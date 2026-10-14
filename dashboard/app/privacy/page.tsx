import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-slate-300 text-xs leading-relaxed">
      <Link href="/" className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 mb-4">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
      </Link>

      <div className="border-b border-slate-800 pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase font-semibold">
          <ShieldCheck className="w-4 h-4" /> Privacy & GDPR Compliance
        </div>
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-slate-400">Last updated: October 14, 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">1. Commitment to Candidate Confidentiality</h2>
        <p>
          We recognize that visa evidence portfolios contain highly confidential personal data, including passports, degrees, corporate bank statements, employment contracts, and patent filings. GTV Reviewer enforces strict zero-data-leakage policies. We never train public foundation models on your uploaded evidence.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">2. Data We Process</h2>
        <p>
          We process information you provide directly: account details (name, email, law firm name), evidence documents uploaded for pre-submission audit, and session analytics. OCR transcriptions are generated strictly for audit reporting and deleted or encrypted according to tenant retention rules.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">3. UK GDPR & Data Protection Act 2018</h2>
        <p>
          GTV Reviewer complies with the UK General Data Protection Regulation (UK GDPR) and Data Protection Act 2018. All user data is encrypted in transit using TLS 1.3 and at rest using AES-256. European and UK tenant data resides in secure London (eu-west-2) infrastructure.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">4. Document Exclusion by Default</h2>
        <p>
          In our open-source codebase and repository versions, raw applicant evidence files (*.pdf) are automatically placed in .gitignore to prevent accidental public disclosure to GitHub or external version control systems.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">5. Your Data Rights</h2>
        <p>
          Under UK GDPR, you have the right to access, rectify, export, or permanently delete your candidate data and audit run histories at any time through your workspace settings or by emailing privacy@gtvreviewer.co.uk.
        </p>
      </section>
    </div>
  );
}

