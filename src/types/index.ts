export type StrategicTheme = 
  | 'Revenue & Growth'
  | 'Platform & Scale'
  | 'Security & Compliance'
  | 'Customer Experience'
  | 'Developer Productivity';

export type StakeholderPriority = 1 | 2 | 3 | 4; // 1 = P0 Critical, 2 = P1 High, 3 = P2 Medium, 4 = P3 Low

export type EpicStatus = 
  | 'not_started'
  | 'in_discovery'
  | 'in_development'
  | 'in_validation'
  | 'done';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface WSJFData {
  userBusinessValue: number; // 1 - 20 (Fibonacci preferred: 1, 2, 3, 5, 8, 13, 20)
  timeCriticality: number;    // 1 - 20
  riskReduction: number;      // 1 - 20
  jobSize: number;            // Effort in story points or days
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  strategicTheme: StrategicTheme;
  stakeholder: string;
  stakeholderPriority: StakeholderPriority;
  effort: number; // in Story Points or Person-Days
  primaryTeamId: string;
  secondaryTeamIds?: string[];
  wsjf: WSJFData;
  targetIteration: number; // 1 to 5 (or totalIterations)
  status: EpicStatus;
  progressPercent: number; // 0 to 100
  dependencies: string[]; // Epic IDs
  businessOutcome: string;
  confidenceLevel: ConfidenceLevel;
  forceCommit?: boolean; // Manual PO override to keep in scope regardless of math
}

export interface Team {
  id: string;
  name: string;
  color: string;
  members: number; // FTE count
  focusFactor: number; // percentage (typically 70-85%)
  ptoDays: number; // aggregate PTO/holiday days for team during PI
  historicalVelocity: number; // points per 2-week iteration
  leadRole: string;
}

export interface ProgramIncrement {
  id: string;
  name: string;
  targetPeriod: string;
  strategicObjective: string;
  totalWeeks: number; // e.g. 10 weeks
  iterationLengthWeeks: number; // e.g. 2 weeks
  innovationSprintIncluded: boolean; // 1 IP sprint reserved
  bufferReservePercent: number; // e.g. 10% contingency
  unit: 'points' | 'days';
  currentSprintIndex: number; // 1-indexed (e.g., Sprint 2 of 5)
  teams: Team[];
}

export type PrioritizationMode = 
  | 'wsjf'               // Scaled Agile standard: Cost of Delay / Job Size
  | 'stakeholder_p0'     // Stakeholder Priority (P0 -> P3)
  | 'value_density'      // User Value / Effort
  | 'urgency'            // Time Criticality
  | 'manual';            // Custom drag/ordering

export interface PrioritizedEpic extends Epic {
  wsjfScore: number;
  costOfDelay: number;
  cumulativeEffort: number;
  executionCategory: 'committed' | 'stretch' | 'out_of_scope';
  rank: number;
}

export interface CapacityAnalysis {
  artGrossCapacity: number;
  artNetCapacity: number; // after buffer contingency
  totalCommittedPoints: number;
  totalStretchPoints: number;
  totalDeferredPoints: number;
  committedEpicCount: number;
  stretchEpicCount: number;
  deferredEpicCount: number;
  artUtilizationPercent: number;
  teamCapacities: {
    teamId: string;
    teamName: string;
    color: string;
    availableCapacity: number;
    committedPoints: number;
    utilizationPercent: number;
    isOverloaded: boolean;
  }[];
}

export interface SprintProgressRecord {
  sprintNumber: number;
  sprintName: string;
  plannedCumulativePoints: number;
  actualCumulativePoints: number | null;
  sprintVelocity: number | null;
  status: 'completed' | 'in_progress' | 'upcoming';
  notes: string;
}
