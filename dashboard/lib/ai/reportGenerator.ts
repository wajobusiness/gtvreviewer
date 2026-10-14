import { StructuredAnalysisResult } from "./types";

export function generateMarkdownReportsFromAnalysis(
  result: Omit<StructuredAnalysisResult, "markdownReports" | "reports">
): StructuredAnalysisResult["markdownReports"] {
  const { metadata, kpis, radarChart, topRefusalRisks, criteriaScorecard, evidenceMatrix, summary } = result;

  const finalReport = `# UK Global Talent Visa Pre-Submission Forensic Audit: FINAL REPORT

## Executive Verdict
- **Candidate Name:** ${metadata.candidateName || metadata.documentOwner || "Applicant"}
- **Visa Route:** ${metadata.route} (${metadata.targetField})
- **Overall Forensic Readiness Score:** **${kpis.overallScore}/100**
- **Assessment Verdict:** **${kpis.currentStatus}**
- **Estimated Endorsement Probability:** **${kpis.estimatedVisaSuccess}%**
- **Date of Audit:** ${metadata.auditDate}

---

## 1. Executive Summary & Home Office Risk Profile
${kpis.recommendation}

### Key Strengths
${summary.strengths.map((s) => `- ${s}`).join("\n")}

### Critical Weaknesses & Defects
${summary.weaknesses.map((w) => `- ${w}`).join("\n")}

### Remediation Action Plan
${summary.recommendations.map((r, i) => `${i + 1}. ${r}`).join("\n")}

---

## 2. Quantitative Criteria Scorecard
| Criterion ID | Description | Claimed | Pieces Submitted | Status Verdict | Score |
| :--- | :--- | :--- | :--- | :--- | :--- |
${criteriaScorecard
  .map(
    (c) =>
      `| **${c.id}** | ${c.name} | ${c.claimed ? "Yes" : "No"} | ${c.piecesCount}/${c.minimumRequired} | ${c.verdict} | ${c.score}/100 |`
  )
  .join("\n")}

---

## 3. High-Priority Refusal Risks (Part 9 Grounds)
${topRefusalRisks
  .map(
    (r) => `### Risk #${r.rank}: [${r.severity}] ${r.title}
- **Document / Source:** \`${r.file}\` (Page ${r.page})
- **Immigration Rule / Guideline:** ${r.rule}
- **Impact on Application:** ${r.impact}
> "${r.quote}"
`
  )
  .join("\n\n")}
`;

  const evidenceMatrixReport = `# Evidence Matrix & Verification Registry

## Overview
- Total Submitted Pieces: **${evidenceMatrix.length}**
- Legal Limit: Maximum 10 pieces across Mandatory & Optional Criteria.
- Page Budget Limit: Maximum 3 pages per individual piece.

| Item # | Document Name | Criterion Target | Strength | Risk Severity | Attributable | Inside 5-Yr Window |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${evidenceMatrix
  .map(
    (e) =>
      `| ${e.id} | \`${e.fileName || e.file}\` | ${e.category} | ${e.strength} | ${e.status} | ${e.attributable ? "Yes" : "No"} | ${e.insideWindow ? "Yes" : "No"} |`
  )
  .join("\n")}
`;

  const requirementsReport = `# Tech Nation Criteria & Guideline Compliance Map

## Mandatory & Optional Criteria Breakdown
${criteriaScorecard
  .map(
    (c) => `### ${c.id}: ${c.name}
- **Status:** ${c.verdict} (${c.score}/100)
- **Pieces Count:** ${c.piecesCount} (Minimum Required: ${c.minimumRequired})
- **Key Assessment Notes:** ${c.primaryIssue}
`
  )
  .join("\n")}
`;

  const letterForensicsReport = `# Letters of Recommendation Forensic Audit

## Statutory Requirement
Tech Nation requires exactly **3 standalone letters of recommendation** from distinct established leaders in the digital technology sector.

- **Letters Identified in Portfolio:** ${kpis.recommendationLetters} / 3 Required
- **Referees Evaluated:**
${
  kpis.recommendationLetters >= 3
    ? "- All 3 required letters provided and evaluated against author seniority and organization status."
    : "- **DEFICIT:** Less than 3 standalone letters detected. Application will be summarily refused on administrative non-compliance unless 3 qualified referee letters are filed."
}
`;

  const consistencyCheckReport = `# Cross-Document Contradiction & Integrity Report

## Analysis Findings
${topRefusalRisks
  .filter((r) => r.severity === "CRITICAL" || r.severity === "HIGH")
  .map(
    (r, idx) => `### Finding #${idx + 1}: ${r.title}
- **Source:** ${r.file}
- **Rule Breached:** ${r.rule}
- **Caseworker Assessment:** ${r.impact}
`
  )
  .join("\n")}
`;

  const panelSimulationReport = `# 5-Assessor Expert Panel Simulation

## Consensus Vote
- **Overall Verdict:** ${kpis.currentStatus}
- **Endorsement Probability:** ${kpis.estimatedVisaSuccess}%

### Modeled Assessor Deliberation
1. **Assessor 1 (Tech Nation Lead Caseworker):** Focuses on strict guideline compliance, document counts, and page caps.
2. **Assessor 2 (Technical Domain Specialist):** Scrutinizes technical innovation, system architecture, and code authorship.
3. **Assessor 3 (Commercial & Scaling Expert):** Cross-checks revenue metrics, customer traction, and audited growth statements.
4. **Assessor 4 (Legal & Part 9 Compliance Officer):** Inspects identity attribution, certificate validity, and deception grounds.
5. **Assessor 5 (Executive Industry Leader):** Evaluates overall leadership trajectory, public standing, and UK ecosystem value.
`;

  const executiveAuditSummary = `# Executive Audit Summary: ${metadata.candidateName || metadata.documentOwner || "Applicant"}

## Scorecard Overview
- **Score:** ${kpis.overallScore}/100
- **Status:** ${kpis.currentStatus}
- **Visa Route:** ${metadata.route}

### Recommendation
${kpis.recommendation}
`;

  return {
    "FINAL-REPORT.md": finalReport,
    "evidence-matrix.md": evidenceMatrixReport,
    "requirements.md": requirementsReport,
    "letter-forensics.md": letterForensicsReport,
    "consistency-check.md": consistencyCheckReport,
    "panel-simulation.md": panelSimulationReport,
    "executive_audit_summary.md": executiveAuditSummary,
  };
}

