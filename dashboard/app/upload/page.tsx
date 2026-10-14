"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { MetricCard } from "@/components/MetricCard";
import { RiskBadge } from "@/components/RiskBadge";
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Layers,
  FileCheck2,
  Plus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedDocument {
  id: string;
  name: string;
  sizeKb: number;
  estimatedPages: number;
  criterion: string;
  status: "verified" | "uploading" | "warning";
  warningText?: string;
}

const criterionOptions = [
  "Mandatory Criterion (Leadership / Recognition)",
  "Optional Criterion 1 (Innovation / IP)",
  "Optional Criterion 2 (Work Outside Immediate Occupation)",
  "Optional Criterion 3 (Commercial / Technical Impact)",
  "Optional Criterion 4 (Academic Research)",
  "Standalone Letter of Recommendation 1",
  "Standalone Letter of Recommendation 2",
  "Standalone Letter of Recommendation 3",
  "Candidate CV / Resume (Max 2 Pages)",
  "Personal Statement (Max 1,000 Words)",
];

const initialEvidenceDocuments: UploadedDocument[] = [
  {
    id: "doc-1",
    name: "Sample_Evidence_MC1_TechLeadershipAward.pdf",
    sizeKb: 2678,
    estimatedPages: 3,
    criterion: "Mandatory Criterion (Leadership / Recognition)",
    status: "warning",
    warningText: "Third-party co-author name identified in award certificate",
  },
  {
    id: "doc-2",
    name: "Sample_Evidence_MC2_ProductLedGrowth.pdf",
    sizeKb: 2886,
    estimatedPages: 3,
    criterion: "Mandatory Criterion (Leadership / Recognition)",
    status: "warning",
    warningText: "1,000x revenue gap & unverified software license key detected",
  },
  {
    id: "doc-3",
    name: "Sample_Evidence_MC3_RemunerationReport.pdf",
    sizeKb: 1603,
    estimatedPages: 3,
    criterion: "Mandatory Criterion (Leadership / Recognition)",
    status: "warning",
    warningText: "Internal HR letter references conflicting pronouns; no official tax proof",
  },
  {
    id: "doc-4",
    name: "Sample_Evidence_OC2B_CommunityContribution.pdf",
    sizeKb: 4176,
    estimatedPages: 3,
    criterion: "Optional Criterion 2 (Work Outside Immediate Occupation)",
    status: "verified",
  },
  {
    id: "doc-5",
    name: "Sample_Evidence_OC3A_ProductLedImpact.pdf",
    sizeKb: 2196,
    estimatedPages: 3,
    criterion: "Optional Criterion 3 (Commercial / Technical Impact)",
    status: "warning",
    warningText: "Telemedicine copy-paste artifact in AI marketing chatbot table",
  },
];

export default function EvidenceUploadPage() {
  const router = useRouter();
  const { project, organization } = useAuth();
  const [documents, setDocuments] = useState<UploadedDocument[]>(initialEvidenceDocuments);
  const [isDragging, setIsDragging] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalEvidencePieces = documents.filter(
    (d) =>
      !d.criterion.includes("CV") &&
      !d.criterion.includes("Personal Statement") &&
      !d.criterion.includes("Letter of Recommendation")
  ).length;

  const totalPages = documents.reduce((acc, curr) => acc + curr.estimatedPages, 0);
  const standaloneLettersCount = documents.filter((d) =>
    d.criterion.includes("Letter of Recommendation")
  ).length;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newDocs: UploadedDocument[] = [];
    Array.from(files).forEach((file, index) => {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        alert(`File "${file.name}" rejected. Tech Nation requires PDF format only.`);
        return;
      }

      const estimatedPages = Math.max(1, Math.min(3, Math.ceil(file.size / (800 * 1024))));
      newDocs.push({
        id: `upload-${Date.now()}-${index}`,
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        estimatedPages,
        criterion: "Mandatory Criterion (Leadership / Recognition)",
        status: "verified",
      });
    });

    setDocuments((prev) => [...prev, ...newDocs]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const updateCriterion = (id: string, criterion: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, criterion } : d))
    );
  };

  const triggerAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          candidateName: project.candidateName,
          visaRoute: project.visaRoute,
        }),
      });
      const data = await res.json();
      if (data.jobId) {
        router.push(`/jobs/${data.jobId}`);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Failed to dispatch job:", err);
      router.push("/");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <UploadCloud className="w-6 h-6 text-blue-400" />
            Evidence Portfolio Upload & Verification Hub
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Uploading and tagging PDF evidence for <strong>{project.candidateName}</strong> ({project.visaRoute}).
          </p>
        </div>

        <button
          onClick={triggerAudit}
          disabled={isAuditing || documents.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          {isAuditing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Documents via OCR...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Trigger Forensic Audit</span>
            </>
          )}
        </button>
      </div>

      {/* Portfolio Budget Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Evidence Pieces"
          value={`${totalEvidencePieces} / 10`}
          subtitle="Max 10 per Tech Nation rule"
          icon="FileCheck2"
          variant={totalEvidencePieces > 10 ? "danger" : "default"}
          badge={totalEvidencePieces > 10 ? "EXCEEDED" : `${10 - totalEvidencePieces} Left`}
        />
        <MetricCard
          title="Total Page Budget"
          value={`${totalPages} / 30`}
          subtitle="Max 3 pages per piece"
          icon="Layers"
          variant={totalPages > 30 ? "danger" : "default"}
        />
        <MetricCard
          title="Standalone Rec Letters"
          value={`${standaloneLettersCount} / 3`}
          subtitle="3 mandatory letters required"
          icon="FileText"
          variant={standaloneLettersCount < 3 ? "danger" : "success"}
          badge={standaloneLettersCount < 3 ? "DEFICIT" : "MET"}
        />
        <MetricCard
          title="Pre-Screen Status"
          value={documents.some((d) => d.status === "warning") ? "Defects Found" : "Valid"}
          subtitle="Based on OCR inspection"
          icon="ShieldAlert"
          variant={documents.some((d) => d.status === "warning") ? "danger" : "success"}
        />
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 backdrop-blur-sm flex flex-col items-center justify-center gap-3",
          isDragging
            ? "border-blue-500 bg-blue-600/10 scale-[1.01]"
            : "border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="p-3.5 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">
            Drag and drop candidate evidence PDFs here, or click to browse
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            Supported: PDF format only • Maximum 3 sides of A4 per evidence piece • Up to 50MB per file
          </p>
        </div>
      </div>

      {/* Uploaded Documents Registry */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
              Evidence Portfolio Items ({documents.length})
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">
            Assign each document to its corresponding Tech Nation criterion
          </span>
        </div>

        <div className="divide-y divide-slate-800/60">
          {documents.map((doc, idx) => (
            <div
              key={doc.id}
              className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-slate-400 shrink-0 mt-0.5">
                  {idx + 1}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-xs text-slate-200 truncate">
                      {doc.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      ({doc.sizeKb} KB • ~{doc.estimatedPages} pages)
                    </span>
                  </div>

                  {doc.warningText && (
                    <div className="flex items-center gap-1.5 text-[11px] text-red-400 font-mono bg-red-950/30 px-2 py-0.5 rounded border border-red-500/20 max-w-2xl">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{doc.warningText}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Criterion Assignment Dropdown */}
              <div className="flex items-center gap-3 shrink-0">
                <select
                  value={doc.criterion}
                  onChange={(e) => updateCriterion(doc.id, e.target.value)}
                  className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 max-w-xs truncate"
                >
                  {criterionOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => removeDocument(doc.id)}
                  title="Remove document from portfolio"
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

