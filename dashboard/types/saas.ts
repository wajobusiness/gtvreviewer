import { AuditData, ReportMeta, EvidenceRow, RefusalRisk, PanelVote, CriterionScore } from "./audit";

export type UserRole = "owner" | "admin" | "member" | "solicitor" | "viewer";
export type SubscriptionTier = "starter" | "professional" | "firm_enterprise";
export type AuditRunStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface OrganizationModel {
  id: string;
  name: string;
  slug: string;
  tier: SubscriptionTier;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserModel {
  id: string;
  organizationId: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectModel {
  id: string;
  organizationId: string;
  candidateName: string;
  visaRoute: "Exceptional Talent" | "Exceptional Promise";
  targetField: "Digital Technology" | "Arts and Culture" | "Research and Academia";
  applicantType: "Technical" | "Business" | "Both";
  status: "draft" | "auditing" | "action_required" | "ready_to_submit";
  currentScore?: number;
  latestRunId?: string;
  totalRuns: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuditRunSummary {
  id: string;
  projectId: string;
  versionNumber: number;
  overallScore: number;
  currentStatus: string;
  recommendation: string;
  estimatedVisaSuccess: number;
  criticalRisksCount: number;
  passesCount: number;
  createdAt: string;
}

export interface AuditRunModel extends AuditRunSummary {
  rawAuditJson: AuditData;
  reports: ReportDocumentModel[];
  evidence: EvidenceItemModel[];
  durationMs: number;
}

export interface EvidenceItemModel {
  id: string;
  auditRunId: string;
  fileName: string;
  storageKey?: string;
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
}

export interface ReportDocumentModel {
  id: string;
  auditRunId: string;
  slug: string;
  title: string;
  filename: string;
  description: string;
  category: string;
  status: "Critical" | "Warning" | "Passed" | "Informational";
  score?: number;
  content: string;
  createdAt: string;
}

