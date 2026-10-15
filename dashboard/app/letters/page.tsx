import React from "react";
import Link from "next/link";
import { getAuditData } from "@/lib/reports";
import { MetricCard } from "@/components/MetricCard";
import { RiskBadge } from "@/components/RiskBadge";
import {
  FileCheck,
  ShieldAlert,
  AlertTriangle,
  UserX,
  FileText,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle,
} from "lucide-react";

import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function LetterForensicsPage({
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
  const { kpis, evidenceMatrix, topRefusalRisks, isEmpty } = audit;

  const isAuditEmpty = isEmpty || (kpis?.totalFilesAnalysed || 0) === 0;

  if (isAuditEmpty) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
              <FileCheck className="w-6 h-6 text-blue-400" />
              Recommendation & Reference Letter Forensics
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Forensic analysis of all recommendation, reference, and confirmation letters submitted in the application bundle.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center max-w-xl mx-auto my-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
            <FileCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Letters Analysed Yet</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upload your candidate&apos;s application bundle, including the 3 mandatory standalone letters of recommendation and any supplementary reference letters, to audit referee standing, sentiment metrics, and Tech Nation guideline alignment.
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

  const recLettersCount = kpis?.recommendationLetters || 0;
  const recLettersRequired = kpis?.recommendationLettersRequired || 3;
  const isLetterShortfall = recLettersCount < recLettersRequired;

  const letterEvidence = evidenceMatrix.filter(
    (e) =>
      e.category.toLowerCase().includes("letter") ||
      e.file.toLowerCase().includes("letter") ||
      e.category.toLowerCase().includes("recommendation")
  );

  const letterRisks = topRefusalRisks.filter(
    (r) =>
      r.title.toLowerCase().includes("letter") ||
      r.rule.toLowerCase().includes("letter") ||
      r.file.toLowerCase().includes("letter") ||
      r.impact.toLowerCase().includes("letter")
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-blue-400" />
            Recommendation & Reference Letter Forensics
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Forensic analysis of all recommendation, reference, and confirmation letters submitted in the application bundle.
          </p>
        </div>

        <Link
          href="/reports/letter-forensics"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>View Letter Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Structural Finding Alert */}
      {isLetterShortfall ? (
        <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-5 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-red-300 uppercase tracking-wide">
                Mandatory Structural Shortfall: {recLettersCount} / {recLettersRequired} Standalone Recommendation Letters Found
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tech Nation guidelines mandate <strong>three (3) standalone letters of recommendation</strong> from recognized leaders of established digital technology companies (each up to 3 sides of A4). Ensure three independent letters are included directly in the application bundle rather than compressed inside evidence pieces.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-5 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wide">
                Recommendation Letter Threshold Satisfied: {recLettersCount} / {recLettersRequired} Letters Detected
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The required number of standalone recommendation letters has been identified in the application bundle.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Standalone Letters"
          value={`${recLettersCount} / ${recLettersRequired}`}
          subtitle="Mandatory requirement"
          icon="UserX"
          variant={isLetterShortfall ? "danger" : "default"}
          badge={isLetterShortfall ? "SHORTFALL" : "SATISFIED"}
        />
        <MetricCard
          title="Letter Evidence Pieces"
          value={letterEvidence.length}
          subtitle="Mapped in matrix"
          icon="FileText"
          variant="default"
        />
        <MetricCard
          title="Referee Risk Flags"
          value={letterRisks.length}
          subtitle="Identified concerns"
          icon="AlertTriangle"
          variant={letterRisks.length > 0 ? "danger" : "default"}
        />
        <MetricCard
          title="Letter Compliance"
          value={recLettersCount >= 3 ? "100%" : `${Math.round((recLettersCount / 3) * 100)}%`}
          subtitle="Tech Nation standard"
          icon="TrendingUp"
          variant={recLettersCount >= 3 ? "default" : "warning"}
        />
      </div>

      {/* Forensic Breakdown / Statutory Requirements */}
      <div className="space-y-5">
        <h2 className="text-base font-bold text-foreground">
          Referee Qualification & Letter Standards Check
        </h2>

        {letterEvidence.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {letterEvidence.map((ev, idx) => (
              <div
                key={ev.id}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-400">
                        Letter #{idx + 1}
                      </span>
                      <h3 className="text-base font-bold text-foreground">
                        {ev.file}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Category: {ev.category}
                    </p>
                  </div>
                  <RiskBadge status={ev.status} size="sm" />
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono text-[11px]">
                    <span className="text-muted-foreground">Attribution:</span>
                    <span className={ev.attributable ? "text-emerald-400" : "text-red-400"}>
                      {ev.attributable ? "Verified to Applicant" : "Defective Attribution"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono text-[11px]">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="text-slate-300">{ev.confidence}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60 font-mono text-[11px]">
                    <span className="text-muted-foreground">Time Window:</span>
                    <span className={ev.insideWindow ? "text-emerald-400" : "text-amber-400"}>
                      {ev.insideWindow ? "Within 5-Year Window" : "Historical (> 5 Years)"}
                    </span>
                  </div>
                </div>

                {ev.risk && (
                  <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-[11px] font-mono text-red-300">
                    <strong>Finding:</strong> {ev.risk}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-400" />
              Tech Nation Official Letter Checklist & Compliance Rules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-blue-400 font-bold uppercase text-[11px]">1. Referee Standing</div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Referees must be recognized leaders (e.g. C-Suite, Founder, VP Engineering, Research Director) of established digital technology organizations of national or international standing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-purple-400 font-bold uppercase text-[11px]">2. Substantive Knowledge</div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  The referee must state how they know the applicant, detail their personal achievements, and explain why the applicant is a leader or emerging talent in digital technology.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-emerald-400 font-bold uppercase text-[11px]">3. Verification Evidence</div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Each letter must be signed, dated, include the referee&apos;s CV or LinkedIn link, and provide verifiable contact details for Home Office verification.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
