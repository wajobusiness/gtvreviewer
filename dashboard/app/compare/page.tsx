"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import {
  GitCompare,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  FileText,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Users,
  ChevronDown,
  Printer,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";

interface DefectResolution {
  id: string;
  rank: number;
  defectTitle: string;
  originalFinding: string;
  remediationAction: string;
  status: "RESOLVED" | "PERSISTENT" | "ATTENTION_NEEDED";
  verifiedDocument: string;
}

const defectResolutions: DefectResolution[] = [
  {
    id: "def-1",
    rank: 1,
    defectTitle: "Name & Pronoun Mismatch (Deception Ground Part 9.7.1)",
    originalFinding:
      "IESEG Certificate of Participation issued to third-party co-author with conflicting pronouns ('her contribution'), directly conflicting with applicant identity.",
    remediationAction:
      "Withdrawn third-party certificate. Replaced with primary degree certificate and official academic transcripts in applicant's verified legal name, authenticated by WES.",
    status: "RESOLVED",
    verifiedDocument: "MC1_Degree_Certificate_Authenticated.pdf",
  },
  {
    id: "def-2",
    rank: 2,
    defectTitle: "1,000x Financial Revenue Inflation (Material Misrepresentation)",
    originalFinding:
      "WHMCS billing screenshot showed ₦2,260,350 total gross earnings, whereas application text claimed ₦2,200,000,000 (1,000x discrepancy).",
    remediationAction:
      "Removed unverified screenshot. Substituted with 12 months audited corporate bank statements from Zenith Bank Plc and certified ICAN accountant audit report.",
    status: "RESOLVED",
    verifiedDocument: "MC2_Audited_Accounts_ZenithBank.pdf",
  },
  {
    id: "def-3",
    rank: 3,
    defectTitle: "Pirated WHMCS Billing License (Registered to Warez Group)",
    originalFinding:
      "License key in Evidence Document 2 registered to unverified warez group crack, exposing candidate to immediate character/integrity refusal.",
    remediationAction:
      "Purchased legitimate direct Enterprise Tier WHMCS license. Attached official WHMCS.com VAT invoice and digital cryptographic license certificate.",
    status: "RESOLVED",
    verifiedDocument: "MC3_WHMCS_Official_License_Invoice.pdf",
  },
  {
    id: "def-4",
    rank: 4,
    defectTitle: "Complete Absence of Mandatory Recommendation Letters",
    originalFinding:
      "Zero recommendation letters submitted. Paragraph 4 of Appendix Global Talent mandates exactly 3 letters from recognized digital technology leaders.",
    remediationAction:
      "Commissioned and included 3 compliant 2-page letters on corporate letterheads with full author credentials (UK Tech CEO, AI Research Director, Telecom VP).",
    status: "RESOLVED",
    verifiedDocument: "Letters_of_Recommendation_Pack_x3.pdf",
  },
  {
    id: "def-5",
    rank: 5,
    defectTitle: "Evidentiary Shortfall for Claimed Optional Criteria",
    originalFinding:
      "Only 1 document submitted for OC2 and 1 for OC3 (minimum 2 pieces required per claimed criterion under Tech Nation rules).",
    remediationAction:
      "Expanded portfolio to exactly 10 structured pieces: 3 for MC, 4 for OC2 (community leadership), and 3 for OC3 (significant commercial impact).",
    status: "RESOLVED",
    verifiedDocument: "OC2_Community_OC3_Impact_Evidence.pdf",
  },
  {
    id: "def-6",
    rank: 6,
    defectTitle: "Unsubstantiated Self-Authored Narratives",
    originalFinding:
      "Narrative contained extensive subjective claims regarding product adoption without independent secondary evidence or corroborating metrics.",
    remediationAction:
      "Integrated independent press verification from TechCabal, BusinessDay, and live analytics exports showing 45,000+ active enterprise users.",
    status: "RESOLVED",
    verifiedDocument: "OC2_Press_Coverage_Analytics_Pack.pdf",
  },
];

const comparativeRadarData = [
  {
    category: "Qualification",
    Run1: 45,
    Run2: 92,
    Benchmark: 85,
  },
  {
    category: "Recommendation Letters",
    Run1: 0,
    Run2: 95,
    Benchmark: 90,
  },
  {
    category: "Media Evidence",
    Run1: 48,
    Run2: 88,
    Benchmark: 80,
  },
  {
    category: "Leadership",
    Run1: 35,
    Run2: 89,
    Benchmark: 88,
  },
  {
    category: "Innovation",
    Run1: 28,
    Run2: 91,
    Benchmark: 85,
  },
  {
    category: "Recognition",
    Run1: 25,
    Run2: 84,
    Benchmark: 82,
  },
];

export default function ComparePage() {
  const { project, auditRuns } = useAuth();
  const [baseRunId, setBaseRunId] = useState<string>("run-001");
  const [targetRunId, setTargetRunId] = useState<string>("run-002");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "RESOLVED">("ALL");

  const filteredDefects =
    filterStatus === "ALL"
      ? defectResolutions
      : defectResolutions.filter((d) => d.status === filterStatus);

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
            <GitCompare className="w-4 h-4" />
            Audit Version Diff Engine
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Run Comparison & Remediation Delta
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Comparing initial hostile pre-submission audit against remediated submission draft for{" "}
            <span className="text-slate-200 font-semibold">{project.candidateName}</span>.
          </p>
        </div>

        {/* Run Selector Badges */}
        <div className="flex items-center gap-3">
          <Link
            href="/export"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-lg shadow-blue-500/20"
          >
            <FileCheck className="w-4 h-4" />
            Export Solicitor Bundle
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Diff
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-xs">
            A
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Baseline Run (Before)</div>
            <select
              value={baseRunId}
              onChange={(e) => setBaseRunId(e.target.value)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="run-001">Run #1 (13 Oct 2026) — Score: 32/100 [CRITICAL REFUSAL RISK]</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
            B
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Target Run (Remediated)</div>
            <select
              value={targetRunId}
              onChange={(e) => setTargetRunId(e.target.value)}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="run-002">Run #2 (14 Oct 2026) — Score: 84/100 [READY TO SUBMIT]</option>
            </select>
          </div>
        </div>
      </div>

      {/* Executive Delta Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Score Delta */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 relative overflow-hidden">
          <div className="text-xs font-mono text-emerald-400 font-semibold mb-1 flex items-center justify-between">
            <span>OVERALL SCORE</span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
              +52 pts ▲
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-slate-500 text-lg line-through font-mono">32</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <span className="text-3xl font-extrabold text-white font-mono">84</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] text-emerald-300 mt-2 font-medium">
            Shifted from Refusal Risk to Endorsement Threshold
          </div>
        </div>

        {/* Success Probability */}
        <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-5">
          <div className="text-xs font-mono text-blue-400 font-semibold mb-1 flex items-center justify-between">
            <span>VISA SUCCESS %</span>
            <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">
              +83.0% ▲
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-slate-500 text-lg line-through font-mono">4.0%</span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
            <span className="text-3xl font-extrabold text-white font-mono">87.0%</span>
          </div>
          <div className="text-[11px] text-blue-300 mt-2 font-medium">
            High statistical confidence of Tech Nation endorsement
          </div>
        </div>

        {/* Critical Refusal Defects */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5">
          <div className="text-xs font-mono text-emerald-400 font-semibold mb-1 flex items-center justify-between">
            <span>CRITICAL DEFECTS</span>
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
              -6 Fixed ▼
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-red-400 text-lg font-mono">6</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">0</span>
            <span className="text-xs text-emerald-300">Remaining</span>
          </div>
          <div className="text-[11px] text-emerald-300 mt-2 font-medium">
            Zero character, deception, or piracy flags remaining
          </div>
        </div>

        {/* Recommendation Letters */}
        <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-5">
          <div className="text-xs font-mono text-purple-400 font-semibold mb-1 flex items-center justify-between">
            <span>RECOMMENDATION LETTERS</span>
            <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold">
              +3 Added ▲
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-slate-500 text-lg line-through font-mono">0 / 3</span>
            <ArrowRight className="w-4 h-4 text-purple-400" />
            <span className="text-3xl font-extrabold text-white font-mono">3 / 3</span>
            <span className="text-xs text-purple-300">Complete</span>
          </div>
          <div className="text-[11px] text-purple-300 mt-2 font-medium">
            Full compliance with Appendix Global Talent Para 4
          </div>
        </div>
      </div>

      {/* Side-by-Side Radar Chart & Panel Consensus Shift */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Overlay */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Benchmark Competency Shift
              </h2>
              <p className="text-xs text-slate-400">
                Comparing Baseline Run 1 vs Remediated Run 2 vs Tech Nation Endorsement Benchmark
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                Run 1 (Baseline)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Run 2 (Remediated)
              </span>
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                Benchmark
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={comparativeRadarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="category" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <PolarRadiusAxis stroke="#475569" angle={30} domain={[0, 100]} />
                <Radar name="Run 1 (Baseline)" dataKey="Run1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                <Radar name="Run 2 (Remediated)" dataKey="Run2" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                <Radar name="Benchmark" dataKey="Benchmark" stroke="#3b82f6" fill="transparent" strokeDasharray="3 3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#1e293b",
                    borderRadius: "0.5rem",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel Consensus Shift */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-400" />
              5-Assessor Panel Consensus
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Simulated independent review before and after remedial evidence submission.
            </p>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-950/20">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-red-300">Run 1 Verdict (Baseline)</span>
                  <span className="font-mono text-red-400 font-bold">5 - 0 REJECT</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-full" />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Unanimous refusal consensus due to IESEG deception risk and financial contradiction.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-emerald-300">Run 2 Verdict (Remediated)</span>
                  <span className="font-mono text-emerald-400 font-bold">5 - 0 APPROVE</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full" />
                </div>
                <p className="text-[11px] text-slate-300 mt-2">
                  Unanimous endorsement consensus. All 5 assessors confirm criteria satisfied with zero remaining doubts.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Overall Panel Confidence:</span>
              <span className="text-emerald-400 font-mono font-bold">96% High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Defect Resolution Tracker */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Forensic Defect Resolution Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tracking remediation of all 6 critical issues detected during pre-submission audit.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === "ALL"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              All Defects (6)
            </button>
            <button
              onClick={() => setFilterStatus("RESOLVED")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === "RESOLVED"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Resolved (6)
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredDefects.map((defect) => (
            <div key={defect.id} className="p-5 hover:bg-slate-800/30 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs font-bold font-mono flex items-center justify-center border border-red-500/30">
                    #{defect.rank}
                  </span>
                  <h3 className="text-sm font-semibold text-white">{defect.defectTitle}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {defect.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
                <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/20">
                  <div className="text-[10px] font-mono text-red-400 uppercase font-semibold mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Hostile Audit Finding (Run 1)
                  </div>
                  <p className="text-slate-300 leading-relaxed">{defect.originalFinding}</p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Remediation Action & Verified Proof (Run 2)
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-2">{defect.remediationAction}</p>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-emerald-500/30 text-[10px] font-mono text-emerald-300">
                    <FileText className="w-3 h-3 text-emerald-400" />
                    {defect.verifiedDocument}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Criteria Shift Summary */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-base font-bold text-white mb-4">
          Tech Nation Criteria Coverage Shift
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
            <div className="text-slate-400 font-semibold mb-1">Mandatory Criterion (MC)</div>
            <div className="text-slate-300 text-xs mb-3">Recognition as a leading talent or potential leader</div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-red-400 font-mono line-through">NOT MET</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-mono font-bold">MET (3 Pieces)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
            <div className="text-slate-400 font-semibold mb-1">Optional Criterion 2 (OC2)</div>
            <div className="text-slate-300 text-xs mb-3">Recognition for activity outside day-to-day work</div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-red-400 font-mono line-through">DEFICIT (1 Piece)</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-mono font-bold">MET (4 Pieces)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
            <div className="text-slate-400 font-semibold mb-1">Optional Criterion 3 (OC3)</div>
            <div className="text-slate-300 text-xs mb-3">Significant commercial / technical contributions</div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-red-400 font-mono line-through">DEFICIT (1 Piece)</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-mono font-bold">MET (3 Pieces)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

