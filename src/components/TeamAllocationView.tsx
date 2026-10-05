import React from 'react';
import { 
  ProgramIncrement, 
  CapacityAnalysis, 
  PrioritizedEpic, 
  Team 
} from '../types';
import { calculateTeamCapacity } from '../utils/calculations';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  Minus,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface TeamAllocationViewProps {
  pi: ProgramIncrement;
  capacityAnalysis: CapacityAnalysis;
  prioritizedEpics: PrioritizedEpic[];
  onUpdateTeam: (teamId: string, updated: Partial<Team>) => void;
}

export const TeamAllocationView: React.FC<TeamAllocationViewProps> = ({
  pi,
  capacityAnalysis,
  prioritizedEpics,
  onUpdateTeam
}) => {
  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Agile Release Train Team Capacity Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Individual team resource availability, focus factor, PTO deductions, and load distribution across {pi.teams.length} teams.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400">Total Engineers: </span>
              <strong className="text-white">
                {pi.teams.reduce((s, t) => s + t.members, 0)} FTEs
              </strong>
            </div>
            <div>
              <span className="text-slate-400">Gross Capacity: </span>
              <strong className="text-cyan-300 font-bold">
                {capacityAnalysis.artGrossCapacity} pts
              </strong>
            </div>
          </div>
        </div>

        {/* Bottleneck Warning Banner if any team is overcommitted */}
        {capacityAnalysis.teamCapacities.some(t => t.isOverloaded) && (
          <div className="mt-4 p-3.5 bg-amber-950/40 border border-amber-800/80 rounded-lg flex items-center gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <strong className="font-semibold">Team Overcommitment Bottleneck Detected: </strong>
              {capacityAnalysis.teamCapacities
                .filter(t => t.isOverloaded)
                .map(t => `${t.teamName} (${t.utilizationPercent}%)`)
                .join(', ')} exceeded recommended safe capacity. Consider re-scoping epics, shifting dependencies, or adding contractors.
            </div>
          </div>
        )}
      </div>

      {/* Grid of Team Capacity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pi.teams.map((team) => {
          const teamAnalysis = capacityAnalysis.teamCapacities.find(t => t.teamId === team.id) || {
            availableCapacity: calculateTeamCapacity(team, pi),
            committedPoints: 0,
            utilizationPercent: 0,
            isOverloaded: false
          };

          const assignedEpics = prioritizedEpics.filter(
            e => e.primaryTeamId === team.id && e.executionCategory === 'committed'
          );

          const stretchAssigned = prioritizedEpics.filter(
            e => e.primaryTeamId === team.id && e.executionCategory === 'stretch'
          );

          return (
            <div 
              key={team.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors shadow-xs"
            >
              {/* Team Title & Lead */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span 
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: team.color }}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {team.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {team.leadRole}
                    </p>
                  </div>
                </div>

                {/* Utilization Pill */}
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                  teamAnalysis.isOverloaded
                    ? 'bg-rose-950/60 border-rose-800/80 text-rose-300'
                    : teamAnalysis.utilizationPercent > 92
                      ? 'bg-amber-950/60 border-amber-800/80 text-amber-300'
                      : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                }`}>
                  {teamAnalysis.utilizationPercent}% Load
                </span>
              </div>

              {/* Capacity Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
                  <span>Committed: <strong className="text-white">{teamAnalysis.committedPoints} pts</strong></span>
                  <span>Available: <strong className="text-cyan-300">{teamAnalysis.availableCapacity} pts</strong></span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      teamAnalysis.isOverloaded 
                        ? 'bg-rose-500' 
                        : teamAnalysis.utilizationPercent > 90 
                          ? 'bg-amber-400' 
                          : 'bg-cyan-400'
                    }`}
                    style={{ width: `${Math.min(100, teamAnalysis.utilizationPercent)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>
                    {teamAnalysis.availableCapacity - teamAnalysis.committedPoints >= 0
                      ? `${teamAnalysis.availableCapacity - teamAnalysis.committedPoints} pts safe headroom`
                      : `${Math.abs(teamAnalysis.availableCapacity - teamAnalysis.committedPoints)} pts deficit`}
                  </span>
                  <span>{assignedEpics.length} in-scope epics</span>
                </div>
              </div>

              {/* Resource Configuration Adjusters */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                {/* Team FTEs */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Team Size:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateTeam(team.id, { members: Math.max(1, team.members - 1) })}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
                      title="Remove 1 engineer"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-white w-6 text-center">
                      {team.members}
                    </span>
                    <button
                      onClick={() => onUpdateTeam(team.id, { members: team.members + 1 })}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
                      title="Add 1 engineer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Focus Factor */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Focus Factor:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateTeam(team.id, { focusFactor: Math.max(50, team.focusFactor - 5) })}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
                      title="Decrease focus factor"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-white w-8 text-center">
                      {team.focusFactor}%
                    </span>
                    <button
                      onClick={() => onUpdateTeam(team.id, { focusFactor: Math.min(100, team.focusFactor + 5) })}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
                      title="Increase focus factor"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Planned PTO Days */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Planned PTO:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateTeam(team.id, { ptoDays: Math.max(0, team.ptoDays - 1) })}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
                      title="Deduct 1 day PTO"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-white w-6 text-center">
                      {team.ptoDays}d
                    </span>
                    <button
                      onClick={() => onUpdateTeam(team.id, { ptoDays: team.ptoDays + 1 })}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
                      title="Add 1 day PTO"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Historical Sprint Velocity */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sprint Velocity:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateTeam(team.id, { historicalVelocity: Math.max(10, team.historicalVelocity - 5) })}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
                      title="Decrease baseline velocity"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-white w-8 text-center">
                      {team.historicalVelocity}p
                    </span>
                    <button
                      onClick={() => onUpdateTeam(team.id, { historicalVelocity: team.historicalVelocity + 5 })}
                      className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs"
                      title="Increase baseline velocity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Assigned In-Scope Epics List */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Assigned In-Scope Epics</span>
                  <span>{assignedEpics.length} Epics</span>
                </div>
                {assignedEpics.length > 0 ? (
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                    {assignedEpics.map(epic => (
                      <div 
                        key={epic.id}
                        className="text-xs bg-slate-950/60 p-2 rounded border border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="truncate min-w-0">
                          <span className="font-mono text-cyan-400 font-bold mr-1.5">
                            {epic.id}
                          </span>
                          <span className="text-slate-300 truncate">
                            {epic.title}
                          </span>
                        </div>
                        <span className="font-mono text-slate-400 font-semibold shrink-0">
                          {epic.effort}p
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic py-2">
                    No epics currently assigned in scope for this team.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
