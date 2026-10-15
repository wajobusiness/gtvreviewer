import React from "react";
import Link from "next/link";
import { getAuditData } from "@/lib/reports";
import { MetricCard } from "@/components/MetricCard";
import { RiskBadge } from "@/components/RiskBadge";
import {
  GitCompare,
  ShieldAlert,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  FileSpreadsheet,
  FileText,
  Sparkles,
} from "lucide-react";

import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function ConsistencyCheckPage({
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
  const { topRefusalRisks, kpis, isEmpty } = audit;

  const isAuditEmpty = isEmpty || (kpis?.totalFilesAnalysed || 0) === 0;

  if (isAuditEmpty) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
              <GitCompare className="w-6 h-6 text-blue-400" />
              Consistency & Integrity Cross-Verification
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Automated cross-document contradiction detection, template contamination tracing, and numerical integrity checks.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center max-w-xl mx-auto my-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
            <GitCompare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Consistency Checks Run Yet</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upload your application documents to run an automated cross-document audit checking for date mismatches, conflicting numerical claims, mismatched company entities, and template copy-paste errors.
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

  const criticalRisks = topRefusalRisks.filter((r) => r.severity === "CRITICAL").length;
  const highRisks = topRefusalRisks.filter((r) => r.severity === "HIGH").length;
  const mediumRisks = topRefusalRisks.filter((r) => r.severity === "MEDIUM" || r.severity === "LOW").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <GitCompare className="w-6 h-6 text-blue-400" />
            Consistency & Integrity Cross-Verification
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Automated cross-document contradiction detection, template contamination tracing, and numerical integrity checks.
          </p>
        </div>

        <Link
          href="/reports/consistency-check"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>View Consistency Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Findings"
          value={topRefusalRisks.length}
          subtitle="Identified risks"
          icon="GitCompare"
          variant={topRefusalRisks.length > 0 ? "danger" : "default"}
          badge={topRefusalRisks.length > 0 ? `${topRefusalRisks.length} FINDINGS` : "0 DEFECTS"}
        />
        <MetricCard
          title="Critical Risks"
          value={criticalRisks}
          subtitle="High refusal grounds"
          icon="ShieldAlert"
          variant={criticalRisks > 0 ? "danger" : "default"}
        />
        <MetricCard
          title="High Concerns"
          value={highRisks}
          subtitle="Verifiability gaps"
          icon="FileSpreadsheet"
          variant={highRisks > 0 ? "warning" : "default"}
        />
        <MetricCard
          title="Medium / Low"
          value={mediumRisks}
          subtitle="Secondary items"
          icon="AlertOctagon"
          variant="default"
        />
      </div>

      {/* Findings Matrix */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground">
          Forensic Integrity Findings & Evidence Locations
        </h2>

        {topRefusalRisks.length === 0 ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-6 text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-emerald-300">
              No Material Contradictions or Critical Defects Flagged
            </h3>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              The automated cross-document audit did not detect conflicting figures, entity discrepancies, or document integrity risks in the current submission bundle.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {topRefusalRisks.map((risk) => (
              <div
                key={risk.rank}
                className={`rounded-xl border p-4 sm:p-5 backdrop-blur-sm text-xs transition-all ${
                  risk.severity === "CRITICAL"
                    ? "bg-red-950/15 border-red-500/25 hover:border-red-500/40"
                    : risk.severity === "HIGH"
                    ? "bg-amber-950/15 border-amber-500/25 hover:border-amber-500/40"
                    : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold flex items-center justify-center text-[11px]">
                      #{risk.rank}
                    </span>
                    <h3 className="text-sm font-bold text-foreground">
                      {risk.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-muted-foreground">{risk.rule}</span>
                    <RiskBadge status={risk.severity} size="sm" />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-blue-400" />
                      Document Source & Location
                    </span>
                    <div className="font-mono text-slate-200 text-[11px]">{risk.file}</div>
                    <div className="text-slate-400 text-[11px]">Page / Section: {risk.page}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-semibold flex items-center gap-1.5">
                      <ShieldAlert className="w-3 h-3 text-red-400" />
                      Caseworker Impact Assessment
                    </span>
                    <div className="text-slate-300 text-[11px] leading-relaxed">{risk.impact}</div>
                  </div>
                </div>

                {/* Excerpt */}
                {risk.quote && (
                  <div className="mt-3 p-3 rounded-lg bg-slate-950/40 border border-slate-800/60 text-[11px] font-mono text-slate-400 italic">
                    &quot;{risk.quote}&quot;
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
