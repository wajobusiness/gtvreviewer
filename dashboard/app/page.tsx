"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileCheck2,
  Sparkles,
  Users,
  Scale,
  FileText,
  TrendingUp,
  Cpu,
  Lock,
  ChevronDown,
  Building2,
  Award,
  Zap,
} from "lucide-react";

export default function MarketingHomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "Does Tech Nation allow the use of AI in Global Talent visa applications?",
      a: "Yes, for pre-submission auditing, consistency checking, and formatting verification. Tech Nation strictly prohibits AI-generated ghostwriting or fabricating evidence text. GTV Reviewer is strictly an audit and cross-examination tool—it never rewrites your evidence; it stress-tests your claims like a hostile Home Office caseworker so you can fix weaknesses yourself.",
    },
    {
      q: "How does GTV Reviewer detect deception risks and grounds for refusal?",
      a: "Our engine executes forensic multimodal OCR and cross-document entity extraction. It cross-examines names, pronouns, certificate issuers, corporate bank statements, software licenses, and dates. If your narrative claims ₦2.2B but your screenshot shows ₦2.2M, or if a certificate contains misattributed pronouns, GTV Reviewer flags the exact line and rule under Part 9 of the Immigration Rules.",
    },
    {
      q: "Are my confidential evidence documents uploaded or stored?",
      a: "No. GTV Reviewer is built with privacy-by-design. Your evidence is audited locally or in your dedicated isolated tenant database. Raw PDFs are strictly excluded from version control and public networks.",
    },
    {
      q: "Can UK immigration law firms use this platform for client portfolios?",
      a: "Yes. Our Firm Enterprise tier is specifically architected for SRA-regulated immigration law firms and visa consultancies. It includes multi-seat solicitor access, unlimited candidate portfolios, white-label PDF dossiers (/export), and version diff tracking.",
    },
  ];

  return (
    <div className="space-y-24 py-12 lg:py-16">
      {/* 1. HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OFFICIAL 2026 TECH NATION GUIDELINES & APPENDIX GLOBAL TALENT</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
          Guarantee Your UK Global Talent Visa{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            Before You Submit.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          The hostile-but-fair AI pre-submission audit engine that stress-tests your Digital Technology endorsement application. We catch fatal numerical contradictions, Part 9 deception risks, and evidence deficits before Home Office caseworkers see them.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group"
          >
            Start Free Pre-Submission Check
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-colors flex items-center justify-center gap-2"
          >
            Explore Live Audit Demo
          </Link>
        </div>

        {/* Micro Social Proof */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> 100% Privacy Protected
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> SRA Law Firm Compatible
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Scale className="w-4 h-4 text-purple-400" /> 5-Assessor Consensus Simulation
          </span>
        </div>
      </section>

      {/* 2. INTERACTIVE BEFORE / AFTER LIVE AUDIT PREVIEW */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                Live Audit Transformation Engine
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                How GTV Reviewer Turns a Refusal into an Endorsement
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all shrink-0"
            >
              Open Full Interactive Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Run 1: Baseline Hostile Audit */}
            <div className="p-6 rounded-xl border border-red-500/30 bg-red-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  RUN 1: INITIAL HOSTILE AUDIT
                </span>
                <span className="text-xs font-mono font-bold text-red-400">32 / 100</span>
              </div>

              <div>
                <div className="text-lg font-bold text-white">CRITICAL REFUSAL RISK</div>
                <div className="text-xs text-red-400 font-mono mt-0.5">Estimated Success: 4.0%</div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2 text-red-300">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Part 9 Deception:</strong> Female pronouns & wrong name on IESEG award.</span>
                </div>
                <div className="flex items-start gap-2 text-red-300">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>1,000x Misrepresentation:</strong> ₦2.2M screenshot vs ₦2.2B text.</span>
                </div>
                <div className="flex items-start gap-2 text-red-300">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Character Risk:</strong> Billing software registered to warez cracker.</span>
                </div>
                <div className="flex items-start gap-2 text-red-300">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>0 / 3 Rec Letters:</strong> Zero recommendation letters provided.</span>
                </div>
              </div>

              <div className="pt-3 border-t border-red-500/20 text-[11px] font-mono text-red-400 font-semibold">
                Simulated Consensus: 5 - 0 Unanimous Refusal
              </div>
            </div>

            {/* Run 2: Remediated Submission Draft */}
            <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  RUN 2: REMEDIATED DRAFT
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">84 / 100</span>
              </div>

              <div>
                <div className="text-lg font-bold text-white">READY FOR SUBMISSION</div>
                <div className="text-xs text-emerald-400 font-mono mt-0.5">Estimated Success: 87.0%</div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2 text-emerald-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Primary Credentials:</strong> WES-authenticated university degree certificate.</span>
                </div>
                <div className="flex items-start gap-2 text-emerald-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Audited Accounts:</strong> 12 months audited bank statements from Zenith Bank.</span>
                </div>
                <div className="flex items-start gap-2 text-emerald-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Legitimate Licenses:</strong> Official WHMCS enterprise invoice & crypto key.</span>
                </div>
                <div className="flex items-start gap-2 text-emerald-300">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>3 / 3 Rec Letters:</strong> UK Tech CEO, AI Director, Telecom VP letters.</span>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-400 font-semibold">
                Simulated Consensus: 5 - 0 Unanimous Endorsement
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE SAAS FEATURES (THE 6 PILLARS) */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono text-blue-400 uppercase font-semibold">
            Built for UK Global Talent Success
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Six Specialized Engines in One Enterprise Platform
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Everything immigration solicitors and digital technology applicants need to audit, remediate, and submit with total confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Hostile Forensic Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We act as an uncompromising casework examiner, cross-examining every assertion, date, and figure to find fatal refusal grounds before Home Office caseworkers do.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multimodal Vision OCR</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts verbatim text, corporate letterheads, official stamps, digital signatures, software license keys, and dashboard figures with high forensic confidence.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Real-Time Ingestion Queue</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Asynchronous 7-stage pipeline worker powered by Server-Sent Events (SSE). Watch files ingest, OCR extract, criteria match, and score in real time.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Audit Version Diff Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare Baseline Run 1 against Remediated Run 2. Track score deltas (+52 pts), resolved defects, radar benchmark gains, and criteria shifts.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">5-Assessor Simulated Panel</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simulates independent evaluations from 5 realistic assessor personas: Caseworker Lead, Technical Specialist, Commercial Scaleup Leader, Legal Counsel, and Academic Director.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Official Solicitor Dossier</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              One-click compilation into an official, courtroom-grade legal dossier with cover sheets, Part 9 compliance attestations, 10-piece evidence index, and Print-to-PDF formatting.
            </p>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            From Document Ingestion to Solicitor-Approved Dossier
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <div className="text-3xl font-black text-slate-600 font-mono">01</div>
            <h3 className="text-base font-bold text-white">Upload Candidate Evidence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Drag and drop your candidate&apos;s CV, personal statement, 3 recommendation letters, and up to 10 evidentiary pieces.
            </p>
          </div>

          <div className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <div className="text-3xl font-black text-blue-500 font-mono">02</div>
            <h3 className="text-base font-bold text-white">Run 7-Stage Hostile Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our automated engine cross-examines evidence against 2026 Tech Nation criteria, spotting page breaches and character risks.
            </p>
          </div>

          <div className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <div className="text-3xl font-black text-emerald-400 font-mono">03</div>
            <h3 className="text-base font-bold text-white">Export Official Legal Dossier</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review resolution deltas, verify 5-0 panel consensus, and print your UKVI-compliant submission bundle with one click.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PRICING TEASER */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono text-blue-400 uppercase font-semibold">
            Transparent SaaS Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Plans for Individual Tech Founders & Immigration Law Firms
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-400 uppercase font-semibold">Starter Preview</div>
              <div className="text-3xl font-black text-white">£0</div>
              <p className="text-xs text-slate-400">Basic pre-submission eligibility scan for single applicants.</p>
              <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <li className="flex items-center gap-2">✓ 1 Candidate Portfolio</li>
                <li className="flex items-center gap-2">✓ High-level score & risk count</li>
                <li className="flex items-center gap-2">✓ Basic Markdown summary</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Applicant */}
          <div className="p-6 rounded-2xl border border-blue-500/60 bg-slate-900/80 shadow-xl shadow-blue-500/10 flex flex-col justify-between space-y-6 relative ring-1 ring-blue-500/30">
            <div className="absolute -top-3 left-6">
              <span className="text-[10px] font-mono font-bold bg-blue-600 text-white px-3 py-0.5 rounded-full">
                MOST POPULAR
              </span>
            </div>
            <div className="space-y-3">
              <div className="text-xs font-mono text-blue-400 uppercase font-semibold">Pro Applicant</div>
              <div className="text-3xl font-black text-white">£79 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
              <p className="text-xs text-slate-400">Complete forensic audit engine for individual exceptional talent.</p>
              <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <li className="flex items-center gap-2">✓ Up to 5 Candidate Portfolios</li>
                <li className="flex items-center gap-2">✓ Version Diff Engine (/compare)</li>
                <li className="flex items-center gap-2">✓ Contradiction & Deception Scanner</li>
                <li className="flex items-center gap-2">✓ Standard PDF & JSON Exports</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs text-center shadow-lg shadow-blue-500/20 transition-all"
            >
              Start Pro Audit
            </Link>
          </div>

          {/* Firm Enterprise */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-mono text-emerald-400 uppercase font-semibold">Law Firm Enterprise</div>
              <div className="text-3xl font-black text-white">£399 <span className="text-xs text-slate-400 font-normal">/ mo</span></div>
              <p className="text-xs text-slate-400">For UK immigration law firms & corporate immigration teams.</p>
              <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <li className="flex items-center gap-2">✓ Unlimited Candidate Portfolios</li>
                <li className="flex items-center gap-2">✓ 10 Solicitor / Caseworker Seats</li>
                <li className="flex items-center gap-2">✓ Official Solicitor Export Bundle (/export)</li>
                <li className="flex items-center gap-2">✓ Priority OCR Vision Queue & API</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs text-center transition-colors"
            >
              Contact Law Firm Sales
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about GTV Reviewer and Tech Nation compliance.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(i)}
                className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-blue-400"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {activeFaq === i && (
                <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 mt-1">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Don&apos;t Leave Your UK Endorsement to Caseworker Discretion.
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            Audit your evidence portfolio with the same forensic hostile rigor as an experienced Home Office casework panel.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/25 transition-all"
            >
              Run Your Pre-Submission Audit
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 rounded-xl font-bold text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              Explore Live Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
