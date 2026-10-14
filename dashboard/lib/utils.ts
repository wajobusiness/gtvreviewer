import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return `${Math.round(score)}`;
}

export function getStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case "critical":
    case "danger":
    case "failed":
    case "not met":
    case "reject":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    case "warning":
    case "needs improvement":
    case "borderline":
    case "high":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "passed":
    case "met":
    case "approve":
    case "low":
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "informational":
    default:
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  }
}

