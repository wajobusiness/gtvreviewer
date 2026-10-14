"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { History, ChevronDown, Check, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuditRunSwitcher() {
  const { auditRuns, activeRunId, switchAuditRun } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeRun = auditRuns.find((r) => r.id === activeRunId) || auditRuns[0];

  if (!activeRun) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-xs text-foreground transition-all"
        title="Audit Version & History"
      >
        <History className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-semibold">Run v{activeRun.versionNumber}</span>
        {activeRun.isLatest && (
          <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold">
            LATEST
          </span>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-64 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl p-1.5 z-50 text-xs">
          <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Historical Audit Runs
          </div>
          <div className="space-y-1">
            {auditRuns.map((run) => {
              const isSelected = run.id === activeRun.id;
              return (
                <button
                  key={run.id}
                  onClick={() => {
                    switchAuditRun(run.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors",
                    isSelected
                      ? "bg-blue-600/15 text-blue-300 font-medium"
                      : "hover:bg-slate-800 text-slate-300"
                  )}
                >
                  <div>
                    <div className="font-semibold flex items-center gap-1.5">
                      <span>Run v{run.versionNumber}</span>
                      {run.isLatest && (
                        <span className="text-[9px] text-emerald-400 font-mono font-bold">
                          [Active]
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {run.createdAt} • {run.currentStatus}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded",
                        run.overallScore >= 70
                          ? "bg-emerald-500/15 text-emerald-400"
                          : run.overallScore >= 50
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-red-500/15 text-red-400"
                      )}
                    >
                      {run.overallScore}/100
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

