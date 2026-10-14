import React from "react";
import Link from "next/link";
import { MetricCard } from "@/components/MetricCard";
import { RiskBadge } from "@/components/RiskBadge";
import {
  GitCompare,
  ShieldAlert,
  AlertOctagon,
  ArrowRight,
  TrendingDown,
  Layers,
  CopyX,
  FileSpreadsheet,
} from "lucide-react";

export default function ConsistencyCheckPage() {
  const contradictions = [
    {
      id: "C1",
      severity: "CRITICAL",
      title: "Third-Party Identity on Primary Award Certificate",
      category: "Document Authenticity & Deception Risk",
      docA: "MANDATORY CRITERIA 1, Page 1",
      quoteA: "Top 5 African Digital Technology Entrepreneurs... issued to CHIDIEBERE FELICITAS CHIAMAKA... verifies her contribution",
      docB: "Application Passport & Bundle Identity",
      quoteB: "Applicant is male: Oluwafemi Wale Ogunniyi",
      discrepancy: "Fatal identity mismatch. Certificate belongs to another female individual with female pronouns. Triggers UK Immigration Rules Part 9.7.1 deception refusal and potential 10-year UK entry ban.",
    },
    {
      id: "C2",
      severity: "CRITICAL",
      title: "1,000x Discrepancy on Primary Business Revenue",
      category: "Numerical Contradiction",
      docA: "MANDATORY CRITERIA 2, Page 2 (WHMCS Live Dashboard)",
      quoteA: "All Time: ₦2,260,242,00 (₦2.26 million total all-time revenue)",
      docB: "MANDATORY CRITERIA 2, Page 2 (Narrative Caption)",
      quoteB: "The platform has generated over ₦2.2 billion in all-time revenue...",
      discrepancy: "1,000x numerical gap between dashboard screenshot and self-written narrative text. ₦2.26M vs ₦2.2B.",
    },
    {
      id: "C3",
      severity: "CRITICAL",
      title: "Production Billing Run on Cracked 'ShayanXtreme' Software",
      category: "Technical Credibility & Piracy",
      docA: "MANDATORY CRITERIA 2, Page 2 (Admin Screenshot)",
      quoteA: "Registered To: ShayanXtreme | License Type: WHMCS 9.0.5 | Expires: 31st December 2099",
      docB: "Claimed Tech Leadership & Sector Standing",
      quoteB: "National cloud infrastructure leader securing enterprise transactions",
      discrepancy: "ShayanXtreme is an infamous piracy release group. Production billing is operating on nulled/cracked software expiring in 2099.",
    },
    {
      id: "C4",
      severity: "CRITICAL",
      title: "Third Revenue Contradiction in Internal HR Letter",
      category: "Numerical Contradiction",
      docA: "MANDATORY CRITERIA 3, Page 3 (HR Letter)",
      quoteA: "FinxHost has achieved ₦5.3bn+ in total revenue...",
      docB: "MANDATORY CRITERIA 2, Page 2",
      quoteB: "Platform has generated over ₦2.2 billion in all-time revenue...",
      discrepancy: "Conflicting revenue claims across consecutive documents: ₦5.3B vs ₦2.2B vs ₦2.26M actual dashboard total.",
    },
    {
      id: "C5",
      severity: "HIGH",
      title: "Smoking-Gun Template Cloning: Telemedicine in Chatbot Table",
      category: "Template Contamination",
      docA: "OPTIONAL CRITERIA 3A (BotifyAI), Page 1 Table (Row 7)",
      quoteA: "Leadership Action: 'Lower-cost care options, instant rural access' -> Impact: '35% improvement in conversion rates for AI automation'",
      docB: "Product Domain (BotifyAI Chatbot)",
      quoteB: "AI WhatsApp/Telegram marketing automation chatbot platform",
      discrepancy: "Telemedicine copy copied from HealthSyn NG hospital application left in marketing table, indisputably proving copy-paste fabrication.",
    },
    {
      id: "C6",
      severity: "HIGH",
      title: "Gender Pronoun Contamination in Remuneration Verification",
      category: "Document Integrity",
      docA: "MANDATORY CRITERIA 3, Page 3 (WAJO HR Letter)",
      quoteA: "...paid directly into her nominated bank account via bank transfer. Attached are her authenticated payslips...",
      docB: "Male Applicant Identity",
      quoteB: "Oluwafemi Wale Ogunniyi (He/Him)",
      discrepancy: "HR letter repeatedly alternates between 'her' and 'his', proving text was lifted from an existing template for a female applicant.",
    },
    {
      id: "C7",
      severity: "HIGH",
      title: "Ghost Companies & App Names in Document Headings",
      category: "Cross-Application Confusion",
      docA: "MANDATORY CRITERIA 3, Page 1 Subtitle",
      quoteA: "Proof of high salary and contribution to CredVerify.App and HealthSyn NG under Everypoint Media Links Ltd.",
      docB: "Body of Document & Company Structure",
      quoteB: "As Founder & CEO of FinxHost and BotifyAI under WAJO Limited...",
      discrepancy: "Subtitle names two ghost apps and a foreign parent company (Everypoint Media Links Ltd.) never mentioned elsewhere.",
    },
    {
      id: "C8",
      severity: "MEDIUM",
      title: "Conflicting Corporate Incorporation Numbers",
      category: "Regulatory Verification",
      docA: "OPTIONAL CRITERIA 3A, Page 1 Table",
      quoteA: "CAC Registration No.: RC1352306",
      docB: "Attached CAC Certificate (Page 3)",
      quoteB: "Certificate of Incorporation: RC 1900387",
      discrepancy: "Typed RC number differs from official corporate seal and certificate number.",
    },
    {
      id: "C9",
      severity: "MEDIUM",
      title: "Quiety Theme Lorem Ipsum Left on Production Website",
      category: "Commercial Substance",
      docA: "MANDATORY CRITERIA 2, Page 2 Screenshot",
      quoteA: "Intrinsicly strategize cutting-edge functionalities before interoperable applications. Synergistically incubate extensive...",
      docB: "Enterprise Hosting Claims",
      quoteB: "Hosting infrastructure trusted by 500,000 businesses across Africa and Asia",
      discrepancy: "Live team page contains default lorem ipsum marketing filler from ThemeForest template 'Quiety'.",
    },
    {
      id: "C10",
      severity: "MEDIUM",
      title: "Salary Math Discrepancy Across Payslips",
      category: "Remuneration Accounting",
      docA: "MANDATORY CRITERIA 3, Page 1 Text",
      quoteA: "Monthly gross of ₦14,500,000 (net ₦10,200,000)",
      docB: "Historical Tax & Prior Year Payslips",
      quoteB: "Annual salary previously stated as ₦18,000,000 (₦1.5M/month)",
      discrepancy: "Uncorroborated 10x sudden jump in executive compensation without FIRS tax remittances.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <GitCompare className="w-6 h-6 text-blue-400" />
            Consistency & Integrity Cross-Verification
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Automated cross-document contradiction detection, template contamination tracing, and numerical integrity checks.
          </p>
        </div>

        <Link
          href="/reports/consistency-check"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>View Consistency Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Contradictions"
          value="16"
          subtitle="Cross-document conflicts"
          icon="GitCompare"
          variant="danger"
          badge="16 DEFECTS"
        />
        <MetricCard
          title="Critical Violations"
          value="6"
          subtitle="Deception & Identity risks"
          icon="ShieldAlert"
          variant="danger"
        />
        <MetricCard
          title="Numerical Mismatches"
          value="5"
          subtitle="Salary & Revenue gaps"
          icon="FileSpreadsheet"
          variant="warning"
        />
        <MetricCard
          title="Template Clones"
          value="3"
          subtitle="Copy-paste artifacts"
          icon="CopyX"
          variant="warning"
        />
      </div>

      {/* Entity Relationship Conflict Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 mb-2">
          <Layers className="w-4 h-4 text-blue-400" />
          Entity & Project Confusion Matrix
        </h3>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          The application portfolio cross-references conflicting company entities and app names across file headers, metadata, and body text:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-muted-foreground text-[10px] uppercase font-semibold">Stated Core Entity</div>
            <div className="text-blue-400 font-bold mt-1">WAJO Limited</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Parent company of FinxHost & BotifyAI</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-red-500/20">
            <div className="text-red-400 text-[10px] uppercase font-semibold">Ghost Entity In Subtitles</div>
            <div className="text-red-300 font-bold mt-1">Everypoint Media Links Ltd.</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Named in MC3 Page 1 salary subtitle</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-amber-500/20">
            <div className="text-amber-400 text-[10px] uppercase font-semibold">Conflicting Products</div>
            <div className="text-amber-300 font-bold mt-1">HealthSyn NG & CredVerify</div>
            <div className="text-slate-400 text-[11px] mt-0.5">Named in File 2 & 5 filenames/subtitles</div>
          </div>
        </div>
      </div>

      {/* Contradiction Matrix Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-foreground">
          Forensic Conflict Matrix: Direct Quotes & Discrepancies
        </h2>

        <div className="space-y-3">
          {contradictions.map((c, idx) => (
            <div
              key={c.id}
              className={`rounded-xl border p-4 sm:p-5 backdrop-blur-sm text-xs transition-all ${
                c.severity === "CRITICAL"
                  ? "bg-red-950/15 border-red-500/25 hover:border-red-500/40"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold flex items-center justify-center text-[11px]">
                    {c.id}
                  </span>
                  <h3 className="text-sm font-bold text-foreground">
                    {c.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-muted-foreground">{c.category}</span>
                  <RiskBadge status={c.severity} size="sm" />
                </div>
              </div>

              {/* Comparison Grid */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
                {/* Document A */}
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="text-muted-foreground uppercase text-[10px] font-semibold">
                    Document Source A: {c.docA}
                  </div>
                  <div className="text-red-300/90">&quot;{c.quoteA}&quot;</div>
                </div>

                {/* Document B */}
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="text-muted-foreground uppercase text-[10px] font-semibold">
                    Document Source B: {c.docB}
                  </div>
                  <div className="text-blue-300/90">&quot;{c.quoteB}&quot;</div>
                </div>
              </div>

              {/* Impact / Discrepancy */}
              <div className="mt-3 p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 text-slate-300 flex items-start gap-2 leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-400">Examiner Impact:</strong> {c.discrepancy}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

