import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  SlidersHorizontal, 
  Users, 
  TrendingUp, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Award,
  Zap,
  Target
} from 'lucide-react';

interface WelcomeGuideBannerProps {
  onDismiss: () => void;
  onNavigateTab: (tab: 'overview' | 'prioritizer' | 'velocity' | 'teams' | 'report') => void;
  onOpenWhatIf: () => void;
  onOpenNewEpic: () => void;
}

export const WelcomeGuideBanner: React.FC<WelcomeGuideBannerProps> = ({
  onDismiss,
  onNavigateTab,
  onOpenWhatIf,
  onOpenNewEpic
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'features' | 'start'>('overview');
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <div className="no-print bg-slate-900/90 border border-cyan-900/40 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs transition-all shadow-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-white">First-Time User Guide:</span>
          <span className="text-slate-400 hidden sm:inline">Learn how PI Capacity & Epic Prioritization works in 3 steps.</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(false)}
            className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
          >
            <span>Expand Guide</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDismiss}
            className="text-slate-500 hover:text-slate-300 p-1"
            title="Dismiss welcome guide"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="no-print bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-cyan-800/50 rounded-2xl p-5 md:p-6 shadow-md relative overflow-hidden transition-all">
      {/* Subtle background accent glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Top Bar: Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800/80 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="inline-flex items-center gap-1 font-mono uppercase tracking-wider text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 px-2 py-0.5 rounded">
              <Compass className="w-3 h-3" />
              <span>Getting Started Guide</span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Program Increment (PI) Governance</span>
          </div>

          <h2 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Welcome to the PI Capacity & Epic Scope Planner</span>
          </h2>

          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            The decision engine built for <strong className="text-white">Product Owners</strong> and <strong className="text-white">Release Train Engineers (RTEs)</strong> to eliminate guessing during PI planning. Answer with mathematical confidence: <em className="text-cyan-300 not-italic font-medium">How many Epics can your Agile Release Train execute within available capacity and technical skills?</em>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start shrink-0">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
            title="Minimize guide"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={onDismiss}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Dismiss guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center gap-1 pt-4 pb-3 border-b border-slate-800/60 text-xs">
        <button
          onClick={() => setActiveSection('overview')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeSection === 'overview'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>1. What This App Does</span>
        </button>

        <button
          onClick={() => setActiveSection('features')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeSection === 'features'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>2. Feature Breakdown</span>
        </button>

        <button
          onClick={() => setActiveSection('start')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
            activeSection === 'start'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>3. Where to Start (3 Steps)</span>
        </button>
      </div>

      {/* SECTION 1: WHAT THIS APP DOES */}
      {activeSection === 'overview' && (
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs animate-in fade-in duration-150">
          <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl space-y-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono">
              01
            </div>
            <h4 className="font-bold text-white text-sm">Calculates True Capacity</h4>
            <p className="text-slate-400 leading-relaxed">
              Computes net available story points across all cross-functional teams by taking into account team headcounts, focus factors (70–85%), planned holiday/PTO days, and reserving a buffer for stabilization.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl space-y-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold font-mono">
              02
            </div>
            <h4 className="font-bold text-white text-sm">Draws The Cut-Off Line</h4>
            <p className="text-slate-400 leading-relaxed">
              Ranks Epics using SAFe WSJF or Stakeholder Priorities, then marks the exact line where capacity runs out. You get an immediate answer: <strong className="text-cyan-300">How many Epics can be executed</strong> without team burnout.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-xl space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono">
              03
            </div>
            <h4 className="font-bold text-white text-sm">Prevents Skill Bottlenecks</h4>
            <p className="text-slate-400 leading-relaxed">
              Verifies whether assigned teams possess the required technical skills (e.g., Kubernetes, Kafka, Security, React) and flags skill deficits before sprints start.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 2: FEATURE BREAKDOWN */}
      {activeSection === 'features' && (
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
          <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Prioritization Engine</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Sort by WSJF (Cost of Delay / Effort), Stakeholder P0–P3, Value Density, or Urgency. Pin must-deliver regulatory epics with PO Override.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 font-semibold">
              <Award className="w-4 h-4" />
              <span>Team Skills Matrix</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Assign competencies and proficiency levels. The engine identifies skill bottlenecks when high-effort epics lack qualified engineers.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>Burn-Up & Velocity</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Visual trajectory chart tracking delivered points against planned commitments. Log sprint velocity actuals to calculate Say/Do predictability.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <FileText className="w-4 h-4" />
              <span>Stakeholder Reports</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Export professional executive briefing reports for VP & C-suite reviews via formatted PDF, CSV for Jira/Azure DevOps, or Markdown.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 3: WHERE TO START (3 STEPS) */}
      {activeSection === 'start' && (
        <div className="pt-4 space-y-3 text-xs animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-cyan-400 font-mono text-[11px] font-bold mb-1">
                  <span>STEP 1</span>
                  <span>CAPACITY</span>
                </div>
                <h4 className="font-bold text-white text-sm">Review Team Availability</h4>
                <p className="text-slate-400 mt-1 text-[11px]">
                  Check your 4 delivery teams, engineer headcounts, and registered technical skills. Adjust focus factors or planned PTO days.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('teams')}
                className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Inspect Teams & Skills</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-950 border border-cyan-800/50 p-4 rounded-xl flex flex-col justify-between space-y-3 shadow-xs">
              <div>
                <div className="flex items-center justify-between text-cyan-300 font-mono text-[11px] font-bold mb-1">
                  <span>STEP 2</span>
                  <span>SCOPE CUT-OFF</span>
                </div>
                <h4 className="font-bold text-white text-sm">Observe The Execution Cut-Off</h4>
                <p className="text-slate-400 mt-1 text-[11px]">
                  View candidate Epics sorted by WSJF or Priority. See which Epics are In-Scope, which are Stretch, and which are Deferred.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('prioritizer')}
                className="w-full py-1.5 px-3 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Open Prioritization View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-purple-400 font-mono text-[11px] font-bold mb-1">
                  <span>STEP 3</span>
                  <span>WHAT-IF & REPORT</span>
                </div>
                <h4 className="font-bold text-white text-sm">Simulate Scenarios & Export</h4>
                <p className="text-slate-400 mt-1 text-[11px]">
                  Test adding contractors or extending duration in the What-If Sandbox, or generate a formatted PDF briefing for stakeholders.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onOpenWhatIf}
                  className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-center transition-colors"
                >
                  What-If Sandbox
                </button>
                <button
                  onClick={() => onNavigateTab('report')}
                  className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-center transition-colors"
                >
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer Callout */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Pre-loaded with sample Agile Release Train data (4 teams, 14 epics, 18 skills). You can edit or add your own anytime.</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewEpic}
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            + Create First Epic
          </button>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white"
          >
            Got it, hide guide
          </button>
        </div>
      </div>
    </div>
  );
};
