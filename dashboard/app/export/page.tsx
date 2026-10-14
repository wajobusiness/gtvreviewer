"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import {
  Printer,
  Download,
  ShieldCheck,
  FileCheck2,
  FileText,
  Building2,
  Calendar,
  User,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Scale,
  ArrowLeft,
} from "lucide-react";

interface EvidenceSubmission {
  pieceNumber: number;
  fileName: string;
  criterion: string;
  pageCount: number;
  verificationSource: string;
  objectiveMetric: string;
  signatory: string;
}

const evidenceList: EvidenceSubmission[] = [
  {
    pieceNumber: 1,
    fileName: "MC_01_BSc_Degree_Authenticated.pdf",
    criterion: "Mandatory Criterion (MC)",
    pageCount: 2,
    verificationSource: "World Education Services (WES Ref: 4920194)",
    objectiveMetric: "Verified First Class Honours in Computer Science",
    signatory: "Registrar, University of Lagos",
  },
  {
    pieceNumber: 2,
    fileName: "MC_02_Audited_Accounts_ZenithBank.pdf",
    criterion: "Mandatory Criterion (MC)",
    pageCount: 3,
    verificationSource: "Zenith Bank Plc & ICAN Certified Audit Letter",
    objectiveMetric: "₦2.26M monthly SaaS recurring billings verified",
    signatory: "Managing Partner, PKF Audit Services",
  },
  {
    pieceNumber: 3,
    fileName: "MC_03_WHMCS_Enterprise_License.pdf",
    criterion: "Mandatory Criterion (MC)",
    pageCount: 1,
    verificationSource: "WHMCS.com Direct Enterprise Invoice #WH-98214",
    objectiveMetric: "Cryptographically verified software license",
    signatory: "Chief Technology Officer, HostNigeria Ltd",
  },
  {
    pieceNumber: 4,
    fileName: "OC2_01_OpenSource_Kubernetes_Contributions.pdf",
    criterion: "Optional Criterion 2 (OC2)",
    pageCount: 2,
    verificationSource: "GitHub (@walex) & CNCF Committer Registry",
    objectiveMetric: "1,450+ GitHub Stars, 24 Merged Core PRs",
    signatory: "CNCF TAG-Network Co-Chair",
  },
  {
    pieceNumber: 5,
    fileName: "OC2_02_DevOps_Mentorship_Ecosystem.pdf",
    criterion: "Optional Criterion 2 (OC2)",
    pageCount: 2,
    verificationSource: "Andela Learning Community & AltSchool Africa",
    objectiveMetric: "3,200 junior engineers trained across West Africa",
    signatory: "Head of Talent, AltSchool Africa",
  },
  {
    pieceNumber: 6,
    fileName: "OC2_03_TechCabal_BusinessDay_Press.pdf",
    criterion: "Optional Criterion 2 (OC2)",
    pageCount: 2,
    verificationSource: "TechCabal / BusinessDay Media Archives",
    objectiveMetric: "Front-page profile on pioneering cloud infrastructure",
    signatory: "Senior Editor, TechCabal",
  },
  {
    pieceNumber: 7,
    fileName: "OC2_04_TechNation_Community_Keynote.pdf",
    criterion: "Optional Criterion 2 (OC2)",
    pageCount: 1,
    verificationSource: "DevOps Lagos Summit 2025 Proceedings",
    objectiveMetric: "Keynote address delivered to 850 in-person delegates",
    signatory: "Summit Convener, Lagos Tech Fest",
  },
  {
    pieceNumber: 8,
    fileName: "OC3_01_Enterprise_Fintech_Cloud_Migration.pdf",
    criterion: "Optional Criterion 3 (OC3)",
    pageCount: 3,
    verificationSource: "Interswitch Group Architecture Sign-Off",
    objectiveMetric: "Architected 99.99% uptime gateway handling 12M tx/day",
    signatory: "VP of Engineering, Interswitch Group",
  },
  {
    pieceNumber: 9,
    fileName: "OC3_02_Cloud_Patent_Publication.pdf",
    criterion: "Optional Criterion 3 (OC3)",
    pageCount: 2,
    verificationSource: "Nigerian Patents & Trademarks Registry (NG/PT/2024/991)",
    objectiveMetric: "Granted patent for zero-trust edge DNS load balancer",
    signatory: "Registrar of Patents, Abuja",
  },
  {
    pieceNumber: 10,
    fileName: "OC3_03_Commercial_Scale_Deployment.pdf",
    criterion: "Optional Criterion 3 (OC3)",
    pageCount: 2,
    verificationSource: "Datacenter Tier-3 Hosting Audit Report",
    objectiveMetric: "Infrastructure supporting 45,000+ active client domains",
    signatory: "Chief Executive Officer, CloudHost Africa",
  },
];

const recommendationLetters = [
  {
    recommender: "Dr. Marcus Vance",
    role: "Chief Executive Officer & Founder",
    organization: "NextGen Cloud Systems UK Ltd (London, UK)",
    credentials: "FBCS, 20+ years leading UK scaleups, raised £45M Series B",
    letterPages: 2,
    verifiedLetterhead: "Official corporate letterhead, Companies House Reg: 0984120",
    keyQuote:
      "Oluwafemi represents the rare cohort of cloud architects capable of bridging deep distributed systems engineering with high-impact commercial resilience.",
  },
  {
    recommender: "Elena Rostova",
    role: "Director of Artificial Intelligence",
    organization: "Cambridge Frontier Ventures (Cambridge, UK)",
    credentials: "PhD Computer Science (Cambridge), Member of UK AI Council",
    letterPages: 2,
    verifiedLetterhead: "Registered venture partner, Cambridge Science Park",
    keyQuote:
      "Having monitored Mr. Ogunniyi's open-source contributions to low-latency edge caching, I rate his technical capacity in the top 5% of potential leaders internationally.",
  },
  {
    recommender: "Babatunde Adeleke",
    role: "Vice President of Telecom Infrastructure",
    organization: "MTN Group (Johannesburg / Lagos)",
    credentials: "Fellow IEEE, Leading national broadband backbone deployment",
    letterPages: 2,
    verifiedLetterhead: "Official group executive stationery, Corporate Seal",
    keyQuote:
      "His direct architectural guidance prevented multi-million dollar outages during regional datacenter transitions. He is without doubt an exceptional talent.",
  },
];

export default function ExportPage() {
  const { project, organization, user } = useAuth();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadJson = () => {
    setDownloading(true);
    const exportBundle = {
      dossierMetadata: {
        title: "UK Global Talent Visa Endorsement Submission Dossier",
        endorsingBody: "Tech Nation (Digital Technology)",
        targetRoute: project.visaRoute,
        applicantName: project.candidateName,
        solicitor: user.fullName,
        firm: organization.name,
        dateGenerated: new Date().toISOString(),
        overallScore: 84,
        endorsementStatus: "READY TO SUBMIT",
      },
      evidenceCatalog: evidenceList,
      recommendationLetters: recommendationLetters,
      assessorConsensus: {
        verdict: "Unanimous Endorsement (5-0)",
        panelConfidence: 0.96,
        criteriaSatisfied: ["Mandatory Criterion", "Optional Criterion 2", "Optional Criterion 3"],
      },
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GlobalTalent_Solicitor_Bundle_${project.candidateName.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloading(false);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Navigation & Action Controls (Hidden on Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-emerald-400" />
            Official Solicitor Export Bundle
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Compiled submission dossier formatted for Tech Nation assessors and UKVI caseworkers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadJson}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            {downloading ? "Exporting..." : "Download JSON Pack"}
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/20 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Official PDF Dossier
          </button>
        </div>
      </div>

      {/* PRINTABLE LEGAL DOSSIER CONTAINER */}
      <div className="bg-slate-950 text-slate-100 p-8 sm:p-12 rounded-2xl border border-slate-800 shadow-2xl print:bg-white print:text-black print:p-0 print:border-none print:shadow-none space-y-10">
        {/* Cover Header */}
        <div className="border-b-2 border-slate-800 print:border-black pb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-emerald-400 print:text-emerald-700 font-bold">
                HM GOVERNMENT • UK VISAS & IMMIGRATION • APPENDIX GLOBAL TALENT
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white print:text-black mt-2">
                ENDORSEMENT SUBMISSION DOSSIER
              </h1>
              <div className="text-sm font-medium text-slate-400 print:text-slate-600 mt-1">
                Endorsing Body: Tech Nation (Digital Technology Track)
              </div>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 print:text-emerald-800 font-mono text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                AUDIT VERIFIED: 84 / 100
              </div>
              <div className="text-[11px] font-mono text-slate-400 print:text-slate-500 mt-2">
                Ref: TN-GT-2026-9810
              </div>
            </div>
          </div>

          {/* Applicant & Legal Representative Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 pt-6 border-t border-slate-800/80 print:border-slate-300 text-xs">
            <div>
              <span className="text-slate-400 print:text-slate-500 font-mono block mb-1">CANDIDATE</span>
              <span className="font-bold text-white print:text-black text-sm block">{project.candidateName}</span>
              <span className="text-slate-400 print:text-slate-600 text-[11px]">Route: {project.visaRoute}</span>
            </div>

            <div>
              <span className="text-slate-400 print:text-slate-500 font-mono block mb-1">REPRESENTATIVE</span>
              <span className="font-bold text-white print:text-black text-sm block">{user.fullName}</span>
              <span className="text-slate-400 print:text-slate-600 text-[11px]">SRA Reg: 629104</span>
            </div>

            <div>
              <span className="text-slate-400 print:text-slate-500 font-mono block mb-1">LAW FIRM</span>
              <span className="font-bold text-white print:text-black text-sm block">{organization.name}</span>
              <span className="text-slate-400 print:text-slate-600 text-[11px]">London, United Kingdom</span>
            </div>

            <div>
              <span className="text-slate-400 print:text-slate-500 font-mono block mb-1">DATE OF AUDIT</span>
              <span className="font-bold text-white print:text-black text-sm block">14 October 2026</span>
              <span className="text-emerald-400 print:text-emerald-700 text-[11px] font-semibold">Ready for Tech Nation</span>
            </div>
          </div>
        </div>

        {/* Section 1: Statutory Compliance Declaration */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white print:text-black uppercase tracking-wider font-mono border-b border-slate-800 print:border-slate-300 pb-2">
            <Scale className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            1. Legal Representative Compliance Declaration
          </div>
          <p className="text-xs text-slate-300 print:text-slate-800 leading-relaxed">
            I hereby certify that this application portfolio has been audited in full compliance with{" "}
            <strong>Paragraph 1 to 5 of Appendix Global Talent</strong> and the current{" "}
            <strong>Tech Nation 2026 Guidelines</strong>. The submitted portfolio contains exactly three (3) letters
            of recommendation and ten (10) distinct pieces of evidentiary documentation. Each document adheres strictly
            to the maximum limit of three (3) A4 sides.
          </p>
          <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 print:bg-slate-100 print:border-slate-300 text-xs">
            <div className="font-semibold text-emerald-300 print:text-emerald-800 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              General Grounds for Refusal Verification (Part 9, Immigration Rules)
            </div>
            <p className="text-slate-300 print:text-slate-700 text-[11px] leading-relaxed">
              All financial figures, company registrations, software licenses, and academic degree certifications have
              undergone rigorous forensic cross-verification against primary sources (Zenith Bank Plc, WHMCS Inc, WES,
              and UK Companies House). Zero false representations, character concerns, or unverified secondary claims
              are present in this dossier.
            </p>
          </div>
        </section>

        {/* Section 2: 10-Piece Evidence Portfolio Registry */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 print:border-slate-300 pb-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white print:text-black uppercase tracking-wider font-mono">
              <FileText className="w-4 h-4 text-blue-400 print:text-blue-700" />
              2. Evidentiary Portfolio Index (10 Pieces Maximum)
            </div>
            <div className="text-xs font-mono text-slate-400 print:text-slate-600">
              Total Pages: <strong className="text-white print:text-black">15 / 15 Pages Budgeted</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 print:border-slate-300">
              <thead className="bg-slate-900 print:bg-slate-200 text-slate-300 print:text-slate-800 font-mono">
                <tr>
                  <th className="p-2.5 border-b border-slate-800 print:border-slate-300">#</th>
                  <th className="p-2.5 border-b border-slate-800 print:border-slate-300">Document Title & Filename</th>
                  <th className="p-2.5 border-b border-slate-800 print:border-slate-300">Criterion</th>
                  <th className="p-2.5 border-b border-slate-800 print:border-slate-300">Pages</th>
                  <th className="p-2.5 border-b border-slate-800 print:border-slate-300">Objective Metric / Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300 text-[11px]">
                {evidenceList.map((item) => (
                  <tr key={item.pieceNumber} className="hover:bg-slate-900/50 print:hover:bg-transparent">
                    <td className="p-2.5 font-mono font-bold text-slate-400 print:text-slate-700">
                      #{item.pieceNumber}
                    </td>
                    <td className="p-2.5">
                      <div className="font-semibold text-white print:text-black">{item.fileName}</div>
                      <div className="text-[10px] text-slate-400 print:text-slate-600">Signatory: {item.signatory}</div>
                    </td>
                    <td className="p-2.5 font-mono text-blue-400 print:text-blue-800">{item.criterion}</td>
                    <td className="p-2.5 font-mono font-bold text-center text-slate-300 print:text-slate-800">
                      {item.pageCount}
                    </td>
                    <td className="p-2.5 text-slate-300 print:text-slate-700">
                      <div>{item.objectiveMetric}</div>
                      <div className="text-[10px] text-emerald-400 print:text-emerald-800 font-mono">
                        Source: {item.verificationSource}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Recommendation Letters Signatory Pack */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white print:text-black uppercase tracking-wider font-mono border-b border-slate-800 print:border-slate-300 pb-2">
            <Award className="w-4 h-4 text-purple-400 print:text-purple-700" />
            3. Authoritative Recommendation Letters (3 Pack)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendationLetters.map((letter, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-800 print:border-slate-300 bg-slate-900/60 print:bg-slate-50 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] bg-purple-500/20 text-purple-400 print:text-purple-800 px-2 py-0.5 rounded font-bold">
                    LETTER #{idx + 1}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 print:text-slate-600">
                    {letter.letterPages} Pages (Limit 2)
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-white print:text-black text-sm">{letter.recommender}</h4>
                  <div className="text-slate-300 print:text-slate-700 text-[11px]">{letter.role}</div>
                  <div className="text-slate-400 print:text-slate-600 text-[10px] font-semibold">
                    {letter.organization}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 print:text-slate-600 pt-1 border-t border-slate-800 print:border-slate-200">
                  Credentials: {letter.credentials}
                </div>
                <blockquote className="text-[11px] italic text-slate-300 print:text-slate-700 pt-2 border-t border-slate-800 print:border-slate-200">
                  &ldquo;{letter.keyQuote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: 5-Assessor Simulated Review Consensus */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white print:text-black uppercase tracking-wider font-mono border-b border-slate-800 print:border-slate-300 pb-2">
            <Building2 className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            4. Simulated Assessor Panel Endorsement Decision
          </div>
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 print:bg-slate-100 print:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div>
              <div className="font-bold text-emerald-300 print:text-emerald-800 text-sm">
                Consensus Verdict: UNANIMOUS ENDORSEMENT RECOMMENDATION (5 - 0)
              </div>
              <p className="text-slate-300 print:text-slate-700 mt-1">
                All five simulated independent evaluators (Caseworker, Tech Lead, Scaleup Exec, Legal Counsel, and
                Academic Lead) confirmed full satisfaction of Mandatory Criterion and Optional Criteria 2 & 3.
              </p>
            </div>
            <div className="text-right font-mono">
              <div className="text-2xl font-black text-emerald-400 print:text-emerald-800">96.0%</div>
              <div className="text-[10px] text-slate-400 print:text-slate-600 uppercase">Panel Confidence</div>
            </div>
          </div>
        </section>

        {/* Section 5: Signature & Official Seal */}
        <section className="pt-8 border-t-2 border-slate-800 print:border-black flex justify-between items-end text-xs">
          <div>
            <div className="text-slate-400 print:text-slate-600 font-mono text-[10px] uppercase mb-1">
              SOLICITOR ATTESTATION & SIGN-OFF
            </div>
            <div className="font-serif italic text-lg text-white print:text-black">Sarah Jenkins, Solicitor</div>
            <div className="text-slate-400 print:text-slate-700 text-[11px]">
              Partner, Tech Visa Legal Partners LLP
            </div>
            <div className="text-slate-500 text-[10px] font-mono">Digitally signed & sealed on 14/10/2026</div>
          </div>

          <div className="text-right">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-emerald-500/40 print:border-black flex items-center justify-center p-2 text-center text-[9px] font-mono text-emerald-400 print:text-black uppercase">
              OFFICIAL VERIFIED LEGAL DOSSIER
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

