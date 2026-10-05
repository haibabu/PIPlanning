import React from 'react';
import { 
  Sparkles, 
  SlidersHorizontal, 
  Plus, 
  FileDown, 
  Layers, 
  TrendingUp, 
  Users, 
  FileText
} from 'lucide-react';

interface HeaderNavProps {
  activeTab: 'overview' | 'prioritizer' | 'velocity' | 'teams' | 'report';
  setActiveTab: (tab: 'overview' | 'prioritizer' | 'velocity' | 'teams' | 'report') => void;
  onOpenNewEpic: () => void;
  onOpenWhatIf: () => void;
  onExportReport: () => void;
  committedCount: number;
  totalCount: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewEpic,
  onOpenWhatIf,
  onExportReport,
  committedCount,
  totalCount
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <button 
            onClick={() => setActiveTab('overview')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              AgileRelease
            </span>
            <span className="ml-2 text-xs font-mono tracking-widest text-cyan-400">
              PI CAPACITY PLANNER
            </span>
          </button>

          {/* Mobile primary action trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenNewEpic}
              className="p-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-md transition-colors"
              aria-label="Create Epic"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('prioritizer')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'prioritizer'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
            <span>Capacity & Prioritization</span>
            <span className="ml-1 text-[10px] font-mono text-cyan-400 font-normal">
              ({committedCount}/{totalCount})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('velocity')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'velocity'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Velocity & Burn-Up</span>
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'teams'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Team Allocation</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'report'
                ? 'bg-slate-800 text-white font-semibold shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Stakeholder Review</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenWhatIf}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            title="Simulate capacity scenarios, staffing changes, or duration adjustments"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>What-If Sandbox</span>
          </button>

          <button
            onClick={onExportReport}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/60 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
            title="Export executive summary and progress report"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Report</span>
          </button>

          <button
            onClick={onOpenNewEpic}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Epic</span>
          </button>
        </div>
      </div>
    </header>
  );
};
