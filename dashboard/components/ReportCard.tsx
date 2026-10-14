"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  ShieldAlert,
  Table,
  FileCheck,
  GitCompare,
  Users,
  BookOpen,
  ArrowRight,
  Download,
  Calendar,
  HardDrive,
} from "lucide-react";
import { ReportMeta } from "@/types/audit";
import { RiskBadge } from "./RiskBadge";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  report: ReportMeta;
  delay?: number;
}

const iconMap: Record<string, React.ElementType> = {
  FileText,
  ShieldAlert,
  Table,
  FileCheck,
  GitCompare,
  Users,
  BookOpen,
};

export function ReportCard({ report, delay = 0 }: ReportCardProps) {
  const IconComponent = iconMap[report.icon] || FileText;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Direct link to download the raw markdown file
    const element = document.createElement("a");
    element.setAttribute("href", `/api/download/${report.slug}`);
    element.setAttribute("download", report.filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -3 }}
      className="group relative rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700/80 transition-all p-5 flex flex-col justify-between backdrop-blur-sm shadow-sm"
    >
      <div>
        {/* Top bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform">
              <IconComponent className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-mono uppercase text-muted-foreground tracking-wider font-semibold">
              {report.category}
            </span>
          </div>
          <RiskBadge status={report.status} size="sm" />
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-foreground group-hover:text-blue-400 transition-colors line-clamp-1">
          {report.title}
        </h4>

        {/* Description */}
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {report.description}
        </p>

        {/* Metadata pills */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            {report.date}
          </span>
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-slate-500" />
            {report.size}
          </span>
          {report.score !== undefined && (
            <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-bold text-slate-300">
              Score: {report.score}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <Link
          href={`/reports/${report.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors py-1 px-2 -ml-2 rounded hover:bg-blue-500/10"
        >
          Open Analysis
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>

        <button
          onClick={handleDownload}
          title="Download report Markdown"
          className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

