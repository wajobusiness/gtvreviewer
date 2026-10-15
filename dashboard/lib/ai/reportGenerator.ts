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
- Statutory Limit: Maximum 10 pieces across Mandatory & Optional Criteria.
- Statutory Page Limit: Maximum 3 A4 pages per individual piece.

| Item # | File | What It Actually Shows | Criterion Claimed | Matches Guidance Example | Inside 5-Yr Window | Distinct? | Personally Attributable? | Metrics Shown? | Independently Verifiable? | Third-Party Source? | Risk Severity | Rationale / Why |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${evidenceMatrix
  .map(
    (e) =>
      `| ${e.id} | \`${e.fileName || e.file}\` | ${e.shows || e.category} | ${e.category} | ${e.guidanceExampleMatch || e.requirement || "Tech Nation Criteria"} | ${e.insideWindow ? "Yes" : "No"} | ${e.distinct !== false ? "Yes" : "No"} | ${e.attributable ? "Yes" : "No"} | ${e.metrics ? "Yes (" + e.metrics + ")" : "None cited"} | ${e.verifiable !== false ? "Yes" : "No"} | ${e.thirdPartySource !== false ? "Yes" : "No"} | ${e.status} | ${e.why || e.risk || "Evaluated against criteria"} |`
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

  const perDocumentForensicsReport = `# Word-for-Word Per-Document Forensic Dossier

## Statutory Casework Objective
Every evidence piece must be audited individually before being relied upon in an application dossier.
Tech Nation caseworkers evaluate each piece against 4 core tests:
1. **Statutory Page Limit Test**: Max 3 A4 pages per piece.
2. **Personal Attribution Test ("The Company Trap")**: Does this evidence prove the candidate's direct personal leadership and contribution, or merely aggregate team/company success?
3. **Independent Third-Party Corroboration**: Are metrics, revenue figures, and claims backed by independent external sources (press, audited financials, client contracts) or self-asserted?
4. **Visual Artifact & Screenshot Integrity**: Do screenshots have verifiable public URLs, timestamps, or repository links, or are they unverified internal captures?

---

${(result.individualDocumentAudits || [])
  .map(
    (doc, idx) => `### Document #${idx + 1}: ${doc.documentName}
- **Assigned Category:** ${doc.category}
- **Statutory Length:** ${doc.pageCount} A4 pages ${doc.pageLimitExceeded ? "⚠️ **[EXCEEDS 3-PAGE LIMIT]**" : "✓ (Within 3-page cap)"}
- **Caseworker Verdict:** **${doc.verdict}** (Score: ${doc.score}/100)

#### 1. Personal Attribution Analysis ("We vs I" Test)
- **Personally Attributable:** ${doc.personalAttribution.isPersonallyAttributable ? "✓ YES (Candidate's direct work proven)" : "❌ NO — FATAL DEFECT (Conflates corporate/team success with individual leadership)"}
- **Caseworker Assessment:** ${doc.personalAttribution.analysis}

#### 2. Screenshot & Visual Artifact Inspection
- **Artifacts Present:** ${doc.screenshotAnalysis.hasScreenshots ? "Yes (Screenshots / UI Captures)" : "No Standalone Screenshots"}
- **Verification Status:** \`${doc.screenshotAnalysis.verificationStatus}\`
- **Caseworker Findings:** ${doc.screenshotAnalysis.details}

#### 3. Independent Corroboration & Product-Led Check
- **Third-Party Corroboration:** ${doc.corroboration.isThirdPartyCorroborated ? "✓ Corroborated by independent sources" : "❌ Uncorroborated / Self-Asserted"} (${doc.corroboration.corroborationType})
- **Product-Led Qualification:** ${doc.productLedCheck.isProductLed ? "✓ Product-Led Tech Company" : "❌ Non-Product-Led (Agency/Consultancy/Services)"}

#### 4. Fatal Evidentiary Defects
${doc.fatalDefects.length > 0 ? doc.fatalDefects.map((d) => `- ${d}`).join("\n") : "- None detected. Complies with statutory rules."}

#### 5. Remediation Directive
> ${doc.remediationAdvice}
`
  )
  .join("\n---\n\n")}
`;

  return {
    "FINAL-REPORT.md": finalReport,
    "per-document-forensics.md": perDocumentForensicsReport,
    "evidence-matrix.md": evidenceMatrixReport,
    "requirements.md": requirementsReport,
    "letter-forensics.md": letterForensicsReport,
    "consistency-check.md": consistencyCheckReport,
    "panel-simulation.md": panelSimulationReport,
    "executive_audit_summary.md": executiveAuditSummary,
  };
}

