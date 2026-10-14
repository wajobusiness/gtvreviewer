"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LucideIcon,
  FileText,
  Layers,
  FileCheck2,
  Newspaper,
  Trophy,
  Image as ImageIcon,
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Award,
  Users,
  XCircle,
  Scale,
  Activity,
  TrendingDown,
  Table,
  UserX,
  TrendingUp,
  GitCompare,
  FileSpreadsheet,
  CopyX,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Layers,
  FileCheck2,
  Newspaper,
  Trophy,
  ImageIcon,
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Award,
  Users,
  XCircle,
  Scale,
  Activity,
  TrendingDown,
  Table,
  UserX,
  TrendingUp,
  GitCompare,
  FileSpreadsheet,
  CopyX,
};

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon | string;
  badge?: string;
  variant?: "default" | "danger" | "warning" | "success" | "info";
  className?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  badge,
  variant = "default",
  className,
  delay = 0,
}: MetricCardProps) {
  const variantStyles = {
    default: "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70",
    danger: "border-red-500/20 bg-red-950/20 hover:border-red-500/40 hover:bg-red-950/30",
    warning: "border-amber-500/20 bg-amber-950/20 hover:border-amber-500/40 hover:bg-amber-950/30",
    success: "border-emerald-500/20 bg-emerald-950/20 hover:border-emerald-500/40 hover:bg-emerald-950/30",
    info: "border-blue-500/20 bg-blue-950/20 hover:border-blue-500/40 hover:bg-blue-950/30",
  };

  const iconColors = {
    default: "text-slate-400 bg-slate-800/60 border-slate-700/60",
    danger: "text-red-400 bg-red-500/10 border-red-500/30",
    warning: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    success: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    info: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  };

  const ResolvedIcon =
    typeof icon === "string" ? iconMap[icon] : (icon as React.ElementType | undefined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2 }}
      className={cn(
        "relative rounded-xl border p-4 sm:p-5 backdrop-blur-md transition-all duration-200 shadow-sm group",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </span>
        {ResolvedIcon && (
          <div
            className={cn(
              "p-2 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-105",
              iconColors[variant]
            )}
          >
            <ResolvedIcon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
          {value}
        </div>
        {badge && (
          <span
            className={cn(
              "text-[11px] font-semibold px-2 py-0.5 rounded-full border",
              variant === "danger"
                ? "bg-red-500/15 text-red-400 border-red-500/30"
                : variant === "warning"
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : variant === "success"
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : "bg-slate-800 text-slate-300 border-slate-700"
            )}
          >
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-muted-foreground truncate">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
