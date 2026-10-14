"use client";

import React from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";
import { RadarData } from "@/types/audit";

interface RadarChartComponentProps {
  data: RadarData[];
  title?: string;
  subtitle?: string;
}

export function RadarChartComponent({
  data,
  title = "Success Probability Assessment",
  subtitle = "Current Evidence Strength vs. Tech Nation Endorsement Benchmark",
}: RadarChartComponentProps) {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-semibold text-foreground tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>

      <div className="w-full h-[320px] sm:h-[360px] mt-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 10 }}
              stroke="#1e293b"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as RadarData;
                  const delta = item.score - item.benchmark;
                  return (
                    <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-3 shadow-xl backdrop-blur-md text-xs">
                      <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 mb-2">
                        {item.category}
                      </div>
                      <div className="flex items-center justify-between gap-4 py-0.5 text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                          Candidate Evidence:
                        </span>
                        <span className="font-mono font-bold text-red-400">
                          {item.score}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-0.5 text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                          Target Benchmark:
                        </span>
                        <span className="font-mono font-bold text-blue-400">
                          {item.benchmark}%
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-800 mt-2 text-[11px] flex justify-between">
                        <span className="text-muted-foreground">Gap:</span>
                        <span
                          className={`font-mono font-bold ${
                            delta >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {delta > 0 ? `+${delta}%` : `${delta}%`}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar
              name="Target Benchmark (Endorsement Pass)"
              dataKey="benchmark"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.15}
              strokeWidth={1.5}
            />
            <Radar
              name="Candidate Score (Audited Evidence)"
              dataKey="score"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.4}
              strokeWidth={2}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "12px",
                fontSize: "12px",
              }}
              formatter={(value) => (
                <span className="text-slate-300 text-xs font-medium mr-3">
                  {value}
                </span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

