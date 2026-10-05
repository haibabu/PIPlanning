import React, { useState, useMemo } from 'react';
import { 
  Epic, 
  PrioritizedEpic, 
  CapacityAnalysis, 
  PrioritizationMode, 
  ProgramIncrement,
  StrategicTheme,
  StakeholderPriority 
} from '../types';
import { 
  getPriorityLabel, 
  getStatusLabel 
} from '../utils/calculations';
import { 
  Search, 
  Filter, 
  Check, 
  Pin, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Minus, 
  Plus, 
  ArrowUpDown,
  Sparkles,
  Info
} from 'lucide-react';

interface PrioritizationViewProps {
  prioritizedEpics: PrioritizedEpic[];
  capacityAnalysis: CapacityAnalysis;
  pi: ProgramIncrement;
  prioritizationMode: PrioritizationMode;
  setPrioritizationMode: (mode: PrioritizationMode) => void;
  onEditEpic: (epic: Epic) => void;
  onDeleteEpic: (id: string) => void;
  onToggleForceCommit: (id: string) => void;
  onUpdateEffort: (id: string, newEffort: number) => void;
}

export const PrioritizationView: React.FC<PrioritizationViewProps> = ({
  prioritizedEpics,
  capacityAnalysis,
  pi,
  prioritizationMode,
  setPrioritizationMode,
  onEditEpic,
  onDeleteEpic,
  onToggleForceCommit,
  onUpdateEffort
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'committed' | 'stretch' | 'out_of_scope'>('all');

  // Filtered epics
  const filteredEpics = useMemo(() => {
    return prioritizedEpics.filter(epic => {
      const matchesSearch = 
        epic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        epic.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        epic.stakeholder.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTheme = selectedTheme === 'all' || epic.strategicTheme === selectedTheme;
      const matchesTeam = selectedTeam === 'all' || epic.primaryTeamId === selectedTeam;
      const matchesCategory = selectedCategory === 'all' || epic.executionCategory === selectedCategory;

      return matchesSearch && matchesTheme && matchesTeam && matchesCategory;
    });
  }, [prioritizedEpics, searchQuery, selectedTheme, selectedTeam, selectedCategory]);

  // Find team by ID
  const getTeam = (id: string) => pi.teams.find(t => t.id === id);

  // Group epics for clear visual boundaries
  const committedEpics = filteredEpics.filter(e => e.executionCategory === 'committed');
  const stretchEpics = filteredEpics.filter(e => e.executionCategory === 'stretch');
  const deferredEpics = filteredEpics.filter(e => e.executionCategory === 'out_of_scope');

  return (
    <div className="space-y-6">
      {/* Top Controls: Search, Filters & Algorithm Selection */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search epics by ID, title, or stakeholder..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Execution Scopes</option>
            <option value="committed">Committed In-Scope Only</option>
            <option value="stretch">Stretch Targets Only</option>
            <option value="out_of_scope">Deferred Scope Only</option>
          </select>

          {/* Theme Filter */}
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Strategic Themes</option>
            <option value="Revenue & Growth">Revenue & Growth</option>
            <option value="Platform & Scale">Platform & Scale</option>
            <option value="Security & Compliance">Security & Compliance</option>
            <option value="Customer Experience">Customer Experience</option>
            <option value="Developer Productivity">Developer Productivity</option>
          </select>

          {/* Team Filter */}
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Delivery Teams</option>
            {pi.teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Prioritization Stack with Explicit Cut-Off Dividers */}
      <div className="space-y-4">
        {/* COMMITTED SECTION */}
        {committedEpics.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white tracking-tight">
                  Committed Epics for {pi.name.split('—')[0]}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({committedEpics.length} Epics · {committedEpics.reduce((s, e) => s + e.effort, 0)} pts)
                </span>
              </div>
              <div className="text-xs text-emerald-400 font-medium">
                Within Net ART Capacity ({capacityAnalysis.artNetCapacity} pts max)
              </div>
            </div>

            <div className="divide-y divide-slate-800/80">
              {committedEpics.map((epic) => (
                <EpicRowItem
                  key={epic.id}
                  epic={epic}
                  team={getTeam(epic.primaryTeamId)}
                  pi={pi}
                  onEditEpic={onEditEpic}
                  onDeleteEpic={onDeleteEpic}
                  onToggleForceCommit={onToggleForceCommit}
                  onUpdateEffort={onUpdateEffort}
                />
              ))}
            </div>
          </div>
        )}

        {/* --- CAPACITY COMMITMENT CUT-OFF LINE --- */}
        <div className="my-6 p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-slate-950/40 border-2 border-dashed border-cyan-500/50 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-wider text-cyan-300">
                CAPACITY COMMITMENT CUT-OFF THRESHOLD
              </div>
              <div className="text-xs text-slate-300">
                Committed load: <strong className="text-white font-mono">{capacityAnalysis.totalCommittedPoints} pts</strong> of <strong className="text-white font-mono">{capacityAnalysis.artNetCapacity} pts</strong> net capacity ({capacityAnalysis.artUtilizationPercent}% utilized).
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
            Buffer: {capacityAnalysis.artNetCapacity - capacityAnalysis.totalCommittedPoints} pts remaining before stretch
          </div>
        </div>

        {/* STRETCH SECTION */}
        {stretchEpics.length > 0 && (
          <div className="bg-slate-900/90 border border-amber-900/40 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 bg-amber-950/20 border-b border-amber-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-amber-200 tracking-tight">
                  Stretch Target Epics
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({stretchEpics.length} Epics · {stretchEpics.reduce((s, e) => s + e.effort, 0)} pts)
                </span>
              </div>
              <div className="text-xs text-amber-400/90 font-medium">
                Contingency scope — executed if teams maintain &gt;95% planned velocity
              </div>
            </div>

            <div className="divide-y divide-slate-800/80">
              {stretchEpics.map((epic) => (
                <EpicRowItem
                  key={epic.id}
                  epic={epic}
                  team={getTeam(epic.primaryTeamId)}
                  pi={pi}
                  onEditEpic={onEditEpic}
                  onDeleteEpic={onDeleteEpic}
                  onToggleForceCommit={onToggleForceCommit}
                  onUpdateEffort={onUpdateEffort}
                />
              ))}
            </div>
          </div>
        )}

        {/* --- HARD CAPACITY CEILING DIVIDER --- */}
        {deferredEpics.length > 0 && (
          <div className="my-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <div className="text-xs font-mono font-semibold tracking-wider text-slate-400">
                  OUT OF SCOPE / DEFERRED CAPACITY LIMIT
                </div>
                <div className="text-xs text-slate-400">
                  Epics below this threshold exceed available engineering capacity and are deferred to next PI.
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              {deferredEpics.length} Epics · {deferredEpics.reduce((s, e) => s + e.effort, 0)} pts deferred
            </div>
          </div>
        )}

        {/* DEFERRED SECTION */}
        {deferredEpics.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden opacity-90">
            <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-400 tracking-tight">
                  Deferred Backlog for Next PI ({pi.name.includes('Q4') ? 'PI 2027.Q1' : 'Next PI'})
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({deferredEpics.length} Epics)
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Lower WSJF / Stakeholder Priority rank
              </div>
            </div>

            <div className="divide-y divide-slate-800/80">
              {deferredEpics.map((epic) => (
                <EpicRowItem
                  key={epic.id}
                  epic={epic}
                  team={getTeam(epic.primaryTeamId)}
                  pi={pi}
                  onEditEpic={onEditEpic}
                  onDeleteEpic={onDeleteEpic}
                  onToggleForceCommit={onToggleForceCommit}
                  onUpdateEffort={onUpdateEffort}
                />
              ))}
            </div>
          </div>
        )}

        {filteredEpics.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 text-sm">
            No epics match the current search or filters. Try adjusting your query or filters.
          </div>
        )}
      </div>
    </div>
  );
};

interface EpicRowItemProps {
  epic: PrioritizedEpic;
  team?: any;
  pi: ProgramIncrement;
  onEditEpic: (epic: Epic) => void;
  onDeleteEpic: (id: string) => void;
  onToggleForceCommit: (id: string) => void;
  onUpdateEffort: (id: string, newEffort: number) => void;
}

const EpicRowItem: React.FC<EpicRowItemProps> = ({
  epic,
  team,
  pi,
  onEditEpic,
  onDeleteEpic,
  onToggleForceCommit,
  onUpdateEffort
}) => {
  const priorityInfo = getPriorityLabel(epic.stakeholderPriority);
  const statusInfo = getStatusLabel(epic.status);

  return (
    <div className="px-5 py-4 hover:bg-slate-800/50 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 group">
      {/* Left: Rank, ID, Title & Metadata */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className="font-mono font-bold text-slate-400">
            #{epic.rank}
          </span>
          <span className="font-mono font-semibold text-cyan-400">
            {epic.id}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">{epic.strategicTheme}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400">{epic.stakeholder}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className={`font-medium ${priorityInfo.textClass}`}>
            {priorityInfo.label}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-white tracking-tight group-hover:text-cyan-200 transition-colors">
          {epic.title}
        </h3>

        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
          {epic.description}
        </p>

        {/* Business Outcome Kicker */}
        {epic.businessOutcome && (
          <div className="mt-1.5 text-[11px] text-emerald-400/90 font-medium flex items-center gap-1.5">
            <span className="text-slate-400">Outcome:</span>
            <span>{epic.businessOutcome}</span>
          </div>
        )}
      </div>

      {/* Middle: WSJF Metrics & Team */}
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 lg:gap-6 shrink-0 text-xs">
        {/* WSJF Metrics Capsule */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-lg px-3 py-2 text-center min-w-[90px]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
            WSJF Score
          </div>
          <div className="text-base font-mono font-bold text-cyan-300 tabular-nums">
            {epic.wsjfScore}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            CoD: {epic.costOfDelay}
          </div>
        </div>

        {/* Assigned Team */}
        <div className="min-w-[130px]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Assigned Team
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span 
              className="w-2 h-2 rounded-full shrink-0" 
              style={{ backgroundColor: team?.color || '#3b82f6' }}
            />
            <span className="font-medium text-slate-200 truncate max-w-[120px]">
              {team?.name || 'Unassigned'}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Target: Sprint {epic.targetIteration}
          </div>
        </div>

        {/* Effort & Quick Adjuster */}
        <div className="min-w-[110px]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            Effort ({pi.unit})
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <button
              onClick={() => onUpdateEffort(epic.id, Math.max(5, epic.effort - 5))}
              className="w-5 h-5 rounded bg-slate-950 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors"
              title="De-scope -5 points"
            >
              -
            </button>
            <span className="font-mono font-bold text-sm text-white tabular-nums px-1">
              {epic.effort}
            </span>
            <button
              onClick={() => onUpdateEffort(epic.id, epic.effort + 5)}
              className="w-5 h-5 rounded bg-slate-950 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors"
              title="Add effort +5 points"
            >
              +
            </button>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Cumul: {epic.cumulativeEffort} pts
          </div>
        </div>

        {/* Scope Pill */}
        <div className="min-w-[95px] text-right">
          <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded ${
            epic.executionCategory === 'committed'
              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/80'
              : epic.executionCategory === 'stretch'
                ? 'bg-amber-950/60 text-amber-300 border border-amber-800/80'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
          }`}>
            {epic.executionCategory === 'committed'
              ? 'Committed'
              : epic.executionCategory === 'stretch'
                ? 'Stretch'
                : 'Deferred'}
          </span>
          <div className="text-[10px] text-slate-400 mt-1">
            Status: <span className={statusInfo.textClass}>{statusInfo.label}</span>
          </div>
        </div>

        {/* Row Actions */}
        <div className="flex items-center gap-1">
          {/* Force-Commit Toggle */}
          <button
            onClick={() => onToggleForceCommit(epic.id)}
            className={`p-1.5 rounded transition-colors ${
              epic.forceCommit
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={epic.forceCommit ? "Pinned in scope by PO override" : "Pin/Force into scope (PO Override)"}
          >
            <Pin className={`w-3.5 h-3.5 ${epic.forceCommit ? 'rotate-45 text-cyan-400' : ''}`} />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEditEpic(epic)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Edit Epic details & WSJF parameters"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDeleteEpic(epic.id)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
            title="Delete Epic"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
