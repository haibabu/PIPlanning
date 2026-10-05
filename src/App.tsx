import React, { useState, useEffect, useMemo } from 'react';
import { 
  ProgramIncrement, 
  Epic, 
  PrioritizationMode, 
  PrioritizedEpic, 
  Team 
} from './types';
import { 
  INITIAL_PI, 
  INITIAL_TEAMS,
  INITIAL_EPICS, 
  INITIAL_COMPLETED_SPRINTS 
} from './utils/defaultData';
import { 
  prioritizeEpics, 
  calculateCapacityAnalysis 
} from './utils/calculations';
import { HeaderNav } from './components/HeaderNav';
import { CapacitySummaryBanner } from './components/CapacitySummaryBanner';
import { ExecutiveOverviewView } from './components/ExecutiveOverviewView';
import { PrioritizationView } from './components/PrioritizationView';
import { VelocityDashboardView } from './components/VelocityDashboardView';
import { TeamAllocationView } from './components/TeamAllocationView';
import { StakeholderReportView } from './components/StakeholderReportView';
import { WhatIfSimulatorModal } from './components/WhatIfSimulatorModal';
import { EpicModal } from './components/EpicModal';
import { RotateCcw, ShieldCheck } from 'lucide-react';

const STORAGE_KEY_PI = 'apex_pi_data_v3';
const STORAGE_KEY_EPICS = 'apex_epics_data_v3';
const STORAGE_KEY_SPRINTS = 'apex_sprints_data_v3';

export default function App() {
  // Load state from localStorage or default
  const [pi, setPi] = useState<ProgramIncrement>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PI);
      if (!saved) return INITIAL_PI;
      const parsed = JSON.parse(saved);
      if (parsed.teams) {
        parsed.teams = parsed.teams.map((t: Team, idx: number) => ({
          ...t,
          skills: t.skills || INITIAL_TEAMS[idx]?.skills || []
        }));
      }
      return parsed;
    } catch {
      return INITIAL_PI;
    }
  });

  const [epics, setEpics] = useState<Epic[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EPICS);
      if (!saved) return INITIAL_EPICS;
      const parsed = JSON.parse(saved);
      return parsed.map((e: Epic, idx: number) => ({
        ...e,
        requiredSkills: e.requiredSkills || INITIAL_EPICS.find(ie => ie.id === e.id)?.requiredSkills || []
      }));
    } catch {
      return INITIAL_EPICS;
    }
  });

  const [completedSprintsData, setCompletedSprintsData] = useState<{ [sprintNum: number]: number }>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SPRINTS);
      return saved ? JSON.parse(saved) : INITIAL_COMPLETED_SPRINTS;
    } catch {
      return INITIAL_COMPLETED_SPRINTS;
    }
  });

  const [prioritizationMode, setPrioritizationMode] = useState<PrioritizationMode>('wsjf');
  const [activeTab, setActiveTab] = useState<'overview' | 'prioritizer' | 'velocity' | 'teams' | 'report'>('overview');

  // Modals state
  const [isEpicModalOpen, setIsEpicModalOpen] = useState(false);
  const [editingEpic, setEditingEpic] = useState<Epic | null>(null);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PI, JSON.stringify(pi));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [pi]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EPICS, JSON.stringify(epics));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [epics]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SPRINTS, JSON.stringify(completedSprintsData));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [completedSprintsData]);

  // Reactive Prioritization and Capacity Analysis
  const prioritizedEpics = useMemo(() => {
    return prioritizeEpics(epics, pi, prioritizationMode);
  }, [epics, pi, prioritizationMode]);

  const capacityAnalysis = useMemo(() => {
    return calculateCapacityAnalysis(pi, prioritizedEpics);
  }, [pi, prioritizedEpics]);

  // Actions
  const handleUpdatePi = (updated: Partial<ProgramIncrement>) => {
    setPi(prev => ({ ...prev, ...updated }));
  };

  const handleUpdateTeam = (teamId: string, updated: Partial<Team>) => {
    setPi(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === teamId ? { ...t, ...updated } : t)
    }));
  };

  const handleSaveEpic = (epicData: Epic) => {
    setEpics(prev => {
      const exists = prev.some(e => e.id === epicData.id);
      if (exists) {
        return prev.map(e => e.id === epicData.id ? epicData : e);
      } else {
        return [epicData, ...prev];
      }
    });
    setEditingEpic(null);
  };

  const handleDeleteEpic = (id: string) => {
    setEpics(prev => prev.filter(e => e.id !== id));
  };

  const handleToggleForceCommit = (id: string) => {
    setEpics(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, forceCommit: !e.forceCommit };
      }
      return e;
    }));
  };

  const handleUpdateEffort = (id: string, newEffort: number) => {
    setEpics(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          effort: newEffort,
          wsjf: {
            ...e.wsjf,
            jobSize: newEffort
          }
        };
      }
      return e;
    }));
  };

  const handleUpdateSprintActuals = (sprintNum: number, actualPoints: number) => {
    setCompletedSprintsData(prev => ({
      ...prev,
      [sprintNum]: actualPoints
    }));
  };

  const handleUpdateCurrentSprint = (sprintNum: number) => {
    setPi(prev => ({ ...prev, currentSprintIndex: sprintNum }));
  };

  const handleApplyScenario = (simulatedPi: ProgramIncrement) => {
    setPi(simulatedPi);
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Reset all PI planning data, teams, and epics to standard default ART baseline?")) {
      setPi(INITIAL_PI);
      setEpics(INITIAL_EPICS);
      setCompletedSprintsData(INITIAL_COMPLETED_SPRINTS);
      setPrioritizationMode('wsjf');
      localStorage.removeItem(STORAGE_KEY_PI);
      localStorage.removeItem(STORAGE_KEY_EPICS);
      localStorage.removeItem(STORAGE_KEY_SPRINTS);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewEpic={() => {
          setEditingEpic(null);
          setIsEpicModalOpen(true);
        }}
        onOpenWhatIf={() => setIsWhatIfOpen(true)}
        onExportReport={() => setActiveTab('report')}
        committedCount={capacityAnalysis.committedEpicCount}
        totalCount={epics.length}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Top Capacity Summary Banner (Answers "How Many Epics Can Be Executed?") */}
        <div className="no-print">
          <CapacitySummaryBanner
            pi={pi}
            capacityAnalysis={capacityAnalysis}
            prioritizationMode={prioritizationMode}
            setPrioritizationMode={setPrioritizationMode}
            onUpdatePi={handleUpdatePi}
            onNavigateToPrioritization={() => setActiveTab('prioritizer')}
          />
        </div>

        {/* Tab Panels */}
        {activeTab === 'overview' && (
          <ExecutiveOverviewView
            pi={pi}
            capacityAnalysis={capacityAnalysis}
            prioritizedEpics={prioritizedEpics}
            onNavigateTab={setActiveTab}
            onOpenNewEpic={() => {
              setEditingEpic(null);
              setIsEpicModalOpen(true);
            }}
            onOpenWhatIf={() => setIsWhatIfOpen(true)}
          />
        )}

        {activeTab === 'prioritizer' && (
          <PrioritizationView
            prioritizedEpics={prioritizedEpics}
            capacityAnalysis={capacityAnalysis}
            pi={pi}
            prioritizationMode={prioritizationMode}
            setPrioritizationMode={setPrioritizationMode}
            onEditEpic={(epic) => {
              setEditingEpic(epic);
              setIsEpicModalOpen(true);
            }}
            onDeleteEpic={handleDeleteEpic}
            onToggleForceCommit={handleToggleForceCommit}
            onUpdateEffort={handleUpdateEffort}
          />
        )}

        {activeTab === 'velocity' && (
          <VelocityDashboardView
            pi={pi}
            capacityAnalysis={capacityAnalysis}
            prioritizedEpics={prioritizedEpics}
            completedSprintsData={completedSprintsData}
            onUpdateSprintActuals={handleUpdateSprintActuals}
            onUpdateCurrentSprint={handleUpdateCurrentSprint}
          />
        )}

        {activeTab === 'teams' && (
          <TeamAllocationView
            pi={pi}
            capacityAnalysis={capacityAnalysis}
            prioritizedEpics={prioritizedEpics}
            onUpdateTeam={handleUpdateTeam}
          />
        )}

        {activeTab === 'report' && (
          <StakeholderReportView
            pi={pi}
            capacityAnalysis={capacityAnalysis}
            prioritizedEpics={prioritizedEpics}
            completedSprintsData={completedSprintsData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-4 px-4 lg:px-8 mt-auto text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Apex PI Capacity & Scope Planner</span>
            <span aria-hidden="true">·</span>
            <span>Scaled Agile (SAFe) Program Increment Governance</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetToDefaults}
              className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
              title="Reset all sample data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-cyan-400">
              {capacityAnalysis.committedEpicCount} of {epics.length} Epics In Scope
            </span>
          </div>
        </div>
      </footer>

      {/* Epic Create / Edit Modal */}
      <EpicModal
        isOpen={isEpicModalOpen}
        onClose={() => {
          setIsEpicModalOpen(false);
          setEditingEpic(null);
        }}
        onSave={handleSaveEpic}
        editingEpic={editingEpic}
        pi={pi}
      />

      {/* What-If Simulation Sandbox Modal */}
      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        pi={pi}
        epics={epics}
        prioritizationMode={prioritizationMode}
        onApplyScenario={handleApplyScenario}
      />
    </div>
  );
}
