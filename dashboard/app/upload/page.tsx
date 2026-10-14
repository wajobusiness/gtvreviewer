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
  Globe,
  ExternalLink,
  FolderOpen,
  Link2,
  Check,
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
  source?: "local" | "google_drive";
  driveUrl?: string;
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
    source: "local",
  },
  {
    id: "doc-2",
    name: "Sample_Evidence_MC2_ProductLedGrowth.pdf",
    sizeKb: 2886,
    estimatedPages: 3,
    criterion: "Mandatory Criterion (Leadership / Recognition)",
    status: "warning",
    warningText: "1,000x revenue gap & unverified software license key detected",
    source: "local",
  },
  {
    id: "doc-3",
    name: "Sample_Evidence_MC3_RemunerationReport.pdf",
    sizeKb: 1603,
    estimatedPages: 3,
    criterion: "Mandatory Criterion (Leadership / Recognition)",
    status: "warning",
    warningText: "Internal HR letter references conflicting pronouns; no official tax proof",
    source: "local",
  },
  {
    id: "doc-4",
    name: "Sample_Evidence_OC2B_CommunityContribution.pdf",
    sizeKb: 4176,
    estimatedPages: 3,
    criterion: "Optional Criterion 2 (Work Outside Immediate Occupation)",
    status: "verified",
    source: "local",
  },
  {
    id: "doc-5",
    name: "Sample_Evidence_OC3A_ProductLedImpact.pdf",
    sizeKb: 2196,
    estimatedPages: 3,
    criterion: "Optional Criterion 3 (Commercial / Technical Impact)",
    status: "warning",
    warningText: "Telemedicine copy-paste artifact in AI marketing chatbot table",
    source: "local",
  },
];

export default function EvidenceUploadPage() {
  const router = useRouter();
  const { project } = useAuth();
  const [activeTab, setActiveTab] = useState<"files" | "gdrive">("files");
  const [documents, setDocuments] = useState<UploadedDocument[]>(initialEvidenceDocuments);
  const [isDragging, setIsDragging] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Google Drive state
  const [gdriveUrl, setGdriveUrl] = useState<string>("");
  const [isInspectingDrive, setIsInspectingDrive] = useState<boolean>(false);
  const [driveInspectionSuccess, setDriveInspectionSuccess] = useState<string | null>(null);
  const [driveInspectionError, setDriveInspectionError] = useState<string | null>(null);

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
        source: "local",
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

  const handleInspectDrive = async (customUrl?: string) => {
    const urlToUse = customUrl || gdriveUrl;
    if (!urlToUse || !urlToUse.trim()) {
      setDriveInspectionError("Please enter a Google Drive folder or file URL.");
      return;
    }

    setIsInspectingDrive(true);
    setDriveInspectionError(null);
    setDriveInspectionSuccess(null);

    try {
      const res = await fetch("/api/drive/inspect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToUse }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to inspect Google Drive link.");
      }

      setDriveInspectionSuccess(
        `Public Google Drive folder verified (${data.driveType.toUpperCase()} ID: ${data.driveId}). Imported ${data.totalFiles} evidence documents into audit manifest.`
      );

      // Replace portfolio documents with the Google Drive documents
      const importedDocs: UploadedDocument[] = data.files.map((f: any) => ({
        id: f.id,
        name: f.name,
        sizeKb: f.sizeKb,
        estimatedPages: f.estimatedPages,
        criterion: f.criterion,
        status: f.status,
        source: "google_drive" as const,
        driveUrl: f.driveUrl,
      }));

      setDocuments(importedDocs);
    } catch (err: any) {
      setDriveInspectionError(
        err.message || "Failed to connect to Google Drive link. Ensure the link has public view access."
      );
    } finally {
      setIsInspectingDrive(false);
    }
  };

  const triggerAudit = async () => {
    setIsAuditing(true);
    try {
      const isDrive = activeTab === "gdrive" || documents.some((d) => d.source === "google_drive");
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          candidateName: project.candidateName,
          visaRoute: project.visaRoute,
          sourceType: isDrive ? "GOOGLE_DRIVE" : "LOCAL_UPLOAD",
          googleDriveUrl: isDrive
            ? gdriveUrl || "https://drive.google.com/drive/folders/1SampleTechNationEvidenceBundle2026?usp=sharing"
            : undefined,
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
          subtitle={
            documents.some((d) => d.source === "google_drive")
              ? "Google Drive Ingestion"
              : "Based on OCR inspection"
          }
          icon="ShieldAlert"
          variant={documents.some((d) => d.status === "warning") ? "danger" : "success"}
        />
      </div>

      {/* Ingestion Source Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("files")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
            activeTab === "files"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
              : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          )}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload PDF Files</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 font-mono">
            Direct
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("gdrive")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
            activeTab === "gdrive"
              ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
              : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          )}
        >
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Import from Public Google Drive</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
            Cloud Link
          </span>
        </button>
      </div>

      {/* Method 1: Drag and Drop Zone */}
      {activeTab === "files" && (
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
      )}

      {/* Method 2: Public Google Drive Link Ingestion Card */}
      {activeTab === "gdrive" && (
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950/80 p-6 backdrop-blur-md shadow-lg space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">
                    Scan Public Google Drive Folder or File
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Public Link Required
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Paste a shared Google Drive link with view permissions (<code className="text-slate-300">Anyone with the link can view</code>). The system will automatically inspect, download, and index all evidence PDFs inside the folder.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const sampleUrl =
                  "https://drive.google.com/drive/folders/1SampleTechNationEvidenceBundle2026?usp=sharing";
                setGdriveUrl(sampleUrl);
                handleInspectDrive(sampleUrl);
              }}
              className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 self-start sm:self-auto shrink-0 transition-colors"
            >
              <span>Use Sample Public Drive Folder</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Link2 className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={gdriveUrl}
                onChange={(e) => setGdriveUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/... or https://drive.google.com/file/d/..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-foreground placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-all"
              />
            </div>

            <button
              type="button"
              disabled={isInspectingDrive || !gdriveUrl.trim()}
              onClick={() => handleInspectDrive()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all shrink-0"
            >
              {isInspectingDrive ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Inspecting Google Drive...</span>
                </>
              ) : (
                <>
                  <FolderOpen className="w-4 h-4" />
                  <span>Fetch & Verify Documents</span>
                </>
              )}
            </button>
          </div>

          {/* Feedback messages */}
          {driveInspectionSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-emerald-200">
                  {driveInspectionSuccess}
                </div>
                <div className="text-[11px] text-emerald-400/80">
                  All 5 evidence documents have been loaded into the registry below. You can now adjust criteria tags or click <strong>Trigger Forensic Audit</strong> above.
                </div>
              </div>
            </div>
          )}

          {driveInspectionError && (
            <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-red-200">Google Drive Verification Failed</div>
                <div className="text-[11px] text-red-300/80">{driveInspectionError}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Tip: In Google Drive, click Share &gt; General Access &gt; change to &quot;Anyone with the link&quot; &gt; Role: &quot;Viewer&quot;.
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-400 font-mono">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public View Permissions</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Folder or Direct PDF File</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Automatic OCR & Criteria Mapping</span>
            </div>
          </div>
        </div>
      )}

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
                    {doc.source === "google_drive" && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Globe className="w-3 h-3" />
                        Google Drive
                      </span>
                    )}
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
