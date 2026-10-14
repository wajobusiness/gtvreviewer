import React from "react";
import Link from "next/link";
import { getAuditData } from "@/lib/reports";
import { ScoreGauge } from "@/components/ScoreGauge";
import { RiskBadge } from "@/components/RiskBadge";
import { PrintButton } from "@/components/PrintButton";
import {
  Download,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Sparkles,
} from "lucide-react";

export default function ExecutiveSummaryPage() {
  const auditData = getAuditData();

  const isAuditEmpty = !auditData || auditData.isEmpty || (auditData.kpis?.totalFilesAnalysed || 0) === 0;

  if (isAuditEmpty) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 text-blue-400" />
              Executive Pre-Submission Audit Summary
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Official forensic pre-submission assessment report for UK Global Talent visa endorsement application.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center max-w-xl mx-auto my-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">No Executive Summary Available</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upload your candidate&apos;s evidentiary documents to generate an executive-level pre-submission audit summary complete with benchmark scoring, risk matrices, and a strategic remediation roadmap.
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

  const { metadata, kpis, topRefusalRisks, criteriaScorecard } = auditData;
  const isPassing = kpis.overallScore >= 70;

  const passedCriteria = criteriaScorecard.filter((c) => c.verdict === "MET");
  const failedCriteria = criteriaScorecard.filter((c) => c.claimed && c.verdict === "NOT MET");

  return (
    <div className="space-y-8 max-w-5xl mx-auto print:max-w-none print:p-0">
      {/* Action / Print Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            Executive Pre-Submission Audit Summary
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Official forensic pre-submission assessment report for UK Global Talent visa endorsement application.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <PrintButton />

          <a
            href="/api/download/executive_audit_summary"
            download="executive_audit_summary.md"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download MD</span>
          </a>
        </div>
      </div>

      {/* Main Executive Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-8 print:border-none print:bg-white print:text-black">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <RiskBadge status={kpis.currentStatus} size="md" />
              <span className="text-xs font-mono text-slate-400">
                Endorsing Body: {metadata.endorsingBody || "Tech Nation"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              UK Global Talent Visa Endorsement Audit
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span>Candidate: <strong>{metadata.documentOwner || metadata.candidateName || "Applicant"}</strong></span>
              <span>•</span>
              <span>Field: <strong>{metadata.targetField || "Digital Technology"}</strong></span>
              <span>•</span>
              <span>Route: <strong>{metadata.route || "Exceptional Talent / Promise"}</strong></span>
              <span>•</span>
              <span>Date: <strong>{metadata.auditDate || new Date().toLocaleDateString()}</strong></span>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center p-3 rounded-xl bg-slate-900/90 border border-slate-800 print:hidden">
            <ScoreGauge score={kpis.overallScore} size={150} strokeWidth={10} label="Audit Score" />
          </div>
        </div>

        {/* Executive Verdict Callout */}
        <div
          className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
            isPassing
              ? "border-emerald-500/30 bg-emerald-950/20"
              : "border-red-500/30 bg-red-950/20"
          }`}
        >
          <div
            className={`flex items-center gap-2 text-sm font-bold uppercase tracking-wide ${
              isPassing ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {isPassing ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
            )}
            Definitive Recommendation: {kpis.recommendation}
          </div>
          <p className="text-slate-300">
            {isPassing
              ? `The portfolio demonstrates robust evidentiary alignment with the UK Global Talent criteria. Current score stands at ${kpis.overallScore}/100 with strong corroboration across claimed criteria.`
              : `The application portfolio in its current state contains ${topRefusalRisks.length} identified refusal risks. Submitting without remedying these evidentiary deficiencies carries acute risk of non-endorsement under the official Tech Nation guidelines.`}
          </p>
        </div>

        {/* Strengths vs Weakest Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Top Strengths */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-400 uppercase tracking-wider text-xs">
              <CheckCircle className="w-4 h-4" />
              Core Portfolio Strengths
            </div>
            <ul className="space-y-2 text-slate-300 pl-4 list-disc leading-relaxed">
              {passedCriteria.length > 0 ? (
                passedCriteria.map((c) => (
                  <li key={c.id}>
                    <strong>{c.id} ({c.name}):</strong> Satisfies Tech Nation evidentiary criteria with {c.piecesCount} qualifying piece(s).
                  </li>
                ))
              ) : (
                <>
                  <li><strong>Technical Discipline:</strong> Active technical specialization aligned to the UK digital technology sector.</li>
                  <li><strong>Document Submission:</strong> {kpis.totalFilesAnalysed} evidence piece(s) cataloged and verified by automated OCR extraction.</li>
                </>
              )}
            </ul>
          </div>

          {/* Weakest Areas */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-red-400 uppercase tracking-wider text-xs">
              <AlertTriangle className="w-4 h-4" />
              Primary Evidentiary Deficits
            </div>
            <ul className="space-y-2 text-slate-300 pl-4 list-disc leading-relaxed">
              {topRefusalRisks.length > 0 ? (
                topRefusalRisks.slice(0, 4).map((risk) => (
                  <li key={risk.rank}>
                    <strong>{risk.title}:</strong> {risk.impact}
                  </li>
                ))
              ) : (
                <li>No critical deficits identified in the current evidence bundle.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Critical Findings Table */}
        {topRefusalRisks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Summary of Critical Findings & Remediation Roadmap
            </h3>

            <div className="rounded-xl border border-slate-800 overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 text-muted-foreground uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <th className="py-2.5 px-4 font-semibold">Defect</th>
                    <th className="py-2.5 px-4 font-semibold">Document Location</th>
                    <th className="py-2.5 px-4 font-semibold">Rule Violated</th>
                    <th className="py-2.5 px-4 font-semibold">Impact Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {topRefusalRisks.map((risk) => (
                    <tr key={risk.rank} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-bold text-red-400">{risk.title}</td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">{risk.file}</td>
                      <td className="py-2.5 px-4 text-slate-300">{risk.rule}</td>
                      <td className="py-2.5 px-4 text-slate-400 text-[11px]">{risk.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Strategy */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3 text-xs">
          <div className="font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            Step-by-Step Strategic Rectification Protocol
          </div>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-300 leading-relaxed">
            <li>
              <strong>Evidentiary Attribution:</strong> Verify that every award, certificate, publication, and press feature explicitly names the applicant as the primary beneficiary or contributor.
            </li>
            <li>
              <strong>Document Count Verification:</strong> Ensure a minimum of 2 distinct qualifying pieces of evidence are submitted for each claimed Optional Criterion.
            </li>
            <li>
              <strong>Financial & Metric Corroboration:</strong> Reconcile all revenue, commercial metrics, and compensation figures with third-party verifiable proofs (audited statements, tax receipts, bank letters).
            </li>
            <li>
              <strong>Qualifying Recommendation Letters:</strong> Ensure three standalone recommendation letters from recognized C-level digital technology leaders are included with referee credentials.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
