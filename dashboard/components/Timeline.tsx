"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { TimelineStep } from "@/types/audit";
import { cn } from "@/lib/utils";

interface TimelineProps {
  steps: TimelineStep[];
  title?: string;
  subtitle?: string;
}

export function Timeline({
  steps,
  title = "Audit Process Pipeline",
  subtitle = "End-to-end automated forensic audit execution stages",
}: TimelineProps) {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground tracking-tight">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>

      <div className="relative">
        {/* Horizontal connector line on desktop, hidden on mobile */}
        <div className="hidden lg:block absolute top-4 left-6 right-6 h-0.5 bg-slate-800 -z-0" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 relative z-10">
          {steps.map((item, idx) => {
            const isCompleted = item.status === "completed";
            const isInProgress = item.status === "in-progress";
            const isFailed = item.status === "failed";

            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className={cn(
                  "p-3 rounded-lg border backdrop-blur-sm flex flex-col justify-between transition-all",
                  isCompleted
                    ? "bg-slate-900/60 border-slate-800 hover:border-emerald-500/40"
                    : isInProgress
                    ? "bg-blue-950/20 border-blue-500/30"
                    : isFailed
                    ? "bg-red-950/20 border-red-500/30"
                    : "bg-slate-900/20 border-slate-800/60"
                )}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold border",
                        isCompleted
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                          : isInProgress
                          ? "bg-blue-500/10 border-blue-500/40 text-blue-400 animate-spin"
                          : isFailed
                          ? "bg-red-500/10 border-red-500/40 text-red-400"
                          : "bg-slate-800 border-slate-700 text-slate-400"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : isInProgress ? (
                        <Loader2 className="w-3.5 h-3.5" />
                      ) : isFailed ? (
                        <AlertCircle className="w-3.5 h-3.5" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <span className="text-xs font-semibold text-foreground tracking-tight truncate">
                      {item.step}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.details}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span className="capitalize text-emerald-400/90 font-medium">
                    {item.status}
                  </span>
                  <span>{item.timestamp?.split(" ")[1] || item.timestamp}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

