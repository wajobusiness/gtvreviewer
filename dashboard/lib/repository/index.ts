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

import { createEmptyAuditData } from "@/lib/emptyAudit";

/**
 * Backward-compatible helper functions matching existing lib/reports.ts API
 */
export function getAuditData(projectId?: string, runId?: string): AuditData {
  if (runId) {
    const analysis = jobManager.getAnalysisForRun(runId);
    if (analysis) return analysis;
  }
  if (projectId) {
    const analysis = jobManager.getAnalysisForProject(projectId);
    if (analysis) return analysis;
  }

  // Explicit sample demonstration mode
  if (projectId === "sample-audit" || runId === "sample" || process.env.STORAGE_DRIVER === "demo") {
    const res = auditRepository.getAuditData(projectId, runId);
    return res as AuditData;
  }

  // In production SaaS mode: default to the real, clean empty workspace
  return createEmptyAuditData(projectId || "Candidate Application");
}

export function getAllReports(projectId?: string, runId?: string): ReportMeta[] {
  let targetAnalysis = null;
  if (runId) {
    targetAnalysis = jobManager.getAnalysisForRun(runId);
  } else if (projectId) {
    targetAnalysis = jobManager.getAnalysisForProject(projectId);
  }

  if (targetAnalysis && targetAnalysis.markdownReports) {
    return Object.entries(targetAnalysis.markdownReports).map(([filename, content]) => {
      const slug = filename.replace(/\.md$/, "").toLowerCase();
      return {
        slug,
        title: filename.replace(/\.md$/, "").replace(/-/g, " ").toUpperCase(),
        filename,
        description: `Forensic AI report generated for ${targetAnalysis.metadata.candidateName || targetAnalysis.metadata.documentOwner || "Applicant"}`,
        category: "Forensic Analysis",
        status: (targetAnalysis.kpis.overallScore >= 70 ? "Passed" : "Critical") as any,
        score: targetAnalysis.kpis.overallScore,
        icon: "FileText",
        date: targetAnalysis.metadata.auditDate,
        size: `${Math.round(content.length / 1024)} KB`,
        content,
      };
    });
  }

  if (projectId === "sample-audit" || runId === "sample" || process.env.STORAGE_DRIVER === "demo") {
    const res = auditRepository.getAllReports(projectId, runId);
    return res as ReportMeta[];
  }

  // Production SaaS mode: Return empty array so users see their real empty repository
  return [];
}

export function getReportBySlug(
  slug: string,
  projectId?: string,
  runId?: string
): { meta: ReportMeta; content: string } | null {
  let targetAnalysis = null;
  if (runId) {
    targetAnalysis = jobManager.getAnalysisForRun(runId);
  } else if (projectId) {
    targetAnalysis = jobManager.getAnalysisForProject(projectId);
  }

  if (targetAnalysis && targetAnalysis.markdownReports) {
    for (const [filename, content] of Object.entries(targetAnalysis.markdownReports)) {
      const fileSlug = filename.replace(/\.md$/, "").toLowerCase();
      if (fileSlug === slug.toLowerCase()) {
        const meta: ReportMeta = {
          slug: fileSlug,
          title: filename.replace(/\.md$/, "").replace(/-/g, " ").toUpperCase(),
          filename,
          description: `Forensic AI report generated for ${targetAnalysis.metadata.candidateName || targetAnalysis.metadata.documentOwner || "Applicant"}`,
          category: "Forensic Analysis",
          status: (targetAnalysis.kpis.overallScore >= 70 ? "Passed" : "Critical") as any,
          score: targetAnalysis.kpis.overallScore,
          icon: "FileText",
          date: targetAnalysis.metadata.auditDate,
          size: `${Math.round(content.length / 1024)} KB`,
        };
        return { meta, content };
      }
    }
  }

  const res = auditRepository.getReportBySlug(slug, projectId, runId);
  return res as { meta: ReportMeta; content: string } | null;
}

export function searchAllReports(
  query: string,
  projectId?: string,
  runId?: string
): SearchResult[] {
  const res = auditRepository.searchAllReports(query, projectId, runId);
  return res as SearchResult[];
}

export function listAuditRuns(projectId?: string): AuditRunSummary[] {
  const res = auditRepository.listAuditRuns(projectId);
  return res as AuditRunSummary[];
}

export function getProject(projectId?: string): ProjectModel | null {
  const res = auditRepository.getProject(projectId);
  return res as ProjectModel | null;
}
