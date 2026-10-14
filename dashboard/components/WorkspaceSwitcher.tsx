"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Building2, ChevronDown, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function WorkspaceSwitcher() {
  const { organization, organizations, switchOrganization } = useAuth();
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
        title="Switch Organization / Firm"
      >
        <Building2 className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-semibold max-w-[140px] sm:max-w-[180px] truncate">
          {organization.name}
        </span>
        <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono">
          {organization.tier === "FIRM_ENTERPRISE" ? "ENTERPRISE" : "PRO"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-64 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl p-1.5 z-50 text-xs">
          <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Select Organization / Practice
          </div>
          {organizations.map((org) => {
            const isSelected = org.id === organization.id;
            return (
              <button
                key={org.id}
                onClick={() => {
                  switchOrganization(org.id);
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
                  <div className="font-semibold truncate">{org.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    Seats: {org.seatsUsed}/{org.seatsMax} • {org.tier}
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

