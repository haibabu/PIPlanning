import React, { useState } from 'react';
import { 
  ProgramIncrement, 
  CapacityAnalysis, 
  SprintProgressRecord, 
  PrioritizedEpic 
} from '../types';
import { 
  generateSprintBurnUp, 
  getStatusLabel 
} from '../utils/calculations';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Edit2, 
  Check, 
  Layers,
  Sparkles,
  Calendar
} from 'lucide-react';

interface VelocityDashboardViewProps {
  pi: ProgramIncrement;
  capacityAnalysis: CapacityAnalysis;
  prioritizedEpics: PrioritizedEpic[];
  completedSprintsData: { [sprintNum: number]: number };
  onUpdateSprintActuals: (sprintNum: number, actualPoints: number) => void;
  onUpdateCurrentSprint: (sprintNum: number) => void;
}

export const VelocityDashboardView: React.FC<VelocityDashboardViewProps> = ({
  pi,
  capacityAnalysis,
  prioritizedEpics,
  completedSprintsData,
  onUpdateSprintActuals,
  onUpdateCurrentSprint
}) => {
  const [editingSprintNum, setEditingSprintNum] = useState<number | null>(null);
  const [editPointsInput, setEditPointsInput] = useState<string>('');

  const sprintRecords = generateSprintBurnUp(
    pi, 
    capacityAnalysis.totalCommittedPoints, 
    completedSprintsData
  );

  const totalCommitted = capacityAnalysis.totalCommittedPoints;
  const currentSprintRecord = sprintRecords.find(r => r.sprintNumber === pi.currentSprintIndex) || sprintRecords[0];

  // Calculate Say/Do Ratio
  const completedRecords = sprintRecords.filter(r => r.actualCumulativePoints !== null && r.sprintVelocity !== null);
  const totalActualDelivered = completedRecords.length > 0 
    ? completedRecords[completedRecords.length - 1].actualCumulativePoints || 0 
    : 0;

  const plannedAtCurrent = currentSprintRecord ? currentSprintRecord.plannedCumulativePoints : totalCommitted;
  const sayDoRatio = plannedAtCurrent > 0 ? Math.round((totalActualDelivered / plannedAtCurrent) * 100) : 100;

  // Average actual velocity across completed iterations
  const actualVelocities = completedRecords.map(r => r.sprintVelocity || 0).filter(v => v > 0);
  const avgVelocity = actualVelocities.length > 0 
    ? Math.round(actualVelocities.reduce((a, b) => a + b, 0) / actualVelocities.length) 
    : Math.round(totalCommitted / Math.max(1, sprintRecords.length - 1));

  // Projected completion based on current run-rate
  const remainingPoints = Math.max(0, totalCommitted - totalActualDelivered);
  const devSprintsLeft = sprintRecords.filter(r => r.sprintNumber >= pi.currentSprintIndex && !r.sprintName.includes('IP')).length;
  const projectedPointsCapacityLeft = devSprintsLeft * avgVelocity;
  const isDeliveryOnTrack = projectedPointsCapacityLeft >= remainingPoints * 0.95;

  const handleSaveSprintActual = (sprintNum: number) => {
    const val = parseInt(editPointsInput, 10);
    if (!isNaN(val) && val >= 0) {
      onUpdateSprintActuals(sprintNum, val);
    }
    setEditingSprintNum(null);
  };

  // SVG Chart Geometry
  const chartWidth = 720;
  const chartHeight = 240;
  const padding = { top: 20, right: 35, bottom: 35, left: 55 };
  const graphWidth = chartWidth - padding.left - padding.right;
  const graphHeight = chartHeight - padding.top - padding.bottom;

  const maxY = Math.max(totalCommitted * 1.15, 100);
  const getY = (val: number) => padding.top + graphHeight - (val / maxY) * graphHeight;
  const getX = (index: number, total: number) => padding.left + (index / (total - 1 || 1)) * graphWidth;

  // Planned Path
  const plannedPointsCoordinates = sprintRecords.map((r, i) => ({
    x: getX(i, sprintRecords.length),
    y: getY(r.plannedCumulativePoints),
    val: r.plannedCumulativePoints,
    name: r.sprintName
  }));
  const plannedPathD = plannedPointsCoordinates.reduce((acc, pt, i) => (
    i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`
  ), '');

  // Actual Path
  const actualPointsCoordinates = sprintRecords
    .filter(r => r.actualCumulativePoints !== null)
    .map((r, i) => ({
      x: getX(r.sprintNumber - 1, sprintRecords.length),
      y: getY(r.actualCumulativePoints!),
      val: r.actualCumulativePoints!,
      sprintNum: r.sprintNumber
    }));

  const actualPathD = actualPointsCoordinates.reduce((acc, pt, i) => (
    i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`
  ), '');

  // Projected Path
  let projectedPathD = '';
  if (actualPointsCoordinates.length > 0) {
    const lastActual = actualPointsCoordinates[actualPointsCoordinates.length - 1];
    const lastSprintNum = lastActual.sprintNum;
    
    projectedPathD = `M ${lastActual.x},${lastActual.y}`;
    for (let i = lastSprintNum; i < sprintRecords.length; i++) {
      const x = getX(i, sprintRecords.length);
      const projY = getY(Math.min(totalCommitted, lastActual.val + (i - lastSprintNum + 1) * avgVelocity));
      projectedPathD += ` L ${x},${projY}`;
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Velocity KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Say/Do Ratio */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Say / Do Ratio</span>
            <span className="text-[11px] font-mono text-cyan-400">Commitment Reliability</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-bold font-mono tracking-tight tabular-nums ${
              sayDoRatio >= 90 ? 'text-emerald-400' : sayDoRatio >= 75 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {sayDoRatio}%
            </span>
            <span className="text-xs text-slate-400">
              {sayDoRatio >= 90 ? 'High predictability' : 'Pacing variance'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {totalActualDelivered} delivered vs {plannedAtCurrent} planned to date
          </div>
        </div>

        {/* KPI 2: Average Velocity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Average ART Velocity</span>
            <span className="text-[11px] font-mono text-slate-400">Throughput</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-white tabular-nums">
              {avgVelocity}
            </span>
            <span className="text-sm text-slate-400 font-mono">
              pts / sprint
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Across {pi.teams.length} coordinated delivery teams
          </div>
        </div>

        {/* KPI 3: Projection Forecast */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Delivery Projection</span>
            <span className="text-[11px] font-mono text-slate-400">PI Target</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-xl font-bold tracking-tight flex items-center gap-1.5 ${
              isDeliveryOnTrack ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {isDeliveryOnTrack ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>On Track</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>At Risk (-18 pts)</span>
                </>
              )}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {remainingPoints} points remaining across {devSprintsLeft} sprints
          </div>
        </div>

        {/* KPI 4: Current Active Iteration */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium flex items-center justify-between">
            <span>Active Iteration</span>
            <span className="text-[11px] font-mono text-cyan-400">Live Cycle</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-2xl font-bold text-cyan-300 font-mono">
              Sprint {pi.currentSprintIndex}
            </span>
            <select
              value={pi.currentSprintIndex}
              onChange={(e) => onUpdateCurrentSprint(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
            >
              {sprintRecords.map(r => (
                <option key={r.sprintNumber} value={r.sprintNumber}>
                  Sprint {r.sprintNumber}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {sprintRecords.length} total iterations ({pi.totalWeeks} calendar weeks)
          </div>
        </div>
      </div>

      {/* Visual Burn-Up Dashboard Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Program Increment Velocity Burn-Up Tracker</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cumulative delivery progress against planned velocity baseline ({totalCommitted} committed points).
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-500 border-t border-dashed border-slate-400 inline-block" />
              <span className="text-slate-400">Total Scope ({totalCommitted}p)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
              <span className="text-cyan-300">Planned Trajectory</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-emerald-400 rounded-full inline-block" />
              <span className="text-emerald-300 font-semibold">Actual Delivered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400 border-t border-dotted border-amber-300 inline-block" />
              <span className="text-amber-300">Projected Run</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto py-4">
          <div className="min-w-[640px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const yVal = Math.round(maxY * ratio);
                const y = getY(yVal);
                return (
                  <g key={ratio}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartWidth - padding.right}
                      y2={y}
                      stroke="#1e293b"
                      strokeWidth="1"
                    />
                    <text
                      x={padding.left - 10}
                      y={y + 4}
                      fill="#64748b"
                      fontSize="10"
                      textAnchor="end"
                      className="font-mono"
                    >
                      {yVal}p
                    </text>
                  </g>
                );
              })}

              {/* Total Committed Scope Ceiling Line */}
              <line
                x1={padding.left}
                y1={getY(totalCommitted)}
                x2={chartWidth - padding.right}
                y2={getY(totalCommitted)}
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={chartWidth - padding.right}
                y={getY(totalCommitted) - 6}
                fill="#94a3b8"
                fontSize="10"
                textAnchor="end"
                className="font-mono font-semibold"
              >
                Committed Scope: {totalCommitted} pts
              </text>

              {/* Planned Trajectory Line */}
              <path
                d={plannedPathD}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="6 3"
              />

              {/* Projected Line */}
              {projectedPathD && (
                <path
                  d={projectedPathD}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
              )}

              {/* Actual Velocity Line */}
              {actualPathD && (
                <path
                  d={actualPathD}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Actual Data Nodes */}
              {actualPointsCoordinates.map((pt) => (
                <g key={pt.sprintNum}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="#10b981"
                    stroke="#022c22"
                    strokeWidth="2"
                  />
                  <rect
                    x={pt.x - 22}
                    y={pt.y - 24}
                    width="44"
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    stroke="#10b981"
                    strokeWidth="1"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    fill="#34d399"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {pt.val}p
                  </text>
                </g>
              ))}

              {/* X Axis Sprint Ticks */}
              {sprintRecords.map((r, i) => {
                const x = getX(i, sprintRecords.length);
                const isCurrent = r.sprintNumber === pi.currentSprintIndex;
                return (
                  <g key={r.sprintNumber}>
                    <line
                      x1={x}
                      y1={chartHeight - padding.bottom}
                      x2={x}
                      y2={chartHeight - padding.bottom + 6}
                      stroke={isCurrent ? '#06b6d4' : '#475569'}
                      strokeWidth="1.5"
                    />
                    <text
                      x={x}
                      y={chartHeight - padding.bottom + 18}
                      fill={isCurrent ? '#38bdf8' : '#94a3b8'}
                      fontSize="11"
                      fontWeight={isCurrent ? 'bold' : 'normal'}
                      textAnchor="middle"
                      className="font-mono"
                    >
                      {r.sprintName.replace(' (IP Sprint)', ' (IP)')}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Iteration-by-Iteration Breakdown & Actuals Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Iteration Velocity & Sprint Progress Ledger
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click "Log Actual" on any sprint to record delivered velocity and instantly update burn-up projections.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {sprintRecords.map((record) => {
            const isEditing = editingSprintNum === record.sprintNumber;
            const inFlightEpics = prioritizedEpics.filter(
              e => e.targetIteration === record.sprintNumber && e.executionCategory === 'committed'
            );

            return (
              <div
                key={record.sprintNumber}
                className={`p-4 md:px-6 transition-colors ${
                  record.sprintNumber === pi.currentSprintIndex
                    ? 'bg-cyan-950/20 border-l-4 border-cyan-500'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Sprint Label & Status */}
                  <div className="min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">
                        {record.sprintName}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        record.status === 'completed'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          : record.status === 'in_progress'
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                            : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}>
                        {record.status === 'completed'
                          ? 'Delivered'
                          : record.status === 'in_progress'
                            ? 'Active In-Flight'
                            : 'Scheduled'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {record.notes}
                    </div>
                  </div>

                  {/* Middle: Planned vs Delivered Numbers */}
                  <div className="flex items-center gap-6 text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">
                        Planned Target
                      </div>
                      <div className="text-sm font-bold text-cyan-300 mt-0.5">
                        {record.plannedCumulativePoints} pts
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">
                        Actual Delivered
                      </div>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">
                        {record.actualCumulativePoints !== null 
                          ? `${record.actualCumulativePoints} pts (${record.sprintVelocity}p this sprint)` 
                          : '—'}
                      </div>
                    </div>

                    {/* Assigned Epics Count */}
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">
                        Target Epics
                      </div>
                      <div className="text-sm font-semibold text-slate-200 mt-0.5">
                        {inFlightEpics.length} Epics ({inFlightEpics.reduce((s, e) => s + e.effort, 0)} pts)
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions / Inline Point Logging */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          value={editPointsInput}
                          onChange={(e) => setEditPointsInput(e.target.value)}
                          placeholder="pts"
                          className="w-16 px-2 py-1 bg-slate-950 border border-cyan-500 rounded text-xs text-white font-mono"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveSprintActual(record.sprintNumber)}
                          className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded font-semibold text-xs"
                          title="Save delivered velocity"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingSprintNum(record.sprintNumber);
                          setEditPointsInput(String(record.sprintVelocity || 80));
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3 text-slate-400" />
                        <span>Log Actual</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-row: Preview of Epics in this Sprint */}
                {inFlightEpics.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">Assigned Epics:</span>
                    {inFlightEpics.map(e => (
                      <span 
                        key={e.id}
                        className="text-[11px] font-mono bg-slate-950 px-2 py-0.5 rounded text-slate-300 border border-slate-800"
                        title={e.title}
                      >
                        {e.id} ({e.effort}p) · {e.title.slice(0, 30)}...
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
