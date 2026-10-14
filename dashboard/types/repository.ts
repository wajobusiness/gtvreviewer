import { AuditData, ReportMeta } from "./audit";
import { ProjectModel, AuditRunSummary, AuditRunModel } from "./saas";

export interface SearchResult {
  slug: string;
  title: string;
  filename: string;
  matchSnippet: string;
  matchLine: number;
}

export interface IAuditRepository {
  /**
   * Retrieves the consolidated audit data for a given project/run.
   */
  getAuditData(projectId?: string, runId?: string): Promise<AuditData> | AuditData;

  /**
   * Retrieves all report metadata discovered or stored for this project/run.
   */
  getAllReports(projectId?: string, runId?: string): Promise<ReportMeta[]> | ReportMeta[];

  /**
   * Retrieves a single report and its full content by slug.
   */
  getReportBySlug(
    slug: string,
    projectId?: string,
    runId?: string
  ): Promise<{ meta: ReportMeta; content: string } | null> | { meta: ReportMeta; content: string } | null;

  /**
   * Searches across all reports for the query string.
   */
  searchAllReports(
    query: string,
    projectId?: string,
    runId?: string
  ): Promise<SearchResult[]> | SearchResult[];

  /**
   * Lists all historical audit runs for comparison / diffs.
   */
  listAuditRuns(projectId?: string): Promise<AuditRunSummary[]> | AuditRunSummary[];

  /**
   * Retrieves the current project metadata.
   */
  getProject(projectId?: string): Promise<ProjectModel | null> | (ProjectModel | null);
}

