import React, { useState } from 'react';
import { 
  Network, 
  X, 
  Layers, 
  Cpu, 
  Database, 
  FileDown, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Award,
  SlidersHorizontal,
  TrendingUp,
  ShieldCheck,
  Copy,
  Check,
  Code
} from 'lucide-react';

import { PlantUMLDiagramView } from './PlantUMLDiagramView';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MERMAID_DIAGRAM_CODE = `flowchart TB
    %% ==========================================
    %% PRESENTATION & UI LAYER
    %% ==========================================
    subgraph UI_LAYER["Presentation & User Experience Layer (React 19 SPA)"]
        Nav["HeaderNav\\n(Tabs, What-If, Guide, Architecture, +Add Epic)"]
        Banner["CapacitySummaryBanner\\n(Core Answer, Utilization %, Duration & Buffer)"]
        Guide["WelcomeGuideBanner\\n(Onboarding, Purpose, 3-Step Walkthrough)"]

        subgraph VIEWS["Active View Tabs"]
            V_Overview["ExecutiveOverviewView\\n(Roadmap & Theme Mix)"]
            V_Prioritize["PrioritizationView\\n(Capacity Cut-Off Line & WSJF)"]
            V_Velocity["VelocityDashboardView\\n(SVG Burn-Up & Sprints)"]
            V_Teams["TeamAllocationView\\n(FTE Sliders & Skills Heatmap)"]
            V_Report["StakeholderReportView\\n(Print PDF, CSV, Markdown)"]
        end

        subgraph MODALS["Interactive Overlays"]
            M_Epic["EpicModal\\n(WSJF Calculator & Skills)"]
            M_WhatIf["WhatIfSimulatorModal\\n(Staffing & Buffer Sandbox)"]
            M_Arch["ArchitectureModal\\n(Mermaid & PlantUML Viewer)"]
        end
    end

    %% ==========================================
    %% DOMAIN & CALCULATION ENGINE
    %% ==========================================
    subgraph CORE_ENGINE["Agile Domain & Calculation Engine (calculations.ts)"]
        CapCalc["1. Capacity Derivation Engine\\n• Team Capacity = Base * Focus * (1 - PTO)\\n• Net Capacity = Gross * (1 - Buffer%)"]
        PrioritizeEngine["2. Multi-Model Prioritization Stack\\n• WSJF = Cost of Delay / Effort\\n• Stakeholder P0-P3 & Value Density"]
        CutoffEngine["3. Scope Boundary Classifier\\n• Cumulative <= Net: COMMITTED\\n• Cumulative <= Gross: STRETCH\\n• Cumulative > Gross: DEFERRED"]
        SkillsEngine["4. Skill Matching & Bottleneck Matrix\\n• Cross-references Epic.requiredSkills\\n• Flags Missing Skills on Teams\\n• Aggregates Skill Demand Heatmap"]
        VelocityEngine["5. Burn-Up Forecasting\\n• Ideal trajectory line\\n• Say/Do Ratio & actual run-rate"]
    end

    %% ==========================================
    %% DATA PERSISTENCE & EXPORT LAYER
    %% ==========================================
    subgraph DATA_LAYER["Persistence & Export Layer"]
        subgraph STORAGE["Browser LocalStorage"]
            LS_PI["apex_pi_data_v3\\n(PI Config & Teams)"]
            LS_Epics["apex_epics_data_v3\\n(Candidate Epics)"]
            LS_Sprints["apex_sprints_data_v3\\n(Iteration Actuals)"]
        end

        subgraph EXPORTS["Export Pipelines"]
            EXP_PDF["Native Print Engine\\n(@media print -> PDF)"]
            EXP_CSV["Jira / ADO CSV Export"]
            EXP_MD["Markdown Briefing Generator"]
            EXP_Clip["Clipboard Slack/Email Serializer"]
        end
    end

    %% ==========================================
    %% RELATIONSHIPS & FLOW
    %% ==========================================
    Nav --> VIEWS
    Banner --> V_Prioritize
    VIEWS --> CORE_ENGINE
    MODALS --> CORE_ENGINE

    CORE_ENGINE --> CapCalc
    CapCalc --> CutoffEngine
    PrioritizeEngine --> CutoffEngine
    CutoffEngine --> V_Prioritize
    CutoffEngine --> Banner
    SkillsEngine --> V_Teams
    SkillsEngine --> V_Prioritize
    VelocityEngine --> V_Velocity

    CORE_ENGINE <--> STORAGE
    V_Report --> EXPORTS

    classDef ui fill:#0f172a,stroke:#06b6d4,stroke-width:2px,color:#f8fafc;
    classDef engine fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#f8fafc;
    classDef data fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#f8fafc;

    class UI_LAYER,Nav,Banner,Guide,V_Overview,V_Prioritize,V_Velocity,V_Teams,V_Report,M_Epic,M_WhatIf,M_Arch ui;
    class CORE_ENGINE,CapCalc,PrioritizeEngine,CutoffEngine,SkillsEngine,VelocityEngine engine;
    class DATA_LAYER,LS_PI,LS_Epics,LS_Sprints,EXP_PDF,EXP_CSV,EXP_MD,EXP_Clip data;`;

export const PLANTUML_DIAGRAM_CODE = `@startuml PI_Capacity_Planner_Architecture
!theme plain
skinparam backgroundColor #0F172A
skinparam defaultFontColor #F8FAFC
skinparam defaultFontName "Helvetica"
skinparam roundcorner 10
skinparam shadowing false
skinparam ArrowColor #38BDF8

skinparam package {
  BackgroundColor #1E293B
  BorderColor #334155
  FontColor #38BDF8
}

skinparam component {
  BackgroundColor #0F172A
  BorderColor #06B6D4
  FontColor #F8FAFC
}

skinparam database {
  BackgroundColor #0F172A
  BorderColor #10B981
  FontColor #F8FAFC
}

package "Presentation & UI Layer (React 19 SPA)" as UI {
  [HeaderNav] as Nav
  [CapacitySummaryBanner] as Banner
  [WelcomeGuideBanner] as Guide
  
  package "Active Views" {
    [ExecutiveOverviewView] as V_Overview
    [PrioritizationView\\n(Capacity Cut-Off Line)] as V_Prioritize
    [VelocityDashboardView\\n(SVG Burn-Up)] as V_Velocity
    [TeamAllocationView\\n(Skills Matrix)] as V_Teams
    [StakeholderReportView] as V_Report
  }
  
  package "Modals & Overlays" {
    [EpicModal\\n(WSJF & Skills)] as M_Epic
    [WhatIfSimulatorModal] as M_WhatIf
    [ArchitectureModal] as M_Arch
  }
}

package "Business Logic & Domain Engine (calculations.ts)" as Engine {
  [Capacity Derivation Engine\\n(FTE, Focus, PTO, Buffer)] as CapEngine
  [Multi-Model Prioritization\\n(WSJF, P0-P3, Value Density)] as PrioEngine
  [Scope Boundary Classifier\\n(Committed / Stretch / Deferred)] as CutoffEngine
  [Skill Matching & Bottleneck Matrix] as SkillsEngine
  [Velocity Burn-Up & Forecasting] as VelocityEngine
}

package "Persistence & Interoperability" as Persistence {
  database "LocalStorage" {
    [apex_pi_data_v3] as DB_PI
    [apex_epics_data_v3] as DB_Epics
    [apex_sprints_data_v3] as DB_Sprints
  }
  
  package "Export Channels" {
    [Native Print / PDF Engine] as Exp_PDF
    [Jira / ADO CSV Generator] as Exp_CSV
    [Markdown Executive Brief] as Exp_MD
    [Clipboard Serializer] as Exp_Clip
  }
}

' User interactions & View navigation
Nav --> V_Overview
Nav --> V_Prioritize
Nav --> V_Velocity
Nav --> V_Teams
Nav --> V_Report
Banner --> V_Prioritize

' Views and Modals connect to Engine
V_Prioritize ..> PrioEngine : request prioritization
V_Prioritize ..> CutoffEngine : query cut-off status
V_Teams ..> CapEngine : team resource adjustments
V_Teams ..> SkillsEngine : team skill profiles
V_Velocity ..> VelocityEngine : burn-up & Say/Do actuals
M_WhatIf ..> CapEngine : sandbox simulation
M_WhatIf ..> CutoffEngine : simulate scope shifts

' Calculation chain inside Engine
CapEngine --> CutoffEngine : provides Net & Gross Capacity
PrioEngine --> CutoffEngine : provides ranked Cumulative Effort
SkillsEngine ..> CutoffEngine : flags team skill deficits
CutoffEngine --> Banner : committed count & load %
CutoffEngine --> V_Prioritize : renders visual Cut-Off Line

' Persistence and Export links
UI <--> DB_PI : state sync
UI <--> DB_Epics : state sync
UI <--> DB_Sprints : state sync

V_Report --> Exp_PDF : window.print()
V_Report --> Exp_CSV : download .csv
V_Report --> Exp_MD : download .md
V_Report --> Exp_Clip : copy summary

@enduml`;

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'mermaid' | 'plantuml'>('visual');
  const [copiedMermaid, setCopiedMermaid] = useState(false);
  const [copiedPlantUml, setCopiedPlantUml] = useState(false);

  const handleCopyMermaid = () => {
    navigator.clipboard.writeText(MERMAID_DIAGRAM_CODE);
    setCopiedMermaid(true);
    setTimeout(() => setCopiedMermaid(false), 2000);
  };

  const handleCopyPlantUml = () => {
    navigator.clipboard.writeText(PLANTUML_DIAGRAM_CODE);
    setCopiedPlantUml(true);
    setTimeout(() => setCopiedPlantUml(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-6xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                System & Architecture Blueprint
              </h2>
              <p className="text-xs text-slate-400">
                End-to-end component hierarchy, data flow, Mermaid & PlantUML models with adjacent image view.
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

        {/* View Switcher Tabs */}
        <div className="px-6 pt-3 pb-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between">
          <div className="inline-flex bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'visual'
                  ? 'bg-slate-800 text-cyan-300 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Visual Flow</span>
            </button>
            <button
              onClick={() => setActiveTab('plantuml')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'plantuml'
                  ? 'bg-slate-800 text-purple-300 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-purple-400" />
              <span>PlantUML Diagram (Image & Code)</span>
            </button>
            <button
              onClick={() => setActiveTab('mermaid')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'mermaid'
                  ? 'bg-slate-800 text-cyan-300 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mermaid Diagram</span>
            </button>
          </div>

          {activeTab === 'mermaid' && (
            <button
              onClick={handleCopyMermaid}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono rounded flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copiedMermaid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMermaid ? 'Copied!' : 'Copy Mermaid Code'}</span>
            </button>
          )}

          {activeTab === 'plantuml' && (
            <button
              onClick={handleCopyPlantUml}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-mono rounded flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copiedPlantUml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPlantUml ? 'Copied!' : 'Copy PlantUML Code'}</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* TAB 1: Visual Blueprint */}
          {activeTab === 'visual' && (
            <div className="space-y-6">
              {/* Layer 1: Presentation & Views */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-cyan-400 font-mono">
                  <span className="font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>LAYER 1: PRESENTATION & USER EXPERIENCE (React 19 SPA)</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Tailwind CSS v4 · Client-Side</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg">
                    <div className="font-bold text-white">HeaderNav & Top Bar</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">3-Zone Top Bar contract: Brand wordmark, 5-tab links, What-If trigger, guide toggle, architecture view.</div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg">
                    <div className="font-bold text-white">CapacitySummaryBanner</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Direct answer to "How many Epics can be executed?", utilization gauge, duration/buffer controls.</div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg">
                    <div className="font-bold text-white">PrioritizationView</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Visual Capacity Cut-off threshold line, WSJF scoring, effort adjusters down to 1, and skill gap alerts.</div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg">
                    <div className="font-bold text-white">VelocityDashboardView</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Interactive SVG Burn-Up chart, sprint iteration actuals logger, Say/Do ratio tracker.</div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg">
                    <div className="font-bold text-white">TeamAllocationView</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">FTE & focus factor sliders, technical skills matrix, and skill demand vs supply heatmap.</div>
                  </div>
                  <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg">
                    <div className="font-bold text-white">StakeholderReportView</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Executive progress briefing, printable PDF view, CSV export for Jira/ADO, Markdown generator.</div>
                  </div>
                </div>
              </div>

              {/* Central Arrow */}
              <div className="flex justify-center -my-3">
                <div className="px-3 py-1 bg-slate-800 text-cyan-400 font-mono text-[10px] rounded-full border border-slate-700 flex items-center gap-1">
                  <span>Dynamic State & Event Dispatch</span>
                  <ArrowRight className="w-3 h-3 rotate-90" />
                </div>
              </div>

              {/* Layer 2: Business Logic & Calculations Engine */}
              <div className="bg-slate-950 border border-cyan-900/40 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-cyan-300 font-mono">
                  <span className="font-bold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>LAYER 2: BUSINESS LOGIC & CALCULATION ENGINE (src/utils/calculations.ts)</span>
                  </span>
                  <span className="text-[10px] text-cyan-400/80">Deterministic Math Engine</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg space-y-1.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-cyan-400">1.</span>
                      <span>Empirical Capacity Engine</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      <code className="text-cyan-300 font-mono text-[10px]">
                        NetCapacity = Gross - (Gross * Buffer%)
                      </code><br />
                      Computes individual team available capacity using FTE headcount, iteration workdays, focus factors (70–85%), and PTO deduction rates.
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg space-y-1.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-cyan-400">2.</span>
                      <span>Multi-Model Prioritization Stack</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      <code className="text-cyan-300 font-mono text-[10px]">
                        WSJF = (UserValue + TimeCrit + RiskRed) / JobSize
                      </code><br />
                      Supports Scaled Agile (SAFe) WSJF, Stakeholder P0–P3, Value Density (ROI), and PO Pin Override.
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg space-y-1.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-cyan-400">3.</span>
                      <span>Scope Boundary Classification</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Partitions Epics as effort accumulates:<br />
                      • <strong className="text-emerald-400">Committed</strong>: Cumulative ≤ Net Capacity<br />
                      • <strong className="text-amber-400">Stretch Target</strong>: Cumulative ≤ Gross Capacity<br />
                      • <strong className="text-slate-400">Deferred Scope</strong>: Cumulative &gt; Gross Capacity
                    </p>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg space-y-1.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-cyan-400">4.</span>
                      <span>Skills Matching & Bottleneck Engine</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Cross-references 18+ technical competencies across teams. Identifies missing required skills on assigned teams and calculates story point demand per skill.
                    </p>
                  </div>
                </div>
              </div>

              {/* Central Arrow */}
              <div className="flex justify-center -my-3">
                <div className="px-3 py-1 bg-slate-800 text-cyan-400 font-mono text-[10px] rounded-full border border-slate-700 flex items-center gap-1">
                  <span>Read / Write Synchronization</span>
                  <ArrowRight className="w-3 h-3 rotate-90" />
                </div>
              </div>

              {/* Layer 3: Persistence & Interoperability */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-emerald-400 font-mono">
                  <span className="font-bold flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>LAYER 3: PERSISTENCE, SIMULATION & EXPORT CHANNELS</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Storage & Interop</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg space-y-1">
                    <div className="font-bold text-white">LocalStorage Persistence</div>
                    <div className="text-[11px] text-slate-400">
                      • <code className="text-cyan-300">apex_pi_data_v3</code><br />
                      • <code className="text-cyan-300">apex_epics_data_v3</code><br />
                      • <code className="text-cyan-300">apex_sprints_data_v3</code><br />
                      Instant persistence across sessions without external server dependencies.
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg space-y-1">
                    <div className="font-bold text-white">What-If Sandbox Engine</div>
                    <div className="text-[11px] text-slate-400">
                      Simulates staffing shifts (+/- FTEs), PI duration adjustments, and velocity variances in an isolated sandbox before committing to baseline.
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg space-y-1">
                    <div className="font-bold text-white">Export & Report Engine</div>
                    <div className="text-[11px] text-slate-400">
                      • Print-ready PDF via <code className="text-cyan-300">@media print</code><br />
                      • Jira/ADO CSV Spreadsheet<br />
                      • Markdown Executive Briefing<br />
                      • Clipboard Slack/Email Serializer
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Mermaid Diagram */}
          {activeTab === 'mermaid' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
                <span>Mermaid Architecture Specification:</span>
                <span>Valid for GitHub Markdown, Notion & Mermaid Live Editor</span>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto text-[11px] font-mono text-cyan-300/90 leading-relaxed selection:bg-cyan-500/20">
                {MERMAID_DIAGRAM_CODE}
              </pre>
            </div>
          )}

          {/* TAB 3: PlantUML Diagram */}
          {activeTab === 'plantuml' && (
            <PlantUMLDiagramView />
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-slate-400 text-xs">
            Architecture Specification: C4 Level 2 Component Model.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-lg transition-colors text-xs"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
