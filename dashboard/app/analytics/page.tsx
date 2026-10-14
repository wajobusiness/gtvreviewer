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
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MetricCard } from "@/components/MetricCard";
import {
  BarChart3,
  TrendingDown,
  Activity,
  Layers,
  ShieldAlert,
  FileText,
} from "lucide-react";

export default function AnalyticsPage() {
  const categoryScores = [
    { name: "Qualification", score: 45, benchmark: 85 },
    { name: "Rec Letters", score: 12, benchmark: 90 },
    { name: "Media Evidence", score: 48, benchmark: 80 },
    { name: "Leadership", score: 35, benchmark: 88 },
    { name: "Innovation", score: 28, benchmark: 85 },
    { name: "Recognition", score: 25, benchmark: 82 },
  ];

  const evidenceDistribution = [
    { name: "Mandatory Criterion", value: 3, color: "#3b82f6" },
    { name: "Optional Criterion 2", value: 1, color: "#8b5cf6" },
    { name: "Optional Criterion 3", value: 1, color: "#ec4899" },
    { name: "Rec Letters (Missing)", value: 3, color: "#ef4444" },
    { name: "Core CV / Statement", value: 2, color: "#f97316" },
  ];

  const panelConfidence = [
    { reviewer: "R1: Senior Assessor", confidence: 95, decision: "Reject" },
    { reviewer: "R2: Tech Leader", confidence: 90, decision: "Reject" },
    { reviewer: "R3: Awards Specialist", confidence: 92, decision: "Reject" },
    { reviewer: "R4: Legal Counsel", confidence: 98, decision: "Reject" },
    { reviewer: "R5: Devil's Advocate", confidence: 99, decision: "Reject" },
  ];

  const reportWordCounts = [
    { report: "FINAL REPORT", words: 4320 },
    { report: "Forensics", words: 3120 },
    { report: "Requirements", words: 2840 },
    { report: "Consistency", words: 2450 },
    { report: "Simulation", words: 2980 },
    { report: "Evidence Matrix", words: 1850 },
  ];

  const scoreHistory = [
    { stage: "Initial Screening", score: 62 },
    { stage: "OCR Transcription", score: 55 },
    { stage: "Attribution Check", score: 41 },
    { stage: "Numerical Validation", score: 34 },
    { stage: "Panel Deliberation", score: 32 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Audit Analytics & Quantitative Intelligence
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Statistical breakdown of application metrics, benchmark deviations, assessor confidence ratings, and report densities.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Audit Score"
          value="32 / 100"
          subtitle="Target: 70+"
          icon="Activity"
          variant="danger"
        />
        <MetricCard
          title="Endorsement Probability"
          value="4.0%"
          subtitle="Unanimous refusal risk"
          icon="TrendingDown"
          variant="danger"
        />
        <MetricCard
          title="Average Panel Confidence"
          value="94.8%"
          subtitle="Assessor certainty"
          icon="ShieldAlert"
          variant="default"
        />
        <MetricCard
          title="Total Audited Words"
          value="17,560"
          subtitle="Across 7 reports"
          icon="FileText"
          variant="default"
        />
      </div>

      {/* Charts Grid Row 1: Category Scores vs Benchmark & Evidence Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Scores Bar Chart */}
        <div className="lg:col-span-8 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Evidence Category Performance vs. Endorsement Benchmark
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Candidate audited scores compared against the threshold required for successful Tech Nation endorsement.
            </p>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryScores} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs">
                          <div className="font-semibold text-slate-200 mb-1 border-b border-slate-800 pb-1">
                            {label}
                          </div>
                          <div className="flex justify-between gap-4 py-0.5 text-red-400">
                            <span>Candidate Score:</span>
                            <span className="font-mono font-bold">{payload[0].value}%</span>
                          </div>
                          <div className="flex justify-between gap-4 py-0.5 text-blue-400">
                            <span>Benchmark:</span>
                            <span className="font-mono font-bold">{payload[1].value}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "10px", fontSize: "12px" }}
                  formatter={(val) => <span className="text-slate-300 text-xs">{val}</span>}
                />
                <Bar name="Candidate Score" dataKey="score" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar name="Tech Nation Benchmark" dataKey="benchmark" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Evidence Distribution Pie Chart */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Evidence Allocation
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Breakdown of submitted vs. missing portfolio pieces
            </p>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={evidenceDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="#0f172a"
                  strokeWidth={2}
                >
                  {evidenceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-2 text-xs">
                          <span className="font-semibold text-slate-200">{item.name}</span>:{" "}
                          <span className="font-mono font-bold text-blue-400">{item.value} pieces</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px" }}
                  formatter={(value) => <span className="text-slate-300 text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2: Score Decay Line Chart & Assessor Confidence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score History Decay */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Forensic Audit Score Decay by Verification Phase
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Score drop as attribution defects, piracy indicators, and numerical discrepancies were uncovered.
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreHistory} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="stage" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-2.5 text-xs">
                          <div className="font-semibold text-slate-200">{label}</div>
                          <div className="font-mono font-bold text-red-400 mt-0.5">
                            Audit Score: {payload[0].value}/100
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#ef4444" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Panel Reviewer Confidence */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Assessor Deliberation Certainty Rating
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Statistical certainty rating across simulated panel members rejecting endorsement.
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={panelConfidence} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="reviewer" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis domain={[70, 100]} stroke="#64748b" tick={{ fill: "#64748b", fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-2.5 text-xs">
                          <div className="font-semibold text-slate-200">{label}</div>
                          <div className="font-mono font-bold text-red-400 mt-0.5">
                            Refusal Certainty: {payload[0].value}%
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="confidence" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

