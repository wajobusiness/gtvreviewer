"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Layers, Activity } from "lucide-react";

interface AnalyticsChartsProps {
  categoryScores: Array<{ name: string; score: number; benchmark: number }>;
  evidenceDistribution: Array<{ name: string; value: number; color?: string }>;
  panelConfidence: Array<{ reviewer: string; confidence: number; decision: string }>;
}

export function AnalyticsCharts({
  categoryScores,
  evidenceDistribution,
  panelConfidence,
}: AnalyticsChartsProps) {
  return (
    <div className="space-y-6">
      {/* Charts Section 1: Categories & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Scores vs Benchmarks */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Category Score vs. Endorsement Benchmark
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Current applicant scores compared against historical benchmark thresholds.
              </p>
            </div>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryScores}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    fontSize: "12px",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
                  iconSize={10}
                />
                <Bar dataKey="score" name="Applicant Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="benchmark" name="Benchmark" fill="#64748b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evidence Distribution Pie Chart */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Compliance Verification Distribution
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Breakdown of verified, flagged, and deficient evidence findings.
              </p>
            </div>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={evidenceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {evidenceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    fontSize: "12px",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Assessor Confidence Ratings */}
      {panelConfidence.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground">
            Simulated Assessor Confidence Metrics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            {panelConfidence.map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1 text-center"
              >
                <div className="text-[11px] font-semibold text-slate-300 truncate">{p.reviewer}</div>
                <div className="text-base font-bold font-mono text-blue-400">{p.confidence}%</div>
                <div
                  className={`text-[10px] uppercase font-bold ${
                    p.decision === "Approve"
                      ? "text-emerald-400"
                      : p.decision === "Borderline"
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {p.decision}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

