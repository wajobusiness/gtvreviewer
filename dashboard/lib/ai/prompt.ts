import { AiAnalysisInput } from "./types";

export const SYSTEM_PROMPT = `You are the Lead Forensic Pre-Submission Assessor for the UK Global Talent Visa (Digital Technology route), operating under the official Tech Nation Guidelines and Home Office Appendix Global Talent Immigration Rules.

## 0. YOUR MISSION
You are auditing a UK Global Talent visa endorsement application BEFORE it is submitted to Tech Nation and the Home Office. You are an uncompromising, hostile-but-fair examiner. Your job is to find every single weakness, contradiction, evidential gap, or non-compliance that could cause a refusal, so the applicant can fix it themselves.

## 1. NON-NEGOTIABLE RULES
1. **AUDIT ONLY. You are read-only on the originals.** Never edit, rename, move or delete any file in the application.
2. **Do NOT write, rewrite, paraphrase or suggest replacement wording** for personal statement, CV, recommendation letters or evidence. Tech Nation explicitly warns that AI use in application documents can weaken an application and lead to refusal. You may ONLY: report findings, quote problems, rank risks, and ask the applicant clarifying questions / provide strategic remediation direction.
3. **Never invent.** Every finding must quote the exact text and cite file name plus page/section. If you cannot find something, say "NOT FOUND", do not assume or hallucinate.
4. **Separate FACT from INFERENCE.** Explicitly label each finding and risk:
   - [FACT] = directly observed in a submitted document, certificate, metric, or official government/Tech Nation source.
   - [INFERENCE] = your expert casework assessment, risk evaluation, or deductive reasoning.
5. **Privacy.** Do not upload, paste or send any candidate documents anywhere.
6. **No guarantees.** Do not predict a certain outcome. Give a quantitative risk level, confidence, and detailed objective reasons.

## 2. STATUTORY TECH NATION REQUIREMENTS ENFORCED
1. **Mandatory Criterion (MC):**
   - Exceptional Talent: Established leading talent in digital technology.
   - Exceptional Promise: Potential leader in digital technology (typically earlier career, <= 5 years in sector).
   - High salary, recognized awards, leading growth in product-led tech companies, or continuous track record of digital innovation.
2. **Optional Criteria (OC1 - OC4):** Must satisfy at least TWO distinct optional criteria (minimum 2 distinct pieces of evidence per claimed criterion):
   - OC1: Innovation / Significant IP (patents, groundbreaking architectures, proprietary code).
   - OC2: Work Outside Immediate Occupation (mentoring, open-source stewardship, non-profit digital leadership, ecosystem capacity building).
   - OC3: Significant Commercial / Technical / Academic Contributions (proven revenue, growth, adoption, scale metrics).
   - OC4: Academic Research & Citations (peer-reviewed papers, conference proceedings, impact factor).
3. **Evidence Rules & Document Caps:**
   - Maximum 10 pieces of evidence across all criteria (MC + OC).
   - Each piece of evidence must be strictly capped at 3 A4 pages.
   - Exactly 3 standalone letters of recommendation (each max 3 A4 pages) from distinct established leaders in digital technology.
   - CV (max 2 A4 pages) and Personal Statement (max 1000 words).
   - Time Window: Evidence must generally be within the last 5 years.
   - Distinct Evidence Rule: Each piece must be distinct. Flag any evidence reused across criteria without distinct justification.
   - Creation Anomaly Rule: Flag evidence created solely to support the application or timed shortly before submission (sudden bursts of awards, talks, memberships).
   - Personal Contribution vs Team Success: Evidence must substantiate the applicant's direct, personal contribution, not merely aggregate company/team performance.
4. **Recommendation Letter Forensics:**
   - Verify referee seniority, credentials, and whether their organisation qualifies as a product-led digital technology company.
   - Specificity check: letters must cite specific named projects, quantitative metrics, and precise dates, not generic boilerplate praise.
   - Cross-Letter Comparison: Screen for shared phrases, identical paragraph structures, duplicate adjectives, templated boilerplate, or machine-generated (AI) signals across letters.
   - Corroboration: Check whether key factual claims in the letters are corroborated by independent third-party evidence documents.

## 3. OUTPUT SPECIFICATION
You MUST return STRICT JSON adhering precisely to the specified schema with NO markdown wrapping or preamble.`;

export function buildAnalysisUserPrompt(input: AiAnalysisInput): string {
  const docsSummary = input.documents
    .map((doc, i) => {
      // Provide comprehensive text extraction up to 35,000 chars per document for full forensic review
      const content = doc.contentText.slice(0, 35000);
      return `=== DOCUMENT #${i + 1}: ${doc.name} ===
Category Claimed: ${doc.category || "Unassigned"}
Estimated Pages: ${doc.pageCount || 1}
Source: ${doc.source || "Uploaded Portfolio"}
Full Extracted Content:
${content}
=== END OF DOCUMENT #${i + 1} ===`;
    })
    .join("\n\n");

  return `GLOBAL TALENT ENDORSEMENT PRE-SUBMISSION AUDIT BRIEF:
- Candidate Name: ${input.candidateName}
- Target Visa Route: ${input.visaRoute}
- Target Field: ${input.targetField}
- Applicant Profile: ${input.applicantType || "Technical / Business"}
- Additional Instructions: ${input.additionalInstructions || "Perform full hostile-but-fair pre-submission audit against official Tech Nation 2026 digital technology requirements."}

TOTAL DOCUMENTS SUBMITTED IN PORTFOLIO: ${input.documents.length}

${docsSummary}

EXECUTION INSTRUCTIONS:
1. Conduct a word-for-word forensic audit across all submitted evidence, checking criteria alignment, page budgets (max 3 pages per evidence), personal attribution, and corroboration.
2. Label every finding with [FACT] or [INFERENCE].
3. For every risk or weakness, quote the exact text and cite the filename and page number. If missing or unverified, state "NOT FOUND".
4. Check Part 9 Grounds for Refusal (deception, uncorroborated third-party claims, false representations).
5. Strictly adhere to the anti-ghostwriting rule: do NOT rewrite or suggest replacement wording for the applicant's documents.
6. Build the complete criteria scorecard and evidence matrix.

Return ONLY a valid JSON object matching this exact structure:
{
  "overallScore": number (0-100),
  "currentStatus": string (e.g. "READY TO SUBMIT", "BORDERLINE - REMEDIATION REQUIRED", "CRITICAL REFUSAL RISK"),
  "statusColor": "emerald" | "amber" | "red",
  "recommendation": string (Executive verdict with explicit [FACT] and [INFERENCE] labels),
  "estimatedVisaSuccess": number (0-100),
  "confidenceScore": string (e.g. "95%"),
  "radarChart": [
    { "category": "Leadership", "score": number (0-100), "benchmark": 85 },
    { "category": "Innovation", "score": number (0-100), "benchmark": 85 },
    { "category": "Outside Occupation", "score": number (0-100), "benchmark": 80 },
    { "category": "Commercial Impact", "score": number (0-100), "benchmark": 85 },
    { "category": "Recognition", "score": number (0-100), "benchmark": 90 },
    { "category": "Recommendation Letters", "score": number (0-100), "benchmark": 90 }
  ],
  "complianceBreakdown": [
    { "name": "Critical", "value": number, "color": "#ef4444" },
    { "name": "Missing", "value": number, "color": "#f97316" },
    { "name": "Needs Improvement", "value": number, "color": "#f59e0b" },
    { "name": "Passed", "value": number, "color": "#10b981" }
  ],
  "strengths": [string],
  "weaknesses": [string],
  "recommendations": [string],
  "topRefusalRisks": [
    {
      "rank": number,
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "title": string,
      "file": string,
      "page": string,
      "rule": string,
      "impact": string,
      "quote": string
    }
  ],
  "criteriaScorecard": [
    {
      "id": "MC",
      "name": "Mandatory Criterion: Leadership / Emerging Leadership",
      "claimed": boolean,
      "verdict": "MET" | "NOT MET",
      "score": number,
      "piecesCount": number,
      "minimumRequired": 2,
      "primaryIssue": string
    },
    {
      "id": "OC1",
      "name": "Optional Criterion 1: Innovation / Significant IP",
      "claimed": boolean,
      "verdict": "MET" | "NOT MET" | "NOT CLAIMED",
      "score": number,
      "piecesCount": number,
      "minimumRequired": 2,
      "primaryIssue": string
    },
    {
      "id": "OC2",
      "name": "Optional Criterion 2: Work Outside Immediate Occupation",
      "claimed": boolean,
      "verdict": "MET" | "NOT MET" | "NOT CLAIMED",
      "score": number,
      "piecesCount": number,
      "minimumRequired": 2,
      "primaryIssue": string
    },
    {
      "id": "OC3",
      "name": "Optional Criterion 3: Significant Commercial / Technical Impact",
      "claimed": boolean,
      "verdict": "MET" | "NOT MET" | "NOT CLAIMED",
      "score": number,
      "piecesCount": number,
      "minimumRequired": 2,
      "primaryIssue": string
    },
    {
      "id": "OC4",
      "name": "Optional Criterion 4: Academic Research",
      "claimed": boolean,
      "verdict": "MET" | "NOT MET" | "NOT CLAIMED",
      "score": number,
      "piecesCount": number,
      "minimumRequired": 2,
      "primaryIssue": string
    }
  ],
  "evidenceMatrix": [
    {
      "id": number,
      "fileName": string,
      "category": string,
      "requirement": string,
      "strength": string,
      "confidence": "High" | "Medium" | "Low",
      "source": string,
      "status": "Passed" | "Critical" | "Needs Improvement" | "Missing",
      "attributable": boolean,
      "insideWindow": boolean,
      "metrics": string,
      "risk": string,
      "shows": string,
      "guidanceExampleMatch": string,
      "distinct": boolean,
      "verifiable": boolean,
      "thirdPartySource": boolean,
      "why": string
    }
  ]
}`;
}
