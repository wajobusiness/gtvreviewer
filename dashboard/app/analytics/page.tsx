import React from "react";
import Link from "next/link";
import { getAuditData } from "@/lib/reports";
import { MetricCard } from "@/components/MetricCard";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Activity,
  ShieldAlert,
  FileText,
  Sparkles,
} from "lucide-react";

export default function AnalyticsPage() {
  const audit = getAuditData();
  const { kpis, radarChart, complianceBreakdown, panelVotes, isEmpty } = audit;

  const isAuditEmpty = isEmpty || (kpis?.totalFilesAnalysed || 0) === 0;

  if (isAuditEmpty) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              Audit Analytics & Quantitative Intelligence
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Statistical breakdown of application metrics, benchmark deviations, assessor confidence ratings, and report densities.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center max-w-xl mx-auto my-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Analytics Generated Yet</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upload candidate evidence documents to generate quantitative intelligence dashboards, criterion benchmarks, and assessor confidence curves.
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

  const categoryScores = radarChart && radarChart.length > 0
    ? radarChart.map((r) => ({ name: r.category, score: r.score, benchmark: r.benchmark }))
    : [
        { name: "Mandatory Criterion", score: kpis.overallScore, benchmark: 80 },
        { name: "Optional Criterion 2", score: Math.max(0, kpis.overallScore - 10), benchmark: 75 },
        { name: "Optional Criterion 3", score: Math.max(0, kpis.overallScore - 5), benchmark: 75 },
        { name: "Letters of Rec", score: kpis.recommendationLetters >= 3 ? 90 : 20, benchmark: 85 },
      ];

  const evidenceDistribution = complianceBreakdown && complianceBreakdown.length > 0
    ? complianceBreakdown
    : [
        { name: "Passed Verifications", value: Math.max(1, kpis.passes), color: "#10b981" },
        { name: "Critical Deficits", value: Math.max(0, kpis.criticalRisks), color: "#ef4444" },
        { name: "Warnings / Gaps", value: Math.max(0, kpis.warnings), color: "#f59e0b" },
      ];

  const panelConfidence = panelVotes && panelVotes.length > 0
    ? panelVotes.map((v) => ({ reviewer: v.reviewer, confidence: v.confidence, decision: v.decision }))
    : [];

  const isPassing = kpis.overallScore >= 70;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Audit Analytics & Quantitative Intelligence
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Statistical breakdown of application metrics, benchmark deviations, assessor confidence ratings, and report densities.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Audit Score"
          value={`${kpis.overallScore} / 100`}
          subtitle="Target: 70+"
          icon="Activity"
          variant={isPassing ? "success" : "danger"}
          badge={isPassing ? "PASSING" : "AT RISK"}
        />
        <MetricCard
          title="Endorsement Probability"
          value={`${kpis.estimatedVisaSuccess}%`}
          subtitle={isPassing ? "Strong alignment" : "Refusal risk"}
          icon={isPassing ? "TrendingUp" : "TrendingDown"}
          variant={isPassing ? "success" : "danger"}
        />
        <MetricCard
          title="Documents Analysed"
          value={kpis.totalFilesAnalysed}
          subtitle="Total verified files"
          icon="FileText"
          variant="default"
        />
        <MetricCard
          title="Critical Risk Flags"
          value={kpis.criticalRisks}
          subtitle="Refusal triggers"
          icon="ShieldAlert"
          variant={kpis.criticalRisks > 0 ? "danger" : "default"}
        />
      </div>

      {/* Delegated Client Component for Recharts */}
      <AnalyticsCharts
        categoryScores={categoryScores}
        evidenceDistribution={evidenceDistribution}
        panelConfidence={panelConfidence}
      />
    </div>
  );
}
