import React from 'react';
import { 
  ProgramIncrement, 
  CapacityAnalysis, 
  PrioritizationMode 
} from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface CapacitySummaryBannerProps {
  pi: ProgramIncrement;
  capacityAnalysis: CapacityAnalysis;
  prioritizationMode: PrioritizationMode;
  setPrioritizationMode: (mode: PrioritizationMode) => void;
  onUpdatePi: (updated: Partial<ProgramIncrement>) => void;
  onNavigateToPrioritization: () => void;
}

export const CapacitySummaryBanner: React.FC<CapacitySummaryBannerProps> = ({
  pi,
  capacityAnalysis,
  prioritizationMode,
  setPrioritizationMode,
  onUpdatePi,
  onNavigateToPrioritization
}) => {
  const {
    artNetCapacity,
    artGrossCapacity,
    totalCommittedPoints,
    committedEpicCount,
    stretchEpicCount,
    deferredEpicCount,
    artUtilizationPercent,
    teamCapacities
  } = capacityAnalysis;

  const totalEpicsCount = committedEpicCount + stretchEpicCount + deferredEpicCount;
  const overloadedTeams = teamCapacities.filter(t => t.isOverloaded);
  const isOverallHealthy = artUtilizationPercent <= 100 && overloadedTeams.length === 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
      {/* Top Row: Strategic PI Headline & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-200">{pi.name}</span>
            <span aria-hidden="true">·</span>
            <span>{pi.targetPeriod}</span>
            <span aria-hidden="true">·</span>
            <span>{pi.totalWeeks} Weeks ({Math.round(pi.totalWeeks / pi.iterationLengthWeeks)} Sprints)</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>PI Capacity & Execution Commitment</span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${
              isOverallHealthy 
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300' 
                : 'bg-amber-950/60 border-amber-800/80 text-amber-300'
            }`}>
              {isOverallHealthy ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Feasible & Balanced</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{overloadedTeams.length > 0 ? `${overloadedTeams.length} Team Bottleneck` : 'Over Capacity Limit'}</span>
                </>
              )}
            </span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl">
            {pi.strategicObjective}
          </p>
        </div>

        {/* Action Button to inspect prioritized list */}
        <button
          onClick={onNavigateToPrioritization}
          className="self-start lg:self-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/40 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shrink-0 group"
        >
          <span>View Cut-Off Line & Prioritization</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Middle Row: The Core Answer (Prominent Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-5 border-b border-slate-800">
        {/* Metric 1: Executable Epics */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Executable Epics</span>
            <span className="text-[11px] font-mono text-cyan-400">Committed Scope</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-white tabular-nums">
              {committedEpicCount}
            </span>
            <span className="text-sm text-slate-400 font-mono">
              of {totalEpicsCount} Epics
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">{Math.round((committedEpicCount / (totalEpicsCount || 1)) * 100)}%</span> of candidate backlog committed
          </div>
        </div>

        {/* Metric 2: Committed Story Points vs Capacity */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>ART Capacity Load</span>
            <span className="text-[11px] font-mono text-slate-400">Net after buffer</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-bold font-mono tracking-tight tabular-nums ${
              artUtilizationPercent > 100 ? 'text-rose-400' : 'text-cyan-300'
            }`}>
              {totalCommittedPoints}
            </span>
            <span className="text-sm text-slate-400 font-mono">
              / {artNetCapacity} pts
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                artUtilizationPercent > 100 
                  ? 'bg-rose-500' 
                  : artUtilizationPercent > 92 
                    ? 'bg-amber-400' 
                    : 'bg-cyan-400'
              }`}
              style={{ width: `${Math.min(100, artUtilizationPercent)}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>{artUtilizationPercent}% utilized</span>
            <span>{artNetCapacity - totalCommittedPoints} pts margin</span>
          </div>
        </div>

        {/* Metric 3: Stretch Targets & Contingency */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Stretch Targets</span>
            <span className="text-[11px] font-mono text-amber-400">Next In Line</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-amber-300 tabular-nums">
              {stretchEpicCount}
            </span>
            <span className="text-sm text-slate-400 font-mono">
              Epics ({capacityAnalysis.totalStretchPoints} pts)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Fits if sprint velocity exceeds plan by +{pi.bufferReservePercent}%
          </div>
        </div>

        {/* Metric 4: Deferred Scope */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Deferred Scope</span>
            <span className="text-[11px] font-mono text-slate-500">Beyond Cut-Off</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-slate-400 tabular-nums">
              {deferredEpicCount}
            </span>
            <span className="text-sm text-slate-400 font-mono">
              Epics ({capacityAnalysis.totalDeferredPoints} pts)
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Queued for subsequent PI planning review
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Parameters & Prioritization Algorithm Controls */}
      <div className="pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        {/* Prioritization Mode Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <span>Prioritization Model:</span>
          </span>
          <div className="inline-flex bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setPrioritizationMode('wsjf')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                prioritizationMode === 'wsjf'
                  ? 'bg-slate-800 text-cyan-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Weighted Shortest Job First (Cost of Delay / Effort) - SAFe Standard"
            >
              WSJF (SAFe)
            </button>
            <button
              onClick={() => setPrioritizationMode('stakeholder_p0')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                prioritizationMode === 'stakeholder_p0'
                  ? 'bg-slate-800 text-cyan-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Stakeholder Priority: P0 Critical first, then P1 High, then P2 Medium"
            >
              Stakeholder P0-P3
            </button>
            <button
              onClick={() => setPrioritizationMode('value_density')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                prioritizationMode === 'value_density'
                  ? 'bg-slate-800 text-cyan-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="User Value / Effort density ratio"
            >
              Value Density (ROI)
            </button>
            <button
              onClick={() => setPrioritizationMode('urgency')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                prioritizationMode === 'urgency'
                  ? 'bg-slate-800 text-cyan-300 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Time-Criticality and deadline sensitivity first"
            >
              Urgency First
            </button>
          </div>
        </div>

        {/* Quick Sliders / Toggles for PI Duration and Buffer */}
        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          {/* PI Duration */}
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Duration:</span>
            <div className="inline-flex bg-slate-950 border border-slate-800 rounded-md p-0.5">
              {[8, 10, 12].map(weeks => (
                <button
                  key={weeks}
                  onClick={() => onUpdatePi({ totalWeeks: weeks })}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    pi.totalWeeks === weeks
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {weeks}w
                </button>
              ))}
            </div>
          </div>

          {/* Innovation & Planning Sprint Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={pi.innovationSprintIncluded}
              onChange={(e) => onUpdatePi({ innovationSprintIncluded: e.target.checked })}
              className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500/30"
            />
            <span className="text-slate-400">1 IP Hardening Sprint</span>
          </label>

          {/* Contingency Buffer Reserve */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Buffer:</span>
            <select
              value={pi.bufferReservePercent}
              onChange={(e) => onUpdatePi({ bufferReservePercent: Number(e.target.value) })}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-0.5 text-xs font-mono focus:border-cyan-500 focus:outline-none"
            >
              <option value="5">5% Reserve</option>
              <option value="10">10% Recommended</option>
              <option value="15">15% Conservative</option>
              <option value="20">20% High Risk</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
