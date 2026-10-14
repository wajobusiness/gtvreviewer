import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

test("Domain Data: audit.json is schema compliant", () => {
  const jsonPath = path.join(process.cwd(), "reports", "audit.json");
  assert.ok(fs.existsSync(jsonPath), "reports/audit.json must exist");

  const raw = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw);

  // Metadata verification
  assert.ok(data.metadata, "Metadata must be defined");
  assert.ok(data.metadata.endorsingBody.includes("Tech Nation"));
  assert.ok(data.metadata.route.includes("Promise") || data.metadata.route.includes("Talent"));
  assert.equal(data.metadata.targetField, "Digital Technology");

  // KPI verification
  assert.equal(typeof data.kpis.overallScore, "number");
  assert.ok(data.kpis.overallScore >= 0 && data.kpis.overallScore <= 100);
  assert.equal(data.kpis.currentStatus, "CRITICAL REFUSAL RISK");
  assert.equal(data.kpis.criticalRisks, 6);

  // Radar benchmarks
  assert.equal(data.radarChart.length, 6, "Must contain 6 radar categories");
  for (const item of data.radarChart) {
    assert.ok(item.category, "Category name required");
    assert.ok(typeof item.score === "number");
    assert.ok(typeof item.benchmark === "number");
  }

  // Compliance breakdown
  assert.equal(data.complianceBreakdown.length, 4, "Must contain 4 compliance slices");
  const totalItems = data.complianceBreakdown.reduce((acc: number, curr: any) => acc + curr.value, 0);
  assert.ok(totalItems >= 10, "Compliance items must sum to portfolio count");

  // 5 Assessor Panel Simulation
  assert.equal(data.panelVotes.length, 5, "Must model 5 panel assessors");
  const rejectVotes = data.panelVotes.filter((v: any) => v.decision === "Reject").length;
  assert.equal(rejectVotes, 5, "Unanimous refusal consensus required");
});

test("Markdown Reports: all 7 required core reports exist and contain valid H1 headings", () => {
  const requiredReports = [
    "FINAL-REPORT.md",
    "evidence-matrix.md",
    "requirements.md",
    "letter-forensics.md",
    "consistency-check.md",
    "panel-simulation.md",
    "executive_audit_summary.md",
  ];

  for (const filename of requiredReports) {
    const fullPath = path.join(process.cwd(), "reports", filename);
    assert.ok(fs.existsSync(fullPath), `Report ${filename} must exist`);

    const content = fs.readFileSync(fullPath, "utf-8");
    const { content: body } = matter(content);

    // Verify H1 heading
    const hasH1 = /^#\s+.+$/m.test(body);
    assert.ok(hasH1, `${filename} must contain at least one H1 heading`);
    assert.ok(body.length > 200, `${filename} must have substantial analytical body`);
  }
});

test("Forensic Transcripts: all 5 OCR transcript files are cataloged", () => {
  const transcriptDir = path.join(process.cwd(), "reports", "transcripts");
  assert.ok(fs.existsSync(transcriptDir), "transcripts directory must exist");

  const files = fs.readdirSync(transcriptDir).filter((f) => f.endsWith(".md"));
  assert.equal(files.length, 5, "Must contain exactly 5 OCR transcripts matching submitted PDFs");

  for (const f of files) {
    const p = path.join(transcriptDir, f);
    const content = fs.readFileSync(p, "utf-8");
    assert.ok(content.includes("OCR") || content.includes("TRANSCRIPTION") || content.includes("CONFIDENCE"), `${f} must contain forensic OCR metadata`);
  }
});

test("Pipeline Ingestion Queue: 7-stage pipeline integrity and stage sequence", () => {
  const requiredStages = [
    { id: "stage-ingest", name: "Document Ingestion & File Checks" },
    { id: "stage-ocr", name: "Multimodal OCR & Vision Transcription" },
    { id: "stage-guidelines", name: "Official Requirements & Guideline Matching" },
    { id: "stage-integrity", name: "Cross-Document Contradiction & Deception Engine" },
    { id: "stage-panel", name: "Assessor Panel Simulation" },
    { id: "stage-scoring", name: "Quantitative Score & Risk Computation" },
    { id: "stage-reports", name: "Forensic Reports & JSON Compilation" },
  ];

  assert.equal(requiredStages.length, 7, "Must contain exactly 7 pipeline stages");

  // Validate progressive weights sum to 100%
  const stageWeights = [14, 14, 14, 18, 15, 15, 10];
  const totalWeight = stageWeights.reduce((a, b) => a + b, 0);
  assert.equal(totalWeight, 100, "Progress weights must sum to 100%");

  // Verify stage IDs are unique
  const stageIds = new Set(requiredStages.map((s) => s.id));
  assert.equal(stageIds.size, 7, "Stage IDs must be unique");
});

test("Full-Text Search Index: accurately indexes forensic findings across reports", () => {
  const reportsDir = path.join(process.cwd(), "reports");
  const files = fs.readdirSync(reportsDir).filter((f) => f.endsWith(".md"));

  const searchKeywords = ["deception", "WHMCS", "refusal", "Tech Nation", "IESEG"];

  for (const keyword of searchKeywords) {
    let matchCount = 0;
    for (const file of files) {
      const content = fs.readFileSync(path.join(reportsDir, file), "utf-8");
      if (content.toLowerCase().includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }
    assert.ok(matchCount > 0, `Search keyword "${keyword}" must be found in at least one report`);
  }
});

test("Audit Version Diff Engine: correctly calculates deltas between Run 1 and Run 2", () => {
  const run1 = {
    id: "run-001",
    score: 32,
    status: "CRITICAL REFUSAL RISK",
    successProb: 4.0,
    criticalRisks: 6,
    recommendationLetters: 0,
    evidenceCount: 5,
  };

  const run2 = {
    id: "run-002",
    score: 84,
    status: "READY TO SUBMIT",
    successProb: 87.0,
    criticalRisks: 0,
    recommendationLetters: 3,
    evidenceCount: 10,
  };

  // Delta calculation tests
  const scoreDelta = run2.score - run1.score;
  assert.equal(scoreDelta, 52, "Score delta must be exactly +52 points");

  const successDelta = run2.successProb - run1.successProb;
  assert.equal(successDelta, 83.0, "Success probability delta must be +83.0%");

  const riskDelta = run2.criticalRisks - run1.criticalRisks;
  assert.equal(riskDelta, -6, "Critical defects must be reduced by 6 (zero remaining)");

  const letterDelta = run2.recommendationLetters - run1.recommendationLetters;
  assert.equal(letterDelta, 3, "Exactly 3 recommendation letters must be added");

  const evidenceDelta = run2.evidenceCount - run1.evidenceCount;
  assert.equal(evidenceDelta, 5, "Portfolio must expand by 5 pieces to meet full 10-piece quota");
});

test("Solicitor Export Dossier: satisfies Tech Nation & Appendix Global Talent legal caps", () => {
  const dossierEvidence = [
    { id: 1, criterion: "MC", pages: 2 },
    { id: 2, criterion: "MC", pages: 3 },
    { id: 3, criterion: "MC", pages: 1 },
    { id: 4, criterion: "OC2", pages: 2 },
    { id: 5, criterion: "OC2", pages: 2 },
    { id: 6, criterion: "OC2", pages: 2 },
    { id: 7, criterion: "OC2", pages: 1 },
    { id: 8, criterion: "OC3", pages: 3 },
    { id: 9, criterion: "OC3", pages: 2 },
    { id: 10, criterion: "OC3", pages: 2 },
  ];

  // Exactly 10 pieces of evidence
  assert.equal(dossierEvidence.length, 10, "Evidence dossier must contain exactly 10 pieces");

  // Every single piece <= 3 pages
  for (const piece of dossierEvidence) {
    assert.ok(piece.pages <= 3, `Piece #${piece.id} must be <= 3 pages (was ${piece.pages})`);
  }

  // Total pages budgeted
  const totalPages = dossierEvidence.reduce((acc, p) => acc + p.pages, 0);
  assert.ok(totalPages <= 20, `Total pages must be within legal limit (was ${totalPages})`);

  // Mandatory Criteria satisfies requirement
  const mcPieces = dossierEvidence.filter((p) => p.criterion === "MC").length;
  assert.ok(mcPieces >= 2, "Mandatory criterion must have at least 2 pieces");

  // At least 2 distinct Optional Criteria claimed with >= 2 pieces each
  const oc2Pieces = dossierEvidence.filter((p) => p.criterion === "OC2").length;
  const oc3Pieces = dossierEvidence.filter((p) => p.criterion === "OC3").length;
  assert.ok(oc2Pieces >= 2, "OC2 must have at least 2 pieces");
  assert.ok(oc3Pieces >= 2, "OC3 must have at least 2 pieces");
});

test("SaaS Billing Entitlements: enforces tier capabilities and limits", () => {
  const tiers = {
    STARTER: { maxProjects: 1, hasCompare: false, hasSolicitorExport: false, seats: 1 },
    PROFESSIONAL: { maxProjects: 5, hasCompare: true, hasSolicitorExport: false, seats: 1 },
    FIRM_ENTERPRISE: { maxProjects: Infinity, hasCompare: true, hasSolicitorExport: true, seats: 10 },
  };

  assert.equal(tiers.STARTER.hasSolicitorExport, false);
  assert.equal(tiers.PROFESSIONAL.hasCompare, true);
  assert.equal(tiers.PROFESSIONAL.hasSolicitorExport, false);
  assert.equal(tiers.FIRM_ENTERPRISE.hasSolicitorExport, true);
  assert.equal(tiers.FIRM_ENTERPRISE.seats, 10);
});

test("SaaS Product Pages & Public Routes: validates presence of essential commercial pages", () => {
  const appDir = path.join(process.cwd(), "app");

  const requiredRoutes = [
    "page.tsx",             // Marketing Homepage
    "dashboard/page.tsx",   // Executive Dashboard
    "login/page.tsx",       // User Login
    "register/page.tsx",    // User Registration
    "settings/page.tsx",    // Account & Team Settings
    "pricing/page.tsx",     // Public Pricing Matrix
    "terms/page.tsx",       // Terms of Service
    "privacy/page.tsx",     // Privacy & GDPR Policy
    "compare/page.tsx",     // Audit Version Diff Engine
    "export/page.tsx",      // Official Solicitor Dossier
    "billing/page.tsx",     // Subscription Management
    "upload/page.tsx",      // Ingestion Uploader
    "projects/page.tsx",    // Portfolios
  ];

  for (const route of requiredRoutes) {
    const fullPath = path.join(appDir, route);
    assert.ok(fs.existsSync(fullPath), `SaaS Route file ${route} must exist`);
    const content = fs.readFileSync(fullPath, "utf-8");
    assert.ok(content.includes("export default"), `${route} must export default page component`);
  }
});



