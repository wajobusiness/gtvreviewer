"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Table,
  BookOpen,
  FileCheck,
  GitCompare,
  Users,
  BarChart3,
  ShieldAlert,
  Menu,
  X,
  FileBadge,
  FolderKanban,
  UploadCloud,
  CreditCard,
  FileCheck2,
  ShieldCheck,
  Settings,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/context/AuthContext";

const navigationItems = [
  { name: "Executive Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Executive Summary", href: "/summary", icon: ShieldAlert },
  { name: "Candidates & Portfolios", href: "/projects", icon: FolderKanban },
  { name: "Evidence Uploader", href: "/upload", icon: UploadCloud },
  { name: "Solicitor Bundle", href: "/export", icon: FileCheck2 },
  { name: "Billing & Plans", href: "/billing", icon: CreditCard },
  { name: "Workspace Settings", href: "/settings", icon: Settings },
  { name: "Audit Reports", href: "/reports", icon: FileText },
  { name: "Evidence Matrix", href: "/evidence", icon: Table },
  { name: "Requirements Coverage", href: "/requirements", icon: BookOpen },
  { name: "Letter Forensics", href: "/letters", icon: FileCheck },
  { name: "Consistency Check", href: "/consistency", icon: GitCompare },
  { name: "Panel Simulation", href: "/panel", icon: Users },
  { name: "Quantitative Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Public Homepage", href: "/", icon: Globe },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, activeRunId, project } = useAuth();
  const isRun2 = activeRunId === "run-002";

  const isCandidate = user.role === "CANDIDATE";
  const isAdmin = user.role === "ADMIN";

  const visibleItems = navigationItems.filter((item) => {
    if (isCandidate && (item.href === "/export" || item.href === "/billing")) {
      return false;
    }
    return true;
  });

  const finalItems = isAdmin
    ? [{ name: "Admin Telemetry", href: "/admin", icon: ShieldCheck }, ...visibleItems]
    : visibleItems;

  return (
    <>
      {/* Mobile Menu Trigger */}
      <div className="lg:hidden fixed top-3 left-3 z-40">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-30 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="overflow-y-auto">
          {/* Logo & Platform Info */}
          <div className="p-5 border-b border-slate-800/80">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <FileBadge className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  GLOBAL TALENT
                  <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-mono">
                    AUDIT
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Tech Nation • UK Visa
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Platform Navigation
            </div>
            {finalItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));

              const Icon = item.icon;
              const isAuditPage =
                item.href !== "/" &&
                item.href !== "/projects" &&
                item.href !== "/billing" &&
                item.href !== "/settings";

              const itemHref =
                isAuditPage && project?.id
                  ? `${item.href}?projectId=${encodeURIComponent(project.id)}${activeRunId ? `&runId=${encodeURIComponent(activeRunId)}` : ""}`
                  : item.href;

              return (
                <Link
                  key={item.name}
                  href={itemHref}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                    isActive
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-blue-400"
                        : "text-slate-500 group-hover:text-slate-300"
                    )}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status Card */}
        <div className="p-4 border-t border-slate-800/80">
          <div
            className={cn(
              "rounded-xl border p-3 text-xs transition-colors",
              isRun2
                ? "border-emerald-500/30 bg-emerald-950/20"
                : "border-red-500/30 bg-red-950/20"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between font-bold mb-1",
                isRun2 ? "text-emerald-400" : "text-red-400"
              )}
            >
              <span className="flex items-center gap-1.5">
                {isRun2 ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
                )}
                {isRun2 ? "READY TO SUBMIT" : "REFUSAL RISK"}
              </span>
              <span className="font-mono text-xs">{isRun2 ? "84/100" : "32/100"}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {isRun2
                ? "Remediated submission draft meets all criteria with 3 compliant letters."
                : "Pre-submission audit found 6 critical defects & deception risks."}
            </p>
            <div
              className={cn(
                "mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] font-mono text-slate-400",
                isRun2 ? "border-emerald-500/20" : "border-red-500/20"
              )}
            >
              <span>Success Prob:</span>
              <span className={cn("font-bold", isRun2 ? "text-emerald-400" : "text-red-400")}>
                {isRun2 ? "87.0%" : "4.0%"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
