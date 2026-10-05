import React from 'react';
import { 
  ProgramIncrement, 
  CapacityAnalysis, 
  PrioritizedEpic, 
  StrategicTheme 
} from '../types';
import { getPriorityLabel, getStatusLabel } from '../utils/calculations';
import { 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Calendar, 
  Target,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ExecutiveOverviewViewProps {
  pi: ProgramIncrement;
  capacityAnalysis: CapacityAnalysis;
  prioritizedEpics: PrioritizedEpic[];
  onNavigateTab: (tab: 'prioritizer' | 'velocity' | 'teams' | 'report') => void;
  onOpenNewEpic: () => void;
  onOpenWhatIf: () => void;
}

export const ExecutiveOverviewView: React.FC<ExecutiveOverviewViewProps> = ({
  pi,
  capacityAnalysis,
  prioritizedEpics,
  onNavigateTab,
  onOpenNewEpic,
  onOpenWhatIf
}) => {
  const committedEpics = prioritizedEpics.filter(e => e.executionCategory === 'committed');
  const stretchEpics = prioritizedEpics.filter(e => e.executionCategory === 'stretch');
  const deferredEpics = prioritizedEpics.filter(e => e.executionCategory === 'out_of_scope');

  // Breakdown by Strategic Theme
  const themes: StrategicTheme[] = [
    'Revenue & Growth',
    'Platform & Scale',
    'Security & Compliance',
    'Customer Experience',
    'Developer Productivity'
  ];

  const themeBreakdown = themes.map(theme => {
    const epicsInTheme = committedEpics.filter(e => e.strategicTheme === theme);
    const points = epicsInTheme.reduce((s, e) => s + e.effort, 0);
    const share = capacityAnalysis.totalCommittedPoints > 0
      ? Math.round((points / capacityAnalysis.totalCommittedPoints) * 100)
      : 0;

    return {
      theme,
      count: epicsInTheme.length,
      points,
      share
    };
  }).filter(t => t.points > 0);

  // Sprints map
  const totalSprints = Math.max(1, Math.round(pi.totalWeeks / pi.iterationLengthWeeks));
  const sprints = Array.from({ length: totalSprints }).map((_, idx) => {
    const sprintNum = idx + 1;
    const isIp = pi.innovationSprintIncluded && sprintNum === totalSprints;
    const epicsInSprint = committedEpics.filter(e => e.targetIteration === sprintNum);
    const sprintPoints = epicsInSprint.reduce((s, e) => s + e.effort, 0);

    return {
      sprintNum,
      label: isIp ? `Sprint ${sprintNum} (IP)` : `Sprint ${sprintNum}`,
      isIp,
      epics: epicsInSprint,
      points: sprintPoints,
      isCurrent: sprintNum === pi.currentSprintIndex,
      isCompleted: sprintNum < pi.currentSprintIndex
    };
  });

  return (
    <div className="space-y-6">
      {/* 2-Column Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Iteration Map & Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          {/* Iteration Delivery Roadmap Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Program Increment Iteration Roadmap</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scheduled delivery cadence across {totalSprints} sprints ({pi.iterationLengthWeeks}-week iterations).
                </p>
              </div>

              <button
                onClick={() => onNavigateTab('velocity')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 group"
              >
                <span>Velocity Tracker</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Sprints Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-4">
              {sprints.map(sprint => (
                <div
                  key={sprint.sprintNum}
                  className={`rounded-xl p-3 border flex flex-col justify-between min-h-[170px] ${
                    sprint.isCurrent
                      ? 'bg-cyan-950/30 border-cyan-500/60 shadow-xs'
                      : sprint.isCompleted
                        ? 'bg-slate-950/60 border-slate-800'
                        : 'bg-slate-950/30 border-slate-850'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className={`font-mono font-bold ${
                        sprint.isCurrent ? 'text-cyan-300' : 'text-slate-300'
                      }`}>
                        {sprint.label}
                      </span>
                      {sprint.isCurrent ? (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          Active
                        </span>
                      ) : sprint.isCompleted ? (
                        <span className="text-[9px] font-bold text-emerald-400">
                          Delivered
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-500">
                          Queued
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 pb-2 border-b border-slate-800/80 mb-2">
                      {sprint.points} pts · {sprint.epics.length} Epics
                    </div>

                    {/* Epic Mini-Badges */}
                    <div className="space-y-1 overflow-hidden">
                      {sprint.epics.slice(0, 3).map(epic => (
                        <div
                          key={epic.id}
                          className="text-[10px] truncate bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-slate-300"
                          title={epic.title}
                        >
                          <span className="font-mono text-cyan-400 font-bold mr-1">{epic.id}</span>
                          <span>{epic.title}</span>
                        </div>
                      ))}
                      {sprint.epics.length > 3 && (
                        <div className="text-[10px] text-slate-500 font-mono pl-1">
                          +{sprint.epics.length - 3} more
                        </div>
                      )}
                      {sprint.epics.length === 0 && (
                        <div className="text-[10px] text-slate-500 italic py-2">
                          {sprint.isIp ? 'Innovation, buffer & PI Retro' : 'No epics assigned'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/60 font-mono text-right">
                    {sprint.isIp ? 'Hardening' : `${pi.iterationLengthWeeks * 10} dev days`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Theme Allocation */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Investment Allocation by Strategic Theme</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {capacityAnalysis.totalCommittedPoints} Committed Story Points
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
              {themeBreakdown.map(item => (
                <div key={item.theme} className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.theme}</span>
                    <span className="font-mono text-cyan-400 font-bold">{item.share}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-cyan-400 h-full rounded-full"
                      style={{ width: `${item.share}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{item.count} Epics in Scope</span>
                    <span>{item.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Execution Insights & Quick Navigation */}
        <div className="space-y-6">
          {/* Executive Readiness Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>PI Execution Health & Feasibility</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Capacity Commitment Validated</div>
                  <div className="text-slate-400 mt-0.5">
                    {capacityAnalysis.artUtilizationPercent}% planned load with {capacityAnalysis.artNetCapacity - capacityAnalysis.totalCommittedPoints} pts safe contingency margin.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Mission Critical P0 Epics Covered</div>
                  <div className="text-slate-400 mt-0.5">
                    All top P0 stakeholder commitments are situated within the capacity cut-off boundary.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Innovation Sprint Protected</div>
                  <div className="text-slate-400 mt-0.5">
                    Sprint {totalSprints} is fully reserved for technical debt hardening, security audits, and PI preparation.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => onNavigateTab('prioritizer')}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-between"
              >
                <span>Review Capacity Cut-Off Line</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              <button
                onClick={onOpenWhatIf}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-between"
              >
                <span>Launch What-If Sandbox</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              <button
                onClick={() => onNavigateTab('report')}
                className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-between"
              >
                <span>Export Stakeholder Review PDF</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Top In-Flight Epics Spotlight */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Top Priority Epics In Flight
              </h3>
              <span className="text-[11px] font-mono text-cyan-400">
                Sprint {pi.currentSprintIndex}
              </span>
            </div>

            <div className="space-y-2">
              {committedEpics.slice(0, 4).map(epic => {
                const priorityInfo = getPriorityLabel(epic.stakeholderPriority);
                return (
                  <div key={epic.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-cyan-400 font-bold">{epic.id}</span>
                      <span className={`text-[10px] font-semibold ${priorityInfo.textClass}`}>
                        {priorityInfo.label}
                      </span>
                    </div>
                    <div className="font-medium text-slate-200 mt-1 line-clamp-1">
                      {epic.title}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>Effort: {epic.effort}p · WSJF: {epic.wsjfScore}</span>
                      <span>Progress: {epic.progressPercent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
