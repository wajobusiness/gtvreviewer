import React from "react";
import Link from "next/link";
import { FileBadge, ShieldCheck, Heart } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <FileBadge className="w-4 h-4" />
              </div>
              <span className="text-sm font-extrabold text-white tracking-tight">
                GLOBAL TALENT AUDIT
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The hostile-but-fair pre-submission AI audit platform for the UK Global Talent Visa (Tech Nation Digital Technology route). Built for immigration law firms and exceptional tech talent.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Full compliance with 2026 Tech Nation Guidelines & Appendix Global Talent</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
              Product
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-white transition-colors">
                  Version Diff Engine
                </Link>
              </li>
              <li>
                <Link href="/export" className="hover:text-white transition-colors">
                  Solicitor Dossier
                </Link>
              </li>
              <li>
                <Link href="/upload" className="hover:text-white transition-colors">
                  Evidence Ingestion
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines Links */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
              Criteria
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/requirements" className="hover:text-white transition-colors">
                  Mandatory Criterion (MC)
                </Link>
              </li>
              <li>
                <Link href="/requirements" className="hover:text-white transition-colors">
                  OC1: Innovation
                </Link>
              </li>
              <li>
                <Link href="/requirements" className="hover:text-white transition-colors">
                  OC2: Outside Work
                </Link>
              </li>
              <li>
                <Link href="/requirements" className="hover:text-white transition-colors">
                  OC3: Significant Impact
                </Link>
              </li>
              <li>
                <Link href="/letters" className="hover:text-white transition-colors">
                  Letter Forensics
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-white font-bold">
              Legal & Trust
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Client Portal Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Law Firm Registration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} GTV Reviewer Platform. Independent legal tech software. Not affiliated with or endorsed by Tech Nation or the UK Home Office.
          </p>
          <div className="flex items-center gap-1">
            <span>Built for UK Digital Technology Endorsement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

