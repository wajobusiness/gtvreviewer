import React from "react";
import Link from "next/link";
import { getAuditData } from "@/lib/reports";
import { RiskBadge } from "@/components/RiskBadge";
import {
  BookOpen,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  FileText,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
} from "lucide-react";

export default function RequirementsPage() {
  const audit = getAuditData();
  const { criteriaScorecard, evidenceMatrix } = audit;

  const getRequirementDetails = (id: string) => {
    switch (id) {
      case "MC":
        return {
          guidance:
            "Applicant must demonstrate that they are recognised as a leading talent or emerging talent in digital technology through exceptional product leadership, significant commercial impact, or recognized sector awards.",
          matchedEvidence: evidenceMatrix.filter((e) => e.category.includes("Mandatory")),
          coverage: 40,
          confidence: "Low (28%)",
          missingDocuments: [
            "Official FIRS tax clearance certificates matching claimed ₦14.5M/mo salary",
            "Personal award certificates directly in the applicant's name",
            "Genuine, legitimate software license receipt for production billing system",
            "Audited financial statements corroborating revenue metrics",
          ],
          suggestions: [
            "Purge the IESEG Business School certificate (issued to a third party)",
            "Replace self-asserted salary slips with bank-verified tax receipts",
            "Re-align all revenue claims to exact bank statements",
          ],
        };
      case "OC1":
        return {
          guidance:
            "Applicant has a proven track record of innovation as a founder or senior executive of a product-led digital technology company, or as an employee working on a new digital field or concept.",
          matchedEvidence: [],
          coverage: 0,
          confidence: "N/A (0%)",
          missingDocuments: [
            "Evidence of innovation (patents, groundbreaking algorithms, proprietary IP)",
            "Independent code review, architecture diagrams, or GitHub repo audits",
          ],
          suggestions: [
            "If claiming innovation in the future, provide documentation of proprietary code, architecture, or novel IP.",
          ],
        };
      case "OC2":
        return {
          guidance:
            "Applicant has made significant technical, commercial, or entrepreneurial contributions outside of their immediate occupation that have advanced the digital technology sector.",
          matchedEvidence: evidenceMatrix.filter((e) => e.category.includes("Optional Criterion 2")),
          coverage: 50,
          confidence: "Medium (40%)",
          missingDocuments: [
            "Second distinct qualifying document (currently only 1 document is submitted)",
            "Official publisher contracts or ISBN registration for published programming books",
            "Third-party attendee feedback and verifiable syllabus for youth training programs",
          ],
          suggestions: [
            "Add a 2nd distinct piece of evidence (e.g. open-source contributions or national hackathon judging)",
            "Provide ISBN / Amazon / publisher sales metrics for published tech books",
          ],
        };
      case "OC3":
        return {
          guidance:
            "Applicant has made significant commercial, technical, or entrepreneurial contributions to the digital technology sector as a founder or senior employee of a product-led digital technology company.",
          matchedEvidence: evidenceMatrix.filter((e) => e.category.includes("Optional Criterion 3")),
          coverage: 35,
          confidence: "Low (30%)",
          missingDocuments: [
            "Second distinct qualifying document (guidance mandates minimum 2 distinct documents)",
            "Audited accounting records verifying $1.24M revenue or $52.4k MRR",
            "Legitimate CAC company incorporation certificate matching typed registration number",
          ],
          suggestions: [
            "Submit a second distinct document to cure the document-count refusal trigger",
            "Remove all copy-pasted telemedicine metrics from AI chatbot tables",
            "Reconcile CAC incorporation number mismatch (RC1352306 vs RC1900387)",
          ],
        };
      case "OC4":
        return {
          guidance:
            "Applicant has made substantial academic contributions to digital technology through research published in peer-reviewed journals or presented at major conferences.",
          matchedEvidence: [],
          coverage: 0,
          confidence: "N/A (0%)",
          missingDocuments: [
            "Peer-reviewed academic research papers in recognized IEEE / ACM / arXiv venues",
          ],
          suggestions: ["Not applicable unless academic track is selected."],
        };
      default:
        return {
          guidance: "",
          matchedEvidence: [],
          coverage: 0,
          confidence: "0%",
          missingDocuments: [],
          suggestions: [],
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-blue-400" />
            UK Global Talent Requirements & Coverage
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Verification status against official Tech Nation Immigration Rules (Mandatory + 2 Optional Criteria).
          </p>
        </div>

        <Link
          href="/reports/requirements"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>Official Requirements Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Requirement Cards */}
      <div className="space-y-6">
        {criteriaScorecard.map((criterion) => {
          const details = getRequirementDetails(criterion.id);
          const isClaimed = criterion.claimed;

          return (
            <div
              key={criterion.id}
              className={`rounded-xl border p-5 sm:p-6 backdrop-blur-md transition-all shadow-sm ${
                !isClaimed
                  ? "bg-slate-900/30 border-slate-800/60 opacity-70"
                  : criterion.verdict === "MET"
                  ? "bg-emerald-950/15 border-emerald-500/30"
                  : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-mono font-bold text-sm">
                    {criterion.id}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {criterion.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-mono">
                      Pieces Submitted: {criterion.piecesCount} (Minimum Required: {criterion.minimumRequired})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <RiskBadge status={criterion.verdict} size="md" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground">Criterion Coverage & Strength</span>
                  <span
                    className={
                      details.coverage >= 70
                        ? "text-emerald-400 font-bold"
                        : details.coverage >= 40
                        ? "text-amber-400 font-bold"
                        : "text-red-400 font-bold"
                    }
                  >
                    {details.coverage}% ({details.confidence})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      details.coverage >= 70
                        ? "bg-emerald-500"
                        : details.coverage >= 40
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${details.coverage}%` }}
                  />
                </div>
              </div>

              {/* Guidance snippet */}
              <p className="mt-3 text-xs text-slate-400 italic">
                &quot;{details.guidance}&quot;
              </p>

              {/* Examiner Primary Finding */}
              {criterion.primaryIssue && (
                <div className="mt-3 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-xs text-red-300 flex items-start gap-2">
                  <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-red-400">Examiner Finding:</strong>{" "}
                    {criterion.primaryIssue}
                  </div>
                </div>
              )}

              {/* Missing Documents & Suggestions Grid */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Missing documents */}
                <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-2">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5 uppercase text-[11px] tracking-wider text-red-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Missing Documents & Corroboration
                  </span>
                  <ul className="space-y-1.5 pl-4 list-disc text-slate-400">
                    {details.missingDocuments.map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                  </ul>
                </div>

                {/* Improvement Suggestions */}
                <div className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-2">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5 uppercase text-[11px] tracking-wider text-amber-400">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Actionable Improvement Strategy
                  </span>
                  <ul className="space-y-1.5 pl-4 list-disc text-slate-400">
                    {details.suggestions.map((sug, idx) => (
                      <li key={idx}>{sug}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Matched Documents */}
              {details.matchedEvidence.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground font-semibold">
                    Submitted Evidence Mapped:
                  </span>
                  <div className="mt-2 space-y-1.5">
                    {details.matchedEvidence.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800/60 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="text-slate-300 truncate font-mono text-[11px]">
                            {ev.file}
                          </span>
                        </div>
                        <RiskBadge status={ev.status} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

