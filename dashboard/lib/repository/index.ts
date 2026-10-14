import { IAuditRepository, SearchResult } from "@/types/repository";
import { LocalFileSystemAuditRepository } from "./local";
import { DatabaseAuditRepository } from "./database";
import { AuditData, ReportMeta } from "@/types/audit";
import { ProjectModel, AuditRunSummary } from "@/types/saas";

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

/**
 * Backward-compatible helper functions matching existing lib/reports.ts API
 */
export function getAuditData(projectId?: string, runId?: string): AuditData {
  const res = auditRepository.getAuditData(projectId, runId);
  return res as AuditData;
}

export function getAllReports(projectId?: string, runId?: string): ReportMeta[] {
  const res = auditRepository.getAllReports(projectId, runId);
  return res as ReportMeta[];
}

export function getReportBySlug(
  slug: string,
  projectId?: string,
  runId?: string
): { meta: ReportMeta; content: string } | null {
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

