import { AuditData, ReportMeta } from "@/types/audit";

export interface DocumentInput {
  name: string;
  contentText: string;
  category?: string;
  pageCount?: number;
  sizeKb?: number;
  source?: "local" | "google_drive";
}

export interface AiAnalysisInput {
  candidateName: string;
  visaRoute: "Exceptional Talent" | "Exceptional Promise";
  targetField: string;
  applicantType?: "Technical" | "Business" | "Both";
  documents: DocumentInput[];
  additionalInstructions?: string;
}

export interface StructuredAnalysisResult extends AuditData {
  summary: {
    overallScore: number;
    currentStatus: string;
    confidenceScore: string;
    verdictSummary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
  markdownReports: {
    "FINAL-REPORT.md": string;
    "per-document-forensics.md": string;
    "evidence-matrix.md": string;
    "requirements.md": string;
    "letter-forensics.md": string;
    "consistency-check.md": string;
    "panel-simulation.md": string;
    "executive_audit_summary.md": string;
    [key: string]: string;
  };
}

export interface IAiProvider {
  name: string;
  isConfigured: () => boolean;
  analyze: (input: AiAnalysisInput) => Promise<StructuredAnalysisResult>;
}

