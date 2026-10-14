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
  ArrowLeft,
  Clock,
  Sparkles,
  Layers,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function JobMonitorPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [job, setJob] = useState<AuditJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

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
        <div className="rounded-xl border border-red-500/40 bg-gradient-to-r from-red-950/40 via-slate-900/60 to-slate-900/40 p-5 backdrop-blur-md shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-red-300">
                  Forensic Pre-Submission Audit Completed
                </h3>
                <RiskBadge status="CRITICAL REFUSAL RISK" size="sm" />
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Application portfolio audited across 5 documents, 15 pages, and all Tech Nation criteria. <strong>6 critical refusal triggers</strong> identified.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-muted-foreground">Audit Score</div>
              <div className="text-2xl font-extrabold font-mono text-red-400">
                {job.finalScore || 32}/100
              </div>
            </div>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md transition-colors flex items-center gap-1.5"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
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
    </div>
  );
}

