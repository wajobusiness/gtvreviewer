export interface AuditMetadata {
  documentName: string;
  documentOwner: string;
  candidateName?: string;
  auditDate: string;
  lastUpdated: string;
  endorsingBody: string;
  route: string;
  applicantType: string;
  targetField: string;
  version: string;
}

export interface AuditKPIs {
  overallScore: number;
  currentStatus: string;
  statusColor: "red" | "amber" | "green" | "blue" | string;
  recommendation: string;
  estimatedVisaSuccess: number;
  totalFilesAnalysed: number;
  totalPages: number;
  evidenceCount: number;
  recommendationLetters: number;
  recommendationLettersRequired: number;
  newsArticles: number;
  awards: number;
  mediaEvidence: number;
  criticalRisks: number;
  minorRisks: number;
  warnings: number;
  passes: number;
}

export interface RadarData {
  category: string;
  score: number;
  benchmark: number;
}

export interface ComplianceSlice {
  name: string;
  value: number;
  color: string;
}

export interface TimelineStep {
  step: string;
  status: "completed" | "in-progress" | "pending" | "failed";
  timestamp: string;
  details: string;
}

export interface CriterionScore {
  id: string;
  name: string;
  claimed: boolean;
  verdict: "MET" | "BORDERLINE" | "NOT MET" | "NOT CLAIMED";
  score: number;
  piecesCount: number;
  minimumRequired: number;
  primaryIssue: string;
}

export interface RefusalRisk {
  rank: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  title: string;
  file: string;
  page: string;
  rule: string;
  impact: string;
  quote: string;
}

export interface PanelVote {
  reviewer: string;
  decision: "Approve" | "Borderline" | "Reject";
  verdictColor: string;
  confidence: number;
  summary: string;
  comments: string;
}

export interface EvidenceRow {
  id: string;
  file: string;
  fileName?: string;
  category: string;
  requirement: string;
  strength: string;
  confidence: "High" | "Medium" | "Low";
  source: string;
  status: "Critical" | "Needs Improvement" | "Passed" | "Missing";
  attributable: boolean;
  insideWindow: boolean;
  metrics: string;
  risk: string;
  shows?: string;
  guidanceExampleMatch?: string;
  distinct?: boolean;
  verifiable?: boolean;
  thirdPartySource?: boolean;
  why?: string;
}

export interface ReportMeta {
  slug: string;
  title: string;
  filename: string;
  description: string;
  status: "Critical" | "Warning" | "Passed" | "Informational";
  score?: number;
  category: string;
  icon: string;
  date: string;
  size: string;
  content?: string;
}

export interface IndividualDocumentAudit {
  documentId: string;
  documentName: string;
  category: string;
  pageCount: number;
  pageLimitExceeded: boolean;
  verdict: "CRITICAL REFUSAL RISK" | "BORDERLINE / WEAK" | "COMPLIANT / STRONG";
  score: number; // 0-100
  wordCount: number;
  screenshotAnalysis: {
    hasScreenshots: boolean;
    screenshotCount?: number;
    details: string;
    verificationStatus: "VERIFIED_PUBLIC" | "UNVERIFIED_INTERNAL" | "NO_SCREENSHOTS" | "SUSPICIOUS";
  };
  personalAttribution: {
    isPersonallyAttributable: boolean;
    attributionScore: number; // 0-100
    analysis: string; // analysis of "I" vs "We" / employer vs individual
  };
  corroboration: {
    isThirdPartyCorroborated: boolean;
    corroborationType: "INDEPENDENT_PRESS_AUDIT" | "INTERNAL_UNVERIFIED" | "SELF_ASSERTED" | "THIRD_PARTY_LETTER";
    details: string;
  };
  productLedCheck: {
    isProductLed: boolean;
    details: string;
  };
  fatalDefects: string[];
  exactQuotes: string[];
  remediationAdvice: string;
}

export interface AuditData {
  metadata: AuditMetadata;
  kpis: AuditKPIs;
  radarChart: RadarData[];
  complianceBreakdown: ComplianceSlice[];
  timeline: TimelineStep[];
  criteriaScorecard: CriterionScore[];
  topRefusalRisks: RefusalRisk[];
  panelVotes: PanelVote[];
  evidenceMatrix: EvidenceRow[];
  individualDocumentAudits?: IndividualDocumentAudit[];
  reports?: ReportMeta[];
  isEmpty?: boolean;
}

