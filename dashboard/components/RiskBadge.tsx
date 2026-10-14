"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showDot?: boolean;
}

export function RiskBadge({
  status,
  size = "md",
  className,
  showDot = true,
}: RiskBadgeProps) {
  const norm = status?.toUpperCase() || "";

  let bg = "bg-slate-800/80 text-slate-300 border-slate-700";
  let dotColor = "bg-slate-400";

  if (
    norm.includes("CRITICAL") ||
    norm.includes("REJECT") ||
    norm.includes("REFUSAL") ||
    norm.includes("NOT MET") ||
    norm.includes("FAIL")
  ) {
    bg = "bg-red-500/10 text-red-400 border-red-500/30";
    dotColor = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]";
  } else if (
    norm.includes("WARNING") ||
    norm.includes("BORDERLINE") ||
    norm.includes("NEEDS IMPROVEMENT") ||
    norm.includes("AMBER") ||
    norm.includes("MEDIUM")
  ) {
    bg = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    dotColor = "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]";
  } else if (
    norm.includes("PASS") ||
    norm.includes("APPROVE") ||
    norm.includes("MET") ||
    norm.includes("COMPLETED")
  ) {
    bg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    dotColor = "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]";
  } else if (norm.includes("MISSING") || norm.includes("HIGH")) {
    bg = "bg-orange-500/10 text-orange-400 border-orange-500/30";
    dotColor = "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]";
  } else if (norm.includes("INFO") || norm.includes("PENDING")) {
    bg = "bg-blue-500/10 text-blue-400 border-blue-500/30";
    dotColor = "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]";
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border tracking-wide uppercase font-mono transition-all",
        sizeClasses[size],
        bg,
        className
      )}
    >
      {showDot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColor)}
        />
      )}
      {status}
    </span>
  );
}

