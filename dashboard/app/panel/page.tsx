import React from "react";
import Link from "next/link";
import { getAuditData } from "@/lib/reports";
import { ReviewerCard } from "@/components/ReviewerCard";
import { MetricCard } from "@/components/MetricCard";
import { RiskBadge } from "@/components/RiskBadge";
import {
  Users,
  ShieldAlert,
  ShieldCheck,
  XCircle,
  ArrowRight,
  AlertTriangle,
  Scale,
  Sparkles,
} from "lucide-react";

import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function PanelSimulationPage({
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
  const { panelVotes, kpis, topRefusalRisks, isEmpty } = audit;

  const isAuditEmpty = isEmpty || (kpis?.totalFilesAnalysed || 0) === 0 || !panelVotes || panelVotes.length === 0;

  if (isAuditEmpty) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
              <Users className="w-6 h-6 text-blue-400" />
              Independent Endorsement Panel Simulation
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Simulated independent assessments by 5 specialized Tech Nation assessors and immigration examiners.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center max-w-xl mx-auto my-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Panel Simulation Available</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upload your application documents to run an automated simulation of 5 independent Tech Nation assessors examining your evidence from casework, technical, commercial, legal, and academic viewpoints.
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

  const rejectVotes = panelVotes.filter((v) => v.decision === "Reject").length;
  const borderlineVotes = panelVotes.filter((v) => v.decision === "Borderline").length;
  const approveVotes = panelVotes.filter((v) => v.decision === "Approve").length;

  const isEndorsed = approveVotes >= 3;
  const isBorderline = !isEndorsed && (approveVotes + borderlineVotes >= 3);

  const primaryRiskTitle = topRefusalRisks[0]?.title || "Evidentiary deficiencies identified in application bundle";
  const primaryRiskRule = topRefusalRisks[0]?.rule || "Tech Nation Evidentiary Standard";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-400" />
            Independent Endorsement Panel Simulation
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Simulated independent assessments by 5 specialized Tech Nation assessors and immigration examiners.
          </p>
        </div>

        <Link
          href="/reports/panel-simulation"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>View Detailed Deliberations</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Assessors"
          value={panelVotes.length}
          subtitle="Expert panel"
          icon="Users"
          variant="default"
        />
        <MetricCard
          title="Refusal Votes"
          value={`${rejectVotes} / 5`}
          subtitle="Non-endorsement"
          icon="XCircle"
          variant={rejectVotes >= 3 ? "danger" : "default"}
          badge={rejectVotes >= 3 ? "REFUSAL CONSENSUS" : undefined}
        />
        <MetricCard
          title="Borderline Votes"
          value={`${borderlineVotes} / 5`}
          subtitle="Conditional pass"
          icon="AlertTriangle"
          variant="warning"
        />
        <MetricCard
          title="Approval Votes"
          value={`${approveVotes} / 5`}
          subtitle="Endorsement granted"
          icon="Scale"
          variant={approveVotes >= 3 ? "success" : "default"}
          badge={approveVotes >= 3 ? "ENDORSED" : undefined}
        />
      </div>

      {/* 5 Reviewer Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground">
          Simulated Panel Deliberations
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {panelVotes.map((vote, idx) => (
            <ReviewerCard key={vote.reviewer} vote={vote} index={idx} />
          ))}
        </div>
      </div>

      {/* Simulated Outcome Banner */}
      <div
        className={`rounded-xl border p-6 backdrop-blur-md shadow-xl space-y-4 ${
          isEndorsed
            ? "border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-900/40"
            : isBorderline
            ? "border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900/60 to-slate-900/40"
            : "border-red-500/40 bg-gradient-to-r from-red-950/40 via-slate-900/60 to-slate-900/40"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl border shrink-0 ${
              isEndorsed
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                : isBorderline
                ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                : "bg-red-500/20 border-red-500/30 text-red-400"
            }`}
          >
            {isEndorsed ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3
                className={`text-base font-bold uppercase tracking-wide ${
                  isEndorsed
                    ? "text-emerald-300"
                    : isBorderline
                    ? "text-amber-300"
                    : "text-red-300"
                }`}
              >
                Final Simulated Outcome:{" "}
                {isEndorsed
                  ? `Endorsement Recommended (${approveVotes}-5 Vote)`
                  : isBorderline
                  ? `Borderline Risk (${borderlineVotes} Borderline, ${approveVotes} Approve)`
                  : `Formal Refusal Risk (${rejectVotes}-5 Vote)`}
              </h3>
              <RiskBadge
                status={
                  isEndorsed
                    ? "ENDORSED"
                    : isBorderline
                    ? "BORDERLINE"
                    : "REFUSAL CERTAIN"
                }
                size="sm"
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              {isEndorsed
                ? `The simulated endorsement panel reached a positive consensus (${approveVotes}/5 in favor). The evidence demonstrates qualifying digital technology leadership and satisfies the required Mandatory and Optional Criteria.`
                : isBorderline
                ? `The simulated panel is divided with ${borderlineVotes} assessor(s) flagging conditional concerns. Evidence depth and third-party corroboration should be bolstered before formal submission to eliminate caseworker ambiguity.`
                : `A majority of simulated assessors (${rejectVotes}/5) reached a non-endorsement conclusion based on current evidence. Primary concerns center around evidentiary verifiability, document count thresholds, or criterion alignment.`}
            </p>

            {topRefusalRisks.length > 0 && (
              <div className="pt-2 text-xs font-mono text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <strong className="text-amber-400">Primary Evidentiary Concern:</strong> {primaryRiskTitle}{" "}
                <span className="text-slate-500">[{primaryRiskRule}]</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
