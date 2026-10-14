export type UserRole = "SOLICITOR" | "CANDIDATE" | "ADMIN" | "REVIEWER";

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface OrganizationSession {
  id: string;
  name: string;
  slug: string;
  tier: "STARTER" | "PROFESSIONAL" | "FIRM_ENTERPRISE";
  seatsUsed: number;
  seatsMax: number;
}

export interface ProjectSession {
  id: string;
  candidateName: string;
  visaRoute: "Exceptional Talent" | "Exceptional Promise";
  targetField: "Digital Technology" | "Arts and Culture" | "Research and Academia";
  applicantType: "Technical" | "Business" | "Both";
  status: "draft" | "auditing" | "action_required" | "ready_to_submit";
  currentScore: number;
  totalRuns: number;
  activeRunId: string;
}

export interface AuditRunItem {
  id: string;
  versionNumber: number;
  overallScore: number;
  currentStatus: string;
  createdAt: string;
  isLatest: boolean;
}

