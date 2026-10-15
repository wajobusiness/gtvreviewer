"use client";

import React from "react";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { ProjectSwitcher } from "./ProjectSwitcher";
import { AuditRunSwitcher } from "./AuditRunSwitcher";
import { UserProfileMenu } from "./UserProfileMenu";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { RiskBadge } from "./RiskBadge";
import Link from "next/link";
import { GitCompare, FileCheck2 } from "lucide-react";

import { useAuth } from "@/lib/context/AuthContext";

interface HeaderProps {
  documentOwner?: string;
  auditDate?: string;
  currentStatus?: string;
}

export function Header({
  documentOwner = "Applicant",
  auditDate = "2026-10-13",
  currentStatus = "CRITICAL REFUSAL RISK",
}: HeaderProps) {
  const { project } = useAuth();
  const effectiveStatus = project?.status === "ready_to_submit"
    ? "READY TO SUBMIT"
    : project?.status === "action_required"
    ? "CRITICAL REFUSAL RISK"
    : currentStatus;

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Switchers (Organization, Project, Audit Run) */}
        <div className="flex items-center flex-wrap gap-2 pl-10 lg:pl-0">
          <WorkspaceSwitcher />
          <ProjectSwitcher />
          <div className="hidden xl:block">
            <AuditRunSwitcher />
          </div>
          {effectiveStatus && effectiveStatus !== "NO_ANALYSIS" && (
            <RiskBadge status={effectiveStatus} size="sm" className="hidden lg:inline-flex" />
          )}
        </div>

        {/* Right: Actions, Search, Theme & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link
            href="/export"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-500/50 transition-colors"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Solicitor Bundle</span>
          </Link>
          <SearchBar />
          <ThemeToggle />
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
}
