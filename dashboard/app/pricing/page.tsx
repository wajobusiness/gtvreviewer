"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, Zap, Building2, HelpCircle } from "lucide-react";

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Starter Preview",
      price: "£0",
      cadence: "forever free",
      description: "Basic pre-submission eligibility check for single applicants.",
      badge: "Free",
      features: [
        "1 Candidate Evidence Scan",
        "High-level score & defect count",
        "Basic Markdown summary",
        "Watermarked preview export",
        "Community support",
      ],
      notIncluded: [
        "Audit Version Diff Engine (/compare)",
        "Official Solicitor Export Bundle (/export)",
        "Contradiction & deception scanner",
        "Multi-seat law firm collaboration",
      ],
      ctaText: "Start Free Pre-Check",
      ctaLink: "/register",
      highlight: false,
    },
    {
      name: "Pro Applicant",
      price: annual ? "£79" : "£99",
      cadence: annual ? "per month (billed annually)" : "per month",
      description: "Complete 7-stage hostile forensic audit for exceptional talent founders & engineers.",
      badge: "Most Popular",
      features: [
        "Up to 5 Candidate Portfolios",
        "Unlimited Re-Audits & Runs",
        "Full 7-Stage Forensic Engine",
        "Audit Version Diff Engine (/compare)",
        "Contradiction & Deception Scanner",
        "Recommendation Letter Forensics",
        "Standard PDF & JSON Exports",
        "Priority Email Support",
      ],
      notIncluded: [
        "White-label Solicitor Export Bundle",
        "Multi-seat law firm collaboration",
      ],
      ctaText: "Get Started with Pro",
      ctaLink: "/register",
      highlight: true,
    },
    {
      name: "Law Firm Enterprise",
      price: annual ? "£399" : "£499",
      cadence: annual ? "per month (billed annually)" : "per month",
      description: "Built for UK immigration law firms, SRA-regulated solicitors, and enterprise talent teams.",
      badge: "Enterprise",
      features: [
        "Unlimited Candidate Portfolios",
        "Unlimited Forensic Audit Runs",
        "10 Team Seats (Solicitors, Caseworkers)",
        "White-Label Solicitor Export Bundle (/export)",
        "Priority OCR & Vision Processing Queue",
        "Courtroom & Tribunal Compliance Packs",
        "Audit Version Diff Engine (/compare)",
        "Machine-Readable JSON Archive Export",
        "Dedicated Account Executive & Legal API",
      ],
      notIncluded: [],
      ctaText: "Contact Firm Sales",
      ctaLink: "/register",
      highlight: false,
    },
  ];

  return (
    <div className="py-16 space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-mono text-blue-400 uppercase font-semibold">
          Transparent, ROI-Driven Pricing
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Invest in Approval. Protect Against Refusal.
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          The cost of an endorsement refusal review or re-application exceeds £3,500 in wasted legal fees and months of delay. Audit your application with forensic certainty first.
        </p>

        {/* Cadence Switcher */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${!annual ? "text-white" : "text-slate-400"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className="w-12 h-6 rounded-full bg-slate-800 border border-slate-700 p-0.5 transition-colors relative flex items-center"
          >
            <div
              className={`w-5 h-5 rounded-full bg-blue-500 shadow-md transition-transform ${
                annual ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${annual ? "text-white" : "text-slate-400"}`}>
            Annual Billing
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.2 rounded-full font-bold">
              Save 20%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`rounded-3xl border p-8 flex flex-col justify-between transition-all relative ${
              plan.highlight
                ? "bg-slate-900/90 border-blue-500/60 shadow-2xl shadow-blue-500/15 ring-1 ring-blue-500/30"
                : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-8">
                <span className="text-[10px] font-mono font-bold bg-blue-600 text-white px-3 py-0.5 rounded-full shadow-md">
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.description}</p>
              </div>

              <div className="pb-6 border-b border-slate-800">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400 font-mono">/ {plan.cadence}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Included Features</div>
                {plan.features.map((feat, f) => (
                  <div key={f} className="flex items-start gap-2 text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feat, f) => (
                  <div key={f} className="flex items-start gap-2 text-slate-500 line-through">
                    <span className="w-4 h-4 flex items-center justify-center shrink-0 text-slate-600">✕</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link
                href={plan.ctaLink}
                className={`w-full py-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                }`}
              >
                {plan.ctaText} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison Grid */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 space-y-6">
        <h3 className="text-xl font-bold text-white">Full Feature Comparison Matrix</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-950 font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Feature Capability</th>
                <th className="p-3">Starter</th>
                <th className="p-3">Pro Applicant</th>
                <th className="p-3">Law Firm Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="p-3 font-semibold text-white">Candidate Portfolios</td>
                <td className="p-3 text-slate-400">1</td>
                <td className="p-3 text-slate-300">5</td>
                <td className="p-3 font-bold text-emerald-400">Unlimited</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">7-Stage Ingestion Pipeline</td>
                <td className="p-3 text-slate-400">Basic</td>
                <td className="p-3 text-emerald-400 font-bold">Full Deep-Dive</td>
                <td className="p-3 text-emerald-400 font-bold">Priority Execution</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Audit Version Diff Engine (/compare)</td>
                <td className="p-3 text-slate-600">✕</td>
                <td className="p-3 text-emerald-400">✓ Included</td>
                <td className="p-3 text-emerald-400">✓ Included</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Official Solicitor Dossier (/export)</td>
                <td className="p-3 text-slate-600">✕</td>
                <td className="p-3 text-slate-400">Standard PDF</td>
                <td className="p-3 text-emerald-400 font-bold">White-Label Legal Dossier</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Team Collaboration Seats</td>
                <td className="p-3 text-slate-400">1</td>
                <td className="p-3 text-slate-400">1</td>
                <td className="p-3 text-emerald-400 font-bold">10 Solicitor Seats</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

