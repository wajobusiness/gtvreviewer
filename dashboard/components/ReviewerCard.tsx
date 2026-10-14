"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShieldAlert, CheckCircle, AlertTriangle, UserCheck } from "lucide-react";
import { PanelVote } from "@/types/audit";
import { RiskBadge } from "./RiskBadge";
import { cn } from "@/lib/utils";

interface ReviewerCardProps {
  vote: PanelVote;
  index: number;
}

export function ReviewerCard({ vote, index }: ReviewerCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getDecisionIcon = (decision: string) => {
    switch (decision.toUpperCase()) {
      case "APPROVE":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "BORDERLINE":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "REJECT":
      default:
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.1 }}
      className="rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700 transition-all p-5 backdrop-blur-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center font-mono font-bold text-slate-300">
            R{index + 1}
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground tracking-tight">
              {vote.reviewer}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-muted-foreground">Confidence:</span>
              <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden inline-block">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${vote.confidence}%` }}
                />
              </div>
              <span className="text-[11px] font-mono font-semibold text-red-400">
                {vote.confidence}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RiskBadge status={vote.decision} size="md" />
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs text-slate-300 font-medium leading-relaxed">
          {vote.summary}
        </p>
      </div>

      {/* Expandable detailed reasoning */}
      <div className="mt-3 pt-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-left py-1 text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
        >
          <span>{expanded ? "Hide Examiner Reasoning" : "View Examiner Reasoning"}</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              expanded && "transform rotate-180"
            )}
          />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 leading-relaxed font-mono"
            >
              {vote.comments}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

