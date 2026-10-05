import React, { useState } from 'react';
import { 
  ProgramIncrement, 
  CapacityAnalysis, 
  PrioritizedEpic, 
  SprintProgressRecord 
} from '../types';
import { 
  getPriorityLabel, 
  generateSprintBurnUp 
} from '../utils/calculations';
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Layers, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface StakeholderReportViewProps {
  pi: ProgramIncrement;
  capacityAnalysis: CapacityAnalysis;
  prioritizedEpics: PrioritizedEpic[];
  completedSprintsData: { [sprintNum: number]: number };
}

export const StakeholderReportView: React.FC<StakeholderReportViewProps> = ({
  pi,
  capacityAnalysis,
  prioritizedEpics,
  completedSprintsData
}) => {
  const [copied, setCopied] = useState(false);

  const sprintRecords = generateSprintBurnUp(
    pi, 
    capacityAnalysis.totalCommittedPoints, 
    completedSprintsData
  );

  const committedEpics = prioritizedEpics.filter(e => e.executionCategory === 'committed');
  const stretchEpics = prioritizedEpics.filter(e => e.executionCategory === 'stretch');
  const deferredEpics = prioritizedEpics.filter(e => e.executionCategory === 'out_of_scope');

  const totalEngineers = pi.teams.reduce((s, t) => s + t.members, 0);

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  // Download CSV
  const handleDownloadCsv = () => {
    const headers = [
      'Epic ID',
      'Title',
      'Strategic Theme',
      'Stakeholder',
      'Priority',
      'Assigned Team',
      'Required Skills',
      'Effort (pts)',
      'WSJF Score',
      'Cost of Delay',
      'Execution Scope',
      'Status',
      'Target Sprint',
      'Business Outcome'
    ];

    const rows = prioritizedEpics.map(e => {
      const team = pi.teams.find(t => t.id === e.primaryTeamId)?.name || 'Unassigned';
      const pLabel = getPriorityLabel(e.stakeholderPriority).label;
      const skillsStr = (e.requiredSkills || []).join('; ');
      return [
        `"${e.id}"`,
        `"${e.title.replace(/"/g, '""')}"`,
        `"${e.strategicTheme}"`,
        `"${e.stakeholder}"`,
        `"${pLabel}"`,
        `"${team}"`,
        `"${skillsStr}"`,
        e.effort,
        e.wsjfScore,
        e.costOfDelay,
        `"${e.executionCategory.toUpperCase()}"`,
        `"${e.status}"`,
        `"Sprint ${e.targetIteration}"`,
        `"${(e.businessOutcome || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${pi.name.replace(/[^a-zA-Z0-9]/g, '_')}_Executive_Plan.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Markdown
  const handleDownloadMarkdown = () => {
    const md = `# Executive Progress & Scope Commitment Report: ${pi.name}
Generated: ${new Date().toLocaleDateString()} | Target Period: ${pi.targetPeriod}

## Executive Summary
- **Committed Scope**: ${committedEpics.length} of ${prioritizedEpics.length} candidate Epics (${capacityAnalysis.totalCommittedPoints} of ${capacityAnalysis.artNetCapacity} net points, ${capacityAnalysis.artUtilizationPercent}% ART capacity load).
- **Contingency / Stretch**: ${stretchEpics.length} Epics (${capacityAnalysis.totalStretchPoints} pts).
- **Deferred Scope**: ${deferredEpics.length} Epics (${capacityAnalysis.totalDeferredPoints} pts) scheduled for subsequent PI review.
- **Resource Footprint**: ${pi.teams.length} teams (${totalEngineers} FTE engineers) across ${pi.totalWeeks} calendar weeks.

## Strategic Objective
> ${pi.strategicObjective}

## Committed Epics (In-Scope for Delivery)
| Epic ID | Title | Team | Effort | WSJF | Priority | Target Sprint | Business Outcome |
|---|---|---|---|---|---|---|---|
${committedEpics.map(e => {
  const team = pi.teams.find(t => t.id === e.primaryTeamId)?.name || 'Unassigned';
  return `| ${e.id} | ${e.title} | ${team} | ${e.effort}p | ${e.wsjfScore} | P${e.stakeholderPriority} | Sprint ${e.targetIteration} | ${e.businessOutcome} |`;
}).join('\n')}

## Stretch Target Epics (Contingency Pipeline)
${stretchEpics.map(e => `- **${e.id}**: ${e.title} (${e.effort}p) — Triggered if sprint velocity exceeds baseline by +${pi.bufferReservePercent}%.`).join('\n')}

## Deferred Scope (Capacity Cut-Off)
${deferredEpics.map(e => `- **${e.id}**: ${e.title} (${e.effort}p) — Prioritized below cutoff; queued for next PI cycle.`).join('\n')}

## Team Resource Allocation & Skills Competency
${capacityAnalysis.teamCapacities.map(t => {
  const teamDef = pi.teams.find(tm => tm.id === t.teamId);
  const skillsList = (teamDef?.skills || []).map(s => `${s.name} (${s.proficiency}, ${s.headcountWithSkill} devs)`).join(', ');
  return `- **${t.teamName}**: ${t.committedPoints} / ${t.availableCapacity} pts (${t.utilizationPercent}% utilization)${t.isOverloaded ? ' [OVERLOAD WARNING]' : ''}
  - Verified Skills: ${skillsList || 'None registered'}`;
}).join('\n')}

## Skill Demand & Bottleneck Register
${capacityAnalysis.skillDemandAnalysis.filter(s => s.demandedPoints > 0).map(s => `- **${s.skillName}**: ${s.demandedPoints} pts across ${s.demandedEpicCount} epics · ${s.totalCapableEngineers} capable engineers${s.isBottleneck ? ' [SKILL BOTTLENECK]' : ''}`).join('\n')}
`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${pi.name.replace(/[^a-zA-Z0-9]/g, '_')}_Executive_Briefing.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Executive Summary to clipboard
  const handleCopySummary = () => {
    const summaryText = `[EXECUTIVE PI COMMITMENT: ${pi.name}]
Scope: ${committedEpics.length} of ${prioritizedEpics.length} Epics Committed (${capacityAnalysis.totalCommittedPoints}/${capacityAnalysis.artNetCapacity} pts · ${capacityAnalysis.artUtilizationPercent}% ART Load).
Delivery Teams: ${pi.teams.length} teams (${totalEngineers} FTEs).
Period: ${pi.targetPeriod} (${pi.totalWeeks} weeks).
Stretch: ${stretchEpics.length} Epics (${capacityAnalysis.totalStretchPoints}p).
Deferred: ${deferredEpics.length} Epics (${capacityAnalysis.totalDeferredPoints}p).
Strategic Goal: ${pi.strategicObjective}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Executive Progress Report for Stakeholder Review</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Comprehensive stakeholder briefing document with commitment statement, WSJF rationale, and team capacities.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Copy high-level summary for Slack/Email"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Download CSV for Jira or Azure DevOps"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Download Markdown documentation"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Download Markdown</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Executive Document Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 shadow-lg text-slate-200 print:bg-white print:text-slate-900 print:border-none print:p-0 print:shadow-none">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 print:border-slate-900 print:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 print:text-slate-600">
            <span className="font-mono uppercase tracking-widest text-cyan-400 print:text-blue-700 font-bold">
              Agile Release Train // Executive Progress & Commitment Report
            </span>
            <span>Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white print:text-slate-950 mt-2 tracking-tight">
            {pi.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 print:text-slate-600 mt-2">
            <span>Execution Window: <strong className="text-slate-200 print:text-slate-900">{pi.targetPeriod}</strong></span>
            <span>·</span>
            <span>Duration: <strong className="text-slate-200 print:text-slate-900">{pi.totalWeeks} Weeks ({sprintRecords.length} Iterations)</strong></span>
            <span>·</span>
            <span>Resource Staffing: <strong className="text-slate-200 print:text-slate-900">{totalEngineers} Engineers across {pi.teams.length} Teams</strong></span>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400 print:text-slate-600 font-semibold mb-1">
              PI Strategic Mission & Objective
            </div>
            <p className="text-sm text-slate-200 print:text-slate-900 font-medium">
              "{pi.strategicObjective}"
            </p>
          </div>
        </div>

        {/* Section 1: Executive Commitment Statement */}
        <div className="py-6 border-b border-slate-800 print:border-slate-300 space-y-3">
          <h2 className="text-base font-bold text-white print:text-slate-950 tracking-tight flex items-center gap-2">
            <span className="font-mono text-cyan-400 print:text-blue-700">01.</span>
            <span>Capacity Commitment & Execution Boundary</span>
          </h2>

          <p className="text-xs md:text-sm text-slate-300 print:text-slate-800 leading-relaxed">
            Based on empirical historical velocity, team focus factors ({pi.teams.map(t => `${t.name}: ${t.focusFactor}%`).join(', ')}), and planned PTO deductions, the Agile Release Train has an available net capacity of <strong className="font-mono text-cyan-300 print:text-blue-800">{capacityAnalysis.artNetCapacity} story points</strong> (reserving a {pi.bufferReservePercent}% contingency buffer for production stabilization).
          </p>

          {/* Key Executive Stat Callouts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950 print:bg-slate-50 p-3 rounded-lg border border-slate-800 print:border-slate-300">
              <div className="text-[11px] text-slate-400 print:text-slate-600 font-medium">Committed Epics</div>
              <div className="text-xl font-bold font-mono text-white print:text-slate-950 mt-1">
                {committedEpics.length} of {prioritizedEpics.length} Epics
              </div>
              <div className="text-[10px] text-emerald-400 print:text-emerald-700 font-semibold mt-0.5">
                {capacityAnalysis.totalCommittedPoints} pts committed
              </div>
            </div>

            <div className="bg-slate-950 print:bg-slate-50 p-3 rounded-lg border border-slate-800 print:border-slate-300">
              <div className="text-[11px] text-slate-400 print:text-slate-600 font-medium">ART Planned Load</div>
              <div className="text-xl font-bold font-mono text-cyan-300 print:text-blue-800 mt-1">
                {capacityAnalysis.artUtilizationPercent}%
              </div>
              <div className="text-[10px] text-slate-400 print:text-slate-600 mt-0.5">
                {capacityAnalysis.artNetCapacity - capacityAnalysis.totalCommittedPoints} pts safe buffer
              </div>
            </div>

            <div className="bg-slate-950 print:bg-slate-50 p-3 rounded-lg border border-slate-800 print:border-slate-300">
              <div className="text-[11px] text-slate-400 print:text-slate-600 font-medium">Stretch Contingency</div>
              <div className="text-xl font-bold font-mono text-amber-300 print:text-amber-800 mt-1">
                {stretchEpics.length} Epics
              </div>
              <div className="text-[10px] text-slate-400 print:text-slate-600 mt-0.5">
                {capacityAnalysis.totalStretchPoints} pts in queue
              </div>
            </div>

            <div className="bg-slate-950 print:bg-slate-50 p-3 rounded-lg border border-slate-800 print:border-slate-300">
              <div className="text-[11px] text-slate-400 print:text-slate-600 font-medium">Deferred Scope</div>
              <div className="text-xl font-bold font-mono text-slate-400 print:text-slate-700 mt-1">
                {deferredEpics.length} Epics
              </div>
              <div className="text-[10px] text-slate-400 print:text-slate-600 mt-0.5">
                {capacityAnalysis.totalDeferredPoints} pts beyond capacity
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: In-Scope Committed Epics Table */}
        <div className="py-6 border-b border-slate-800 print:border-slate-300 space-y-4 print-break-inside-avoid">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white print:text-slate-950 tracking-tight flex items-center gap-2">
              <span className="font-mono text-cyan-400 print:text-blue-700">02.</span>
              <span>Committed Epics for Delivery ({committedEpics.length} Items)</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400 print:text-emerald-700 font-semibold">
              Total Committed: {capacityAnalysis.totalCommittedPoints} pts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-600 font-mono">
                  <th className="py-2.5 pr-3 font-semibold">Epic ID</th>
                  <th className="py-2.5 px-3 font-semibold">Title & Strategic Theme</th>
                  <th className="py-2.5 px-3 font-semibold">Team</th>
                  <th className="py-2.5 px-2 font-semibold text-center">Priority</th>
                  <th className="py-2.5 px-2 font-semibold text-right">WSJF</th>
                  <th className="py-2.5 px-2 font-semibold text-right">Effort</th>
                  <th className="py-2.5 px-3 font-semibold">Target Sprint</th>
                  <th className="py-2.5 pl-3 font-semibold">Measurable Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
                {committedEpics.map(epic => {
                  const team = pi.teams.find(t => t.id === epic.primaryTeamId);
                  const pInfo = getPriorityLabel(epic.stakeholderPriority);
                  return (
                    <tr key={epic.id} className="hover:bg-slate-800/30 print:hover:bg-transparent">
                      <td className="py-3 pr-3 font-mono font-bold text-cyan-400 print:text-blue-700 whitespace-nowrap">
                        {epic.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white print:text-slate-900">{epic.title}</div>
                        <div className="text-[11px] text-slate-400 print:text-slate-600">{epic.strategicTheme} · {epic.stakeholder}</div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-medium text-slate-200 print:text-slate-800">{team?.name}</span>
                      </td>
                      <td className="py-3 px-2 text-center whitespace-nowrap">
                        <span className={`font-semibold ${pInfo.textClass} print:text-slate-900`}>{pInfo.label.split(' ')[0]}</span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-bold text-cyan-300 print:text-slate-900 tabular-nums">
                        {epic.wsjfScore}
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-bold text-white print:text-slate-900 tabular-nums">
                        {epic.effort}p
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300 print:text-slate-700 whitespace-nowrap">
                        Sprint {epic.targetIteration}
                      </td>
                      <td className="py-3 pl-3 text-[11px] text-slate-300 print:text-slate-700 max-w-xs">
                        {epic.businessOutcome || 'Core architectural deliverable'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Stretch Targets & Contingency Rules */}
        {stretchEpics.length > 0 && (
          <div className="py-6 border-b border-slate-800 print:border-slate-300 space-y-3 print-break-inside-avoid">
            <h2 className="text-base font-bold text-amber-300 print:text-amber-800 tracking-tight flex items-center gap-2">
              <span className="font-mono">03.</span>
              <span>Stretch Target Epics ({stretchEpics.length} Items · {capacityAnalysis.totalStretchPoints} pts)</span>
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600">
              The following epics represent contingency scope. They are fully refined and queued to be pulled into development if early iterations achieve &gt;95% planned velocity without defects:
            </p>
            <div className="space-y-2">
              {stretchEpics.map(epic => (
                <div key={epic.id} className="p-3 bg-slate-950/60 print:bg-slate-50 border border-slate-800 print:border-slate-300 rounded-lg text-xs flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-amber-400 print:text-amber-800 mr-2">{epic.id}</span>
                    <strong className="text-white print:text-slate-900">{epic.title}</strong>
                    <span className="text-slate-400 print:text-slate-600 ml-2">({epic.strategicTheme})</span>
                  </div>
                  <div className="font-mono text-slate-300 print:text-slate-800 shrink-0">
                    WSJF: {epic.wsjfScore} · {epic.effort} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Deferred Backlog & Scope Trade-off Rationale */}
        {deferredEpics.length > 0 && (
          <div className="py-6 border-b border-slate-800 print:border-slate-300 space-y-3 print-break-inside-avoid">
            <h2 className="text-base font-bold text-slate-300 print:text-slate-900 tracking-tight flex items-center gap-2">
              <span className="font-mono text-slate-400">04.</span>
              <span>Deferred Scope & Cut-Off Rationale ({deferredEpics.length} Items · {capacityAnalysis.totalDeferredPoints} pts)</span>
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600">
              These candidate items were evaluated through WSJF and stakeholder priority but fall outside available ART engineering bandwidth. They are deferred to the subsequent PI cycle to preserve delivery predictability and prevent developer burnout:
            </p>
            <div className="space-y-2">
              {deferredEpics.map(epic => (
                <div key={epic.id} className="p-3 bg-slate-950/40 print:bg-slate-50 border border-slate-800/80 print:border-slate-200 rounded-lg text-xs flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-400 print:text-slate-600 mr-2">{epic.id}</span>
                    <span className="text-slate-300 print:text-slate-800">{epic.title}</span>
                    <span className="text-slate-400 print:text-slate-600 ml-2">[{epic.stakeholder}]</span>
                  </div>
                  <div className="font-mono text-slate-400 print:text-slate-600 shrink-0 text-right">
                    WSJF: {epic.wsjfScore} · {epic.effort} pts
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Team Capacity Matrix */}
        <div className="py-6 space-y-4 print-break-inside-avoid">
          <h2 className="text-base font-bold text-white print:text-slate-950 tracking-tight flex items-center gap-2">
            <span className="font-mono text-cyan-400 print:text-blue-700">05.</span>
            <span>Team Resource Capacity & Utilization Ledger</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {capacityAnalysis.teamCapacities.map(team => {
              const teamDef = pi.teams.find(t => t.id === team.teamId);
              return (
                <div key={team.teamId} className="bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-300 rounded-lg p-3 text-xs">
                  <div className="font-bold text-white print:text-slate-950 flex items-center justify-between">
                    <span>{team.teamName}</span>
                    <span className="font-mono text-[11px] text-cyan-400 print:text-blue-700">{team.utilizationPercent}%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5">
                    {teamDef?.members} Engineers · {teamDef?.focusFactor}% Focus
                  </div>
                  <div className="font-mono text-slate-300 print:text-slate-800 mt-2">
                    Committed: <strong className="text-white print:text-slate-950">{team.committedPoints}</strong> / {team.availableCapacity} pts
                  </div>
                  <div className={`text-[10px] font-semibold mt-1 ${
                    team.isOverloaded 
                      ? 'text-rose-400 print:text-rose-700' 
                      : 'text-emerald-400 print:text-emerald-700'
                  }`}>
                    {team.isOverloaded ? 'Overcapacity Warning' : 'Safe Operating Margin'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 6: Technical Skills Architecture & Bottlenecks */}
        <div className="py-6 border-t border-slate-800 print:border-slate-300 space-y-4 print-break-inside-avoid">
          <h2 className="text-base font-bold text-white print:text-slate-950 tracking-tight flex items-center gap-2">
            <span className="font-mono text-cyan-400 print:text-blue-700">06.</span>
            <span>Team Technical Skills & Competency Allocation</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pi.teams.map(team => (
              <div key={team.id} className="bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-300 p-3.5 rounded-lg text-xs">
                <div className="font-bold text-white print:text-slate-950 flex items-center justify-between pb-2 border-b border-slate-800 print:border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: team.color }} />
                    <span>{team.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 print:text-slate-600">
                    {(team.skills || []).length} Verified Skills
                  </span>
                </div>

                <div className="mt-2.5 space-y-1.5">
                  {(team.skills || []).map(skill => (
                    <div key={skill.name} className="flex items-center justify-between text-[11px] text-slate-300 print:text-slate-800">
                      <span>{skill.name}</span>
                      <span className="font-mono text-slate-400 print:text-slate-600">
                        {skill.proficiency} ({skill.headcountWithSkill}/{team.members} devs)
                      </span>
                    </div>
                  ))}
                  {(team.skills || []).length === 0 && (
                    <div className="text-[11px] text-slate-500 italic">No skills registered</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-Off Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 print:border-slate-400 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400 print:text-slate-700">
          <div>
            <div className="font-semibold text-slate-200 print:text-slate-900 mb-4">Product Management Sign-Off</div>
            <div className="border-b border-slate-700 print:border-slate-400 pb-1 mb-1 font-mono text-slate-300 print:text-slate-800">
              Lead Product Owner
            </div>
            <div>Signature & Date</div>
          </div>
          <div>
            <div className="font-semibold text-slate-200 print:text-slate-900 mb-4">Engineering Architecture Sign-Off</div>
            <div className="border-b border-slate-700 print:border-slate-400 pb-1 mb-1 font-mono text-slate-300 print:text-slate-800">
              Release Train Engineer (RTE)
            </div>
            <div>Signature & Date</div>
          </div>
          <div>
            <div className="font-semibold text-slate-200 print:text-slate-900 mb-4">Executive Sponsor Review</div>
            <div className="border-b border-slate-700 print:border-slate-400 pb-1 mb-1 font-mono text-slate-300 print:text-slate-800">
              VP Engineering / CPO
            </div>
            <div>Signature & Date</div>
          </div>
        </div>
      </div>
    </div>
  );
};
