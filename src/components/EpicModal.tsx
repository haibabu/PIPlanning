import React, { useState, useEffect } from 'react';
import { 
  Epic, 
  StrategicTheme, 
  StakeholderPriority, 
  ConfidenceLevel, 
  EpicStatus, 
  ProgramIncrement 
} from '../types';
import { X, Sparkles, Calculator, Check } from 'lucide-react';

interface EpicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (epic: Epic) => void;
  editingEpic: Epic | null;
  pi: ProgramIncrement;
}

export const EpicModal: React.FC<EpicModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingEpic,
  pi
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [strategicTheme, setStrategicTheme] = useState<StrategicTheme>('Platform & Scale');
  const [stakeholder, setStakeholder] = useState('');
  const [stakeholderPriority, setStakeholderPriority] = useState<StakeholderPriority>(2);
  const [effort, setEffort] = useState<number>(34);
  const [primaryTeamId, setPrimaryTeamId] = useState<string>(pi.teams[0]?.id || '');
  const [targetIteration, setTargetIteration] = useState<number>(1);
  const [status, setStatus] = useState<EpicStatus>('not_started');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [businessOutcome, setBusinessOutcome] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState<ConfidenceLevel>('high');

  // WSJF Parameters
  const [userBusinessValue, setUserBusinessValue] = useState<number>(13);
  const [timeCriticality, setTimeCriticality] = useState<number>(8);
  const [riskReduction, setRiskReduction] = useState<number>(8);

  useEffect(() => {
    if (editingEpic) {
      setTitle(editingEpic.title);
      setDescription(editingEpic.description);
      setStrategicTheme(editingEpic.strategicTheme);
      setStakeholder(editingEpic.stakeholder);
      setStakeholderPriority(editingEpic.stakeholderPriority);
      setEffort(editingEpic.effort);
      setPrimaryTeamId(editingEpic.primaryTeamId);
      setTargetIteration(editingEpic.targetIteration);
      setStatus(editingEpic.status);
      setProgressPercent(editingEpic.progressPercent);
      setBusinessOutcome(editingEpic.businessOutcome || '');
      setConfidenceLevel(editingEpic.confidenceLevel);
      setUserBusinessValue(editingEpic.wsjf.userBusinessValue);
      setTimeCriticality(editingEpic.wsjf.timeCriticality);
      setRiskReduction(editingEpic.wsjf.riskReduction);
    } else {
      // New epic defaults
      setTitle('');
      setDescription('');
      setStrategicTheme('Platform & Scale');
      setStakeholder('Product Management');
      setStakeholderPriority(2);
      setEffort(34);
      setPrimaryTeamId(pi.teams[0]?.id || '');
      setTargetIteration(1);
      setStatus('not_started');
      setProgressPercent(0);
      setBusinessOutcome('');
      setConfidenceLevel('high');
      setUserBusinessValue(13);
      setTimeCriticality(8);
      setRiskReduction(8);
    }
  }, [editingEpic, pi]);

  // Computed WSJF
  const costOfDelay = userBusinessValue + timeCriticality + riskReduction;
  const computedWSJF = Number((costOfDelay / Math.max(1, effort)).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const epicData: Epic = {
      id: editingEpic ? editingEpic.id : `EPIC-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      description: description.trim(),
      strategicTheme,
      stakeholder: stakeholder.trim() || 'Product Operations',
      stakeholderPriority,
      effort: Math.max(1, effort),
      primaryTeamId,
      targetIteration,
      status,
      progressPercent,
      businessOutcome: businessOutcome.trim(),
      confidenceLevel,
      dependencies: editingEpic ? editingEpic.dependencies : [],
      wsjf: {
        userBusinessValue,
        timeCriticality,
        riskReduction,
        jobSize: Math.max(1, effort)
      },
      forceCommit: editingEpic ? editingEpic.forceCommit : false
    };

    onSave(epicData);
    onClose();
  };

  const totalSprints = Math.max(1, Math.round(pi.totalWeeks / pi.iterationLengthWeeks));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              {editingEpic ? `Edit Epic ${editingEpic.id}` : 'Create New Epic for PI Backlog'}
            </h2>
            <p className="text-xs text-slate-400">
              Define scope, effort, stakeholder priority, and WSJF business drivers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Epic Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed In-Memory Cache for Real-Time Checkout"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Description & Scope Details
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of architectural requirements, customer problem, or technical enhancement..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Row: Strategic Theme & Stakeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Strategic Theme
              </label>
              <select
                value={strategicTheme}
                onChange={(e) => setStrategicTheme(e.target.value as StrategicTheme)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Revenue & Growth">Revenue & Growth</option>
                <option value="Platform & Scale">Platform & Scale</option>
                <option value="Security & Compliance">Security & Compliance</option>
                <option value="Customer Experience">Customer Experience</option>
                <option value="Developer Productivity">Developer Productivity</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Executive Stakeholder Sponsor
              </label>
              <input
                type="text"
                value={stakeholder}
                onChange={(e) => setStakeholder(e.target.value)}
                placeholder="e.g. VP Commercial Systems"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Row: Stakeholder Priority, Effort, Assigned Team */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Stakeholder Priority
              </label>
              <select
                value={stakeholderPriority}
                onChange={(e) => setStakeholderPriority(Number(e.target.value) as StakeholderPriority)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value={1}>P0 — Mission Critical</option>
                <option value={2}>P1 — High Strategic Impact</option>
                <option value={3}>P2 — Medium Priority</option>
                <option value={4}>P3 — Low / Discretionary</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Effort ({pi.unit})
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={effort}
                onChange={(e) => setEffort(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Delivery Team
              </label>
              <select
                value={primaryTeamId}
                onChange={(e) => setPrimaryTeamId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {pi.teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* WSJF Interactive Calculator Panel */}
          <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-xs uppercase tracking-wider">
                  WSJF Parameters (Weighted Shortest Job First)
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 mr-2">Calculated WSJF:</span>
                <span className="font-mono text-cyan-300 font-bold text-sm">{computedWSJF}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* User Business Value */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>User/Business Value:</span>
                  <span className="font-mono font-bold text-white">{userBusinessValue}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={userBusinessValue}
                  onChange={(e) => setUserBusinessValue(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              {/* Time Criticality */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Time Criticality:</span>
                  <span className="font-mono font-bold text-white">{timeCriticality}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={timeCriticality}
                  onChange={(e) => setTimeCriticality(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              {/* Risk Reduction */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Risk Reduction / O.E.:</span>
                  <span className="font-mono font-bold text-white">{riskReduction}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={riskReduction}
                  onChange={(e) => setRiskReduction(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono pt-1">
              Formula: (Value [{userBusinessValue}] + Time [{timeCriticality}] + Risk [{riskReduction}]) / Effort [{effort}] = Cost of Delay ({costOfDelay}) / {effort} = <strong>{computedWSJF}</strong>
            </div>
          </div>

          {/* Business Outcome */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Measurable Business Outcome / OKR Key Result
            </label>
            <input
              type="text"
              value={businessOutcome}
              onChange={(e) => setBusinessOutcome(e.target.value)}
              placeholder="e.g. +14% lift in enterprise signups, unlocks $3M pipeline"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Row: Target Iteration, Status, Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Target Iteration
              </label>
              <select
                value={targetIteration}
                onChange={(e) => setTargetIteration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {Array.from({ length: totalSprints }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Sprint {i + 1} {i + 1 === totalSprints && pi.innovationSprintIncluded ? '(IP)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EpicStatus)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="not_started">Backlog (Not Started)</option>
                <option value="in_discovery">Discovery & Architecture</option>
                <option value="in_development">In Active Development</option>
                <option value="in_validation">In QA & Validation</option>
                <option value="done">Completed & Accepted</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Progress ({progressPercent}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={progressPercent}
                onChange={(e) => setProgressPercent(Number(e.target.value))}
                className="w-full mt-2 accent-cyan-400 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{editingEpic ? 'Save Changes' : 'Create Epic'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
