"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { User, Shield, Briefcase, UserCheck, ChevronDown, Check } from "lucide-react";
import { UserRole } from "@/types/auth";
import { cn } from "@/lib/utils";

export function UserProfileMenu() {
  const { user, switchUserRole } = useAuth();
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

  const roles: { role: UserRole; label: string; desc: string }[] = [
    {
      role: "SOLICITOR",
      label: "Immigration Solicitor",
      desc: "Full access across all candidate portfolios & forensic analysis",
    },
    {
      role: "CANDIDATE",
      label: "Visa Applicant",
      desc: "Candidate view for reviewing findings & uploading documents",
    },
    {
      role: "ADMIN",
      label: "Firm Administrator",
      desc: "Full administrative & billing management permissions",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs text-foreground transition-all"
        title="User Profile & Role Switching"
      >
        <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-[11px]">
          {user.fullName.charAt(0)}
        </div>
        <div className="hidden md:flex flex-col text-left">
          <span className="font-semibold text-xs leading-none">{user.fullName.split(",")[0]}</span>
          <span className="text-[10px] text-muted-foreground font-mono leading-none mt-1">
            {user.role}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1.5 w-72 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl p-2 z-50 text-xs">
          <div className="p-2 border-b border-slate-800">
            <div className="font-semibold text-foreground">{user.fullName}</div>
            <div className="text-[11px] text-muted-foreground font-mono mt-0.5">{user.email}</div>
          </div>

          <div className="p-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Simulate Persona / Role View
          </div>

          <div className="space-y-1">
            {roles.map((r) => {
              const isSelected = r.role === user.role;
              return (
                <button
                  key={r.role}
                  onClick={() => {
                    switchUserRole(r.role);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-start justify-between p-2 rounded-lg text-left transition-colors",
                    isSelected
                      ? "bg-blue-600/15 text-blue-300 font-medium"
                      : "hover:bg-slate-800 text-slate-300"
                  )}
                >
                  <div>
                    <div className="font-semibold flex items-center gap-1.5">
                      {r.role === "SOLICITOR" ? (
                        <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                      ) : r.role === "CANDIDATE" ? (
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Shield className="w-3.5 h-3.5 text-purple-400" />
                      )}
                      <span>{r.label}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                      {r.desc}
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-2 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

