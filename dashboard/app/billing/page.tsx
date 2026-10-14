"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import {
  CreditCard,
  Check,
  Zap,
  Building,
  ShieldCheck,
  Users,
  Download,
  Receipt,
  FileCheck2,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function BillingPage() {
  const { organization, switchOrganizationTier } = useAuth();
  const [annual, setAnnual] = useState(true);
  const [upgradedSuccess, setUpgradedSuccess] = useState<string | null>(null);

  const handleSelectPlan = (tier: "STARTER" | "PROFESSIONAL" | "FIRM_ENTERPRISE") => {
    switchOrganizationTier(tier);
    setUpgradedSuccess(`Successfully updated organization to ${tier} Tier!`);
    setTimeout(() => {
      setUpgradedSuccess(null);
    }, 4000);
  };

  const plans = [
    {
      id: "STARTER",
      name: "Starter Preview",
      price: "£0",
      cadence: "forever free",
      description: "Basic pre-submission eligibility scan for individual applicants.",
      badge: "Free Tier",
      current: organization.tier === "STARTER",
      features: [
        "1 Candidate Portfolio",
        "High-level score & risk count",
        "Basic Markdown summary",
        "Watermarked basic PDF",
        "Community support",
      ],
      notIncluded: [
        "Version comparison diff engine",
        "Official Solicitor Export Bundle",
        "Contradiction & deception scanner",
        "Multi-seat law firm collaboration",
      ],
    },
    {
      id: "PROFESSIONAL",
      name: "Pro Applicant",
      price: annual ? "£79" : "£99",
      cadence: annual ? "per month (billed annually)" : "per month",
      description: "Complete 7-stage forensic audit engine for individual high-value applicants.",
      badge: "Most Popular",
      current: organization.tier === "PROFESSIONAL",
      features: [
        "Up to 5 Candidate Portfolios",
        "Unlimited Re-Audits & Runs",
        "Full 7-Stage Forensic Engine",
        "Audit Version Diff Engine (/compare)",
        "Contradiction & Deception Scanner",
        "Recommendation Letter Forensics",
        "Standard PDF & JSON Exports",
        "Standard Email Support",
      ],
      notIncluded: [
        "White-label Solicitor Export Bundle",
        "Multi-seat law firm collaboration",
        "Dedicated account manager",
      ],
    },
    {
      id: "FIRM_ENTERPRISE",
      name: "Immigration Law Firm",
      price: annual ? "£399" : "£499",
      cadence: annual ? "per month (billed annually)" : "per month",
      description: "Designed for UK immigration law firms, visa consultants, and corporate partners.",
      badge: "Enterprise Grade",
      current: organization.tier === "FIRM_ENTERPRISE",
      features: [
        "Unlimited Candidate Portfolios",
        "Unlimited Forensic Audit Runs",
        "10 Solicitor & Reviewer Workspace Seats",
        "White-Label Solicitor Export Bundle (/export)",
        "Priority OCR & Vision Processing Queue",
        "Full Courtroom & Tribunal Compliance Packs",
        "Audit Version Diff Engine (/compare)",
        "Raw Machine-Readable JSON Archives",
        "Dedicated Account Executive & SLA",
      ],
      notIncluded: [],
    },
  ];

  const invoices = organization.tier === "STARTER" ? [] : [
    {
      id: "INV-" + new Date().getFullYear() + "-0001",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      amount: organization.tier === "FIRM_ENTERPRISE" ? "£399.00" : "£79.00",
      status: "Paid",
      plan: organization.tier === "FIRM_ENTERPRISE" ? "Law Firm Enterprise (Active)" : "Pro Applicant (Active)",
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            Commercial SaaS Subscription & Billing
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Plans & Workspace Entitlements
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your organization tier, team seats, and forensic audit usage limits for{" "}
            <span className="text-slate-200 font-semibold">{organization.name}</span>.
          </p>
        </div>

        {/* Current Active Plan Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Current Tier</div>
            <div className="text-xs font-bold text-emerald-400 font-mono">{organization.tier}</div>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {upgradedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in duration-300">
          <span className="flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {upgradedSuccess}
          </span>
          <button onClick={() => setUpgradedSuccess(null)} className="text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Annual / Monthly Billing Switcher */}
      <div className="flex items-center justify-center gap-3 py-2">
        <span className={`text-xs font-medium ${!annual ? "text-white" : "text-slate-400"}`}>Monthly</span>
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
        <span className={`text-xs font-medium flex items-center gap-1.5 ${annual ? "text-white" : "text-slate-400"}`}>
          Annual Billing
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.2 rounded-full font-bold">
            Save 20%
          </span>
        </span>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isSelected = plan.current;
          return (
            <div
              key={plan.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all relative ${
                isSelected
                  ? "bg-slate-900/90 border-blue-500/60 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/30"
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6">
                  <span
                    className={`text-[10px] font-mono font-bold px-3 py-0.5 rounded-full border shadow-sm ${
                      isSelected
                        ? "bg-blue-600 border-blue-400 text-white"
                        : "bg-slate-800 border-slate-700 text-slate-300"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  {isSelected && (
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                      Active Plan
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 min-h-[36px] mb-4">{plan.description}</p>

                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-slate-400 font-mono">/ {plan.cadence}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 mb-6 text-xs">
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Included Capabilities</div>
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-200">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-500 line-through">
                      <span className="w-4 h-4 flex items-center justify-center shrink-0 text-slate-600">✕</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleSelectPlan(plan.id as any)}
                  disabled={isSelected}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 ${
                    isSelected
                      ? "bg-slate-800 text-slate-400 cursor-default border border-slate-700"
                      : plan.id === "FIRM_ENTERPRISE"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" /> Current Workspace Tier
                    </>
                  ) : (
                    <>
                      Switch to {plan.name} <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Workspace Resource Usage Statistics */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Workspace Resource Consumption
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>Law Firm Team Seats:</span>
              <span className="font-mono font-bold text-white">
                {organization.seatsUsed} / {organization.seatsMax} Seats
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full"
                style={{ width: `${(organization.seatsUsed / organization.seatsMax) * 100}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400">4 active solicitors, 6 seats available</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>Candidate Portfolios:</span>
              <span className="font-mono font-bold text-emerald-400">3 Active / Unlimited</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[25%]" />
            </div>
            <div className="text-[11px] text-slate-400">Enterprise tier grants unlimited client projects</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>Vision OCR Ingestion:</span>
              <span className="font-mono font-bold text-white">45 / 500 Pages Processed</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-[10%]" />
            </div>
            <div className="text-[11px] text-slate-400">Resets on 1st of next month</div>
          </div>
        </div>
      </div>

      {/* Invoices & Billing History */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              Invoices & Payment History
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Automated Stripe billing statements and VAT invoices.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Invoice Number</th>
                <th className="p-3">Date</th>
                <th className="p-3">Plan / Description</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                    No billing statements or invoices yet. Invoices will automatically generate when your subscription renews.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/30">
                    <td className="p-3 font-mono font-semibold text-white">{inv.id}</td>
                    <td className="p-3 text-slate-400">{inv.date}</td>
                    <td className="p-3 text-slate-300">{inv.plan}</td>
                    <td className="p-3 font-mono font-bold text-white">{inv.amount}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Check className="w-3 h-3" /> {inv.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium">
                        <Download className="w-3 h-3" /> PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

