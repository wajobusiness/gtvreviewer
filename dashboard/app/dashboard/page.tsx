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
  ArrowRight,
  User,
  Calendar,
  Layers,
  Award,
  Sparkles,
  UploadCloud,
  FolderOpen,
  Check,
  Lightbulb,
} from "lucide-react";

export default async function ExecutiveDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ sample?: string; projectId?: string; runId?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const isSample = resolvedParams.sample === "true";
  const audit = getAuditData(
    isSample ? "sample-audit" : resolvedParams.projectId,
    resolvedParams.runId
  );
  const { metadata, kpis, radarChart, complianceBreakdown, timeline, topRefusalRisks, reports = [] } = audit;

  const hasAnalysis = kpis.totalFilesAnalysed > 0 || kpis.overallScore > 0;

  // Production Empty State when user has no analysis completed yet
  if (!hasAnalysis) {
    return (
      <div className="space-y-8 py-4">
        {/* Empty State Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-900/40 p-8 backdrop-blur-md shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL 2026 TECH NATION & APPENDIX GLOBAL TALENT AUDITOR</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              AI Pre-Submission Forensic Workspace
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              No analysis yet. Upload your candidate documents or paste a public Google Drive folder link to stress-test your evidence against Part 9 deception rules and official Tech Nation guidelines.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Create New Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition-colors"
              >
                <span>Add Candidate Project</span>
              </Link>
              <Link
                href="/dashboard?sample=true"
                className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4 font-mono ml-auto"
              >
                Inspect Sample Audit Format &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <span>How to Run Your First Forensic Pre-Submission Audit</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold font-mono text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-white">Upload Candidate Evidence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add PDF, DOCX, or TXT evidence documents (max 10 pieces, max 3 pages each) or paste a public Google Drive link.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold font-mono text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-white">AI Multimodal Audit Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The engine cross-checks dates, letterheads, revenue metrics, third-party award certificates, and referee seniority.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm">
                3
              </div>
              <h3 className="text-base font-bold text-white">Actionable Score & 7 Reports</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive your 0-100 readiness score, 5-assessor consensus, and downloadable Markdown reports with line-by-line remediation.
              </p>
            </div>
          </div>
        </div>

        {/* Empty State Callout */}
        <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center space-y-3">
          <FolderOpen className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">Ready to audit a candidate portfolio?</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Once you submit documents on the upload screen, your real-time score gauge, criteria radar, and risk tables will appear here automatically.
          </p>
          <div className="pt-2">
            <Link
              href="/upload"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              <span>Go to Evidence Ingestion Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active Audit Dashboard View
  return (
    <div className="space-y-8">
      {isSample && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>You are viewing a demonstration sample report. This is not your real data.</span>
          </div>
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-semibold transition-colors text-center shrink-0"
          >
            Return to My Clean Workspace
          </Link>
        </div>
      )}

      {/* 1. Executive Banner */}
      <div className={`relative overflow-hidden rounded-2xl border ${kpis.overallScore >= 70 ? 'border-emerald-500/30 bg-gradient-to-r from-emerald-950/30' : 'border-red-500/30 bg-gradient-to-r from-red-950/30'} via-slate-900/60 to-slate-900/40 p-6 backdrop-blur-md shadow-xl`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-2.5 py-1 rounded-md ${kpis.overallScore >= 70 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-red-500/20 text-red-400 border-red-500/40'} border text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5`}>
                <ShieldAlert className="w-4 h-4 animate-pulse" />
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
              <strong className={kpis.overallScore >= 70 ? "text-emerald-400" : "text-red-400"}>Examiner Verdict:</strong>{" "}
              {kpis.recommendation}
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
          <div className={`shrink-0 rounded-xl border ${kpis.overallScore >= 70 ? 'border-emerald-500/40 bg-emerald-950/40' : 'border-red-500/40 bg-red-950/40'} p-5 flex flex-col items-center justify-center text-center min-w-[180px]`}>
            <span className={`text-xs font-bold uppercase tracking-wider ${kpis.overallScore >= 70 ? 'text-emerald-400' : 'text-red-400'}`}>
              Estimated Visa Success
            </span>
            <span className={`text-4xl font-extrabold ${kpis.overallScore >= 70 ? 'text-emerald-400' : 'text-red-400'} font-mono mt-1`}>
              {kpis.estimatedVisaSuccess}%
            </span>
            <span className="text-[11px] text-slate-300/80 mt-1 font-mono">
              Confidence: 95%
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
            subtitle="Across portfolio"
            icon="Layers"
            variant="default"
            delay={0.04}
          />
          <MetricCard
            title="Evidence Pieces"
            value={kpis.evidenceCount}
            subtitle="Max 10 statutory cap"
            icon="FileCheck2"
            variant={kpis.evidenceCount > 10 ? "danger" : "default"}
            delay={0.06}
          />
          <MetricCard
            title="Rec Letters"
            value={`${kpis.recommendationLetters}/${kpis.recommendationLettersRequired}`}
            subtitle="3 mandatory letters"
            icon="FileText"
            variant={kpis.recommendationLetters < 3 ? "danger" : "success"}
            badge={kpis.recommendationLetters < 3 ? "DEFICIT" : "MET"}
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
            title="Critical Risks"
            value={kpis.criticalRisks}
            subtitle="Fatal refusal triggers"
            icon="ShieldAlert"
            variant={kpis.criticalRisks > 0 ? "danger" : "success"}
            badge={kpis.criticalRisks > 0 ? "ALERT" : "CLEAR"}
            delay={0.16}
          />
        </div>
      </div>

      {/* 3. Visual Charts Grid */}
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
              sublabel={kpis.overallScore >= 70 ? "Endorsement Viable (70+)" : "Refusal Risk (< 70)"}
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
              <span className={`font-mono font-bold ${kpis.overallScore >= 70 ? 'text-emerald-400' : 'text-red-400'}`}>
                {kpis.overallScore >= 70 ? `+${kpis.overallScore - 70} points (Qualifying)` : `${kpis.overallScore - 70} points`}
              </span>
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
      {timeline.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-sm">
          <Timeline steps={timeline} />
        </div>
      )}

      {/* 5. Top Urgent Refusal Risks Quick List */}
      {topRefusalRisks.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                Critical Refusal Risks Requiring Remediation
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
            {topRefusalRisks.map((risk) => (
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
                    Rule: <strong className="text-slate-300">{risk.rule}</strong> • {risk.file} • Page {risk.page}
                  </div>
                </div>

                <div className="shrink-0 font-mono text-[11px] text-red-400/90 bg-red-950/40 p-2 rounded border border-red-500/20 max-w-xs truncate">
                  &quot;{risk.quote}&quot;
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5b. Prioritized Remediation Recommendations Card */}
      <div className="rounded-xl border border-blue-500/30 bg-slate-900/50 p-6 backdrop-blur-md shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-blue-400" />
              Strategic Remediation Recommendations & Roadmap
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Definitive corrective actions required to elevate your endorsement probability before Home Office submission
            </p>
          </div>
          <Link
            href="/summary"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            Executive Summary & Roadmap <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
            <div className="font-bold text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-mono">1</span>
              <span>Statutory Page Cap Compliance</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Ensure every submitted evidence piece (PDF, Word, or image scan) is trimmed to a strict maximum of 3 A4 pages. Caseworkers summarily disregard any pages exceeding this statutory threshold.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
            <div className="font-bold text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-mono">2</span>
              <span>Recommendation Letters Protocol</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Secure exactly 3 standalone letters from verifiable C-suite digital technology leaders. Each letter must detail how the referee knows you, author credentials, and verify your leadership achievements.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
            <div className="font-bold text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-mono">3</span>
              <span>Commercial & Metric Corroboration</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Every financial claim, revenue impact (ARR/MRR), or high salary metric must be supported by official third-party documentary evidence (tax returns, employment agreements, or audited accounts).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 space-y-2">
            <div className="font-bold text-foreground flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 text-xs flex items-center justify-center font-mono">4</span>
              <span>Attribution & Deception Safeguard</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Verify that team awards, press features, and patents explicitly cite the candidate by name. Tech Nation rejects collective organizational accomplishments unless individual contribution is proven.
            </p>
          </div>
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
              Available analytical reports for candidate dossier ({reports.length} reports)
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
