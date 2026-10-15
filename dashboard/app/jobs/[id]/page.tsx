"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AuditJob } from "@/types/queue";
import { RiskBadge } from "@/components/RiskBadge";
import {
  Play,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Terminal,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  Clock,
  Sparkles,
  Layers,
  FileText,
  Globe,
  ExternalLink,
  Table,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { cn } from "@/lib/utils";

export default function JobMonitorPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { updateProjectScore } = useAuth();

  const [job, setJob] = useState<AuditJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const updatedRef = useRef(false);

  useEffect(() => {
    if (job?.status === "COMPLETED" && job.finalScore !== undefined && !updatedRef.current) {
      updatedRef.current = true;
      updateProjectScore(job.projectId, job.finalScore, "ready_to_submit", job.resultRunId);
    }
  }, [job?.status, job?.finalScore, job?.projectId, job?.resultRunId, updateProjectScore]);

  // Connect to SSE stream
  useEffect(() => {
    if (!id) return;

    let eventSource: EventSource | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    try {
      eventSource = new EventSource(`/api/jobs/${id}/stream`);

      eventSource.onmessage = (event) => {
        try {
          const updatedJob = JSON.parse(event.data) as AuditJob;
          setJob(updatedJob);
        } catch (err) {
          console.error("Error parsing SSE job payload:", err);
        }
      };

      eventSource.onerror = () => {
        // Fallback to polling if SSE encounters an issue
        eventSource?.close();
        pollInterval = setInterval(async () => {
          try {
            const res = await fetch(`/api/jobs/${id}`);
            const data = await res.json();
            if (data.job) {
              setJob(data.job);
              if (data.job.status === "COMPLETED" || data.job.status === "FAILED") {
                if (pollInterval) clearInterval(pollInterval);
              }
            }
          } catch {}
        }, 1000);
      };
    } catch {
      setError("Failed to connect to job stream.");
    }

    return () => {
      eventSource?.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [id]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [job?.logs]);

  if (error) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-foreground">{error}</h2>
        <Link href="/projects" className="text-xs text-blue-400 font-semibold">
          Back to Candidates
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        <p className="text-xs text-muted-foreground font-mono">
          Connecting to live forensic pipeline...
        </p>
      </div>
    );
  }

  const isCompleted = job.status === "COMPLETED";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                Audit Execution Worker
              </span>
              <RiskBadge status={job.status} size="sm" />
              {job.sourceType === "GOOGLE_DRIVE" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Globe className="w-3 h-3" />
                  Public Google Drive Link
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight mt-0.5">
              Live Audit: {job.candidateName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>Job ID: {job.id.substring(0, 16)}...</span>
          {isCompleted && (
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>View Audit Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div
          className={`rounded-xl border ${
            (job.finalScore || 0) >= 70 ? "border-emerald-500/40 bg-gradient-to-r from-emerald-950/40" : "border-red-500/40 bg-gradient-to-r from-red-950/40"
          } via-slate-900/60 to-slate-900/40 p-5 backdrop-blur-md shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
        >
          <div className="flex items-start gap-3">
            {(job.finalScore || 0) >= 70 ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5 animate-pulse" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  Forensic Pre-Submission Audit Completed
                </h3>
                <RiskBadge status={job.finalStatus || "COMPLETED"} size="sm" />
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Candidate portfolio audited across all submitted evidence against official 2026 Tech Nation Guidelines and Part 9 Immigration Rules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-muted-foreground">Audit Score</div>
              <div
                className={`text-2xl font-extrabold font-mono ${
                  (job.finalScore || 0) >= 70 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {job.finalScore ?? 0}/100
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={job.resultRunId ? `/dashboard?runId=${job.resultRunId}&projectId=${job.projectId}` : "/dashboard"}
                onClick={() => {
                  try {
                    if (job.projectId) {
                      document.cookie = `gt_active_project_id=${encodeURIComponent(job.projectId)}; path=/; max-age=2592000; SameSite=Lax`;
                      localStorage.setItem("gt_active_proj", job.projectId);
                    }
                    if (job.resultRunId) {
                      document.cookie = `gt_active_run_id=${encodeURIComponent(job.resultRunId)}; path=/; max-age=2592000; SameSite=Lax`;
                    }
                  } catch {}
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>View Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={job.resultRunId ? `/reports?runId=${job.resultRunId}&projectId=${job.projectId}` : "/reports"}
                onClick={() => {
                  try {
                    if (job.projectId) {
                      document.cookie = `gt_active_project_id=${encodeURIComponent(job.projectId)}; path=/; max-age=2592000; SameSite=Lax`;
                      localStorage.setItem("gt_active_proj", job.projectId);
                    }
                    if (job.resultRunId) {
                      document.cookie = `gt_active_run_id=${encodeURIComponent(job.resultRunId)}; path=/; max-age=2592000; SameSite=Lax`;
                    }
                  } catch {}
                }}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Reports (7)</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-foreground flex items-center gap-2">
            {!isCompleted ? (
              <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>Pipeline Progression</span>
          </span>
          <span className="font-mono font-bold text-blue-400">
            {job.overallProgress}% Completed
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${job.overallProgress}%` }}
          />
        </div>
      </div>

      {/* Main Grid: Stages on Left, Terminal Logs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Stages List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Execution Stages (7 Stages)
          </h2>

          <div className="space-y-2.5">
            {job.stages.map((stage, idx) => {
              const isRunning = stage.status === "running";
              const isDone = stage.status === "completed";
              const isPending = stage.status === "pending";

              return (
                <div
                  key={stage.id}
                  className={cn(
                    "p-3.5 rounded-xl border backdrop-blur-sm transition-all flex items-start gap-3",
                    isRunning
                      ? "bg-blue-950/25 border-blue-500/50 shadow-sm shadow-blue-500/10"
                      : isDone
                      ? "bg-slate-900/60 border-slate-800"
                      : "bg-slate-900/20 border-slate-800/40 opacity-60"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 border",
                      isDone
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                        : isRunning
                        ? "bg-blue-500/15 border-blue-500/40 text-blue-400 animate-spin"
                        : "bg-slate-800 border-slate-700 text-slate-500"
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : isRunning ? (
                      <Loader2 className="w-3.5 h-3.5" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-foreground truncate">
                        {stage.name}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-mono uppercase font-bold",
                          isDone
                            ? "text-emerald-400"
                            : isRunning
                            ? "text-blue-400"
                            : "text-slate-500"
                        )}
                      >
                        {stage.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Terminal Logs Window (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col h-[480px]">
          {/* Terminal Header */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Pipeline Stream Logs</span>
            </div>
            <span className="text-[10px] text-slate-500">{job.logs.length} entries</span>
          </div>

          {/* Terminal Body */}
          <div className="flex-1 p-3.5 overflow-y-auto font-mono text-[11px] space-y-2">
            {job.logs.map((log, i) => {
              const time = log.timestamp.split("T")[1]?.slice(0, 8) || log.timestamp;
              return (
                <div key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-600 shrink-0 select-none">[{time}]</span>
                  <span
                    className={
                      log.level === "error"
                        ? "text-red-400 font-semibold"
                        : log.level === "warn"
                        ? "text-amber-400 font-medium"
                        : log.level === "success"
                        ? "text-emerald-400 font-semibold"
                        : "text-slate-300"
                    }
                  >
                    {log.message}
                  </span>
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>

          {/* Terminal Footer */}
          <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex justify-between items-center">
            <span>Status: {job.status}</span>
            <span>SSE Connected</span>
          </div>
        </div>
      </div>

      {/* Comprehensive Audit Findings & Actionable Remediation Section */}
      {isCompleted && (
        <div className="space-y-6 pt-4 border-t border-slate-800/80">
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span>Forensic Pre-Submission Audit Results & Remediation</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Detailed audit evaluation against official 2026 Tech Nation Guidelines and UKVI Part 9 Deception Rules.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                href={job.resultRunId ? `/dashboard?runId=${job.resultRunId}&projectId=${job.projectId}` : "/dashboard"}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all"
              >
                <span>Interactive Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={job.resultRunId ? `/reports?runId=${job.resultRunId}&projectId=${job.projectId}` : "/reports"}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>All 7 Reports</span>
              </Link>
            </div>
          </div>

          {/* 1. Executive Verdict Callout */}
          <div
            className={`p-5 rounded-xl border text-xs leading-relaxed space-y-2.5 ${
              (job.finalScore || 0) >= 70
                ? "border-emerald-500/30 bg-emerald-950/20 text-slate-200"
                : "border-red-500/30 bg-red-950/20 text-slate-200"
            }`}
          >
            <div
              className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${
                (job.finalScore || 0) >= 70 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {(job.finalScore || 0) >= 70 ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
              )}
              <span>
                Examiner Verdict:{" "}
                {job.analysisResult?.kpis?.recommendation ||
                  ((job.finalScore || 0) >= 70
                    ? "PORTFOLIO QUALIFIES FOR ENDORSEMENT"
                    : "CRITICAL DEFICITS FLAGGED — REMEDIATION MANDATORY")}
              </span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm">
              {(job.finalScore || 0) >= 70
                ? `Candidate portfolio scores ${job.finalScore}/100. Evaluated evidence fulfills statutory Tech Nation criteria with an estimated ${
                    job.analysisResult?.kpis?.estimatedVisaSuccess || 85
                  }% visa success rate.`
                : `Candidate portfolio scores ${job.finalScore}/100 with ${
                    job.analysisResult?.topRefusalRisks?.length || 1
                  } flagged risk trigger(s). Submitting without resolving these specific issues creates an acute risk of non-endorsement under Home Office guidelines.`}
            </p>
          </div>

          {/* 2. Side-by-Side: What is NOT Good vs What is Good */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* What is NOT Good (Refusal Risks & Evidentiary Deficits) */}
            <div className="rounded-xl border border-red-500/30 bg-slate-900/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wide">
                  <ShieldAlert className="w-4 h-4 text-red-400" />
                  <span>What Is NOT Good (Refusal Risks)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-mono font-bold">
                  {job.analysisResult?.topRefusalRisks?.length || 0} Issue(s)
                </span>
              </div>

              {(!job.analysisResult?.topRefusalRisks || job.analysisResult.topRefusalRisks.length === 0) ? (
                <p className="text-xs text-slate-400 italic">No critical refusal risks flagged in this submission.</p>
              ) : (
                <div className="space-y-3">
                  {job.analysisResult.topRefusalRisks.map((risk: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-red-500/20 bg-red-950/20 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-red-300 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 text-[10px] flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          {risk.title}
                        </span>
                        <RiskBadge status={risk.severity} size="sm" showDot={false} />
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{risk.impact}</p>
                      <div className="pt-1 flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400">
                        <span>Rule: <strong className="text-slate-300">{risk.rule}</strong></span>
                        {risk.file && <span>• File: <strong className="text-slate-300">{risk.file}</strong></span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* What is Good (Strengths & Criteria Satisfied) */}
            <div className="rounded-xl border border-emerald-500/30 bg-slate-900/60 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>What Is Good (Portfolio Strengths)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  Verified Compliant
                </span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 text-xs space-y-1.5">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Evidence Ingestion & Structure</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Successfully verified and cataloged candidate evidence documents across digital technology criteria.
                  </p>
                </div>

                {job.analysisResult?.criteriaScorecard
                  ?.filter((c: any) => c.verdict === "MET")
                  .map((c: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 text-xs space-y-1.5"
                    >
                      <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{c.id} ({c.name})</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        Statutory evidentiary standards satisfied with {c.piecesCount} qualifying piece(s) corroborated.
                      </p>
                    </div>
                  ))}

                {(job.analysisResult?.kpis?.recommendationLetters || 0) >= 3 && (
                  <div className="p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 text-xs space-y-1.5">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Recommendation Letters Quota Satisfied</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      3 required standalone letters of recommendation from recognized digital technology leaders cataloged.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Actionable Recommendations Protocol */}
          <div className="rounded-xl border border-blue-500/30 bg-slate-900/60 p-5 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-blue-400 uppercase tracking-wide text-xs">
              <Lightbulb className="w-4 h-4 text-blue-400" />
              <span>Prioritized Recommendations & Strategic Remediation Protocol</span>
            </div>
            <ol className="list-decimal pl-5 space-y-2 text-slate-300 leading-relaxed">
              <li>
                <strong>Page Budget Compliance:</strong> Ensure no submitted PDF or evidence piece exceeds the statutory 3 A4 page limit. Any overflow pages are disregarded by Tech Nation assessors.
              </li>
              <li>
                <strong>Mandatory Letters of Recommendation:</strong> Ensure exactly 3 standalone letters from verifiable C-suite / senior industry executives are included, accompanied by author CVs and organization credentials.
              </li>
              <li>
                <strong>Commercial Metric Corroboration:</strong> Reconcile all salary claims, product MRR/ARR metrics, and user growth statistics with third-party verifiable proofs (audited letters, contracts, or tax returns).
              </li>
              <li>
                <strong>Direct Attribution:</strong> Confirm the applicant is explicitly named as the primary lead on all awards, patents, open-source repositories, and technical contributions.
              </li>
            </ol>
          </div>

          {/* 4. Audited Evidence Items Breakdown Table */}
          {job.analysisResult?.evidenceMatrix && job.analysisResult.evidenceMatrix.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Table className="w-4 h-4 text-blue-400" />
                  <span>Audited Evidence Items Registry ({job.analysisResult.evidenceMatrix.length} Documents)</span>
                </h3>
                <span className="text-xs font-mono text-muted-foreground">
                  Official 2026 Tech Nation Guidelines Check
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-muted-foreground bg-slate-950/60">
                      <th className="py-2.5 px-3">File Name</th>
                      <th className="py-2.5 px-3">Assigned Criterion</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Findings / Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {job.analysisResult.evidenceMatrix.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-semibold text-slate-200">{item.fileName || item.file}</td>
                        <td className="py-2.5 px-3 text-slate-400">{item.category}</td>
                        <td className="py-2.5 px-3">
                          <RiskBadge
                            status={
                              item.status === "Passed"
                                ? "Passed"
                                : item.status === "Critical"
                                ? "Critical"
                                : "Warning"
                            }
                            size="sm"
                            showDot={false}
                          />
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">{item.risk || item.metrics}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

