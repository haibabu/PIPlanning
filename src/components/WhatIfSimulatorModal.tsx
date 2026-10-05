import React, { useState } from 'react';
import { 
  ProgramIncrement, 
  Epic, 
  PrioritizationMode, 
  PrioritizedEpic 
} from '../types';
import { 
  prioritizeEpics, 
  calculateCapacityAnalysis 
} from '../utils/calculations';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  Check, 
  RotateCcw, 
  Sliders, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pi: ProgramIncrement;
  epics: Epic[];
  prioritizationMode: PrioritizationMode;
  onApplyScenario: (updatedPi: ProgramIncrement) => void;
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  isOpen,
  onClose,
  pi,
  epics,
  prioritizationMode,
  onApplyScenario
}) => {
  if (!isOpen) return null;

  // Sandbox state
  const [simulatedDurationWeeks, setSimulatedDurationWeeks] = useState(pi.totalWeeks);
  const [simulatedBufferPercent, setSimulatedBufferPercent] = useState(pi.bufferReservePercent);
  const [simulatedStaffingDelta, setSimulatedStaffingDelta] = useState<number>(0);
  const [simulatedVelocityDeltaPercent, setSimulatedVelocityDeltaPercent] = useState<number>(0);

  // Baseline calculation
  const baselinePrioritized = prioritizeEpics(epics, pi, prioritizationMode);
  const baselineAnalysis = calculateCapacityAnalysis(pi, baselinePrioritized);

  // Simulated PI
  const simulatedTeams = pi.teams.map(t => ({
    ...t,
    members: Math.max(1, t.members + Math.round(simulatedStaffingDelta / pi.teams.length)),
    historicalVelocity: Math.round(t.historicalVelocity * (1 + simulatedVelocityDeltaPercent / 100))
  }));

  const simulatedPi: ProgramIncrement = {
    ...pi,
    totalWeeks: simulatedDurationWeeks,
    bufferReservePercent: simulatedBufferPercent,
    teams: simulatedTeams
  };

  const simulatedPrioritized = prioritizeEpics(epics, simulatedPi, prioritizationMode);
  const simulatedAnalysis = calculateCapacityAnalysis(simulatedPi, simulatedPrioritized);

  // Diff
  const epicDelta = simulatedAnalysis.committedEpicCount - baselineAnalysis.committedEpicCount;
  const pointsDelta = simulatedAnalysis.artNetCapacity - baselineAnalysis.artNetCapacity;

  // Newly unlocked epics
  const newlyUnlocked = simulatedPrioritized.filter(
    se => se.executionCategory === 'committed' && 
    baselinePrioritized.find(be => be.id === se.id)?.executionCategory !== 'committed'
  );

  // Newly dropped epics
  const newlyDropped = baselinePrioritized.filter(
    be => be.executionCategory === 'committed' && 
    simulatedPrioritized.find(se => se.id === be.id)?.executionCategory !== 'committed'
  );

  const handleApply = () => {
    onApplyScenario(simulatedPi);
    onClose();
  };

  const handleReset = () => {
    setSimulatedDurationWeeks(pi.totalWeeks);
    setSimulatedBufferPercent(pi.bufferReservePercent);
    setSimulatedStaffingDelta(0);
    setSimulatedVelocityDeltaPercent(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Capacity & Scope What-If Simulator
              </h2>
              <p className="text-xs text-slate-400">
                Stress-test scenarios: staffing changes, duration extensions, and velocity variance.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Controls Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {/* Control 1: PI Duration */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1.5">
                <span>PI Calendar Duration:</span>
                <span className="font-mono text-cyan-400 font-bold">{simulatedDurationWeeks} Weeks</span>
              </div>
              <input
                type="range"
                min="6"
                max="14"
                step="2"
                value={simulatedDurationWeeks}
                onChange={(e) => setSimulatedDurationWeeks(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>6w (3 Sprints)</span>
                <span>10w (Standard)</span>
                <span>14w (7 Sprints)</span>
              </div>
            </div>

            {/* Control 2: Staffing Change */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1.5">
                <span>Staffing Adjustment (Contractors/Hires):</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {simulatedStaffingDelta > 0 ? `+${simulatedStaffingDelta}` : simulatedStaffingDelta} Engineers
                </span>
              </div>
              <input
                type="range"
                min="-4"
                max="8"
                step="1"
                value={simulatedStaffingDelta}
                onChange={(e) => setSimulatedStaffingDelta(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>-4 FTEs</span>
                <span>Current Baseline</span>
                <span>+8 Contractors</span>
              </div>
            </div>

            {/* Control 3: Velocity Shift */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1.5">
                <span>Velocity Variance:</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {simulatedVelocityDeltaPercent > 0 ? `+${simulatedVelocityDeltaPercent}%` : `${simulatedVelocityDeltaPercent}%`}
                </span>
              </div>
              <input
                type="range"
                min="-25"
                max="25"
                step="5"
                value={simulatedVelocityDeltaPercent}
                onChange={(e) => setSimulatedVelocityDeltaPercent(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>-25% Velocity Drop</span>
                <span>Baseline</span>
                <span>+25% Surge</span>
              </div>
            </div>

            {/* Control 4: Contingency Buffer */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-300 font-medium mb-1.5">
                <span>Contingency Buffer Reserve:</span>
                <span className="font-mono text-cyan-400 font-bold">{simulatedBufferPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="5"
                value={simulatedBufferPercent}
                onChange={(e) => setSimulatedBufferPercent(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0% (Aggressive)</span>
                <span>10% (Balanced)</span>
                <span>25% (Safe)</span>
              </div>
            </div>
          </div>

          {/* Impact Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Impact 1: Executable Epics */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Executable Epics
              </div>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {simulatedAnalysis.committedEpicCount} Epics
              </div>
              <div className="text-xs font-mono mt-1">
                {epicDelta > 0 ? (
                  <span className="text-emerald-400 font-semibold">+{epicDelta} Epics Unlocked</span>
                ) : epicDelta < 0 ? (
                  <span className="text-rose-400 font-semibold">{epicDelta} Epics Dropped</span>
                ) : (
                  <span className="text-slate-400">No count change</span>
                )}
              </div>
            </div>

            {/* Impact 2: Net Capacity */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Available ART Capacity
              </div>
              <div className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                {simulatedAnalysis.artNetCapacity} pts
              </div>
              <div className="text-xs font-mono mt-1">
                {pointsDelta > 0 ? (
                  <span className="text-emerald-400 font-semibold">+{pointsDelta} pts available</span>
                ) : pointsDelta < 0 ? (
                  <span className="text-rose-400 font-semibold">{pointsDelta} pts capacity loss</span>
                ) : (
                  <span className="text-slate-400">Identical</span>
                )}
              </div>
            </div>

            {/* Impact 3: Load Feasibility */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Capacity Load
              </div>
              <div className="text-2xl font-mono font-bold text-white mt-1">
                {simulatedAnalysis.artUtilizationPercent}%
              </div>
              <div className="text-xs mt-1">
                {simulatedAnalysis.artUtilizationPercent <= 100 ? (
                  <span className="text-emerald-400 font-semibold">Feasible Commitment</span>
                ) : (
                  <span className="text-rose-400 font-semibold">Over-committed!</span>
                )}
              </div>
            </div>
          </div>

          {/* Scope Shifts: Unlocked or Dropped Epics */}
          {newlyUnlocked.length > 0 && (
            <div className="bg-emerald-950/20 border border-emerald-800/60 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Epics Elevated into Committed Scope:</span>
              </div>
              <div className="space-y-1.5">
                {newlyUnlocked.map(e => (
                  <div key={e.id} className="text-xs bg-slate-950/80 p-2 rounded flex items-center justify-between text-slate-200">
                    <span><strong className="font-mono text-cyan-400">{e.id}</strong> — {e.title}</span>
                    <span className="font-mono text-slate-400">{e.effort} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {newlyDropped.length > 0 && (
            <div className="bg-rose-950/20 border border-rose-800/60 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 mb-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Epics Pushed Beyond Capacity Limit:</span>
              </div>
              <div className="space-y-1.5">
                {newlyDropped.map(e => (
                  <div key={e.id} className="text-xs bg-slate-950/80 p-2 rounded flex items-center justify-between text-slate-200">
                    <span><strong className="font-mono text-cyan-400">{e.id}</strong> — {e.title}</span>
                    <span className="font-mono text-slate-400">{e.effort} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Current PI Baseline</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Apply Scenario to PI Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
