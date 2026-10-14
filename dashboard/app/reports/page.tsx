import React from "react";
import { getAllReports } from "@/lib/reports";
import { ReportCard } from "@/components/ReportCard";
import { FileText, Sparkles, FolderSync } from "lucide-react";

export default async function ReportsIndexPage() {
  const reportsData = await Promise.resolve(getAllReports());
  const reports = Array.isArray(reportsData) ? reportsData : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-blue-400" />
            Audit Reports Repository
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            All dynamically discovered markdown reports compiled by the forensic audit engine.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg">
          <FolderSync className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
          <span>Auto-scanned: {reports.length} files detected</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report, idx) => (
          <ReportCard key={report.slug} report={report} delay={idx * 0.05} />
        ))}
      </div>
    </div>
  );
}

