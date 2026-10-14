import React from "react";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-slate-300 text-xs leading-relaxed">
      <Link href="/" className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase font-semibold">
          <Scale className="w-4 h-4" /> Legal Terms
        </div>
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-slate-400">Last updated: October 14, 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">1. Nature of the Service</h2>
        <p>
          GTV Reviewer is a specialized software-as-a-service (SaaS) pre-submission audit and verification platform designed to evaluate evidence portfolios for the UK Global Talent Visa (Digital Technology route under Tech Nation). GTV Reviewer does not provide legal representation, does not act as an immigration advisor, and does not guarantee visa endorsement or visa grant by Tech Nation or the UK Home Office.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">2. AI Pre-Audit & Evidence Integrity</h2>
        <p>
          Users acknowledge that Tech Nation strictly prohibits the use of artificial intelligence to generate false, exaggerated, or fabricated evidence text. GTV Reviewer operates strictly as an auditing, OCR transcription, and consistency analysis tool. Users remain solely responsible for the authenticity, accuracy, and legal ownership of all documents submitted to the platform.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">3. SRA Compliance & Law Firm Use</h2>
        <p>
          Immigration law firms, solicitors, and caseworkers utilizing the Firm Enterprise tier must ensure their use of the software complies with Solicitors Regulation Authority (SRA) Standards and Regulations, client confidentiality obligations, and duty of care requirements.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">4. Subscriptions & Refunds</h2>
        <p>
          Paid subscriptions are billed on a recurring monthly or annual basis as selected upon checkout. Due to the immediate computation costs of forensic OCR and AI multimodal parsing, audit execution fees are non-refundable once an audit run has been initiated.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">5. Limitation of Liability</h2>
        <p>
          In no event shall GTV Reviewer, its officers, or affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from visa refusal, rejection of endorsement, or loss of application filing fees.
        </p>
      </section>
    </div>
  );
}

