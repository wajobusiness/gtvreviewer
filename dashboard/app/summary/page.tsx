"use client";

import React from "react";
import Link from "next/link";
import { ScoreGauge } from "@/components/ScoreGauge";
import { RiskBadge } from "@/components/RiskBadge";
import {
  Printer,
  Download,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  FileText,
  User,
  Calendar,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function ExecutiveSummaryPage() {
  const handlePrint = () => {
    window.print();
  };

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
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF</span>
          </button>

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
              <RiskBadge status="NOT READY - CRITICAL DECEPTION RISK" size="md" />
              <span className="text-xs font-mono text-slate-400">
                Endorsing Body: Tech Nation
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              UK Global Talent Visa Endorsement Audit
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
              <span>Candidate: <strong>Alex Taylor (Sample Candidate)</strong></span>
              <span>•</span>
              <span>Field: <strong>Digital Technology</strong></span>
              <span>•</span>
              <span>Route: <strong>Exceptional Talent / Promise</strong></span>
              <span>•</span>
              <span>Date: <strong>13 October 2026</strong></span>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center p-3 rounded-xl bg-slate-900/90 border border-slate-800 print:hidden">
            <ScoreGauge score={32} size={150} strokeWidth={10} label="Audit Score" />
          </div>
        </div>

        {/* Executive Verdict Callout */}
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-xs leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-red-300 uppercase tracking-wide">
            <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
            Definitive Recommendation: DO NOT SUBMIT IN PRESENT FORM
          </div>
          <p className="text-slate-300">
            The application portfolio in its current state contains <strong>six (6) critical refusal risks</strong>, including the submission of an international award certificate issued to another person, a 1,000x numerical contradiction in revenue records, production infrastructure operating on pirated billing software, and zero standalone recommendation letters. Submitting without remedying these defects carries acute risk of non-endorsement and an administrative deception review under UK Immigration Rules Part 9.7.1.
          </p>
        </div>

        {/* Top Strengths vs Weakest Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Top Strengths */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-emerald-400 uppercase tracking-wider text-xs">
              <CheckCircle className="w-4 h-4" />
              Core Portfolio Strengths
            </div>
            <ul className="space-y-2 text-slate-300 pl-4 list-disc leading-relaxed">
              <li>
                <strong>Verifiable Public Media:</strong> Genuine press citations across Techpoint Africa, TechCabal, and regional media validating software launches and ecosystem participation.
              </li>
              <li>
                <strong>Ecosystem Capacity & Mentorship:</strong> Documented leadership in community training workshops for over 5,000 youth and NYSC corps members.
              </li>
              <li>
                <strong>Clear Domain Expertise:</strong> Real-world technical capabilities in web hosting infrastructure, DNS routing, and automation scripting.
              </li>
              <li>
                <strong>Corporate Foundation:</strong> Valid corporate incorporation proof for CloudScale Technologies Ltd, establishing an active corporate vehicle.
              </li>
            </ul>
          </div>

          {/* Weakest Areas */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-red-400 uppercase tracking-wider text-xs">
              <AlertTriangle className="w-4 h-4" />
              Primary Evidentiary Deficits
            </div>
            <ul className="space-y-2 text-slate-300 pl-4 list-disc leading-relaxed">
              <li>
                <strong>Attribution & Identity:</strong> Primary award certificate issued to third party (co-author name) with conflicting pronoun captions.
              </li>
              <li>
                <strong>Numerical Credibility:</strong> Billing dashboard displays ₦2.26M revenue vs. self-asserted claims of over ₦2.2B and ₦5.3B.
              </li>
              <li>
                <strong>Software Piracy:</strong> Production billing system displays license registered to international warez group &quot;Unverified Crack Key&quot; expiring in 2099.
              </li>
              <li>
                <strong>Document Count Shortfall:</strong> Only 1 document submitted for OC2 and 1 for OC3 (Tech Nation guidance mandates a minimum of 2 distinct documents per criterion).
              </li>
            </ul>
          </div>
        </div>

        {/* 6 Critical Findings Table */}
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
                  <th className="py-2.5 px-4 font-semibold">Required Remediation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-red-400">Third-Party Certificate</td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">MC1, Page 1</td>
                  <td className="py-2.5 px-4 text-slate-300">Immigration Rules Part 9.7.1 (Deception)</td>
                  <td className="py-2.5 px-4 text-emerald-400">Purge immediately; replace with personal award.</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-red-400">1,000x Revenue Gap</td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">MC2, Page 2</td>
                  <td className="py-2.5 px-4 text-slate-300">Evidence Verifiability Standard</td>
                  <td className="py-2.5 px-4 text-emerald-400">Standardize text to audited bank accounts.</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-red-400">Cracked Billing License</td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">MC2, Page 2</td>
                  <td className="py-2.5 px-4 text-slate-300">Technical Leadership Standard</td>
                  <td className="py-2.5 px-4 text-emerald-400">Purchase genuine WHMCS license receipt.</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-amber-400">Template Contamination</td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">OC3A, Page 1</td>
                  <td className="py-2.5 px-4 text-slate-300">Personally-Authored Evidence</td>
                  <td className="py-2.5 px-4 text-emerald-400">Scrub all telemedicine copy from AI table.</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-amber-400">Document Count Shortfall</td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">OC2 & OC3</td>
                  <td className="py-2.5 px-4 text-slate-300">Min 2 Pieces Per Criterion</td>
                  <td className="py-2.5 px-4 text-emerald-400">Add 1 more distinct document for OC2 and OC3.</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-bold text-red-400">Missing Mandatory Files</td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">Folder Root</td>
                  <td className="py-2.5 px-4 text-slate-300">Appendix Global Talent Filing Rule</td>
                  <td className="py-2.5 px-4 text-emerald-400">Draft 3 letters, 2-page CV, & Personal Statement.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Strategy */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3 text-xs">
          <div className="font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            Step-by-Step Strategic Rectification Protocol
          </div>
          <ol className="list-decimal pl-5 space-y-1.5 text-slate-300 leading-relaxed">
            <li>
              <strong>Document Purge:</strong> Immediately remove the IESEG Business School certificate and all associated narrative referring to female pronouns.
            </li>
            <li>
              <strong>Financial Reconciliation:</strong> Engage an independent chartered accountant to prepare an official compilation report matching bank deposits to invoices for CloudScale Technologies Ltd.
            </li>
            <li>
              <strong>Regulatory Corroboration:</strong> Obtain certified FIRS tax receipts for the applicant&apos;s personal executive remuneration.
            </li>
            <li>
              <strong>Infrastructure Legitimacy:</strong> License all operational hosting and billing modules officially and provide legitimate vendor receipts.
            </li>
            <li>
              <strong>Standalone Letters:</strong> Commission three independent letters of recommendation from recognized C-suite tech leaders who have no financial or subordinate ties to the applicant.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

