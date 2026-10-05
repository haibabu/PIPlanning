import React, { useState } from 'react';
import { 
  ProgramIncrement, 
  CapacityAnalysis, 
  PrioritizedEpic, 
  Team, 
  TeamSkill,
  SkillProficiency 
} from '../types';
import { calculateTeamCapacity } from '../utils/calculations';
import { AVAILABLE_ART_SKILLS } from '../utils/defaultData';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  Minus,
  Sparkles,
  ShieldCheck,
  Award,
  Zap,
  Tag,
  X,
  Check,
  Layers,
  Flame
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
  const [activeSubTab, setActiveSubTab] = useState<'load' | 'skills' | 'gap'>('load');
  
  // State for Add Skill Modal
  const [addingSkillTeamId, setAddingSkillTeamId] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState<string>('');
  const [newSkillCategory, setNewSkillCategory] = useState<string>('Backend & Distributed Systems');
  const [newSkillProficiency, setNewSkillProficiency] = useState<SkillProficiency>('Proficient');
  const [newSkillHeadcount, setNewSkillHeadcount] = useState<number>(3);

  // Handle adding skill
  const handleSaveSkill = () => {
    if (!addingSkillTeamId || !newSkillName.trim()) return;

    const targetTeam = pi.teams.find(t => t.id === addingSkillTeamId);
    if (!targetTeam) return;

    const existingSkills = targetTeam.skills || [];
    const normalizedName = newSkillName.trim();
    
    // Check if skill already exists on team
    const updatedSkills = existingSkills.filter(s => s.name.toLowerCase() !== normalizedName.toLowerCase());
    
    const newSkill: TeamSkill = {
      id: `sk-${Date.now()}`,
      name: normalizedName,
      category: newSkillCategory,
      proficiency: newSkillProficiency,
      headcountWithSkill: Math.min(targetTeam.members, Math.max(1, newSkillHeadcount))
    };

    onUpdateTeam(addingSkillTeamId, {
      skills: [...updatedSkills, newSkill]
    });

    setAddingSkillTeamId(null);
    setNewSkillName('');
  };

  // Handle removing skill
  const handleRemoveSkill = (teamId: string, skillName: string) => {
    const targetTeam = pi.teams.find(t => t.id === teamId);
    if (!targetTeam) return;

    onUpdateTeam(teamId, {
      skills: (targetTeam.skills || []).filter(s => s.name !== skillName)
    });
  };

  // Total unique skills across ART
  const totalUniqueSkills = new Set(
    pi.teams.flatMap(t => (t.skills || []).map(s => s.name))
  ).size;

  const bottleneckSkills = capacityAnalysis.skillDemandAnalysis.filter(s => s.isBottleneck);

  return (
    <div className="space-y-6">
      {/* Overview Header & Sub-Nav */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Agile Release Train Resource Governance</span>
              <span aria-hidden="true">·</span>
              <span>{pi.teams.length} Delivery Teams</span>
              <span aria-hidden="true">·</span>
              <span className="text-cyan-400 font-semibold">{totalUniqueSkills} Verified Technical Competencies</span>
            </div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Team Capacity & Technical Skills Architecture</span>
            </h2>
          </div>

          {/* Sub-Tab Navigation */}
          <div className="inline-flex bg-slate-950 border border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setActiveSubTab('load')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeSubTab === 'load'
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Capacity & Utilization
            </button>
            <button
              onClick={() => setActiveSubTab('skills')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'skills'
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Team Skills Matrix</span>
            </button>
            <button
              onClick={() => setActiveSubTab('gap')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'gap'
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Skill Demand & Bottlenecks</span>
              {bottleneckSkills.length > 0 && (
                <span className="text-[10px] font-mono font-bold bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded border border-amber-800">
                  {bottleneckSkills.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottleneck Warning Banner */}
        {bottleneckSkills.length > 0 && (
          <div className="mt-4 p-3.5 bg-amber-950/40 border border-amber-800/80 rounded-lg flex items-center gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <strong className="font-semibold">Skill Demand Bottleneck Detected: </strong>
              High story point demand on specialized skills with limited headcount: {' '}
              {bottleneckSkills.map(b => `${b.skillName} (${b.demandedPoints} pts across ${b.demandedEpicCount} epics)`).join('; ')}. Consider pairing or cross-team enablement.
            </div>
          </div>
        )}
      </div>

      {/* SUB-TAB 1: Team Capacity & Load Cards */}
      {activeSubTab === 'load' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pi.teams.map((team) => {
            const teamAnalysis = capacityAnalysis.teamCapacities.find(t => t.teamId === team.id) || {
              availableCapacity: calculateTeamCapacity(team, pi),
              committedPoints: 0,
              utilizationPercent: 0,
              isOverloaded: false,
              skillCount: (team.skills || []).length
            };

            const assignedEpics = prioritizedEpics.filter(
              e => e.primaryTeamId === team.id && e.executionCategory === 'committed'
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

                {/* Team Skills Preview Chips */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Verified Team Skills</span>
                    <button
                      onClick={() => {
                        setAddingSkillTeamId(team.id);
                        setNewSkillHeadcount(Math.max(1, Math.round(team.members * 0.7)));
                      }}
                      className="text-cyan-400 hover:text-cyan-300 text-[10px] font-sans font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Skill</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(team.skills || []).map(skill => (
                      <span
                        key={skill.name}
                        className="text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300 flex items-center gap-1"
                        title={`${skill.category} · ${skill.proficiency} · ${skill.headcountWithSkill} of ${team.members} devs`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{skill.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">({skill.headcountWithSkill}p)</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 2: Team Skills Matrix (Detailed management) */}
      {activeSubTab === 'skills' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pi.teams.map((team) => (
              <div 
                key={team.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: team.color }}
                    />
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {team.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      ({(team.skills || []).length} Skills)
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setAddingSkillTeamId(team.id);
                      setNewSkillHeadcount(Math.max(1, Math.round(team.members * 0.7)));
                    }}
                    className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Skill</span>
                  </button>
                </div>

                {/* Skills Detailed Table */}
                <div className="space-y-2">
                  {(team.skills || []).map((skill) => (
                    <div 
                      key={skill.name}
                      className="p-2.5 bg-slate-950/80 border border-slate-800/80 rounded-lg flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-white truncate">
                          {skill.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {skill.category}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          skill.proficiency === 'Expert' 
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                            : skill.proficiency === 'Proficient'
                              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                              : 'bg-slate-900 text-slate-300 border border-slate-700'
                        }`}>
                          {skill.proficiency}
                        </span>

                        <span className="text-slate-400">
                          {skill.headcountWithSkill}/{team.members} devs
                        </span>

                        <button
                          onClick={() => handleRemoveSkill(team.id, skill.name)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-1"
                          title="Remove skill from team"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {(team.skills || []).length === 0 && (
                    <div className="text-xs text-slate-500 italic py-4 text-center">
                      No skills registered yet for this team. Click "Add Skill" above.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Skill Demand & Bottlenecks Analysis */}
      {activeSubTab === 'gap' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Skill Demand vs ART Supply Heatmap</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Total story points demanded by committed Epics against capable engineering staffing per skill.
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              {capacityAnalysis.skillDemandAnalysis.length} Total Monitored Competencies
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-mono">
                  <th className="py-3 px-4 font-semibold">Technical Skill / Competency</th>
                  <th className="py-3 px-3 font-semibold">Domain Category</th>
                  <th className="py-3 px-3 font-semibold text-right">Committed Demand</th>
                  <th className="py-3 px-3 font-semibold text-center">In-Scope Epics</th>
                  <th className="py-3 px-4 font-semibold">Capable Teams & Headcount</th>
                  <th className="py-3 px-3 font-semibold text-center">Feasibility Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {capacityAnalysis.skillDemandAnalysis.map(skill => (
                  <tr key={skill.skillName} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {skill.skillName}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {skill.category}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-cyan-300">
                      {skill.demandedPoints > 0 ? `${skill.demandedPoints} pts` : '—'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-slate-300">
                      {skill.demandedEpicCount > 0 ? `${skill.demandedEpicCount} Epics` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      {skill.capableTeams.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {skill.capableTeams.map(ct => (
                            <span 
                              key={ct.teamId}
                              className="text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300"
                            >
                              {ct.teamName} ({ct.headcount} devs · {ct.proficiency})
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-rose-400 font-semibold italic">
                          No team registered with this skill!
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {skill.isBottleneck ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/80">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Skill Bottleneck</span>
                        </span>
                      ) : skill.demandedPoints > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Fully Covered</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">
                          Surplus Available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Skill to Team */}
      {addingSkillTeamId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                <span>Add Skill to {pi.teams.find(t => t.id === addingSkillTeamId)?.name}</span>
              </h3>
              <button
                onClick={() => setAddingSkillTeamId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Select from catalog or type custom */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Skill Name *
                </label>
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="e.g. Kubernetes & Cloud Infra"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                
                {/* Suggestions chips */}
                <div className="mt-2 flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                  {AVAILABLE_ART_SKILLS.map(s => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => {
                        setNewSkillName(s.name);
                        setNewSkillCategory(s.category);
                      }}
                      className="text-[10px] px-2 py-0.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 border border-slate-800 rounded"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Domain Category
                </label>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                  <option value="Backend & Distributed Systems">Backend & Distributed Systems</option>
                  <option value="Frontend & Mobile">Frontend & Mobile</option>
                  <option value="Data & AI / ML">Data & AI / ML</option>
                  <option value="Security & Compliance">Security & Compliance</option>
                  <option value="DevOps & Quality Engineering">DevOps & Quality Engineering</option>
                </select>
              </div>

              {/* Proficiency Level */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Team Proficiency Level
                </label>
                <select
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value as SkillProficiency)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Expert">Expert (Subject Matter Experts)</option>
                  <option value="Proficient">Proficient (Independent Production Delivery)</option>
                  <option value="Familiar">Familiar (Working Knowledge / Pairing Required)</option>
                </select>
              </div>

              {/* Headcount with this skill */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Engineers with this Skill (Headcount)
                </label>
                <input
                  type="number"
                  min="1"
                  max={pi.teams.find(t => t.id === addingSkillTeamId)?.members || 10}
                  value={newSkillHeadcount}
                  onChange={(e) => setNewSkillHeadcount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setAddingSkillTeamId(null)}
                className="px-3 py-1.5 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSkill}
                disabled={!newSkillName.trim()}
                className="px-3 py-1.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 font-semibold rounded-lg flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Skill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
