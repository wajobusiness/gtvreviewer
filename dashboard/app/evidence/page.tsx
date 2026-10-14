import React from "react";
import Link from "next/link";
import { getAuditData } from "@/lib/reports";
import { EvidenceTable } from "@/components/EvidenceTable";
import { MetricCard } from "@/components/MetricCard";
import { Table, ShieldAlert, CheckCircle2, FileText, ArrowRight } from "lucide-react";

export default function EvidenceMatrixPage() {
  const audit = getAuditData();
  const { evidenceMatrix, kpis } = audit;

  const criticalCount = evidenceMatrix.filter((e) => e.status === "Critical").length;
  const improvementCount = evidenceMatrix.filter((e) => e.status === "Needs Improvement").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <Table className="w-6 h-6 text-blue-400" />
            Evidence Matrix & Verification Registry
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Item-by-item breakdown of submitted documents, criterion mappings, authenticity checks, and risk ratings.
          </p>
        </div>

        <Link
          href="/reports/evidence-matrix"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>View Markdown Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Documents"
          value={evidenceMatrix.length}
          subtitle="Portfolio items"
          icon="FileText"
          variant="default"
        />
        <MetricCard
          title="Critical Defects"
          value={criticalCount}
          subtitle="Deception / Attribution risk"
          icon="ShieldAlert"
          variant="danger"
          badge="FATAL"
        />
        <MetricCard
          title="Needs Improvement"
          value={improvementCount}
          subtitle="Count deficit / Missing proof"
          icon="Table"
          variant="warning"
        />
        <MetricCard
          title="Compliant (Passed)"
          value={kpis.passes}
          subtitle="Passing Tech Nation criteria"
          icon="CheckCircle2"
          variant="success"
        />
      </div>

      {/* Interactive Table */}
      <EvidenceTable data={evidenceMatrix} />
    </div>
  );
}

