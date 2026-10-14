import React from "react";
import Link from "next/link";
import { getAuditData } from "@/lib/reports";
import { MetricCard } from "@/components/MetricCard";
import { ScoreGauge } from "@/components/ScoreGauge";
import { RadarChartComponent } from "@/components/RadarChartComponent";
import { CompliancePieChart } from "@/components/CompliancePieChart";
import { Timeline } from "@/components/Timeline";
import { ReportCard } from "@/components/ReportCard";
import { RiskBadge } from "@/components/RiskBadge";
import {
  ShieldAlert,
  AlertOctagon,
  FileText,
  FileCheck2,
  Newspaper,
  Trophy,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingDown,
  ArrowRight,
  User,
  Calendar,
  Layers,
  Award,
} from "lucide-react";

export default function ExecutiveDashboardPage() {
  const audit = getAuditData();
  const { metadata, kpis, radarChart, complianceBreakdown, timeline, topRefusalRisks, reports } = audit;

  return (
    <div className="space-y-8">
      {/* 1. Executive Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-950/30 via-slate-900/60 to-slate-900/40 p-6 backdrop-blur-md shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/40 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
                {kpis.currentStatus}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {metadata.endorsingBody} • {metadata.route}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {metadata.documentName}
            </h1>

            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              <strong className="text-red-400">Examiner Recommendation:</strong>{" "}
              {kpis.recommendation}. Immediate rectification required for third-party certificates, 1,000x numerical discrepancies, and pirated billing licenses prior to Home Office filing.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Owner: <strong className="text-slate-200">{metadata.documentOwner}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Audit Date: <strong className="text-slate-200">{metadata.auditDate}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                Applicant Route: <strong className="text-slate-200">{metadata.applicantType}</strong>
              </span>
            </div>
          </div>

          {/* Quick Probability Card */}
          <div className="shrink-0 rounded-xl border border-red-500/40 bg-red-950/40 p-5 flex flex-col items-center justify-center text-center min-w-[180px]">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Estimated Visa Success
            </span>
            <span className="text-4xl font-extrabold text-red-400 font-mono mt-1">
              {kpis.estimatedVisaSuccess}%
            </span>
            <span className="text-[11px] text-red-300/80 mt-1 font-mono">
              Unanimous Refusal Probability
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <span>Application Portfolio Metrics & Risk Indicators</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          <MetricCard
            title="Total Files"
            value={kpis.totalFilesAnalysed}
            subtitle="Analyzed via OCR"
            icon="FileText"
            variant="default"
            delay={0.02}
          />
          <MetricCard
            title="Total Pages"
            value={kpis.totalPages}
            subtitle="Across 5 documents"
            icon="Layers"
            variant="default"
            delay={0.04}
          />
          <MetricCard
            title="Evidence Pieces"
            value={kpis.evidenceCount}
            subtitle="Min 10 recommended"
            icon="FileCheck2"
            variant="warning"
            delay={0.06}
          />
          <MetricCard
            title="Rec Letters"
            value={`${kpis.recommendationLetters}/${kpis.recommendationLettersRequired}`}
            subtitle="3 mandatory missing"
            icon="FileText"
            variant="danger"
            badge="0 / 3"
            delay={0.08}
          />
          <MetricCard
            title="News Articles"
            value={kpis.newsArticles}
            subtitle="Press coverage items"
            icon="Newspaper"
            variant="default"
            delay={0.1}
          />
          <MetricCard
            title="Awards Claimed"
            value={kpis.awards}
            subtitle="1 critical misattribution"
            icon="Trophy"
            variant="danger"
            delay={0.12}
          />
          <MetricCard
            title="Media Evidence"
            value={kpis.mediaEvidence}
            subtitle="Screenshots & links"
            icon="ImageIcon"
            variant="default"
            delay={0.14}
          />
          <MetricCard
            title="Critical Risks"
            value={kpis.criticalRisks}
            subtitle="Fatal refusal triggers"
            icon="ShieldAlert"
            variant="danger"
            badge="ALERT"
            delay={0.16}
          />
          <MetricCard
            title="Minor Risks"
            value={kpis.minorRisks}
            subtitle="Structural fixes"
            icon="AlertOctagon"
            variant="warning"
            delay={0.18}
          />
          <MetricCard
            title="Warnings"
            value={kpis.warnings}
            subtitle="Adverse findings"
            icon="AlertTriangle"
            variant="warning"
            delay={0.2}
          />
          <MetricCard
            title="Passes"
            value={kpis.passes}
            subtitle="Criteria compliant"
            icon="CheckCircle2"
            variant="success"
            delay={0.22}
          />
          <MetricCard
            title="Audit Score"
            value={`${kpis.overallScore}/100`}
            subtitle="Threshold is 70+"
            icon="Award"
            variant="danger"
            delay={0.24}
          />
        </div>
      </div>

      {/* 3. Visual Charts Grid (Score Gauge, Radar Chart, Compliance Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Overall Score Gauge */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md flex flex-col items-center justify-between shadow-sm">
          <div className="w-full text-left">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Overall Audit Score
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Weighted forensic confidence rating (0-100)
            </p>
          </div>

          <div className="py-6">
            <ScoreGauge
              score={kpis.overallScore}
              label="Audit Score"
              sublabel="Severe Refusal Risk (< 40)"
              size={220}
            />
          </div>

          <div className="w-full pt-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
            <div className="flex justify-between items-center">
              <span>Threshold for Endorsement:</span>
              <span className="font-mono font-bold text-emerald-400">70+ / 100</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Current Score Gap:</span>
              <span className="font-mono font-bold text-red-400">-38 points</span>
            </div>
          </div>
        </div>

        {/* Large Success Probability Radar Chart */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-sm">
          <RadarChartComponent data={radarChart} />
        </div>

        {/* Compliance Breakdown Donut Chart */}
        <div className="lg:col-span-3 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-sm">
          <CompliancePieChart data={complianceBreakdown} />
        </div>
      </div>

      {/* 4. Audit Process Timeline */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-sm">
        <Timeline steps={timeline} />
      </div>

      {/* 5. Top 5 Urgent Refusal Risks Quick List */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Top Critical Refusal Risks Requiring Immediate Action
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Issues flagged that will trigger automatic non-endorsement or immigration deception checks
            </p>
          </div>
          <Link
            href="/reports/final-report"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            Full Report <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {topRefusalRisks.slice(0, 5).map((risk) => (
            <div
              key={risk.rank}
              className="p-3.5 rounded-lg border border-red-500/20 bg-red-950/15 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-semibold">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-mono text-[10px]">
                    #{risk.rank}
                  </span>
                  <span className="text-slate-200">{risk.title}</span>
                  <RiskBadge status={risk.severity} size="sm" showDot={false} />
                </div>
                <p className="text-slate-400 line-clamp-1">{risk.impact}</p>
                <div className="text-[11px] font-mono text-slate-500">
                  {risk.file} • {risk.page}
                </div>
              </div>

              <div className="shrink-0 font-mono text-[11px] text-red-400/90 bg-red-950/40 p-2 rounded border border-red-500/20 max-w-xs truncate">
                &quot;{risk.quote}&quot;
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Recent Audit Reports Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Generated Forensic Reports
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Dynamically scanned from the audit directory ({reports.length} reports available)
            </p>
          </div>
          <Link
            href="/reports"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            View All Reports <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report, idx) => (
            <ReportCard key={report.slug} report={report} delay={idx * 0.05} />
          ))}
        </div>
      </div>
    </div>
  );
}

