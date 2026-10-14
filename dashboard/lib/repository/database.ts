import { AuditData, ReportMeta } from "@/types/audit";
import { IAuditRepository, SearchResult } from "@/types/repository";
import { ProjectModel, AuditRunSummary } from "@/types/saas";
import { LocalFileSystemAuditRepository } from "./local";

/**
 * DatabaseAuditRepository
 *
 * Implements IAuditRepository for relational/cloud backends (PostgreSQL, Supabase, Cloudflare R2).
 * Designed for Phase 1-2 productization. If database environment variables are not fully configured,
 * it safely delegates to the local repository so zero existing features break.
 */
export class DatabaseAuditRepository implements IAuditRepository {
  private fallbackRepo: LocalFileSystemAuditRepository;
  private isConfigured: boolean;

  constructor() {
    this.fallbackRepo = new LocalFileSystemAuditRepository();
    this.isConfigured = !!process.env.DATABASE_URL;
  }

  public getAuditData(projectId?: string, runId?: string): AuditData {
    if (!this.isConfigured) {
      return this.fallbackRepo.getAuditData();
    }
    // Future database query: SELECT raw_audit_json FROM audit_runs WHERE project_id = $1 AND id = $2
    return this.fallbackRepo.getAuditData();
  }

  public getAllReports(projectId?: string, runId?: string): ReportMeta[] {
    if (!this.isConfigured) {
      return this.fallbackRepo.getAllReports();
    }
    // Future database query: SELECT slug, title, filename, description, category, status, score FROM report_documents WHERE audit_run_id = $1
    return this.fallbackRepo.getAllReports();
  }

  public getReportBySlug(
    slug: string,
    projectId?: string,
    runId?: string
  ): { meta: ReportMeta; content: string } | null {
    if (!this.isConfigured) {
      return this.fallbackRepo.getReportBySlug(slug);
    }
    // Future database query: SELECT * FROM report_documents WHERE slug = $1 AND audit_run_id = $2
    return this.fallbackRepo.getReportBySlug(slug);
  }

  public searchAllReports(
    query: string,
    projectId?: string,
    runId?: string
  ): SearchResult[] {
    if (!this.isConfigured) {
      return this.fallbackRepo.searchAllReports(query);
    }
    // Future full-text search: SELECT slug, title, ts_headline(...) FROM report_documents WHERE to_tsvector('english', content) @@ plainto_tsquery($1)
    return this.fallbackRepo.searchAllReports(query);
  }

  public listAuditRuns(projectId?: string): AuditRunSummary[] {
    if (!this.isConfigured) {
      return this.fallbackRepo.listAuditRuns();
    }
    return this.fallbackRepo.listAuditRuns();
  }

  public getProject(projectId?: string): ProjectModel | null {
    if (!this.isConfigured) {
      return this.fallbackRepo.getProject();
    }
    return this.fallbackRepo.getProject();
  }
}

