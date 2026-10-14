import React from "react";
import Link from "next/link";
import { getAuditData } from "@/lib/reports";
import { ReviewerCard } from "@/components/ReviewerCard";
import { MetricCard } from "@/components/MetricCard";
import { RiskBadge } from "@/components/RiskBadge";
import {
  Users,
  ShieldAlert,
  XCircle,
  FileText,
  ArrowRight,
  AlertTriangle,
  Scale,
} from "lucide-react";

export default function PanelSimulationPage() {
  const audit = getAuditData();
  const { panelVotes } = audit;

  const rejectVotes = panelVotes.filter((v) => v.decision === "Reject").length;
  const borderlineVotes = panelVotes.filter((v) => v.decision === "Borderline").length;
  const approveVotes = panelVotes.filter((v) => v.decision === "Approve").length;

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
          <span>View Simulated Refusal Notice</span>
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
          title="Refusal Consensus"
          value={`${rejectVotes} / 5`}
          subtitle="Unanimous refusal"
          icon="XCircle"
          variant="danger"
          badge="100% REJECT"
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
          variant="default"
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

      {/* Simulated Outcome & Warning Banner */}
      <div className="rounded-xl border border-red-500/40 bg-gradient-to-r from-red-950/40 via-slate-900/60 to-slate-900/40 p-6 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-red-300 uppercase tracking-wide">
                Final Simulated Outcome: Formal Refusal of Endorsement (0-5 Vote)
              </h3>
              <RiskBadge status="REFUSAL CERTAIN" size="sm" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              All five simulated assessors unanimously reached a non-endorsement conclusion. The Mandatory Criterion fails on attribution and verifiability (third-party certificate, cracked WHMCS script, and uncorroborated revenue). Optional Criteria 2 and 3 automatically fail the minimum document count threshold (only 1 document submitted for each, where guidance requires a minimum of 2 distinct documents).
            </p>

            <div className="pt-2 text-xs font-mono text-red-400/90 bg-red-950/40 p-3 rounded-lg border border-red-500/20">
              <strong>Immigration Deception Notice:</strong> Submitting File 1 (award certificate belonging to a third-party co-author) as proof of personal recognition will trigger Home Office document verification checks under Immigration Rules Part 9.7.1, exposing the applicant to an administrative refusal and a potential 10-year UK entry ban.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

