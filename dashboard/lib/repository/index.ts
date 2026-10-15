import { IAuditRepository, SearchResult } from "@/types/repository";
import { LocalFileSystemAuditRepository } from "./local";
import { DatabaseAuditRepository } from "./database";
import { AuditData, ReportMeta } from "@/types/audit";
import { ProjectModel, AuditRunSummary } from "@/types/saas";
import { jobManager } from "@/lib/queue/jobManager";

export type { SearchResult, IAuditRepository } from "@/types/repository";

// Factory that resolves the repository implementation based on environment configuration
function createAuditRepository(): IAuditRepository {
  const driver = process.env.STORAGE_DRIVER?.toLowerCase();

  if (driver === "database" || driver === "postgres" || driver === "cloud") {
    return new DatabaseAuditRepository();
  }

  // Default driver: Local file system
  return new LocalFileSystemAuditRepository();
}

// Singleton repository instance
export const auditRepository: IAuditRepository = createAuditRepository();

import { getLatestAuditRunFromDb } from "@/lib/db/neon";
import { createEmptyAuditData } from "@/lib/emptyAudit";

/**
 * Backward-compatible helper functions matching existing lib/reports.ts API
 */
export async function getAuditData(projectId?: string, runId?: string): Promise<AuditData> {
  // 1. In-memory worker check
  if (runId) {
    const analysis = jobManager.getAnalysisForRun(runId);
    if (analysis) return analysis;
  }
  if (projectId && projectId !== "sample-audit") {
    const analysis = jobManager.getAnalysisForProject(projectId);
    if (analysis) return analysis;
  }

  // Check if there is a recently completed analysis in memory
  if (!projectId && !runId) {
    const latest = jobManager.getLatestAnalysis();
    if (latest) return latest;
  }

  // 2. Neon Database persistent check
  try {
    const fromDb = await getLatestAuditRunFromDb(projectId, runId);
    if (fromDb) {
      if (fromDb.markdownReports && (!fromDb.reports || fromDb.reports.length === 0)) {
        fromDb.reports = Object.entries(fromDb.markdownReports).map(([filename, content]) => {
          const slug = filename.replace(/\.md$/, "").toLowerCase();
          return {
            slug,
            title: filename.replace(/\.md$/, "").replace(/-/g, " ").toUpperCase(),
            filename,
            description: `Forensic AI report generated for ${fromDb.metadata?.candidateName || fromDb.metadata?.documentOwner || "Applicant"}`,
            category: "Forensic Analysis",
            status: (fromDb.kpis.overallScore >= 70 ? "Passed" : "Critical") as any,
            score: fromDb.kpis.overallScore,
            icon: "FileText",
            date: fromDb.metadata?.auditDate || new Date().toISOString().split("T")[0],
            size: `${Math.round(content.length / 1024)} KB`,
            content,
          };
        });
      }
      return fromDb as AuditData;
    }
  } catch (err) {
    console.warn("[getAuditData] DB fetch notice:", err);
  }

  // 3. Explicit sample demonstration mode
  if (projectId === "sample-audit" || runId === "sample" || process.env.STORAGE_DRIVER === "demo") {
    const res = await auditRepository.getAuditData(projectId, runId);
    return res as AuditData;
  }

  // 4. In production SaaS mode: default to the real, clean empty workspace
  return createEmptyAuditData(projectId || "Candidate Application");
}

export function getAuditDataSync(projectId?: string, runId?: string): AuditData {
  if (runId) {
    const analysis = jobManager.getAnalysisForRun(runId);
    if (analysis) return analysis;
  }
  if (projectId && projectId !== "sample-audit") {
    const analysis = jobManager.getAnalysisForProject(projectId);
    if (analysis) return analysis;
  }
  if (!projectId && !runId) {
    const latest = jobManager.getLatestAnalysis();
    if (latest) return latest;
  }
  if (projectId === "sample-audit" || runId === "sample" || process.env.STORAGE_DRIVER === "demo") {
    const res = auditRepository.getAuditData(projectId, runId);
    return res as AuditData;
  }
  return createEmptyAuditData(projectId || "Candidate Application");
}

export async function getAllReports(projectId?: string, runId?: string): Promise<ReportMeta[]> {
  let targetAnalysis: any = null;
  if (runId) {
    targetAnalysis = jobManager.getAnalysisForRun(runId);
  } else if (projectId && projectId !== "sample-audit") {
    targetAnalysis = jobManager.getAnalysisForProject(projectId);
  } else if (projectId !== "sample-audit" && runId !== "sample") {
    targetAnalysis = jobManager.getLatestAnalysis();
  }

  if (!targetAnalysis) {
    try {
      targetAnalysis = await getLatestAuditRunFromDb(projectId, runId);
    } catch {}
  }

  if (targetAnalysis && targetAnalysis.markdownReports) {
    return Object.entries(targetAnalysis.markdownReports).map(([filename, content]: [string, any]) => {
      const slug = filename.replace(/\.md$/, "").toLowerCase();
      return {
        slug,
        title: filename.replace(/\.md$/, "").replace(/-/g, " ").toUpperCase(),
        filename,
        description: `Forensic AI report generated for ${targetAnalysis.metadata?.candidateName || targetAnalysis.metadata?.documentOwner || "Applicant"}`,
        category: "Forensic Analysis",
        status: ((targetAnalysis.kpis?.overallScore || 0) >= 70 ? "Passed" : "Critical") as any,
        score: targetAnalysis.kpis?.overallScore || 0,
        icon: "FileText",
        date: targetAnalysis.metadata?.auditDate || new Date().toISOString().split("T")[0],
        size: `${Math.round(content.length / 1024)} KB`,
        content,
      };
    });
  }

  if (projectId === "sample-audit" || runId === "sample" || process.env.STORAGE_DRIVER === "demo") {
    const res = await auditRepository.getAllReports(projectId, runId);
    return res as ReportMeta[];
  }

  return [];
}

export async function getReportBySlug(
  slug: string,
  projectId?: string,
  runId?: string
): Promise<{ meta: ReportMeta; content: string } | null> {
  const reports = await getAllReports(projectId, runId);
  const found = reports.find((r) => r.slug === slug || r.filename === slug || r.filename === `${slug}.md`);
  if (!found) return null;
  return {
    meta: found,
    content: found.content || "",
  };
}

export async function searchAllReports(
  query: string,
  projectId?: string,
  runId?: string
): Promise<SearchResult[]> {
  const reports = await getAllReports(projectId, runId);
  const q = query.toLowerCase();
  const results: SearchResult[] = [];
  for (const r of reports) {
    const lines = (r.content || "").split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(q)) {
        results.push({
          slug: r.slug,
          title: r.title,
          filename: r.filename,
          matchSnippet: lines[i].trim(),
          matchLine: i + 1,
        });
        break;
      }
    }
  }
  return results;
}

export function listAuditRuns(projectId?: string): AuditRunSummary[] {
  const res = auditRepository.listAuditRuns(projectId);
  return res as AuditRunSummary[];
}

export function getProject(projectId?: string): ProjectModel | null {
  const res = auditRepository.getProject(projectId);
  return res as ProjectModel | null;
}
