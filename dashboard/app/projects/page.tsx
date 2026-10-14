"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { MetricCard } from "@/components/MetricCard";
import { RiskBadge } from "@/components/RiskBadge";
import {
  FolderKanban,
  Plus,
  Search,
  UserCheck,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const { projects, project: activeProject, switchProject, deleteProject, organization } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      p.visaRoute.toLowerCase().includes(search.toLowerCase()) ||
      p.targetField.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "ALL" || p.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const readyCount = projects.filter((p) => p.status === "ready_to_submit").length;
  const actionCount = projects.filter((p) => p.status === "action_required").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-blue-400" />
            Candidate Applications & Portfolios
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Managing candidate applications within <strong>{organization.name}</strong> ({organization.tier}).
          </p>
        </div>

        <Link
          href="/projects/new"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Candidate Portfolio</span>
        </Link>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Total Candidates"
          value={projects.length}
          subtitle="In current workspace"
          icon="Users"
          variant="default"
        />
        <MetricCard
          title="Action Required"
          value={actionCount}
          subtitle="Refusal / Defect risks"
          icon="ShieldAlert"
          variant="danger"
          badge="CRITICAL"
        />
        <MetricCard
          title="Ready to Submit"
          value={readyCount}
          subtitle="Score >= 70 threshold"
          icon="CheckCircle2"
          variant="success"
        />
        <MetricCard
          title="Firm Seats Used"
          value={`${organization.seatsUsed}/${organization.seatsMax}`}
          subtitle={`${organization.tier} plan`}
          icon="Table"
          variant="default"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search candidate name, visa route, or field..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900/60 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ready_to_submit">Ready to Submit</option>
            <option value="action_required">Action Required</option>
            <option value="auditing">Auditing / In Progress</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl space-y-3 bg-slate-900/20">
          <FolderKanban className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No candidate applications found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {search
              ? "No candidate matches your search filter."
              : "Create your first candidate portfolio to begin pre-submission forensic auditing."}
          </p>
          <div className="pt-2">
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Candidate Portfolio</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p) => {
            const isActive = p.id === activeProject?.id;
            return (
              <div
                key={p.id}
                className={cn(
                  "rounded-xl border p-5 backdrop-blur-sm transition-all flex flex-col justify-between shadow-sm relative group",
                  isActive
                    ? "bg-slate-900/80 border-blue-500/50 shadow-blue-500/10"
                    : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                )}
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
                        {p.candidateName.charAt(0) || "C"}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-sm leading-tight">
                          {p.candidateName}
                        </h3>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {p.visaRoute}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isActive && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono font-bold">
                          ACTIVE
                        </span>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Delete portfolio for ${p.candidateName}?`)) {
                            deleteProject(p.id);
                          }
                        }}
                        className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors cursor-pointer text-xs"
                        title="Delete Portfolio"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Score and Status */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 my-3">
                    <div>
                      <div className="text-[10px] text-muted-foreground font-mono uppercase">
                        Audit Readiness
                      </div>
                      <div className="text-xl font-extrabold font-mono text-foreground flex items-baseline gap-1 mt-0.5">
                        <span
                          className={
                            p.currentScore >= 70
                              ? "text-emerald-400"
                              : p.currentScore >= 50
                              ? "text-amber-400"
                              : "text-red-400"
                          }
                        >
                          {p.currentScore}
                        </span>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                    </div>

                    <RiskBadge
                      status={
                        p.status === "ready_to_submit"
                          ? "READY"
                          : p.status === "action_required"
                          ? "CRITICAL RISKS"
                          : p.status === "auditing"
                          ? "IN PROGRESS"
                          : "DRAFT"
                      }
                      size="sm"
                    />
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1 text-xs text-slate-400 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Field:</span>
                      <span>{p.targetField}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Applicant Type:</span>
                      <span>{p.applicantType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Audit History:</span>
                      <span>{p.totalRuns} Run{p.totalRuns !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  {isActive ? (
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span>View Live Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => switchProject(p.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>Switch to this Candidate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <Link
                    href="/upload"
                    className="text-xs text-muted-foreground hover:text-slate-200 transition-colors font-mono"
                  >
                    Upload Evidence
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

