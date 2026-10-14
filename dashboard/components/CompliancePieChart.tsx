"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { ComplianceSlice } from "@/types/audit";

interface CompliancePieChartProps {
  data: ComplianceSlice[];
  title?: string;
  subtitle?: string;
}

export function CompliancePieChart({
  data,
  title = "Compliance Breakdown",
  subtitle = "Evidence status across Tech Nation & Home Office criteria",
}: CompliancePieChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-semibold text-foreground tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>

      <div className="w-full h-[280px] sm:h-[320px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              stroke="#0f172a"
              strokeWidth={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as ComplianceSlice;
                  const pct = ((item.value / total) * 100).toFixed(0);
                  return (
                    <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-2.5 shadow-xl backdrop-blur-md text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-semibold text-slate-200">
                          {item.name}
                        </span>
                      </div>
                      <div className="mt-1 text-slate-300 font-mono flex items-center justify-between gap-4">
                        <span>Items: {item.value}</span>
                        <span className="font-bold text-slate-100">{pct}%</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => {
                const item = data.find((d) => d.name === value);
                return (
                  <span className="text-xs font-medium text-slate-300 mx-1">
                    {value} ({item?.value})
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-9">
          <span className="text-3xl font-extrabold text-foreground font-mono">
            {total}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Total Items
          </span>
        </div>
      </div>
    </div>
  );
}

