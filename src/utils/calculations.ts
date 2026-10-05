import {
  ProgramIncrement,
  Team,
  Epic,
  PrioritizationMode,
  PrioritizedEpic,
  CapacityAnalysis,
  SprintProgressRecord
} from '../types';

/**
 * Calculates effective available capacity for a team across the PI.
 * Takes into account:
 * - Development iterations vs IP sprint
 * - Team member FTE count and workdays
 * - Focus factor (productive engineering time)
 * - Planned PTO and holidays
 * - Team historical velocity
 */
export function calculateTeamCapacity(team: Team, pi: ProgramIncrement): number {
  const totalIterations = Math.max(1, Math.round(pi.totalWeeks / pi.iterationLengthWeeks));
  const devIterations = pi.innovationSprintIncluded ? Math.max(1, totalIterations - 1) : totalIterations;
  
  // Historical velocity baseline
  const baseVelocity = team.historicalVelocity * devIterations;
  
  // Workday reduction factor for PTO
  const totalDevDays = devIterations * pi.iterationLengthWeeks * 5;
  const totalTeamPersonDays = team.members * totalDevDays;
  const ptoDeductionRate = totalTeamPersonDays > 0 ? Math.min(0.5, team.ptoDays / totalTeamPersonDays) : 0;
  
  // Focus factor normalized to 80% baseline
  const focusModifier = (team.focusFactor / 80);
  
  const netCapacity = Math.round(baseVelocity * (1 - ptoDeductionRate) * focusModifier);
  return Math.max(10, netCapacity);
}

/**
 * Calculates full ART capacity analysis
 */
export function calculateCapacityAnalysis(
  pi: ProgramIncrement,
  prioritizedEpics: PrioritizedEpic[]
): CapacityAnalysis {
  const teamCapacities = pi.teams.map(team => {
    const availableCapacity = calculateTeamCapacity(team, pi);
    const committedPoints = prioritizedEpics
      .filter(e => e.executionCategory === 'committed' && e.primaryTeamId === team.id)
      .reduce((sum, e) => sum + e.effort, 0);

    const utilizationPercent = availableCapacity > 0 
      ? Math.round((committedPoints / availableCapacity) * 100) 
      : 0;

    return {
      teamId: team.id,
      teamName: team.name,
      color: team.color,
      availableCapacity,
      committedPoints,
      utilizationPercent,
      isOverloaded: utilizationPercent > 105
    };
  });

  const artGrossCapacity = teamCapacities.reduce((sum, t) => sum + t.availableCapacity, 0);
  const bufferDeduction = Math.round(artGrossCapacity * (pi.bufferReservePercent / 100));
  const artNetCapacity = Math.max(10, artGrossCapacity - bufferDeduction);

  const totalCommittedPoints = prioritizedEpics
    .filter(e => e.executionCategory === 'committed')
    .reduce((sum, e) => sum + e.effort, 0);

  const totalStretchPoints = prioritizedEpics
    .filter(e => e.executionCategory === 'stretch')
    .reduce((sum, e) => sum + e.effort, 0);

  const totalDeferredPoints = prioritizedEpics
    .filter(e => e.executionCategory === 'out_of_scope')
    .reduce((sum, e) => sum + e.effort, 0);

  const committedEpicCount = prioritizedEpics.filter(e => e.executionCategory === 'committed').length;
  const stretchEpicCount = prioritizedEpics.filter(e => e.executionCategory === 'stretch').length;
  const deferredEpicCount = prioritizedEpics.filter(e => e.executionCategory === 'out_of_scope').length;

  const artUtilizationPercent = artNetCapacity > 0 
    ? Math.round((totalCommittedPoints / artNetCapacity) * 100) 
    : 0;

  return {
    artGrossCapacity,
    artNetCapacity,
    totalCommittedPoints,
    totalStretchPoints,
    totalDeferredPoints,
    committedEpicCount,
    stretchEpicCount,
    deferredEpicCount,
    artUtilizationPercent,
    teamCapacities
  };
}

/**
 * Computes WSJF and prioritizes epics based on selected prioritization algorithm.
 * Automatically marks Epics as 'committed', 'stretch', or 'out_of_scope'
 * based on ART net capacity and stretch buffer.
 */
export function prioritizeEpics(
  epics: Epic[],
  pi: ProgramIncrement,
  mode: PrioritizationMode,
  customOrderIds: string[] = []
): PrioritizedEpic[] {
  // 1. Calculate Gross and Net ART Capacity
  const grossCapacity = pi.teams.reduce((sum, t) => sum + calculateTeamCapacity(t, pi), 0);
  const bufferFactor = pi.bufferReservePercent / 100;
  const netCapacity = Math.round(grossCapacity * (1 - bufferFactor));
  const stretchCap = grossCapacity; // Stretch fits between net capacity and gross capacity

  // 2. Compute WSJF and Cost of Delay for each epic
  const enriched = epics.map(epic => {
    const cod = epic.wsjf.userBusinessValue + epic.wsjf.timeCriticality + epic.wsjf.riskReduction;
    const jobSize = Math.max(1, epic.wsjf.jobSize || epic.effort);
    const wsjfScore = Number((cod / jobSize).toFixed(2));

    return {
      ...epic,
      costOfDelay: cod,
      wsjfScore,
      cumulativeEffort: 0,
      executionCategory: 'committed' as const,
      rank: 0
    };
  });

  // 3. Sort based on mode
  const sorted = [...enriched].sort((a, b) => {
    // PO Force-Commit always stays at the top
    if (a.forceCommit && !b.forceCommit) return -1;
    if (!a.forceCommit && b.forceCommit) return 1;

    switch (mode) {
      case 'wsjf':
        // Highest WSJF score first
        if (b.wsjfScore !== a.wsjfScore) {
          return b.wsjfScore - a.wsjfScore;
        }
        return a.effort - b.effort;

      case 'stakeholder_p0':
        // P0 (1) before P1 (2), then highest Business Value, then smaller effort
        if (a.stakeholderPriority !== b.stakeholderPriority) {
          return a.stakeholderPriority - b.stakeholderPriority;
        }
        if (b.wsjf.userBusinessValue !== a.wsjf.userBusinessValue) {
          return b.wsjf.userBusinessValue - a.wsjf.userBusinessValue;
        }
        return b.wsjfScore - a.wsjfScore;

      case 'value_density':
        // Business Value / Effort
        const densityA = a.wsjf.userBusinessValue / Math.max(1, a.effort);
        const densityB = b.wsjf.userBusinessValue / Math.max(1, b.effort);
        return densityB - densityA;

      case 'urgency':
        // Time Criticality first, then Cost of Delay
        if (b.wsjf.timeCriticality !== a.wsjf.timeCriticality) {
          return b.wsjf.timeCriticality - a.wsjf.timeCriticality;
        }
        return b.costOfDelay - a.costOfDelay;

      case 'manual':
        if (customOrderIds.length > 0) {
          const indexA = customOrderIds.indexOf(a.id);
          const indexB = customOrderIds.indexOf(b.id);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
        }
        return b.wsjfScore - a.wsjfScore;

      default:
        return b.wsjfScore - a.wsjfScore;
    }
  });

  // 4. Calculate cumulative effort and assign execution categories
  let runningEffort = 0;
  return sorted.map((epic, idx) => {
    runningEffort += epic.effort;
    let category: 'committed' | 'stretch' | 'out_of_scope' = 'committed';

    if (epic.forceCommit) {
      category = 'committed';
    } else if (runningEffort <= netCapacity) {
      category = 'committed';
    } else if (runningEffort <= stretchCap) {
      category = 'stretch';
    } else {
      category = 'out_of_scope';
    }

    return {
      ...epic,
      rank: idx + 1,
      cumulativeEffort: runningEffort,
      executionCategory: category
    };
  });
}

/**
 * Computes Sprint burn-up progress based on planned cumulative points
 * vs. recorded actual sprint completions.
 */
export function generateSprintBurnUp(
  pi: ProgramIncrement,
  totalCommittedPoints: number,
  completedSprintsData: { [sprintNum: number]: number }
): SprintProgressRecord[] {
  const totalIterations = Math.max(1, Math.round(pi.totalWeeks / pi.iterationLengthWeeks));
  const devIterations = pi.innovationSprintIncluded ? Math.max(1, totalIterations - 1) : totalIterations;
  
  const records: SprintProgressRecord[] = [];
  let runningPlanned = 0;
  let runningActual = 0;

  // Linear ideal burn-up curve across dev iterations (with IP sprint as buffer)
  const idealPointsPerDevSprint = devIterations > 0 ? Math.round(totalCommittedPoints / devIterations) : totalCommittedPoints;

  for (let i = 1; i <= totalIterations; i++) {
    const isIpSprint = pi.innovationSprintIncluded && i === totalIterations;
    const isCompleted = i < pi.currentSprintIndex;
    const isInProgress = i === pi.currentSprintIndex;

    if (!isIpSprint) {
      runningPlanned = Math.min(totalCommittedPoints, Math.round((totalCommittedPoints / devIterations) * i));
    } else {
      // IP sprint maintains the planned total
      runningPlanned = totalCommittedPoints;
    }

    const recordedSprintPts = completedSprintsData[i];
    let actualCum: number | null = null;
    let sprintVelocity: number | null = null;

    if (isCompleted || (isInProgress && recordedSprintPts !== undefined)) {
      const pts = recordedSprintPts !== undefined ? recordedSprintPts : idealPointsPerDevSprint;
      runningActual += pts;
      actualCum = runningActual;
      sprintVelocity = pts;
    }

    records.push({
      sprintNumber: i,
      sprintName: isIpSprint ? `Sprint ${i} (IP Sprint)` : `Sprint ${i}`,
      plannedCumulativePoints: runningPlanned,
      actualCumulativePoints: actualCum,
      sprintVelocity: sprintVelocity,
      status: isCompleted ? 'completed' : isInProgress ? 'in_progress' : 'upcoming',
      notes: isIpSprint 
        ? 'Innovation & Planning: Hardening, buffer & PI Planning'
        : `Feature delivery iteration (${pi.iterationLengthWeeks} weeks)`
    });
  }

  return records;
}

/**
 * Helper to format priority label
 */
export function getPriorityLabel(priority: number): { label: string; textClass: string; bgClass: string } {
  switch (priority) {
    case 1:
      return { label: 'P0 Critical', textClass: 'text-rose-400', bgClass: 'bg-rose-950/40 border-rose-800/60' };
    case 2:
      return { label: 'P1 High', textClass: 'text-amber-400', bgClass: 'bg-amber-950/40 border-amber-800/60' };
    case 3:
      return { label: 'P2 Medium', textClass: 'text-cyan-400', bgClass: 'bg-cyan-950/40 border-cyan-800/60' };
    case 4:
      return { label: 'P3 Low', textClass: 'text-slate-400', bgClass: 'bg-slate-900 border-slate-700/60' };
    default:
      return { label: 'P2 Medium', textClass: 'text-cyan-400', bgClass: 'bg-cyan-950/40 border-cyan-800/60' };
  }
}

/**
 * Helper to format status label
 */
export function getStatusLabel(status: Epic['status']): { label: string; textClass: string } {
  switch (status) {
    case 'not_started':
      return { label: 'Backlog', textClass: 'text-slate-400' };
    case 'in_discovery':
      return { label: 'Discovery', textClass: 'text-indigo-400' };
    case 'in_development':
      return { label: 'In Dev', textClass: 'text-cyan-400' };
    case 'in_validation':
      return { label: 'Validation', textClass: 'text-amber-400' };
    case 'done':
      return { label: 'Completed', textClass: 'text-emerald-400' };
    default:
      return { label: status, textClass: 'text-slate-300' };
  }
}
