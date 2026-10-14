"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import {
  ShieldCheck,
  Server,
  Cpu,
  Database,
  Users,
  Activity,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Terminal,
  Key,
  Zap,
  FolderKanban,
  FileCheck2,
} from "lucide-react";
import { AuditJob } from "@/types/queue";

export default function AdminConsolePage() {
  const { user, organization } = useAuth();
  const [jobs, setJobs] = useState<AuditJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "queue" | "ai" | "tenants">("overview");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.jobs)) {
            setJobs(data.jobs);
          }
        }
      } catch (err) {
        console.warn("[Admin] Failed to load jobs:", err);
      } finally {
        setLoadingJobs(false);
      }
    }
    fetchJobs();
  }, []);

  const totalCompleted = jobs.filter((j) => j.status === "COMPLETED").length;
  const totalProcessing = jobs.filter((j) => j.status === "PROCESSING").length;
  const totalFailed = jobs.filter((j) => j.status === "FAILED").length;

  return (
    <div className="space-y-8 pb-16">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            System Administration & Telemetry Console
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Platform Operations & AI Health
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor background analysis pipelines, tenant allocations, API provider latency, and PostgreSQL database state.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Cluster Healthy
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "overview"
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> Platform Telemetry
        </button>

        <button
          onClick={() => setActiveTab("queue")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "queue"
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> AI Job Queue ({jobs.length})
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "ai"
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" /> AI Providers & Costs
        </button>

        <button
          onClick={() => setActiveTab("tenants")}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === "tenants"
              ? "bg-purple-600/20 text-purple-300 border border-purple-500/40"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Tenant Registry
        </button>
      </div>

      {/* Tab 1: Overview Telemetry */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex justify-between items-center text-slate-400 text-xs">
                <span>Total Candidate Audits</span>
                <FolderKanban className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white">{jobs.length}</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span>{totalCompleted} Completed</span> &bull; <span>{totalProcessing} Active</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex justify-between items-center text-slate-400 text-xs">
                <span>Database Engine</span>
                <Database className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white">Neon PostgreSQL</div>
              <div className="text-[11px] text-slate-400 font-mono">
                Serverless HTTPS &bull; US-East-1
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex justify-between items-center text-slate-400 text-xs">
                <span>Default AI Provider</span>
                <Cpu className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl font-bold text-white">Google Gemini 2.0</div>
              <div className="text-[11px] text-slate-400 font-mono">
                Fallback: Rule-Based Engine
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex justify-between items-center text-slate-400 text-xs">
                <span>Platform Role</span>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-white">{user.role}</div>
              <div className="text-[11px] text-slate-400 font-mono truncate">
                {user.email || "Active Superuser"}
              </div>
            </div>
          </div>

          {/* System Services Status */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Core Subsystem Health
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">PostgreSQL Connection</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Direct connection pool active via HTTPS serverless driver.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Asynchronous Job Worker</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  7-stage sequential pipeline running with event-driven notifications.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Cryptographic Sessions</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400">
                  PBKDF2-SHA512 password hashing & HMAC-SHA256 HTTP-only cookies.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Job Queue */}
      {activeTab === "queue" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Active & Historical Analysis Jobs</h3>
            <span className="text-xs text-slate-400 font-mono">{jobs.length} Total Registered Jobs</span>
          </div>

          {loadingJobs ? (
            <div className="p-8 text-center text-xs text-slate-500">Loading live job records...</div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 text-slate-400 text-xs">
              No analysis jobs have run yet. Submit evidence on the uploader to see live jobs here.
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Job ID</th>
                    <th className="p-3.5">Candidate / Route</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Score</th>
                    <th className="p-3.5">Created</th>
                    <th className="p-3.5 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-mono text-[11px] text-slate-300">{job.id}</td>
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{job.candidateName}</div>
                        <div className="text-[10px] text-slate-400">{job.visaRoute}</div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            job.status === "COMPLETED"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : job.status === "PROCESSING"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold font-mono">
                        {typeof job.finalScore === "number" ? `${job.finalScore}/100` : "—"}
                      </td>
                      <td className="p-3.5 text-slate-400 text-[11px]">
                        {new Date(job.createdAt).toLocaleTimeString()}
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          <span>Live Logs</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: AI Providers */}
      {activeTab === "ai" && (
        <div className="space-y-6 text-xs max-w-3xl">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-base font-bold text-white">Configured AI Providers</h3>
            <p className="text-slate-400">
              The platform executes inference through server-side environment credentials. Keys are never transmitted to client browsers.
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>Google Gemini 2.0 Flash</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
                      DEFAULT PROVIDER
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    1M token context &bull; High-speed multimodal OCR extraction &bull; ~$0.002/audit
                  </div>
                </div>
                <span className="text-emerald-400 font-bold font-mono">ACTIVE</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">OpenAI GPT-4o</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Structured JSON outputs &bull; Set OPENAI_API_KEY to activate
                  </div>
                </div>
                <span className="text-slate-500 font-mono">AVAILABLE</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Anthropic Claude 3.5 Sonnet</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Legal contradiction & deception analysis &bull; Set ANTHROPIC_API_KEY
                  </div>
                </div>
                <span className="text-slate-500 font-mono">AVAILABLE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Tenants */}
      {activeTab === "tenants" && (
        <div className="space-y-4 text-xs">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-4">
            <h3 className="text-base font-bold text-white">Current Workspace Tenant</h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{organization.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold font-mono">
                  {organization.tier} TIER
                </span>
              </div>
              <div className="text-slate-400 text-[11px] font-mono">
                Organization ID: {organization.id} &bull; Seats: {organization.seatsUsed} / {organization.seatsMax}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

