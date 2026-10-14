import { AuditData } from "@/types/audit";

export function createEmptyAuditData(candidateName: string = "New Candidate"): AuditData {
  return {
    isEmpty: true,
    metadata: {
      documentName: `UK Global Talent Visa Audit — ${candidateName}`,
      documentOwner: candidateName,
      auditDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString(),
      endorsingBody: "Tech Nation (Digital Technology)",
      route: "Exceptional Promise / Exceptional Talent",
      applicantType: "Digital Technology",
      targetField: "Digital Technology",
      version: "1.0.0",
    },
    kpis: {
      overallScore: 0,
      currentStatus: "NO_ANALYSIS",
      statusColor: "blue",
      recommendation: "No analysis has been conducted yet. Upload candidate evidence documents to generate a forensic pre-submission audit.",
      estimatedVisaSuccess: 0,
      totalFilesAnalysed: 0,
      totalPages: 0,
      evidenceCount: 0,
      recommendationLetters: 0,
      recommendationLettersRequired: 3,
      newsArticles: 0,
      awards: 0,
      mediaEvidence: 0,
      criticalRisks: 0,
      minorRisks: 0,
      warnings: 0,
      passes: 0,
    },
    radarChart: [
      { category: "Leadership", score: 0, benchmark: 85 },
      { category: "Innovation", score: 0, benchmark: 85 },
      { category: "Outside Occupation", score: 0, benchmark: 80 },
      { category: "Commercial Impact", score: 0, benchmark: 85 },
      { category: "Recognition", score: 0, benchmark: 90 },
      { category: "Recommendation Letters", score: 0, benchmark: 90 },
    ],
    complianceBreakdown: [
      { name: "Critical", value: 0, color: "#ef4444" },
      { name: "Missing", value: 0, color: "#f97316" },
      { name: "Needs Improvement", value: 0, color: "#f59e0b" },
      { name: "Passed", value: 0, color: "#10b981" },
    ],
    timeline: [],
    criteriaScorecard: [],
    topRefusalRisks: [],
    panelVotes: [],
    evidenceMatrix: [],
    reports: [],
  };
}

