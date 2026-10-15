import React from "react";
import Link from "next/link";
import { getAuditData } from "@/lib/reports";
import { RiskBadge } from "@/components/RiskBadge";
import {
  BookOpen,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  FileText,
  AlertTriangle,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function RequirementsPage({
  searchParams,
}: {
  searchParams?: Promise<{ sample?: string; projectId?: string; runId?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const isSample = resolvedParams.sample === "true";
  let targetProjectId = isSample ? "sample-audit" : resolvedParams.projectId;
  let targetRunId = resolvedParams.runId;

  if (!isSample && !targetProjectId) {
    try {
      const cookieStore = await cookies();
      targetProjectId = cookieStore.get("gt_active_project_id")?.value;
      if (!targetRunId) {
        targetRunId = cookieStore.get("gt_active_run_id")?.value;
      }
    } catch {}
  }

  const audit = await getAuditData(targetProjectId, targetRunId);
  const { criteriaScorecard, evidenceMatrix, kpis, topRefusalRisks, isEmpty } = audit;

  const isAuditEmpty = isEmpty || (kpis?.totalFilesAnalysed || 0) === 0;

  if (isAuditEmpty) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-blue-400" />
              UK Global Talent Requirements & Coverage
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Verification status against official Tech Nation Immigration Rules (Mandatory + 2 Optional Criteria).
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center max-w-xl mx-auto my-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Requirements Evaluated Yet</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upload your candidate&apos;s evidentiary documents to benchmark your portfolio coverage across the Mandatory and Optional Criteria under the official Tech Nation guidelines.
          </p>
          <div className="pt-2">
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create New Analysis</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getRequirementDetails = (criterion: typeof criteriaScorecard[0]) => {
    const id = criterion.id;
    const relatedRisks = topRefusalRisks.filter((r) =>
      r.rule.toLowerCase().includes(id.toLowerCase()) ||
      r.title.toLowerCase().includes(id.toLowerCase()) ||
      (id === "MC" && (r.impact.toLowerCase().includes("mandatory") || r.file.toLowerCase().includes("mc"))) ||
      (id === "OC1" && r.file.toLowerCase().includes("oc1")) ||
      (id === "OC2" && r.file.toLowerCase().includes("oc2")) ||
      (id === "OC3" && r.file.toLowerCase().includes("oc3")) ||
      (id === "OC4" && r.file.toLowerCase().includes("oc4"))
    );

    const matched = evidenceMatrix.filter((e) =>
      e.category.toLowerCase().includes(id.toLowerCase()) ||
      (id === "MC" && e.category.toLowerCase().includes("mandatory")) ||
      (id === "OC1" && e.category.toLowerCase().includes("optional criterion 1")) ||
      (id === "OC2" && e.category.toLowerCase().includes("optional criterion 2")) ||
      (id === "OC3" && e.category.toLowerCase().includes("optional criterion 3")) ||
      (id === "OC4" && e.category.toLowerCase().includes("optional criterion 4"))
    );

    const coverage = criterion.score > 0
      ? criterion.score
      : criterion.verdict === "MET"
      ? 100
      : criterion.verdict === "BORDERLINE"
      ? 60
      : criterion.piecesCount > 0
      ? Math.min(60, Math.round((criterion.piecesCount / Math.max(1, criterion.minimumRequired)) * 50))
      : 0;

    const confidenceLabel =
      coverage >= 70
        ? `High (${coverage}%)`
        : coverage >= 40
        ? `Moderate (${coverage}%)`
        : `Deficient (${coverage}%)`;

    switch (id) {
      case "MC":
        return {
          guidance:
            "Applicant must demonstrate that they are recognised as a leading talent (Exceptional Talent) or emerging talent (Exceptional Promise) in the digital technology sector through continuous track record of innovation, leadership, or significant commercial impact.",
          matchedEvidence: matched,
          coverage,
          confidence: confidenceLabel,
          missingDocuments: relatedRisks.length > 0
            ? relatedRisks.map((r) => `${r.title} (${r.file})`)
            : [
                "Standalone reference letters from recognized C-level tech leaders",
                "Audited revenue / commercial metrics or salary verification",
                "Official recognition or sector awards in applicant's personal name",
              ],
          suggestions: criterion.primaryIssue
            ? [criterion.primaryIssue, "Verify all evidence directly attributes to the applicant's personal achievements."]
            : [
                "Ensure every metric is corroborated by verifiable third-party documentation.",
                "Verify referee standing and add independent corporate proofs.",
              ],
        };
      case "OC1":
        return {
          guidance:
            "Applicant has a proven track record of innovation as a founder or senior executive of a product-led digital technology company, or as an employee working on a new digital field or concept.",
          matchedEvidence: matched,
          coverage,
          confidence: confidenceLabel,
          missingDocuments: relatedRisks.length > 0
            ? relatedRisks.map((r) => `${r.title} (${r.file})`)
            : [
                "Evidence of proprietary IP, patents, or novel technical architectures",
                "Independent repository audits, technical benchmarks, or architecture diagrams",
              ],
          suggestions: criterion.primaryIssue
            ? [criterion.primaryIssue]
            : ["Provide verifiable documentation of proprietary innovations and technological novelties."],
        };
      case "OC2":
        return {
          guidance:
            "Applicant has made significant technical, commercial, or entrepreneurial contributions outside of their immediate occupation that have advanced the digital technology sector.",
          matchedEvidence: matched,
          coverage,
          confidence: confidenceLabel,
          missingDocuments: relatedRisks.length > 0
            ? relatedRisks.map((r) => `${r.title} (${r.file})`)
            : [
                "Minimum 2 distinct qualifying pieces of evidence (mandatory threshold)",
                "Documented open-source contributions, public technical talks, or community mentorship",
              ],
          suggestions: criterion.primaryIssue
            ? [criterion.primaryIssue, "Ensure minimum 2 distinct documents are submitted for this criterion."]
            : ["Submit at least 2 distinct qualifying pieces of evidence verifying sector impact."],
        };
      case "OC3":
        return {
          guidance:
            "Applicant has made significant commercial, technical, or entrepreneurial contributions to the digital technology sector as a founder or senior employee of a product-led digital technology company.",
          matchedEvidence: matched,
          coverage,
          confidence: confidenceLabel,
          missingDocuments: relatedRisks.length > 0
            ? relatedRisks.map((r) => `${r.title} (${r.file})`)
            : [
                "Minimum 2 distinct qualifying pieces of evidence (mandatory threshold)",
                "Audited financial statements, billing records, or customer contract metrics",
              ],
          suggestions: criterion.primaryIssue
            ? [criterion.primaryIssue, "Ensure all commercial metrics reconcile across consecutive documents."]
            : ["Submit 2 distinct documents demonstrating measurable commercial or technical growth."],
        };
      case "OC4":
        return {
          guidance:
            "Applicant has made substantial academic contributions to digital technology through research published in peer-reviewed journals or presented at major conferences.",
          matchedEvidence: matched,
          coverage,
          confidence: confidenceLabel,
          missingDocuments: relatedRisks.length > 0
            ? relatedRisks.map((r) => `${r.title} (${r.file})`)
            : [
                "Peer-reviewed research publications in recognized academic/industry venues",
                "Citation metrics or conference presentation confirmation",
              ],
          suggestions: ["Not applicable unless academic track is selected."],
        };
      default:
        return {
          guidance: "",
          matchedEvidence: matched,
          coverage,
          confidence: confidenceLabel,
          missingDocuments: [],
          suggestions: [],
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-400" />
            UK Global Talent Requirements & Coverage
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Verification status against official Tech Nation Immigration Rules (Mandatory + 2 Optional Criteria).
          </p>
        </div>

        <Link
          href="/reports/requirements"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>Official Requirements Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Requirement Cards */}
      <div className="space-y-6">
        {criteriaScorecard.map((criterion) => {
          const details = getRequirementDetails(criterion);
          const isClaimed = criterion.claimed;

          return (
            <div
              key={criterion.id}
              className={`rounded-xl border p-5 sm:p-6 backdrop-blur-md transition-all shadow-sm ${
                !isClaimed
                  ? "bg-slate-900/30 border-slate-800/60 opacity-70"
                  : criterion.verdict === "MET"
                  ? "bg-emerald-950/15 border-emerald-500/30"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-sm">
                    {criterion.id}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {criterion.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      Pieces Submitted: {criterion.piecesCount} (Minimum Required: {criterion.minimumRequired})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <RiskBadge status={criterion.verdict} size="md" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground">Criterion Coverage & Strength</span>
                  <span
                    className={
                      details.coverage >= 70
                        ? "text-emerald-400 font-bold"
                        : details.coverage >= 40
                        ? "text-amber-400 font-bold"
                        : "text-red-400 font-bold"
                    }
                  >
                    {details.coverage}% ({details.confidence})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      details.coverage >= 70
                        ? "bg-emerald-500"
                        : details.coverage >= 40
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${details.coverage}%` }}
                  />
                </div>
              </div>

              {/* Guidance snippet */}
              <p className="mt-3 text-xs text-slate-400 italic">
                &quot;{details.guidance}&quot;
              </p>

              {/* Examiner Primary Finding */}
              {criterion.primaryIssue && (
                <div className="mt-3 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-xs text-red-300 flex items-start gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-red-400">Examiner Finding:</strong>{" "}
                    {criterion.primaryIssue}
                  </div>
                </div>
              )}

              {/* Missing Documents & Suggestions Grid */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Missing documents */}
                <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-2">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5 uppercase text-[11px] tracking-wider text-red-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Missing Documents & Corroboration
                  </span>
                  <ul className="space-y-1.5 pl-4 list-disc text-slate-400">
                    {details.missingDocuments.map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                  </ul>
                </div>

                {/* Improvement Suggestions */}
                <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-2">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5 uppercase text-[11px] tracking-wider text-amber-400">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Actionable Improvement Strategy
                  </span>
                  <ul className="space-y-1.5 pl-4 list-disc text-slate-400">
                    {details.suggestions.map((sug, idx) => (
                      <li key={idx}>{sug}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Matched Documents */}
              {details.matchedEvidence.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground font-semibold">
                    Submitted Evidence Mapped:
                  </span>
                  <div className="mt-2 space-y-1.5">
                    {details.matchedEvidence.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800/60 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="text-slate-300 truncate font-mono text-[11px]">
                            {ev.file}
                          </span>
                        </div>
                        <RiskBadge status={ev.status} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
