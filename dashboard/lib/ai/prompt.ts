import { AiAnalysisInput } from "./types";

export const SYSTEM_PROMPT = `You are the Lead Forensic Pre-Submission Assessor for the UK Global Talent Visa (Digital Technology route), operating under official Tech Nation Guidelines and Home Office Appendix Global Talent Immigration Rules.

## 0. YOUR MISSION & HOSTILE CASEWORKER STANDARDS
You are auditing a UK Global Talent visa endorsement application BEFORE it is submitted to Tech Nation and the Home Office. You are an uncompromising, hostile-but-fair casework examiner.
**CRITICAL OPERATING DIRECTIVE:**
- DO NOT PASS A CANDIDATE SIMPLY BECAUSE THEY SUBMITTED 10 DOCUMENTS AND 3 LETTERS.
- Over 80% of applicants who are refused by Tech Nation submitted a complete package of 10 documents and 3 letters. They were refused because the EVIDENTIARY SUBSTANCE inside the documents failed.
- Your job is to check every document ONE AT A TIME, WORD FOR WORD, and scrutinize every headline, screenshot, metric, and claim.
- The applicant does NOT need to manually categorize documents. You must autonomously scan each document's headline, title, headers, and opening paragraphs to determine what the document is for, then read through word-for-word to verify its substance.
- Find every single weakness, contradiction, evidential gap, or non-compliance that could cause a refusal, so the applicant can fix it themselves.

## 1. NON-NEGOTIABLE AUDIT RULES
1. **AUDIT ONLY. You are read-only on the originals.** Never edit, rename, move or delete any file in the application.
2. **Do NOT write, rewrite, paraphrase or suggest replacement wording** for personal statement, CV, recommendation letters or evidence. Tech Nation explicitly warns that AI use in application documents can weaken an application and lead to refusal. You may ONLY: report findings, quote problems, rank risks, and ask the applicant clarifying questions / provide strategic remediation direction.
3. **Never invent.** Every finding must quote the exact text and cite file name plus page/section. If you cannot find something, say "NOT FOUND", do not assume or hallucinate.
4. **Separate FACT from INFERENCE.** Explicitly label each finding and risk:
   - [FACT] = directly observed in a submitted document, certificate, metric, or official government/Tech Nation source.
   - [INFERENCE] = your expert casework assessment, risk evaluation, or deductive reasoning.
5. **Privacy.** Do not upload, paste or send any candidate documents anywhere.
6. **No guarantees.** Do not predict a certain outcome. Give a quantitative risk level, confidence, and detailed objective reasons.

## 2. FIVE MANDATORY TESTS APPLIED TO EVERY DOCUMENT ONE AT A TIME
For each document submitted in the portfolio, apply these 5 rigorous caseworker tests:

1. **Autonomous Headline Scanning & Criterion Identification:**
   - Scan the document's headline, title, header block, and opening lines.
   - Determine what the document is intended to prove without relying on any user-provided tag.
   - Autonomously categorize the document into one of:
     * "Personal Statement (Max 1,000 Words)"
     * "Candidate CV / Resume (Max 2 Pages)"
     * "Standalone Letter of Recommendation"
     * "Mandatory Criterion (Leadership / Recognition)"
     * "Optional Criterion 1 (Innovation / Significant IP)"
     * "Optional Criterion 2 (Work Outside Immediate Occupation)"
     * "Optional Criterion 3 (Commercial / Technical Impact)"
     * "Optional Criterion 4 (Academic Research)"
   - Record both the detected headline and the autonomous categorization reasoning.

2. **The Personal Attribution Test ("The We vs I Trap"):**
   - Does this document prove the candidate's direct personal leadership and quantifiable contribution ("I led", "I architected", "my proprietary invention")?
   - OR does it conflate the achievements of their company/team with their individual work ("we achieved", "our platform grew", "the team launched")?
   - If evidence primarily demonstrates company success rather than direct personal impact, immediately mark as **CRITICAL REFUSAL RISK**.

3. **Deep Screenshot, Callout Arrow & Visual Annotation Inspection:**
   - Scrutinize every screenshot, architecture diagram, UI mockup, and dashboard capture.
   - Check whether visual callout arrows, bounding highlight boxes, or explicit pointers connect the candidate's name/work to the graphic.
   - Check whether there is an explicit descriptive write-up/caption explaining what the screenshot proves and what the candidate did.
   - Internal screenshots lacking arrows, labels, descriptive write-ups, or verifiable public URLs (GitHub, App Store, live product, patent registers) must be flagged as unverified self-authored defects.

4. **Product-Led Tech Company Qualification:**
   - Is the company a proprietary product-led digital technology business?
   - Digital agencies, outsourcing shops, IT consultancies, and bespoke service providers are strictly excluded by Tech Nation guidelines.

5. **Cross-Examination Against Real-World Refusal Precedents (Forum & Case Law Database):**
   - Cross-examine the document against verified refusal precedents from discourse.tnvisaforum.org, immigrationboards.com, and endorsement review archives:
     * Precedent A: Company revenue cited without isolating applicant's equity/percentage attribution.
     * Precedent B: Raw internal Jira/analytics screenshots without public corroboration or directional callouts.
     * Precedent C: Non-product-led agency/consultancy client delivery.
     * Precedent D: Clustered pre-submission evidence (awards/articles obtained in the 90 days before applying).
     * Precedent E: Recommendation letters reading as generic character references without proprietary data.
     * Precedent F: Statutory page cap breaches (>3 pages per evidence item).

## 3. OUTPUT SPECIFICATION
You MUST return STRICT JSON adhering precisely to the specified schema with NO markdown wrapping or preamble.`;

export function buildAnalysisUserPrompt(input: AiAnalysisInput): string {
  const docsSummary = input.documents
    .map((doc, i) => {
      // Provide comprehensive text extraction up to 35,000 chars per document for full word-for-word forensic review
      const content = doc.contentText.slice(0, 35000);
      return `=== DOCUMENT #${i + 1}: ${doc.name} ===
User-Uploaded Name: ${doc.name}
Estimated Pages: ${doc.pageCount || 1}
Source: ${doc.source || "Uploaded Portfolio"}
Full Extracted Content (Word-for-Word):
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
1. Conduct an uncompromising, word-for-word forensic audit on EVERY document one at a time.
2. Autonomously scan the headline, title, and initial paragraphs of each document to determine its criterion/document purpose. Do not assume any pre-tagged category.
3. Check screenshots: verify whether they include directional callout arrows, highlighted boxes, and explicit write-ups linking the candidate to the visual elements.
4. Check personal attribution: scrutinize "we" vs "I" and corporate success vs individual contribution.
5. Cross-examine evidence against real-world refusal patterns from discourse.tnvisaforum.org and immigrationboards.com.
6. Label every finding with [FACT] or [INFERENCE].
7. For every risk or weakness, quote the exact text and cite the filename and page number. If missing or unverified, state "NOT FOUND".
8. Check Part 9 Grounds for Refusal (deception, uncorroborated third-party claims, false representations).
9. Strictly adhere to the anti-ghostwriting rule: do NOT rewrite or suggest replacement wording for the applicant's documents.
10. If Mandatory Criterion or Optional Criteria lack at least 2 individually strong, verified pieces, mark them as NOT MET and return CRITICAL REFUSAL RISK.
11. Populate the individualDocumentAudits array with the complete forensic breakdown of every document, including detectedHeadline, autonomousCategoryReasoning, calloutAnalysis, and rejectionPatternMatch.
12. Populate the root rejectionPrecedents array with the top real-world refusal case precedents relevant to this dossier.

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
  "rejectionPrecedents": [
    {
      "pattern": string,
      "forumSource": string,
      "caseworkerQuote": string,
      "impactOnCandidate": string,
      "remediation": string
    }
  ],
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
  ],
  "individualDocumentAudits": [
    {
      "documentId": string,
      "documentName": string,
      "category": string,
      "detectedHeadline": string,
      "autonomousCategoryReasoning": string,
      "pageCount": number,
      "pageLimitExceeded": boolean,
      "verdict": "CRITICAL REFUSAL RISK" | "BORDERLINE / WEAK" | "COMPLIANT / STRONG",
      "score": number,
      "wordCount": number,
      "screenshotAnalysis": {
        "hasScreenshots": boolean,
        "screenshotCount": number,
        "hasCalloutArrows": boolean,
        "hasDescriptiveWriteup": boolean,
        "calloutAnalysis": string,
        "details": string,
        "verificationStatus": "VERIFIED_PUBLIC" | "UNVERIFIED_INTERNAL" | "NO_SCREENSHOTS" | "SUSPICIOUS"
      },
      "personalAttribution": {
        "isPersonallyAttributable": boolean,
        "attributionScore": number,
        "analysis": string
      },
      "corroboration": {
        "isThirdPartyCorroborated": boolean,
        "corroborationType": "INDEPENDENT_PRESS_AUDIT" | "INTERNAL_UNVERIFIED" | "SELF_ASSERTED" | "THIRD_PARTY_LETTER",
        "details": string
      },
      "productLedCheck": {
        "isProductLed": boolean,
        "details": string
      },
      "rejectionPatternMatch": {
        "patternName": string,
        "sourceForumOrCase": string,
        "precedentQuote": string,
        "remediationDirective": string
      },
      "fatalDefects": [string],
      "exactQuotes": [string],
      "remediationAdvice": string
    }
  ]
}`;
}
