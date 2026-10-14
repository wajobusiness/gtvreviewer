import { AiAnalysisInput } from "./types";

export const SYSTEM_PROMPT = `You are the Lead Forensic Pre-Submission Assessor for the UK Global Talent Visa (Digital Technology route), operating under the official 2026 Tech Nation Guidelines and Home Office Appendix Global Talent Immigration Rules.

Your mission is HOSTILE-BUT-FAIR PRE-SUBMISSION AUDITING:
1. Act as an uncompromising caseworker examiner stress-testing the evidence.
2. Cross-examine every assertion, certificate, metric, date, pronoun, letterhead, and document attribution.
3. Detect Part 9 Grounds for Refusal risks (Part 9.7.1 - False Representation / Deception, third-party attribution, contradictory numbers).
4. Verify document caps: maximum 10 pieces of evidence (each max 3 A4 pages) + 3 standalone recommendation letters (each max 3 A4 pages) + CV (max 2 A4 pages) + Personal Statement (max 1000 words).
5. Verify Mandatory Criteria (MC: Leadership / Emerging Leadership) and Optional Criteria (at least 2 distinct criteria from OC1-OC4, minimum 2 pieces each).
6. Calculate a quantitative readiness score (0-100), estimated visa endorsement success probability (0-100%), identify all strengths, fatal defects, and remediation instructions.

You MUST return STRICT JSON adhering precisely to the specified schema with NO markdown wrapping or preamble.`;

export function buildAnalysisUserPrompt(input: AiAnalysisInput): string {
  const docsSummary = input.documents
    .map((doc, i) => {
      const excerpt = doc.contentText.slice(0, 3000);
      return `--- DOCUMENT #${i + 1}: ${doc.name} (Category: ${doc.category || "Unassigned"}, ~${doc.pageCount || 1} pages) ---\n${excerpt}\n`;
    })
    .join("\n\n");

  return `Candidate Name: ${input.candidateName}
Target Visa Route: ${input.visaRoute}
Target Field: ${input.targetField}
Applicant Profile: ${input.applicantType || "Technical / Business"}
Additional Instructions / Notes: ${input.additionalInstructions || "Standard pre-submission forensic audit."}

TOTAL DOCUMENTS SUBMITTED: ${input.documents.length}

${docsSummary}

Analyze all provided evidence against official Tech Nation 2026 guidelines and return a JSON object with this exact structure:
{
  "overallScore": number (0-100),
  "currentStatus": string (e.g. "READY TO SUBMIT", "BORDERLINE - REMEDIATION REQUIRED", "CRITICAL REFUSAL RISK"),
  "statusColor": "emerald" | "amber" | "red",
  "recommendation": string (Clear executive verdict),
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
  "strengths": [string, string, string],
  "weaknesses": [string, string, string],
  "recommendations": [string, string, string, string],
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
      "risk": string
    }
  ]
}`;
}

