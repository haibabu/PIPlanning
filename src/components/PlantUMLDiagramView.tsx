import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Columns, 
  Maximize2, 
  Code, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { PLANTUML_DIAGRAM_CODE } from './ArchitectureModal';

interface PlantUMLDiagramViewProps {
  onCopySuccess?: () => void;
}

export const PlantUMLDiagramView: React.FC<PlantUMLDiagramViewProps> = () => {
  const [viewMode, setViewMode] = useState<'split' | 'diagram' | 'code'>('split');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(PLANTUML_DIAGRAM_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    const svgElement = document.getElementById('plantuml-rendered-svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PI_Capacity_Planner_PlantUML_Architecture.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenPlantText = () => {
    // Open PlantText web editor
    window.open('https://www.planttext.com/', '_blank');
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* View Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-800 text-xs">
        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'split'
                ? 'bg-purple-600/30 text-purple-300 font-semibold border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Adjacent view: Diagram image side-by-side with PlantUML code"
          >
            <Columns className="w-3.5 h-3.5 text-purple-400" />
            <span>Adjacent (Image & Code)</span>
          </button>

          <button
            onClick={() => setViewMode('diagram')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'diagram'
                ? 'bg-purple-600/30 text-purple-300 font-semibold border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Full rendered diagram view"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Diagram Image Only</span>
          </button>

          <button
            onClick={() => setViewMode('code')}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              viewMode === 'code'
                ? 'bg-purple-600/30 text-purple-300 font-semibold border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Raw PlantUML code only"
          >
            <Code className="w-3.5 h-3.5 text-slate-400" />
            <span>PlantUML Code</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {viewMode !== 'code' && (
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-300">
              <button
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
                className="p-0.5 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] px-1 text-cyan-400">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(160, prev + 15))}
                className="p-0.5 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="p-0.5 hover:text-white transition-colors ml-1 text-slate-500 hover:text-slate-300"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={handleDownloadSvg}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Export this PlantUML diagram as a standalone SVG vector image"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save SVG</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 rounded text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Copy PlantUML source code to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleOpenPlantText}
            className="px-2 py-1 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
            title="Open in external PlantText editor"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden md:inline">PlantText</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`grid gap-4 ${
        viewMode === 'split' 
          ? 'grid-cols-1 lg:grid-cols-12 min-h-[580px]' 
          : 'grid-cols-1 min-h-[580px]'
      }`}>
        {/* PlantUML Diagram Rendered Image / View */}
        {viewMode !== 'code' && (
          <div className={`${
            viewMode === 'split' ? 'lg:col-span-7 xl:col-span-8' : 'w-full'
          } bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col`}>
            {/* Diagram Title Banner */}
            <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                <span className="font-mono text-xs text-purple-300 font-semibold">
                  PlantUML Architecture Diagram
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  @startuml PI_Capacity_Planner_Architecture
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                C4 Component Model
              </span>
            </div>

            {/* Scrollable / Zoomable SVG Render Box */}
            <div className="overflow-auto p-4 flex-1 flex justify-center items-start bg-radial from-slate-900 to-slate-950">
              <div 
                style={{ 
                  transform: `scale(${zoomLevel / 100})`, 
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out' 
                }}
                className="w-full flex justify-center py-2"
              >
                {/* Authentic PlantUML Styled SVG Diagram */}
                <svg
                  id="plantuml-rendered-svg"
                  viewBox="0 0 920 1280"
                  className="w-[920px] h-[1280px] drop-shadow-2xl select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    {/* Markers for arrows */}
                    <marker
                      id="puml-arrow"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#38BDF8" />
                    </marker>
                    <marker
                      id="puml-arrow-green"
                      viewBox="0 0 10 10"
                      refX="8"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#10B981" />
                    </marker>

                    {/* Gradient background */}
                    <linearGradient id="puml-bg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0B1120" />
                      <stop offset="100%" stopColor="#020617" />
                    </linearGradient>

                    {/* Package gradient */}
                    <linearGradient id="puml-pkg-bg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E293B" />
                      <stop offset="100%" stopColor="#131C2E" />
                    </linearGradient>

                    {/* Component box gradient */}
                    <linearGradient id="puml-comp-bg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0F172A" />
                      <stop offset="100%" stopColor="#090E17" />
                    </linearGradient>
                  </defs>

                  {/* Canvas Background */}
                  <rect width="920" height="1280" rx="14" fill="url(#puml-bg)" stroke="#334155" strokeWidth="2" />

                  {/* Title & Diagram Frame */}
                  <rect x="24" y="20" width="872" height="42" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="1" />
                  <text x="40" y="46" fill="#38BDF8" fontFamily="ui-monospace, monospace" fontSize="14" fontWeight="bold">
                    diagram: PI_Capacity_Planner_Architecture (C4 Component Model)
                  </text>
                  <text x="730" y="46" fill="#94A3B8" fontFamily="sans-serif" fontSize="11">
                    Skin: Plain Dark / PlantUML
                  </text>

                  {/* ========================================================
                      PACKAGE 1: PRESENTATION & UI LAYER (REACT 19 SPA)
                     ======================================================== */}
                  {/* Package tab */}
                  <path d="M 40 85 L 360 85 L 375 105 L 40 105 Z" fill="#334155" />
                  <text x="52" y="99" fill="#38BDF8" fontFamily="Helvetica, sans-serif" fontSize="12" fontWeight="bold">
                    package "Presentation &amp; UI Layer (React 19 SPA)"
                  </text>
                  {/* Package container body */}
                  <rect x="40" y="105" width="840" height="390" rx="8" fill="url(#puml-pkg-bg)" stroke="#334155" strokeWidth="1.5" />

                  {/* [HeaderNav] Component */}
                  <g id="comp-headernav">
                    <rect x="65" y="125" width="220" height="60" rx="6" fill="url(#puml-comp-bg)" stroke="#06B6D4" strokeWidth="1.5" />
                    {/* Component small icon tabs on right */}
                    <rect x="277" y="133" width="12" height="6" rx="1" fill="#06B6D4" />
                    <rect x="277" y="145" width="12" height="6" rx="1" fill="#06B6D4" />
                    <text x="80" y="148" fill="#38BDF8" fontFamily="monospace" fontSize="10">«component»</text>
                    <text x="80" y="167" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="13" fontWeight="bold">[HeaderNav]</text>
                  </g>

                  {/* [CapacitySummaryBanner] Component */}
                  <g id="comp-banner">
                    <rect x="315" y="125" width="280" height="60" rx="6" fill="url(#puml-comp-bg)" stroke="#06B6D4" strokeWidth="1.5" />
                    <rect x="587" y="133" width="12" height="6" rx="1" fill="#06B6D4" />
                    <rect x="587" y="145" width="12" height="6" rx="1" fill="#06B6D4" />
                    <text x="330" y="148" fill="#38BDF8" fontFamily="monospace" fontSize="10">«component»</text>
                    <text x="330" y="167" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="13" fontWeight="bold">[CapacitySummaryBanner]</text>
                  </g>

                  {/* [WelcomeGuideBanner] Component */}
                  <g id="comp-guide">
                    <rect x="625" y="125" width="230" height="60" rx="6" fill="url(#puml-comp-bg)" stroke="#06B6D4" strokeWidth="1.5" />
                    <rect x="847" y="133" width="12" height="6" rx="1" fill="#06B6D4" />
                    <rect x="847" y="145" width="12" height="6" rx="1" fill="#06B6D4" />
                    <text x="640" y="148" fill="#38BDF8" fontFamily="monospace" fontSize="10">«component»</text>
                    <text x="640" y="167" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="13" fontWeight="bold">[WelcomeGuideBanner]</text>
                  </g>

                  {/* SUBPACKAGE: Active Views */}
                  <path d="M 65 210 L 210 210 L 222 225 L 65 225 Z" fill="#253348" />
                  <text x="75" y="221" fill="#38BDF8" fontFamily="Helvetica, sans-serif" fontSize="10" fontWeight="bold">
                    package "Active Views"
                  </text>
                  <rect x="65" y="225" width="790" height="135" rx="6" fill="#131D2D" stroke="#253348" strokeWidth="1.2" strokeDasharray="4 2" />

                  {/* View 1: ExecutiveOverviewView */}
                  <g id="view-overview">
                    <rect x="85" y="245" width="135" height="52" rx="5" fill="url(#puml-comp-bg)" stroke="#38BDF8" strokeWidth="1.2" />
                    <text x="95" y="263" fill="#94A3B8" fontFamily="monospace" fontSize="9">«view»</text>
                    <text x="95" y="280" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="11" fontWeight="bold">ExecutiveOverview</text>
                  </g>

                  {/* View 2: PrioritizationView */}
                  <g id="view-prioritizer">
                    <rect x="235" y="245" width="155" height="52" rx="5" fill="url(#puml-comp-bg)" stroke="#06B6D4" strokeWidth="1.5" />
                    <text x="245" y="263" fill="#06B6D4" fontFamily="monospace" fontSize="9">«core view»</text>
                    <text x="245" y="278" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="11" fontWeight="bold">PrioritizationView</text>
                    <text x="245" y="290" fill="#94A3B8" fontFamily="Helvetica, sans-serif" fontSize="9">(Cut-Off Line)</text>
                  </g>

                  {/* View 3: VelocityDashboardView */}
                  <g id="view-velocity">
                    <rect x="405" y="245" width="145" height="52" rx="5" fill="url(#puml-comp-bg)" stroke="#10B981" strokeWidth="1.2" />
                    <text x="415" y="263" fill="#10B981" fontFamily="monospace" fontSize="9">«view»</text>
                    <text x="415" y="278" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="11" fontWeight="bold">VelocityDashboard</text>
                    <text x="415" y="290" fill="#94A3B8" fontFamily="Helvetica, sans-serif" fontSize="9">(SVG Burn-Up)</text>
                  </g>

                  {/* View 4: TeamAllocationView */}
                  <g id="view-teams">
                    <rect x="565" y="245" width="135" height="52" rx="5" fill="url(#puml-comp-bg)" stroke="#A855F7" strokeWidth="1.2" />
                    <text x="575" y="263" fill="#A855F7" fontFamily="monospace" fontSize="9">«view»</text>
                    <text x="575" y="278" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="11" fontWeight="bold">TeamAllocation</text>
                    <text x="575" y="290" fill="#94A3B8" fontFamily="Helvetica, sans-serif" fontSize="9">(Skills Matrix)</text>
                  </g>

                  {/* View 5: StakeholderReportView */}
                  <g id="view-report">
                    <rect x="715" y="245" width="125" height="52" rx="5" fill="url(#puml-comp-bg)" stroke="#F59E0B" strokeWidth="1.2" />
                    <text x="725" y="263" fill="#F59E0B" fontFamily="monospace" fontSize="9">«view»</text>
                    <text x="725" y="278" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="11" fontWeight="bold">StakeholderReport</text>
                    <text x="725" y="290" fill="#94A3B8" fontFamily="Helvetica, sans-serif" fontSize="9">(PDF / Export)</text>
                  </g>

                  {/* Navigation labels row */}
                  <text x="85" y="325" fill="#64748B" fontFamily="Helvetica, sans-serif" fontSize="10">
                    • HeaderNav routes between 5 dedicated view controllers with active capacity badges
                  </text>
                  <text x="85" y="342" fill="#64748B" fontFamily="Helvetica, sans-serif" fontSize="10">
                    • Dynamic state synced to LocalStorage instantly on every slider and epic modification
                  </text>

                  {/* SUBPACKAGE: Modals & Overlays */}
                  <path d="M 65 380 L 235 380 L 247 395 L 65 395 Z" fill="#253348" />
                  <text x="75" y="391" fill="#38BDF8" fontFamily="Helvetica, sans-serif" fontSize="10" fontWeight="bold">
                    package "Modals &amp; Overlays"
                  </text>
                  <rect x="65" y="395" width="790" height="85" rx="6" fill="#131D2D" stroke="#253348" strokeWidth="1.2" strokeDasharray="4 2" />

                  {/* Modal 1: EpicModal */}
                  <g id="modal-epic">
                    <rect x="85" y="415" width="230" height="50" rx="5" fill="url(#puml-comp-bg)" stroke="#06B6D4" strokeWidth="1.2" />
                    <text x="95" y="433" fill="#38BDF8" fontFamily="monospace" fontSize="9">«modal»</text>
                    <text x="95" y="449" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="12" fontWeight="bold">[EpicModal (WSJF &amp; Skills)]</text>
                  </g>

                  {/* Modal 2: WhatIfSimulatorModal */}
                  <g id="modal-whatif">
                    <rect x="340" y="415" width="250" height="50" rx="5" fill="url(#puml-comp-bg)" stroke="#38BDF8" strokeWidth="1.2" />
                    <text x="350" y="433" fill="#38BDF8" fontFamily="monospace" fontSize="9">«sandbox modal»</text>
                    <text x="350" y="449" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="12" fontWeight="bold">[WhatIfSimulatorModal]</text>
                  </g>

                  {/* Modal 3: ArchitectureModal */}
                  <g id="modal-arch">
                    <rect x="615" y="415" width="225" height="50" rx="5" fill="url(#puml-comp-bg)" stroke="#A855F7" strokeWidth="1.5" />
                    <text x="625" y="433" fill="#A855F7" fontFamily="monospace" fontSize="9">«modal» (You are here)</text>
                    <text x="625" y="449" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="12" fontWeight="bold">[ArchitectureModal]</text>
                  </g>

                  {/* ========================================================
                      ARROW CONNECTIONS: UI -> DOMAIN ENGINE
                     ======================================================== */}
                  <path d="M 312 300 L 312 555" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#puml-arrow)" fill="none" />
                  <rect x="220" y="508" width="185" height="20" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" />
                  <text x="226" y="522" fill="#38BDF8" fontFamily="monospace" fontSize="9 font-semibold">request prioritization</text>

                  <path d="M 632 300 L 632 555" stroke="#A855F7" strokeWidth="2" strokeDasharray="5 3" markerEnd="url(#puml-arrow)" fill="none" />
                  <rect x="555" y="508" width="155" height="20" rx="4" fill="#0F172A" stroke="#A855F7" strokeWidth="1" />
                  <text x="561" y="522" fill="#A855F7" fontFamily="monospace" fontSize="9">team skill profiles</text>

                  {/* ========================================================
                      PACKAGE 2: BUSINESS LOGIC & DOMAIN ENGINE
                     ======================================================== */}
                  <path d="M 40 560 L 440 560 L 455 580 L 40 580 Z" fill="#334155" />
                  <text x="52" y="574" fill="#38BDF8" fontFamily="Helvetica, sans-serif" fontSize="12" fontWeight="bold">
                    package "Business Logic &amp; Domain Engine (calculations.ts)"
                  </text>
                  <rect x="40" y="580" width="840" height="340" rx="8" fill="url(#puml-pkg-bg)" stroke="#334155" strokeWidth="1.5" />

                  {/* Component 1: Capacity Derivation Engine */}
                  <g id="engine-capacity">
                    <rect x="65" y="605" width="370" height="85" rx="6" fill="url(#puml-comp-bg)" stroke="#38BDF8" strokeWidth="1.5" />
                    <rect x="427" y="617" width="12" height="6" rx="1" fill="#38BDF8" />
                    <rect x="427" y="629" width="12" height="6" rx="1" fill="#38BDF8" />
                    <text x="80" y="626" fill="#38BDF8" fontFamily="monospace" fontSize="10">«component» [CapEngine]</text>
                    <text x="80" y="646" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="13" fontWeight="bold">Capacity Derivation Engine</text>
                    <text x="80" y="664" fill="#94A3B8" fontFamily="monospace" fontSize="10">• FTE * FocusFactor * IterationDays * (1 - PTO)</text>
                    <text x="80" y="678" fill="#94A3B8" fontFamily="monospace" fontSize="10">• NetCapacity = GrossCapacity * (1 - Buffer%)</text>
                  </g>

                  {/* Component 2: Multi-Model Prioritization */}
                  <g id="engine-prioritize">
                    <rect x="480" y="605" width="375" height="85" rx="6" fill="url(#puml-comp-bg)" stroke="#06B6D4" strokeWidth="1.5" />
                    <rect x="847" y="617" width="12" height="6" rx="1" fill="#06B6D4" />
                    <rect x="847" y="629" width="12" height="6" rx="1" fill="#06B6D4" />
                    <text x="495" y="626" fill="#06B6D4" fontFamily="monospace" fontSize="10">«component» [PrioEngine]</text>
                    <text x="495" y="646" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="13" fontWeight="bold">Multi-Model Prioritization</text>
                    <text x="495" y="664" fill="#94A3B8" fontFamily="monospace" fontSize="10">• WSJF = (UserVal + TimeCrit + RiskRed) / Effort</text>
                    <text x="495" y="678" fill="#94A3B8" fontFamily="monospace" fontSize="10">• Stakeholder P0-P3, Value Density, PO Manual Pin</text>
                  </g>

                  {/* Component 3: Scope Boundary Classifier (Cutoff Engine) */}
                  <g id="engine-cutoff">
                    <rect x="65" y="715" width="450" height="90" rx="6" fill="url(#puml-comp-bg)" stroke="#10B981" strokeWidth="2" />
                    <rect x="507" y="727" width="12" height="6" rx="1" fill="#10B981" />
                    <rect x="507" y="739" width="12" height="6" rx="1" fill="#10B981" />
                    <text x="80" y="736" fill="#10B981" fontFamily="monospace" fontSize="10">«core boundary classifier» [CutoffEngine]</text>
                    <text x="80" y="756" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="14" fontWeight="bold">Scope Boundary Classifier</text>
                    <text x="80" y="774" fill="#6EE7B7" fontFamily="Helvetica, sans-serif" fontSize="11">• Committed: Cumulative Effort &lt;= Net Capacity</text>
                    <text x="80" y="789" fill="#FDE68A" fontFamily="Helvetica, sans-serif" fontSize="11">• Stretch Target: Net &lt; Cumulative &lt;= Gross Capacity</text>
                    <text x="80" y="802" fill="#94A3B8" fontFamily="Helvetica, sans-serif" fontSize="10">• Deferred: Cumulative &gt; Gross Capacity</text>
                  </g>

                  {/* PlantUML Note box attached to CutoffEngine */}
                  <g id="puml-note">
                    <polygon points="545,720 740,720 755,735 755,800 545,800" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
                    <polygon points="740,720 740,735 755,735" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
                    <text x="555" y="740" fill="#854D0E" fontFamily="monospace" fontSize="9 font-bold">note right of CutoffEngine</text>
                    <text x="555" y="757" fill="#713F12" fontFamily="Helvetica, sans-serif" fontSize="10">Automates PO decision cut-off:</text>
                    <text x="555" y="773" fill="#713F12" fontFamily="Helvetica, sans-serif" fontSize="10">Renders high-contrast boundary</text>
                    <text x="555" y="789" fill="#713F12" fontFamily="Helvetica, sans-serif" fontSize="10">line across sprint scope.</text>
                  </g>

                  {/* Component 4 & 5: Skills Engine & Velocity Engine */}
                  <g id="engine-skills">
                    <rect x="65" y="825" width="370" height="75" rx="6" fill="url(#puml-comp-bg)" stroke="#A855F7" strokeWidth="1.5" />
                    <text x="80" y="845" fill="#A855F7" fontFamily="monospace" fontSize="10">«component» [SkillsEngine]</text>
                    <text x="80" y="865" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="12" fontWeight="bold">Skill Matching &amp; Bottleneck Matrix</text>
                    <text x="80" y="882" fill="#94A3B8" fontFamily="monospace" fontSize="10">• Compares Epic.requiredSkills vs Team.skills</text>
                  </g>

                  <g id="engine-velocity">
                    <rect x="480" y="825" width="375" height="75" rx="6" fill="url(#puml-comp-bg)" stroke="#F59E0B" strokeWidth="1.5" />
                    <text x="495" y="845" fill="#F59E0B" fontFamily="monospace" fontSize="10">«component» [VelocityEngine]</text>
                    <text x="495" y="865" fill="#F8FAFC" fontFamily="Helvetica, sans-serif" fontSize="12" fontWeight="bold">Velocity Burn-Up &amp; Forecasting</text>
                    <text x="495" y="882" fill="#94A3B8" fontFamily="monospace" fontSize="10">• Computes Say/Do ratio and actuals runway</text>
                  </g>

                  {/* Internal connections in Engine */}
                  <path d="M 250 690 L 250 715" stroke="#38BDF8" strokeWidth="1.8" markerEnd="url(#puml-arrow)" fill="none" />
                  <path d="M 660 690 L 460 715" stroke="#38BDF8" strokeWidth="1.8" markerEnd="url(#puml-arrow)" fill="none" />

                  {/* Flow label */}
                  <rect x="255" y="692" width="180" height="18" rx="3" fill="#0F172A" stroke="#38BDF8" strokeWidth="0.8" />
                  <text x="260" y="705" fill="#38BDF8" fontFamily="monospace" fontSize="8.5">provides Net &amp; Gross Capacity</text>

                  {/* ========================================================
                      ARROW CONNECTIONS: ENGINE -> PERSISTENCE / EXPORTS
                     ======================================================== */}
                  <path d="M 230 920 L 230 965" stroke="#10B981" strokeWidth="2" markerEnd="url(#puml-arrow-green)" fill="none" />
                  <path d="M 690 920 L 690 965" stroke="#38BDF8" strokeWidth="2" markerEnd="url(#puml-arrow)" fill="none" />

                  {/* ========================================================
                      PACKAGE 3: PERSISTENCE & INTEROPERABILITY
                     ======================================================== */}
                  <path d="M 40 970 L 320 970 L 335 990 L 40 990 Z" fill="#334155" />
                  <text x="52" y="984" fill="#38BDF8" fontFamily="Helvetica, sans-serif" fontSize="12" fontWeight="bold">
                    package "Persistence &amp; Interoperability"
                  </text>
                  <rect x="40" y="990" width="840" height="240" rx="8" fill="url(#puml-pkg-bg)" stroke="#334155" strokeWidth="1.5" />

                  {/* Database Cylinder: LocalStorage */}
                  <g id="db-localstorage">
                    {/* Cylinder body */}
                    <path d="M 75 1050 L 75 1170 A 155 22 0 0 0 385 1170 L 385 1050 Z" fill="url(#puml-comp-bg)" stroke="#10B981" strokeWidth="1.5" />
                    {/* Cylinder top ellipse */}
                    <ellipse cx="230" cy="1050" rx="155" ry="22" fill="#132B25" stroke="#10B981" strokeWidth="1.5" />
                    <text x="170" y="1055" fill="#10B981" fontFamily="Helvetica, sans-serif" fontSize="13" fontWeight="bold">database "LocalStorage"</text>
                    
                    {/* DB Items */}
                    <rect x="95" y="1080" width="270" height="24" rx="4" fill="#0B1C16" stroke="#10B981" strokeWidth="0.8" />
                    <text x="105" y="1096" fill="#A7F3D0" fontFamily="monospace" fontSize="11">[apex_pi_data_v3]</text>
                    <text x="245" y="1096" fill="#6EE7B7" fontFamily="sans-serif" fontSize="10">(PI Config &amp; Teams)</text>

                    <rect x="95" y="1110" width="270" height="24" rx="4" fill="#0B1C16" stroke="#10B981" strokeWidth="0.8" />
                    <text x="105" y="1126" fill="#A7F3D0" fontFamily="monospace" fontSize="11">[apex_epics_data_v3]</text>
                    <text x="245" y="1126" fill="#6EE7B7" fontFamily="sans-serif" fontSize="10">(14 Candidate Epics)</text>

                    <rect x="95" y="1140" width="270" height="24" rx="4" fill="#0B1C16" stroke="#10B981" strokeWidth="0.8" />
                    <text x="105" y="1156" fill="#A7F3D0" fontFamily="monospace" fontSize="11">[apex_sprints_data_v3]</text>
                    <text x="245" y="1156" fill="#6EE7B7" fontFamily="sans-serif" fontSize="10">(Iteration Actuals)</text>
                  </g>

                  {/* Subpackage: Export Channels */}
                  <path d="M 450 1025 L 610 1025 L 622 1040 L 450 1040 Z" fill="#253348" />
                  <text x="460" y="1036" fill="#38BDF8" fontFamily="Helvetica, sans-serif" fontSize="10" fontWeight="bold">
                    package "Export Channels"
                  </text>
                  <rect x="450" y="1040" width="405" height="165" rx="6" fill="#131D2D" stroke="#253348" strokeWidth="1.2" />

                  {/* Channel 1: Native Print / PDF */}
                  <rect x="475" y="1055" width="355" height="32" rx="4" fill="url(#puml-comp-bg)" stroke="#38BDF8" strokeWidth="1" />
                  <text x="490" y="1075" fill="#F8FAFC" fontFamily="monospace" fontSize="11 font-bold">[Native Print / PDF Engine]</text>
                  <text x="715" y="1075" fill="#94A3B8" fontFamily="monospace" fontSize="10">@media print</text>

                  {/* Channel 2: Jira / ADO CSV */}
                  <rect x="475" y="1092" width="355" height="32" rx="4" fill="url(#puml-comp-bg)" stroke="#38BDF8" strokeWidth="1" />
                  <text x="490" y="1112" fill="#F8FAFC" fontFamily="monospace" fontSize="11 font-bold">[Jira / ADO CSV Generator]</text>
                  <text x="735" y="1112" fill="#94A3B8" fontFamily="monospace" fontSize="10">.csv RFC4180</text>

                  {/* Channel 3: Markdown Briefing */}
                  <rect x="475" y="1129" width="355" height="32" rx="4" fill="url(#puml-comp-bg)" stroke="#38BDF8" strokeWidth="1" />
                  <text x="490" y="1149" fill="#F8FAFC" fontFamily="monospace" fontSize="11 font-bold">[Markdown Executive Brief]</text>
                  <text x="740" y="1149" fill="#94A3B8" fontFamily="monospace" fontSize="10">.md Wiki</text>

                  {/* Channel 4: Clipboard Serializer */}
                  <rect x="475" y="1166" width="355" height="32" rx="4" fill="url(#puml-comp-bg)" stroke="#38BDF8" strokeWidth="1" />
                  <text x="490" y="1186" fill="#F8FAFC" fontFamily="monospace" fontSize="11 font-bold">[Clipboard Serializer]</text>
                  <text x="720" y="1186" fill="#94A3B8" fontFamily="monospace" fontSize="10">Slack / Email</text>

                  {/* Diagram Footer */}
                  <text x="40" y="1255" fill="#475569" fontFamily="monospace" fontSize="10">
                    Generated for AI Studio PI Planner • Standard PlantUML Syntax • High-Resolution Vector SVG
                  </text>
                </svg>
              </div>
            </div>

            {/* Bottom Diagram Action Bar */}
            <div className="px-4 py-2.5 bg-slate-900/70 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Rendered Vector Diagram: 3 C4 Packages, 16 Components, 1 Data Store, 4 Export Channels</span>
              </span>
              <button
                onClick={handleDownloadSvg}
                className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] underline flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Download SVG Image</span>
              </button>
            </div>
          </div>
        )}

        {/* PlantUML Raw Code Tab / Adjacent Panel */}
        {viewMode !== 'diagram' && (
          <div className={`${
            viewMode === 'split' ? 'lg:col-span-5 xl:col-span-4' : 'w-full'
          } bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col`}>
            {/* Code Header */}
            <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-mono text-xs text-purple-300 font-semibold">
                  PlantUML Source Specification
                </span>
              </div>
              <button
                onClick={handleCopyCode}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Syntax Info */}
            <div className="px-3.5 py-2 bg-purple-950/20 border-b border-purple-900/30 text-[11px] text-purple-300 flex items-center justify-between">
              <span>Standard PlantUML syntax (.puml / .pu)</span>
              <span className="font-mono text-[10px] text-purple-400">@startuml ... @enduml</span>
            </div>

            {/* Code Area */}
            <div className="p-3 overflow-auto flex-1 font-mono text-[11px] leading-relaxed text-purple-200/90 bg-slate-950">
              <pre className="selection:bg-purple-500/30 whitespace-pre">
                {PLANTUML_DIAGRAM_CODE}
              </pre>
            </div>

            {/* Code Footer */}
            <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col gap-1">
              <div className="font-semibold text-slate-300">How to use this code:</div>
              <div>• Paste into <strong className="text-purple-300">PlantText</strong> or Confluence PlantUML macro.</div>
              <div>• Run with <code className="text-cyan-300 bg-slate-950 px-1 rounded">plantuml diagram.puml</code> to export PNG/PDF.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
