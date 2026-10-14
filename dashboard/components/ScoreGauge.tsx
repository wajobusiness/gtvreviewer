"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
}

export function ScoreGauge({
  score,
  maxScore = 100,
  size = 200,
  strokeWidth = 14,
  label = "Overall Score",
  sublabel = "Risk-Weighted",
}: ScoreGaugeProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dashOffset = circumference - (percentage / 100) * circumference;

  const getColor = (pct: number) => {
    if (pct >= 70) return { stroke: "#10b981", glow: "rgba(16, 185, 129, 0.4)", text: "text-emerald-500" };
    if (pct >= 50) return { stroke: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)", text: "text-amber-500" };
    return { stroke: "#ef4444", glow: "rgba(239, 68, 68, 0.4)", text: "text-red-500" };
  };

  const { stroke, glow, text } = getColor(percentage);

  return (
    <div className="flex flex-col items-center justify-center relative select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800/60"
            fill="transparent"
          />
          {/* Animated Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 10px ${glow})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={`text-5xl font-extrabold tracking-tight ${text}`}
          >
            {score}
            <span className="text-xl font-normal text-muted-foreground">/{maxScore}</span>
          </motion.div>
          <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mt-1">
            {label}
          </span>
        </div>
      </div>
      {sublabel && (
        <span className="text-xs font-medium text-slate-400 mt-2 bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700/50">
          {sublabel}
        </span>
      )}
    </div>
  );
}

