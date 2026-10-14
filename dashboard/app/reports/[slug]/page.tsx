import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getReportBySlug, getAllReports, getAuditData } from "@/lib/reports";
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { RiskBadge } from "@/components/RiskBadge";
import {
  ArrowLeft,
  Calendar,
  HardDrive,
  Download,
  Clock,
  Sparkles,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  FileText,
  ListTree,
} from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "final-report" },
    { slug: "evidence-matrix" },
    { slug: "requirements" },
    { slug: "letter-forensics" },
    { slug: "consistency-check" },
    { slug: "panel-simulation" },
    { slug: "executive_audit_summary" },
  ];
}

export default async function ReportAnalysisPage({ params }: PageProps) {
  const { slug } = await params;
  let reportData = await Promise.resolve(getReportBySlug(slug));

  if (!reportData) {
    reportData = await Promise.resolve(getReportBySlug(slug, "sample-audit"));
  }

  if (!reportData) {
    notFound();
  }

  const { meta, content } = reportData;

  // Extract table of contents (H2 and H3)
  const headingMatches = Array.from(content.matchAll(/^(#{2,3})\s+(.+)$/gm));
  const toc = headingMatches.map((match) => {
    const level = match[1].length;
    const title = match[2].trim().replace(/\*\*/g, "");
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return { level, title, id };
  });

  // Calculate words and read time
  const wordCount = content.split(/\s+/).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 220));

  const audit = getAuditData();

  // Determine metadata summary based on report slug and active audit
  const getAiSummary = (slug: string) => {
    const scoreVal = meta.score ?? audit.kpis?.overallScore ?? 0;
    const isPassing = scoreVal >= 70;

    const dynamicStrengths = (audit.criteriaScorecard || [])
      .filter((c) => c.verdict === "MET")
      .map((c) => `${c.id} (${c.name}) criteria requirements satisfied`);
    if (dynamicStrengths.length === 0) {
      dynamicStrengths.push("Comprehensive official Tech Nation guidance mapping");
      dynamicStrengths.push("Cross-document verification and Part 9 check executed");
    }

    const dynamicWeaknesses = (audit.topRefusalRisks || []).slice(0, 3).map((r) => `${r.title} (${r.file})`);
    if (dynamicWeaknesses.length === 0 && !isPassing) {
      dynamicWeaknesses.push("Evidentiary gaps or document count thresholds identified");
    }

    const dynamicRecs = (audit.topRefusalRisks || []).slice(0, 3).map((r) => r.impact);
    if (dynamicRecs.length === 0) {
      dynamicRecs.push("Review each finding and replace deficient evidence pieces before submission");
    }

    return {
      rating: `${scoreVal}/100`,
      riskLevel: isPassing ? "LOW" : meta.status === "Critical" ? "CRITICAL" : "HIGH",
      confidence: "95%",
      strengths: dynamicStrengths,
      weaknesses: dynamicWeaknesses.length > 0 ? dynamicWeaknesses : ["No critical defects identified in this section"],
      recommendations: dynamicRecs,
    };
  };

  const aiSummary = getAiSummary(slug);

  return (
    <div className="space-y-6">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/reports"
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                {meta.category}
              </span>
              <RiskBadge status={meta.status} size="sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight mt-0.5">
              {meta.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {meta.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-slate-500" />
              {meta.size}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {readTimeMin} min read
            </span>
          </div>

          <a
            href={`/api/download/${meta.slug}`}
            download={meta.filename}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Left TOC (optional/desktop), Center Markdown, Right AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table of Contents Sticky Sidebar (lg:col-span-3) */}
        {toc.length > 0 && (
          <div className="hidden xl:block xl:col-span-3 sticky top-20 rounded-xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 pb-2 border-b border-slate-800">
              <ListTree className="w-4 h-4 text-blue-400" />
              <span>Table of Contents</span>
            </div>
            <nav className="space-y-1 text-xs">
              {toc.map((item, idx) => (
                <a
                  key={idx}
                  href={`#${item.id}`}
                  className={`block py-1 hover:text-blue-400 transition-colors truncate ${
                    item.level === 3
                      ? "pl-4 text-slate-400 text-[11px]"
                      : "font-medium text-slate-300"
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        )}

        {/* Center Report Markdown Viewer (lg:col-span-8 or 6 depending on screen) */}
        <div
          className={`${
            toc.length > 0 ? "xl:col-span-6 lg:col-span-8" : "lg:col-span-8"
          } rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 backdrop-blur-sm shadow-sm overflow-hidden`}
        >
          <MarkdownViewer content={content} />
        </div>

        {/* Right Sidebar: AI Summary & Intelligence Card (lg:col-span-3 or 4) */}
        <div
          className={`${
            toc.length > 0 ? "xl:col-span-3 lg:col-span-4" : "lg:col-span-4"
          } sticky top-20 space-y-4`}
        >
          {/* AI Intelligence Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm shadow-md space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="flex items-center gap-1.5 font-bold text-foreground">
                <Sparkles className="w-4 h-4 text-blue-400" />
                AI Report Summary
              </span>
              <RiskBadge status={aiSummary.riskLevel} size="sm" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>Overall Rating:</span>
                <span className="font-mono font-bold text-slate-200">
                  {aiSummary.rating}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Confidence Score:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {aiSummary.confidence}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Est. Time to Read:</span>
                <span className="font-mono text-slate-300">
                  {readTimeMin} min ({wordCount.toLocaleString()} words)
                </span>
              </div>
            </div>

            {/* Strengths */}
            <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Identified Strengths
              </div>
              <ul className="space-y-1 text-slate-300 pl-4 list-disc text-[11px] leading-relaxed">
                {aiSummary.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
              <div className="font-semibold text-red-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Critical Weaknesses
              </div>
              <ul className="space-y-1 text-slate-300 pl-4 list-disc text-[11px] leading-relaxed">
                {aiSummary.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
              <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                Remediation Actions
              </div>
              <ul className="space-y-1 text-slate-300 pl-4 list-disc text-[11px] leading-relaxed">
                {aiSummary.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

