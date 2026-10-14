"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { UserCheck, ChevronDown, Check, Plus, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectSwitcher() {
  const { project, projects, switchProject } = useAuth();
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-xs text-foreground transition-all"
        title="Switch Candidate Portfolio"
      >
        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-semibold max-w-[120px] sm:max-w-[170px] truncate">
          {project ? project.candidateName : "No Active Portfolio"}
        </span>
        {project && (
          <span className="hidden sm:inline-block font-mono text-[10px] text-slate-400">
            ({project.currentScore}/100)
          </span>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-72 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl p-1.5 z-50 text-xs">
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Candidate Portfolios
            </span>
            <Link
              href="/projects"
              onClick={() => setOpen(false)}
              className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold"
            >
              View All ({projects.length})
            </Link>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/40 my-1">
            {projects.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-[11px]">
                No portfolios created yet.
              </div>
            ) : (
              projects.map((p) => {
                const isSelected = project?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchProject(p.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors",
                      isSelected
                        ? "bg-blue-600/15 text-blue-300 font-medium"
                        : "hover:bg-slate-800 text-slate-300"
                    )}
                  >
                    <div className="truncate mr-2">
                      <div className="font-semibold truncate">{p.candidateName}</div>
                      <div className="text-[10px] text-muted-foreground font-mono truncate">
                        {p.visaRoute} • {p.totalRuns} Run{p.totalRuns !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={cn(
                          "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded",
                          p.currentScore >= 70
                            ? "bg-emerald-500/15 text-emerald-400"
                            : p.currentScore >= 50
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-red-500/15 text-red-400"
                        )}
                      >
                        {p.currentScore}/100
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="pt-1.5 border-t border-slate-800">
            <Link
              href="/projects/new"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Candidate Portfolio</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
