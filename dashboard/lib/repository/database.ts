import { AuditData, ReportMeta } from "@/types/audit";
import { IAuditRepository, SearchResult } from "@/types/repository";
import { ProjectModel, AuditRunSummary } from "@/types/saas";
import { LocalFileSystemAuditRepository } from "./local";
import { getLatestAuditRunFromDb } from "@/lib/db/neon";

/**
 * DatabaseAuditRepository
 *
 * Implements IAuditRepository for relational/cloud backends (PostgreSQL Neon).
 * If database environment variables are not fully configured or no rows match,
 * it safely delegates to the local repository so zero existing features break.
 */
export class DatabaseAuditRepository implements IAuditRepository {
  private fallbackRepo: LocalFileSystemAuditRepository;
  private isConfigured: boolean;

  constructor() {
    this.fallbackRepo = new LocalFileSystemAuditRepository();
    this.isConfigured = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);
  }

  public async getAuditData(projectId?: string, runId?: string): Promise<AuditData> {
    if (this.isConfigured) {
      try {
        const fromDb = await getLatestAuditRunFromDb(projectId, runId);
        if (fromDb) return fromDb as AuditData;
      } catch (e) {
        console.warn("[DatabaseAuditRepository] Error fetching from DB:", e);
      }
    }
    return this.fallbackRepo.getAuditData();
  }

  public async getAllReports(projectId?: string, runId?: string): Promise<ReportMeta[]> {
    if (this.isConfigured) {
      try {
        const fromDb = await getLatestAuditRunFromDb(projectId, runId);
        if (fromDb && fromDb.markdownReports) {
          return Object.entries(fromDb.markdownReports).map(([filename, content]) => ({
            slug: filename.replace(/\.md$/, "").toLowerCase(),
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
          }));
        }
      } catch (e) {
        console.warn("[DatabaseAuditRepository] Error fetching reports from DB:", e);
      }
    }
    return this.fallbackRepo.getAllReports();
  }

  public async getReportBySlug(
    slug: string,
    projectId?: string,
    runId?: string
  ): Promise<{ meta: ReportMeta; content: string } | null> {
    const reports = await this.getAllReports(projectId, runId);
    const found = reports.find((r) => r.slug === slug || r.filename === slug || r.filename === `${slug}.md`);
    if (!found) return null;
    return {
      meta: found,
      content: found.content || "",
    };
  }

  public async searchAllReports(
    query: string,
    projectId?: string,
    runId?: string
  ): Promise<SearchResult[]> {
    const reports = await this.getAllReports(projectId, runId);
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

  public async listAuditRuns(projectId?: string): Promise<AuditRunSummary[]> {
    return this.fallbackRepo.listAuditRuns();
  }

  public async getProject(projectId?: string): Promise<ProjectModel | null> {
    return this.fallbackRepo.getProject();
  }
}

