import { ProgramIncrement, Epic, Team } from '../types';

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-platform',
    name: 'Core Platform & Cloud',
    color: '#06b6d4', // cyan-500
    members: 6,
    focusFactor: 80,
    ptoDays: 8,
    historicalVelocity: 75,
    leadRole: 'Staff Infrastructure Architect'
  },
  {
    id: 'team-commerce',
    name: 'Commerce & Checkout',
    color: '#3b82f6', // blue-500
    members: 5,
    focusFactor: 75,
    ptoDays: 6,
    historicalVelocity: 65,
    leadRole: 'Principal UX & Systems Eng'
  },
  {
    id: 'team-data',
    name: 'Data & Telemetry Engine',
    color: '#10b981', // emerald-500
    members: 5,
    focusFactor: 75,
    ptoDays: 5,
    historicalVelocity: 60,
    leadRole: 'Lead Distributed Systems Eng'
  },
  {
    id: 'team-security',
    name: 'Security, Auth & Trust',
    color: '#8b5cf6', // purple-500
    members: 4,
    focusFactor: 85,
    ptoDays: 4,
    historicalVelocity: 48,
    leadRole: 'Principal Security Specialist'
  }
];

export const INITIAL_PI: ProgramIncrement = {
  id: 'pi-2026-q4',
  name: 'PI 2026.Q4 — Enterprise Scale & Global Checkout',
  targetPeriod: 'Oct 12, 2026 – Dec 18, 2026',
  strategicObjective: 'Expand enterprise high-availability infrastructure to 99.99% SLA, deliver one-click global checkout, and achieve SOC2 Type II automated compliance.',
  totalWeeks: 10,
  iterationLengthWeeks: 2,
  innovationSprintIncluded: true,
  bufferReservePercent: 10,
  unit: 'points',
  currentSprintIndex: 2,
  teams: INITIAL_TEAMS
};

export const INITIAL_EPICS: Epic[] = [
  {
    id: 'EPIC-101',
    title: 'Multi-Region Active-Active Database Failover',
    description: 'Zero-data-loss failover architecture across US-East, US-West, and EU-Central with sub-300ms consensus replication.',
    strategicTheme: 'Platform & Scale',
    stakeholder: 'VP Infrastructure & Reliability',
    stakeholderPriority: 1, // P0
    effort: 55,
    primaryTeamId: 'team-platform',
    wsjf: {
      userBusinessValue: 20,
      timeCriticality: 13,
      riskReduction: 20,
      jobSize: 55
    },
    targetIteration: 1,
    status: 'in_development',
    progressPercent: 70,
    dependencies: [],
    businessOutcome: 'Eliminates regional single points of failure, protecting $14M quarterly revenue from outages.',
    confidenceLevel: 'high'
  },
  {
    id: 'EPIC-102',
    title: 'Global One-Click Enterprise Checkout & Localized Currencies',
    description: 'Frictionless checkout experience supporting 24 local currencies, automated tax calculation, and saved enterprise payment tokens.',
    strategicTheme: 'Revenue & Growth',
    stakeholder: 'Chief Commercial Officer',
    stakeholderPriority: 1, // P0
    effort: 48,
    primaryTeamId: 'team-commerce',
    wsjf: {
      userBusinessValue: 20,
      timeCriticality: 20,
      riskReduction: 8,
      jobSize: 48
    },
    targetIteration: 2,
    status: 'in_development',
    progressPercent: 45,
    dependencies: ['EPIC-101'],
    businessOutcome: '+18% checkout completion rate and 3.2x faster purchase transaction speeds.',
    confidenceLevel: 'high'
  },
  {
    id: 'EPIC-103',
    title: 'SOC2 Type II Automated Compliance Audit Vault',
    description: 'Continuous audit logging pipeline with cryptographic proof of compliance for identity, access, and change management.',
    strategicTheme: 'Security & Compliance',
    stakeholder: 'Chief Information Security Officer',
    stakeholderPriority: 1, // P0
    effort: 34,
    primaryTeamId: 'team-security',
    wsjf: {
      userBusinessValue: 13,
      timeCriticality: 20,
      riskReduction: 20,
      jobSize: 34
    },
    targetIteration: 1,
    status: 'in_validation',
    progressPercent: 85,
    dependencies: [],
    businessOutcome: 'Required gating condition to unlock 12 enterprise contracts valued at $4.2M ARR.',
    confidenceLevel: 'high'
  },
  {
    id: 'EPIC-104',
    title: 'Real-Time Customer Telemetry Stream Engine',
    description: 'Event-driven streaming pipeline processing 100k events/sec with sub-second ingestion into customer intelligence dashboards.',
    strategicTheme: 'Customer Experience',
    stakeholder: 'Head of Product Analytics',
    stakeholderPriority: 2, // P1
    effort: 42,
    primaryTeamId: 'team-data',
    wsjf: {
      userBusinessValue: 13,
      timeCriticality: 8,
      riskReduction: 13,
      jobSize: 42
    },
    targetIteration: 2,
    status: 'in_development',
    progressPercent: 30,
    dependencies: [],
    businessOutcome: 'Provides real-time drop-off alerts and accelerates customer issue resolution from 48h to 10m.',
    confidenceLevel: 'medium'
  },
  {
    id: 'EPIC-105',
    title: 'Enterprise SAML 2.0 & SCIM User Provisioning',
    description: 'Directory sync with Okta, Azure AD, and Google Workspace with granular automated role lifecycle management.',
    strategicTheme: 'Security & Compliance',
    stakeholder: 'Director of Enterprise Partnerships',
    stakeholderPriority: 1, // P0
    effort: 28,
    primaryTeamId: 'team-security',
    wsjf: {
      userBusinessValue: 13,
      timeCriticality: 13,
      riskReduction: 13,
      jobSize: 28
    },
    targetIteration: 3,
    status: 'in_discovery',
    progressPercent: 15,
    dependencies: ['EPIC-103'],
    businessOutcome: 'Reduces enterprise client onboarding friction from 14 days to self-serve in 30 minutes.',
    confidenceLevel: 'high'
  },
  {
    id: 'EPIC-106',
    title: 'Next-Gen Edge Caching & API Rate Limiting',
    description: 'Distributed edge token-bucket rate limiting and smart cache invalidation for partner API endpoints.',
    strategicTheme: 'Platform & Scale',
    stakeholder: 'VP Engineering',
    stakeholderPriority: 2, // P1
    effort: 38,
    primaryTeamId: 'team-platform',
    wsjf: {
      userBusinessValue: 13,
      timeCriticality: 8,
      riskReduction: 8,
      jobSize: 38
    },
    targetIteration: 3,
    status: 'in_discovery',
    progressPercent: 10,
    dependencies: ['EPIC-101'],
    businessOutcome: 'Cuts origin server load by 45% and reduces p99 API latency from 240ms to 42ms.',
    confidenceLevel: 'medium'
  },
  {
    id: 'EPIC-107',
    title: 'Subscription Tier Metering & Dynamic Invoicing',
    description: 'Automated usage-based billing engine with tiered quota alerts, payment retry dunning, and Stripe/Adyen webhooks.',
    strategicTheme: 'Revenue & Growth',
    stakeholder: 'Head of Revenue Operations',
    stakeholderPriority: 2, // P1
    effort: 45,
    primaryTeamId: 'team-commerce',
    wsjf: {
      userBusinessValue: 13,
      timeCriticality: 13,
      riskReduction: 5,
      jobSize: 45
    },
    targetIteration: 3,
    status: 'not_started',
    progressPercent: 0,
    dependencies: ['EPIC-102'],
    businessOutcome: 'Captures an estimated $650k/month in unmetered API volume consumption.',
    confidenceLevel: 'medium'
  },
  {
    id: 'EPIC-108',
    title: 'Automated ML Fraud Scoring & Anomaly Detection',
    description: 'In-line transaction fraud classification model operating at <15ms latency to prevent chargeback spikes.',
    strategicTheme: 'Security & Compliance',
    stakeholder: 'Chief Risk Officer',
    stakeholderPriority: 2, // P1
    effort: 40,
    primaryTeamId: 'team-data',
    wsjf: {
      userBusinessValue: 8,
      timeCriticality: 8,
      riskReduction: 13,
      jobSize: 40
    },
    targetIteration: 4,
    status: 'not_started',
    progressPercent: 0,
    dependencies: ['EPIC-104'],
    businessOutcome: 'Reduces merchant chargeback liability rate from 0.8% to <0.15%.',
    confidenceLevel: 'medium'
  },
  {
    id: 'EPIC-109',
    title: 'Mobile Web Progressive Checkout Speed Optimization',
    description: 'Sub-second mobile checkout load time with aggressive bundle pruning and image AVIF transcoding.',
    strategicTheme: 'Customer Experience',
    stakeholder: 'Lead Product Manager, Mobile',
    stakeholderPriority: 2, // P1
    effort: 24,
    primaryTeamId: 'team-commerce',
    wsjf: {
      userBusinessValue: 8,
      timeCriticality: 8,
      riskReduction: 3,
      jobSize: 24
    },
    targetIteration: 4,
    status: 'not_started',
    progressPercent: 0,
    dependencies: ['EPIC-102'],
    businessOutcome: '+9% mobile conversion lift and 50% reduction in Lighthouse performance blocking time.',
    confidenceLevel: 'high'
  },
  {
    id: 'EPIC-110',
    title: 'Developer Sandbox Environment Auto-Provisioning',
    description: 'Ephemeral Kubernetes preview environments spun up on pull-request creation for faster QA and automated testing.',
    strategicTheme: 'Developer Productivity',
    stakeholder: 'Director of Developer Experience',
    stakeholderPriority: 3, // P2
    effort: 32,
    primaryTeamId: 'team-platform',
    wsjf: {
      userBusinessValue: 8,
      timeCriticality: 5,
      riskReduction: 5,
      jobSize: 32
    },
    targetIteration: 4,
    status: 'not_started',
    progressPercent: 0,
    dependencies: [],
    businessOutcome: 'Reduces PR verification cycle time by 3.5 hours per engineer per week.',
    confidenceLevel: 'medium'
  },
  {
    id: 'EPIC-111',
    title: 'Omnichannel Inventory Real-Time Sync Pipeline',
    description: 'Bidirectional sync connector bridging warehouse ERP with online storefront catalog in <2 seconds.',
    strategicTheme: 'Revenue & Growth',
    stakeholder: 'VP Supply Chain & Operations',
    stakeholderPriority: 3, // P2
    effort: 52,
    primaryTeamId: 'team-data',
    wsjf: {
      userBusinessValue: 8,
      timeCriticality: 5,
      riskReduction: 8,
      jobSize: 52
    },
    targetIteration: 4,
    status: 'not_started',
    progressPercent: 0,
    dependencies: ['EPIC-104'],
    businessOutcome: 'Prevents stockout overselling across 48 distribution centers.',
    confidenceLevel: 'low'
  },
  {
    id: 'EPIC-112',
    title: 'Legacy Monolith Billing Service Decommissioning',
    description: 'Final migration of lingering legacy billing database tables to dedicated microservice with data validation parity.',
    strategicTheme: 'Platform & Scale',
    stakeholder: 'VP Engineering',
    stakeholderPriority: 3, // P2
    effort: 46,
    primaryTeamId: 'team-platform',
    wsjf: {
      userBusinessValue: 5,
      timeCriticality: 3,
      riskReduction: 8,
      jobSize: 46
    },
    targetIteration: 4,
    status: 'not_started',
    progressPercent: 0,
    dependencies: ['EPIC-107'],
    businessOutcome: 'Saves $180k/yr in legacy Oracle database licensing and reduces maintenance toil.',
    confidenceLevel: 'medium'
  },
  {
    id: 'EPIC-113',
    title: 'Automated GDPR / CCPA Right-To-Be-Forgotten Processor',
    description: 'Self-serve compliance deletion crawler removing PII records across 18 distributed data stores within 72 hours.',
    strategicTheme: 'Security & Compliance',
    stakeholder: 'Data Protection Officer',
    stakeholderPriority: 3, // P2
    effort: 36,
    primaryTeamId: 'team-security',
    wsjf: {
      userBusinessValue: 5,
      timeCriticality: 5,
      riskReduction: 13,
      jobSize: 36
    },
    targetIteration: 4,
    status: 'not_started',
    progressPercent: 0,
    dependencies: [],
    businessOutcome: 'Automates manual compliance requests, saving 40 legal hours per month.',
    confidenceLevel: 'medium'
  },
  {
    id: 'EPIC-114',
    title: 'Micro-Frontends Modular Host Shell Migration',
    description: 'Dynamic module federation allowing independent deployability for checkout, account, and catalog web teams.',
    strategicTheme: 'Developer Productivity',
    stakeholder: 'Staff Frontend Lead',
    stakeholderPriority: 4, // P3
    effort: 58,
    primaryTeamId: 'team-commerce',
    wsjf: {
      userBusinessValue: 5,
      timeCriticality: 2,
      riskReduction: 3,
      jobSize: 58
    },
    targetIteration: 4,
    status: 'not_started',
    progressPercent: 0,
    dependencies: [],
    businessOutcome: 'Enables independent weekly release trains without lockstep deployment coordination.',
    confidenceLevel: 'low'
  }
];

export const INITIAL_COMPLETED_SPRINTS: { [sprintNum: number]: number } = {
  1: 88, // Sprint 1 actual delivered velocity
  2: 92  // Sprint 2 in-flight current velocity
};
