import React from "react";
import Link from "next/link";
import { MetricCard } from "@/components/MetricCard";
import { RiskBadge } from "@/components/RiskBadge";
import {
  FileCheck,
  ShieldAlert,
  AlertTriangle,
  UserX,
  FileText,
  ArrowRight,
  TrendingUp,
  BarChart2,
  Sparkles,
} from "lucide-react";

export default function LetterForensicsPage() {
  const letters = [
    {
      id: "L1",
      referee: "David Vance",
      role: "CEO & Co-Founder",
      organization: "SwiftPay Global (Kenya)",
      location: "Sample MC2 Evidence, Page 3",
      score: 45,
      authenticity: "Genuine Signatory / High Plausibility Deficit",
      consistency: "Contradicts File 2 Infrastructure",
      risk: "HIGH",
      tone: "Endorsing & Commercial",
      leadershipMentions: 12,
      innovationMentions: 4,
      technicalMentions: 8,
      commercialMentions: 16,
      summary:
        "Claims SwiftPay Global migrated to CloudScale Labs in 2024 and processed $500M in trade remittances across 500k merchants on CloudScale infrastructure.",
      findings: [
        "David Vance is a legitimate fintech executive and former digital banking head.",
        "Uncorroborated: Highly implausible that an international payment processor routed $500M through a local shared hosting reseller operating on unverified WHMCS software.",
        "Not addressed to Tech Nation or UK Home Office (generic 'To Whom It May Concern').",
      ],
    },
    {
      id: "L2",
      referee: "Samuel Chen",
      role: "CEO",
      organization: "ApexHost Solutions",
      location: "Sample MC2 Evidence, Page 3",
      score: 35,
      authenticity: "Local Business / Low Sector Standing",
      consistency: "Direct Numerical Contradiction",
      risk: "HIGH",
      tone: "Commercial Testimonial",
      leadershipMentions: 6,
      innovationMentions: 2,
      technicalMentions: 7,
      commercialMentions: 14,
      summary:
        "Claims ApexHost Solutions is an active reseller that has paid over ₦50,000,000 in reseller fees to CloudScale Labs.",
      findings: [
        "ApexHost Solutions is a web hosting reseller, which Tech Nation explicitly excludes as non-product-led routine IT service.",
        "Fatal contradiction: Claims paying ₦50M to CloudScale Labs, yet the admin dashboard shows all-time revenue of only ₦2.26M.",
        "Does not qualify as an established tech sector expert of national/international standing.",
      ],
    },
    {
      id: "L3",
      referee: "Claire Bennett",
      role: "Finance & HR Manager",
      organization: "CloudScale Technologies Ltd (Applicant's Company)",
      location: "Sample MC3 Evidence, Page 3",
      score: 15,
      authenticity: "Subordinate Employee / Ineligible Referee",
      consistency: "Gender Pronoun & Revenue Discrepancy",
      risk: "CRITICAL",
      tone: "Internal Verification",
      leadershipMentions: 4,
      innovationMentions: 1,
      technicalMentions: 3,
      commercialMentions: 11,
      summary:
        "Internal HR letter verifying monthly remuneration of ₦10.2M and claiming CloudScale Labs achieved ₦5.3bn+ revenue.",
      findings: [
        "Immediate disqualification: Tech Nation strictly forbids letters from employees, subordinates, or colleagues within applicant's own private company.",
        "Gender pronoun contamination: Refers to applicant with conflicting pronouns ('her nominated bank account', 'her authenticated payslips') proving template copy-paste.",
        "Contradicts File 2 revenue claims (claims ₦5.3B vs ₦2.2B vs ₦2.26M dashboard).",
      ],
    },
    {
      id: "L4",
      referee: "Community / Tech Anchor Referee",
      role: "Ecosystem Lead",
      organization: "Tech Anchor Innovation Hub",
      location: "OC2B (Ecosystem Capacity), Page 2",
      score: 55,
      authenticity: "Community Partner",
      consistency: "Moderate",
      risk: "MEDIUM",
      tone: "Advocacy & Capacity Building",
      leadershipMentions: 9,
      innovationMentions: 5,
      technicalMentions: 11,
      commercialMentions: 3,
      summary:
        "Testimonial confirming applicant's facilitation of digital skills training and mentorship workshops for youth.",
      findings: [
        "Speaks to ecosystem capacity and mentorship (positive for OC2).",
        "Lacks independent corroboration of national scale (e.g., formal government or NYSC accreditation).",
        "Compressed inside a multi-page evidence document rather than submitted as a standalone letter.",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-blue-400" />
            Recommendation & Reference Letter Forensics
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Forensic analysis of all recommendation, reference, and confirmation letters submitted in the application bundle.
          </p>
        </div>

        <Link
          href="/reports/letter-forensics"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>View Forensic Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Critical Structural Defect Alert */}
      <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-5 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-red-300 uppercase tracking-wide">
              Critical Structural Finding: Zero Standalone Letters of Recommendation
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tech Nation guidance mandates <strong>three (3) standalone letters of recommendation</strong> from recognized leaders of established digital technology companies (each up to 3 sides of A4). In this bundle, <strong>0 standalone letters</strong> were found in the folder. All letters have been pasted into the 10 evidence documents, which wastes page budget and fails the mandatory filing format.
            </p>
          </div>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Standalone Letters"
          value="0 / 3"
          subtitle="Mandatory requirement"
          icon="UserX"
          variant="danger"
          badge="MISSING"
        />
        <MetricCard
          title="Embedded Letters"
          value="4"
          subtitle="Compressed inside PDFs"
          icon="FileText"
          variant="warning"
        />
        <MetricCard
          title="Authenticity Risk"
          value="High"
          subtitle="Plausibility & Pronouns"
          icon="AlertTriangle"
          variant="danger"
        />
        <MetricCard
          title="Avg Letter Score"
          value="37 / 100"
          subtitle="Significant rework needed"
          icon="TrendingUp"
          variant="danger"
        />
      </div>

      {/* Letter Cards Grid */}
      <div className="space-y-5">
        <h2 className="text-base font-bold text-foreground">
          Forensic Breakdown of Embedded Letters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {letters.map((letter) => (
            <div
              key={letter.id}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm shadow-sm space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-400">
                      {letter.id}
                    </span>
                    <h3 className="text-base font-bold text-foreground">
                      {letter.referee}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {letter.role} • {letter.organization}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                    {letter.location}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <RiskBadge status={letter.risk} size="sm" />
                  <div className="text-xs font-mono font-bold text-slate-300">
                    Score: {letter.score}/100
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {letter.summary}
              </p>

              {/* Keyword / Mentions Frequencies */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider font-semibold">
                  Thematic Mentions & Tone Analysis ({letter.tone})
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Leadership</div>
                    <div className="font-bold text-blue-400">{letter.leadershipMentions}x</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Innovation</div>
                    <div className="font-bold text-purple-400">{letter.innovationMentions}x</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Technical</div>
                    <div className="font-bold text-emerald-400">{letter.technicalMentions}x</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 text-[10px]">Commercial</div>
                    <div className="font-bold text-amber-400">{letter.commercialMentions}x</div>
                  </div>
                </div>
              </div>

              {/* Forensic Findings List */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-mono uppercase text-red-400 font-semibold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Forensic Anomalies & Examiner Risks:
                </span>
                <ul className="space-y-1 pl-4 list-disc text-slate-400 text-[11px] leading-relaxed">
                  {letter.findings.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

