"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  AlertOctagon,
  CheckCircle2,
  FileText,
  ExternalLink,
} from "lucide-react";
import { EvidenceRow } from "@/types/audit";
import { RiskBadge } from "./RiskBadge";
import { cn } from "@/lib/utils";

interface EvidenceTableProps {
  data: EvidenceRow[];
}

export function EvidenceTable({ data }: EvidenceTableProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortField, setSortField] = useState<keyof EvidenceRow>("category");
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => {
    const set = new Set<string>();
    data.forEach((row) => set.add(row.category));
    return ["ALL", ...Array.from(set)];
  }, [data]);

  const statuses = useMemo(() => {
    const set = new Set<string>();
    data.forEach((row) => set.add(row.status));
    return ["ALL", ...Array.from(set)];
  }, [data]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const matchesCategory =
          selectedCategory === "ALL" || item.category === selectedCategory;
        const matchesStatus =
          selectedStatus === "ALL" || item.status === selectedStatus;
        const q = search.toLowerCase();
        const matchesSearch =
          !q ||
          item.file.toLowerCase().includes(q) ||
          item.requirement.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.risk.toLowerCase().includes(q) ||
          item.metrics.toLowerCase().includes(q);

        return matchesCategory && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const aVal = String(a[sortField] || "");
        const bVal = String(b[sortField] || "");
        return sortAsc
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      });
  }, [data, search, selectedCategory, selectedStatus, sortField, sortAsc]);

  const handleSort = (field: keyof EvidenceRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search evidence file, requirement, or risk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900/60 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-blue-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-2">
            <span>Status:</span>
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900/60 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-blue-500"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-muted-foreground uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 w-10"></th>
                <th
                  onClick={() => handleSort("file")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Evidence Document</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("category")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Criterion</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("requirement")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Requirement</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("confidence")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Confidence</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("status")}
                  className="py-3 px-4 cursor-pointer hover:text-foreground transition-colors text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No evidence records matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => {
                  const isExpanded = !!expandedRows[row.id];
                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        onClick={() => toggleRow(row.id)}
                        className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                      >
                        <td className="py-3 px-4 text-center">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-blue-400 inline" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-500 inline group-hover:text-slate-300" />
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{row.file}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                            ID: {row.id} • Source: {row.source}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-slate-300 font-medium">
                            {row.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-400">
                            {row.requirement}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={cn(
                              "font-mono font-semibold",
                              row.confidence === "High"
                                ? "text-emerald-400"
                                : row.confidence === "Medium"
                                ? "text-amber-400"
                                : "text-red-400"
                            )}
                          >
                            {row.confidence}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <RiskBadge status={row.status} size="sm" />
                        </td>
                      </tr>

                      {/* Expandable Details Drawer */}
                      {isExpanded && (
                        <tr className="bg-slate-950/60 border-t border-b border-slate-800/80">
                          <td colSpan={6} className="py-4 px-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                              <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                <div className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                                  Numerical Metrics Claimed
                                </div>
                                <div className="text-slate-200">
                                  {row.metrics}
                                </div>
                              </div>

                              <div className="space-y-1.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                                <div className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">
                                  Attribution & Window Check
                                </div>
                                <div className="text-slate-200 space-y-0.5">
                                  <div>
                                    Personally Attributable:{" "}
                                    <span
                                      className={
                                        row.attributable
                                          ? "text-emerald-400 font-bold"
                                          : "text-red-400 font-bold"
                                      }
                                    >
                                      {row.attributable ? "YES" : "NO (Fatal Defect)"}
                                    </span>
                                  </div>
                                  <div>
                                    Within 5-Year Window:{" "}
                                    <span
                                      className={
                                        row.insideWindow
                                          ? "text-emerald-400 font-bold"
                                          : "text-red-400 font-bold"
                                      }
                                    >
                                      {row.insideWindow ? "YES" : "NO"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-1.5 p-3 rounded-lg bg-red-950/20 border border-red-500/20">
                                <div className="text-red-400 uppercase text-[10px] tracking-wider font-semibold flex items-center gap-1">
                                  <AlertOctagon className="w-3 h-3" />
                                  Examiner Risk Finding
                                </div>
                                <div className="text-red-300">
                                  {row.risk}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

