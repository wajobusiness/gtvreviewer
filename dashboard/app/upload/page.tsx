"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { MetricCard } from "@/components/MetricCard";
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
  User,
  Compass,
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
  contentText?: string;
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

export default function EvidenceUploadPage() {
  const router = useRouter();
  const { project, addProject } = useAuth();
  const [activeTab, setActiveTab] = useState<"files" | "gdrive">("files");

  // Production state: Starts completely empty with zero fake documents
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis metadata form
  const [candidateName, setCandidateName] = useState(project?.candidateName || "");
  const [visaRoute, setVisaRoute] = useState<"Exceptional Promise" | "Exceptional Talent">(
    project?.visaRoute || "Exceptional Promise"
  );
  const [targetField, setTargetField] = useState<"Digital Technology" | "Arts and Culture" | "Research and Academia">(
    project?.targetField || "Digital Technology"
  );
  const [applicantType, setApplicantType] = useState<"Technical" | "Business" | "Both">(
    project?.applicantType || "Both"
  );
  const [additionalInstructions, setAdditionalInstructions] = useState("");

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

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedDocs: UploadedDocument[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "Mandatory Criterion (Leadership / Recognition)");
      if (project?.id) formData.append("projectId", project.id);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          uploadedDocs.push({
            id: data.fileId || `upload-${Date.now()}-${i}`,
            name: data.fileName || file.name,
            sizeKb: data.fileSizeKb || Math.round(file.size / 1024),
            estimatedPages: data.pageCount || 1,
            criterion: data.category || "Mandatory Criterion (Leadership / Recognition)",
            status: "verified",
            source: "local",
            contentText: data.contentText || "",
          });
        } else {
          // If server extraction failed, add fallback entry
          uploadedDocs.push({
            id: `upload-${Date.now()}-${i}`,
            name: file.name,
            sizeKb: Math.round(file.size / 1024),
            estimatedPages: 1,
            criterion: "Mandatory Criterion (Leadership / Recognition)",
            status: "warning",
            warningText: "Text extraction notice: check file format",
            source: "local",
          });
        }
      } catch (err) {
        uploadedDocs.push({
          id: `upload-${Date.now()}-${i}`,
          name: file.name,
          sizeKb: Math.round(file.size / 1024),
          estimatedPages: 1,
          criterion: "Mandatory Criterion (Leadership / Recognition)",
          status: "verified",
          source: "local",
        });
      }
    }

    setDocuments((prev) => [...prev, ...uploadedDocs]);
    setIsUploading(false);
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

  const handleInspectDrive = async () => {
    if (!gdriveUrl || !gdriveUrl.trim()) {
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
        body: JSON.stringify({ url: gdriveUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to inspect Google Drive link.");
      }

      setDriveInspectionSuccess(
        `Google Drive verified (${data.driveType.toUpperCase()} ID: ${data.driveId}). Imported into audit manifest.`
      );

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
    if (documents.length === 0 && !gdriveUrl) {
      alert("Please upload at least one document or provide a Google Drive link before running the audit.");
      return;
    }

    const effectiveName = candidateName.trim() || project?.candidateName || "Candidate Applicant";

    // If no project exists or candidate name changed, create or update project
    let activeProjectId = project?.id;
    if (!activeProjectId || (candidateName && candidateName !== project?.candidateName)) {
      const created = addProject({
        candidateName: effectiveName,
        visaRoute,
        targetField: targetField as any,
        applicantType,
      });
      activeProjectId = created.id;
    }

    setIsAuditing(true);
    try {
      const isDrive = activeTab === "gdrive" || documents.some((d) => d.source === "google_drive");
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: activeProjectId,
          candidateName: effectiveName,
          visaRoute,
          targetField,
          applicantType,
          documents: documents.map((d) => ({
            name: d.name,
            contentText: d.contentText || "",
            category: d.criterion,
            pageCount: d.estimatedPages,
            sizeKb: d.sizeKb,
            source: d.source || "local",
          })),
          sourceType: isDrive ? "GOOGLE_DRIVE" : "LOCAL_UPLOAD",
          googleDriveUrl: isDrive ? gdriveUrl : undefined,
          additionalInstructions,
        }),
      });

      const data = await res.json();
      if (data.jobId) {
        router.push(`/jobs/${data.jobId}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Failed to dispatch job:", err);
      router.push("/dashboard");
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
            Create New Pre-Submission Analysis
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Upload candidate evidence documents or paste a public Google Drive folder link to execute a hostile forensic audit.
          </p>
        </div>

        <button
          onClick={triggerAudit}
          disabled={isAuditing || (documents.length === 0 && !gdriveUrl)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          {isAuditing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Documents via AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run Forensic Pre-Submission Audit</span>
            </>
          )}
        </button>
      </div>

      {/* Candidate & Analysis Parameters Form */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
          <User className="w-4 h-4 text-blue-400" />
          <span>Candidate & Case Information</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Candidate Legal Name</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="e.g. Dr. Jane Doe"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Visa Route</label>
            <select
              value={visaRoute}
              onChange={(e) => setVisaRoute(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Exceptional Promise">Exceptional Promise (Emerging Leader)</option>
              <option value="Exceptional Talent">Exceptional Talent (Established Leader)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Target Sector Field</label>
            <select
              value={targetField}
              onChange={(e) => setTargetField(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Digital Technology">Digital Technology (Tech Nation)</option>
              <option value="Arts and Culture">Arts and Culture (Arts Council)</option>
              <option value="Research and Academia">Research and Academia (British Academy)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Applicant Profile</label>
            <select
              value={applicantType}
              onChange={(e) => setApplicantType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Both">Both Technical & Business (Founder / Exec)</option>
              <option value="Technical">Technical (Engineer, Architect, Scientist)</option>
              <option value="Business">Business (CPO, Growth, Operations)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-slate-400 font-medium mb-1 text-xs">
            Additional Instructions / Specific Case Notes (Optional)
          </label>
          <input
            type="text"
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            placeholder="e.g. Focus on checking 1000x revenue discrepancies or third-party co-authors on patents"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
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
          title="Statutory Status"
          value={totalEvidencePieces <= 10 && standaloneLettersCount >= 3 ? "Valid" : "Pending"}
          subtitle="Document caps compliance"
          icon="ShieldAlert"
          variant={totalEvidencePieces <= 10 && standaloneLettersCount >= 3 ? "success" : "warning"}
        />
      </div>

      {/* Tab Selector */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("files")}
          className={cn(
            "pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer",
            activeTab === "files"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          <FileText className="w-4 h-4" />
          <span>Upload Files (PDF, DOCX, TXT)</span>
          {documents.filter((d) => d.source !== "google_drive").length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono">
              {documents.filter((d) => d.source !== "google_drive").length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("gdrive")}
          className={cn(
            "pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer",
            activeTab === "gdrive"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          )}
        >
          <Globe className="w-4 h-4" />
          <span>Public Google Drive Link</span>
          {documents.filter((d) => d.source === "google_drive").length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono">
              Connected
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Local Files Dropzone */}
      {activeTab === "files" && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "rounded-xl border-2 border-dashed p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3",
            isDragging
              ? "border-blue-500 bg-blue-500/10"
              : "border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFiles(e.target.files)}
            multiple
            accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
            className="hidden"
          />

          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-200">
              {isUploading ? "Extracting document text..." : "Drop candidate evidence documents here, or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports PDF, DOCX, TXT. Documents will be indexed for multimodal OCR and cross-examination.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Google Drive Ingestion */}
      {activeTab === "gdrive" && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Connect Public Google Drive Folder</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Paste the public sharing link to a Google Drive folder containing candidate evidence. Ensure access is set to <strong>&quot;Anyone with the link can view&quot;</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={gdriveUrl}
                onChange={(e) => setGdriveUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/1abcXYZ... or file link"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleInspectDrive}
              disabled={isInspectingDrive || !gdriveUrl.trim()}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-semibold text-white transition-all cursor-pointer shrink-0"
            >
              {isInspectingDrive ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Inspecting...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify Link</span>
                </>
              )}
            </button>
          </div>

          {driveInspectionSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{driveInspectionSuccess}</span>
            </div>
          )}

          {driveInspectionError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{driveInspectionError}</span>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Documents Manifest Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Uploaded Documents Manifest ({documents.length})</span>
          </h2>

          {documents.length > 0 && (
            <button
              onClick={() => setDocuments([])}
              className="text-xs text-red-400 hover:text-red-300 font-medium cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800/80 rounded-lg">
            No evidence files added yet. Upload files above or verify a public Google Drive folder link.
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-200">{doc.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {doc.sizeKb} KB • ~{doc.estimatedPages} page{doc.estimatedPages > 1 ? "s" : ""} • Source: {doc.source === "google_drive" ? "Google Drive" : "Direct Upload"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={doc.criterion}
                    onChange={(e) => updateCriterion(doc.id, e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 focus:outline-none focus:border-blue-500 max-w-xs truncate"
                  >
                    {criterionOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    title="Remove File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
