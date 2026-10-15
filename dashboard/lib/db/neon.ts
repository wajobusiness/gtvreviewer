/**
 * lib/db/neon.ts
 *
 * Production Neon PostgreSQL serverless client.
 * Connects directly using @neondatabase/serverless via HTTPS (zero native C++ dependencies).
 */

import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { ProjectModel, AuditRunModel } from "@/types/saas";
import { StructuredAnalysisResult } from "@/lib/ai/types";

let sqlInstance: NeonQueryFunction<false, false> | null = null;

export function getDb(): NeonQueryFunction<false, false> | null {
  if (sqlInstance) return sqlInstance;

  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL;

  if (!connectionString) {
    return null;
  }

  try {
    sqlInstance = neon(connectionString);
    return sqlInstance;
  } catch (err) {
    console.error("[NeonDB] Failed to initialize Neon client:", err);
    return null;
  }
}

export async function saveAuditRunToDb(params: {
  projectId: string;
  candidateName: string;
  visaRoute: string;
  targetField: string;
  analysis: StructuredAnalysisResult;
}): Promise<string | null> {
  const sql = getDb();
  if (!sql) return null;

  try {
    const { projectId, candidateName, visaRoute, targetField, analysis } = params;
    const runId = `run-${Date.now()}`;

    // 1. Ensure project exists in DB
    await sql`
      INSERT INTO projects (id, organization_id, candidate_name, visa_route, target_field, current_score, status)
      VALUES (
        ${projectId}::uuid,
        (SELECT id FROM organizations LIMIT 1),
        ${candidateName},
        ${visaRoute},
        ${targetField},
        ${analysis.kpis.overallScore},
        'ready_to_submit'
      )
      ON CONFLICT (id) DO UPDATE
      SET candidate_name = ${candidateName},
          current_score = ${analysis.kpis.overallScore},
          updated_at = CURRENT_TIMESTAMP;
    `.catch(async () => {
      // If organization table doesn't have an entry yet, create one
      await sql`
        INSERT INTO organizations (name, slug, tier)
        VALUES ('Default Law Firm / Workspace', 'default-workspace', 'PROFESSIONAL')
        ON CONFLICT (slug) DO NOTHING;
      `;
    });

    // 2. Insert audit_run record
    await sql`
      INSERT INTO audit_runs (
        id,
        project_id,
        version_number,
        overall_score,
        current_status,
        recommendation,
        estimated_visa_success,
        raw_audit_json,
        status
      ) VALUES (
        ${runId}::uuid,
        ${projectId}::uuid,
        (SELECT COALESCE(MAX(version_number), 0) + 1 FROM audit_runs WHERE project_id = ${projectId}::uuid),
        ${analysis.kpis.overallScore},
        ${analysis.kpis.currentStatus},
        ${analysis.kpis.recommendation},
        ${analysis.kpis.estimatedVisaSuccess},
        ${JSON.stringify(analysis)},
        'COMPLETED'
      )
      ON CONFLICT DO NOTHING;
    `;

    // 3. Insert report documents
    if (analysis.markdownReports) {
      for (const [filename, content] of Object.entries(analysis.markdownReports)) {
        const slug = filename.replace(/\.md$/, "").toLowerCase();
        await sql`
          INSERT INTO report_documents (
            audit_run_id,
            slug,
            title,
            filename,
            category,
            content
          ) VALUES (
            ${runId}::uuid,
            ${slug},
            ${filename.replace(/\.md$/, "")},
            ${filename},
            'Forensic Report',
            ${content}
          )
          ON CONFLICT (audit_run_id, slug) DO UPDATE
          SET content = ${content};
        `.catch((e) => console.warn("[NeonDB] Error saving report doc:", e.message));
      }
    }

    console.info(`[NeonDB] Successfully stored audit run ${runId} for project ${projectId}`);
    return runId;
  } catch (err: any) {
    console.error("[NeonDB] Error saving audit run to Postgres:", err?.message || err);
    return null;
  }
}

export async function getLatestAuditRunFromDb(projectId: string): Promise<StructuredAnalysisResult | null> {
  const sql = getDb();
  if (!sql) return null;

  try {
    const rows = await sql`
      SELECT raw_audit_json
      FROM audit_runs
      WHERE project_id = ${projectId}::uuid
      ORDER BY created_at DESC
      LIMIT 1;
    `;

    if (rows && rows.length > 0 && rows[0].raw_audit_json) {
      return rows[0].raw_audit_json as StructuredAnalysisResult;
    }
    return null;
  } catch (err: any) {
    console.warn("[NeonDB] Query error in getLatestAuditRunFromDb:", err?.message);
    return null;
  }
}

let auditJobsTableChecked = false;

export async function ensureAuditJobsTable() {
  if (auditJobsTableChecked) return;
  const sql = getDb();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS audit_jobs (
        id VARCHAR(100) PRIMARY KEY,
        project_id VARCHAR(100) NOT NULL,
        candidate_name VARCHAR(255) NOT NULL,
        visa_route VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'PENDING',
        overall_progress INTEGER DEFAULT 0,
        current_stage_id VARCHAR(50) DEFAULT 'stage-ingest',
        stages JSONB NOT NULL,
        logs JSONB NOT NULL,
        source_type VARCHAR(50) DEFAULT 'LOCAL_UPLOAD',
        google_drive_url TEXT,
        documents JSONB,
        final_score INTEGER,
        final_status VARCHAR(100),
        result_run_id VARCHAR(100),
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    auditJobsTableChecked = true;
  } catch (e: any) {
    console.warn("[NeonDB] Error ensuring audit_jobs table:", e?.message);
  }
}

export async function saveJobToDb(job: any): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;

  await ensureAuditJobsTable();

  try {
    await sql`
      INSERT INTO audit_jobs (
        id,
        project_id,
        candidate_name,
        visa_route,
        status,
        overall_progress,
        current_stage_id,
        stages,
        logs,
        source_type,
        google_drive_url,
        documents,
        final_score,
        final_status,
        result_run_id,
        error_message,
        updated_at
      ) VALUES (
        ${job.id},
        ${job.projectId},
        ${job.candidateName},
        ${job.visaRoute},
        ${job.status},
        ${job.overallProgress},
        ${job.currentStageId},
        ${JSON.stringify(job.stages)},
        ${JSON.stringify(job.logs)},
        ${job.sourceType || "LOCAL_UPLOAD"},
        ${job.googleDriveUrl || null},
        ${JSON.stringify(job.documents || [])},
        ${job.finalScore || null},
        ${job.finalStatus || null},
        ${job.resultRunId || null},
        ${job.error || null},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        overall_progress = EXCLUDED.overall_progress,
        current_stage_id = EXCLUDED.current_stage_id,
        stages = EXCLUDED.stages,
        logs = EXCLUDED.logs,
        final_score = EXCLUDED.final_score,
        final_status = EXCLUDED.final_status,
        result_run_id = EXCLUDED.result_run_id,
        error_message = EXCLUDED.error_message,
        updated_at = CURRENT_TIMESTAMP;
    `;
    return true;
  } catch (err: any) {
    console.warn("[NeonDB] saveJobToDb warning:", err?.message || err);
    return false;
  }
}

export async function getJobFromDb(jobId: string): Promise<any | null> {
  const sql = getDb();
  if (!sql) return null;

  await ensureAuditJobsTable();

  try {
    const rows = await sql`
      SELECT * FROM audit_jobs WHERE id = ${jobId} LIMIT 1;
    `;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      projectId: r.project_id,
      candidateName: r.candidate_name,
      visaRoute: r.visa_route,
      status: r.status,
      overallProgress: r.overall_progress,
      currentStageId: r.current_stage_id,
      stages: typeof r.stages === "string" ? JSON.parse(r.stages) : r.stages,
      logs: typeof r.logs === "string" ? JSON.parse(r.logs) : r.logs,
      sourceType: r.source_type,
      googleDriveUrl: r.google_drive_url,
      documents: typeof r.documents === "string" ? JSON.parse(r.documents) : r.documents,
      finalScore: r.final_score,
      finalStatus: r.final_status,
      resultRunId: r.result_run_id,
      error: r.error_message,
      createdAt: r.created_at,
    };
  } catch (err: any) {
    console.warn("[NeonDB] getJobFromDb warning:", err?.message || err);
    return null;
  }
}

export async function listJobsFromDb(projectId?: string): Promise<any[]> {
  const sql = getDb();
  if (!sql) return [];

  await ensureAuditJobsTable();

  try {
    let rows;
    if (projectId) {
      rows = await sql`
        SELECT * FROM audit_jobs WHERE project_id = ${projectId} ORDER BY created_at DESC;
      `;
    } else {
      rows = await sql`
        SELECT * FROM audit_jobs ORDER BY created_at DESC LIMIT 50;
      `;
    }

    return (rows || []).map((r: any) => ({
      id: r.id,
      projectId: r.project_id,
      candidateName: r.candidate_name,
      visaRoute: r.visa_route,
      status: r.status,
      overallProgress: r.overall_progress,
      currentStageId: r.current_stage_id,
      stages: typeof r.stages === "string" ? JSON.parse(r.stages) : r.stages,
      logs: typeof r.logs === "string" ? JSON.parse(r.logs) : r.logs,
      sourceType: r.source_type,
      googleDriveUrl: r.google_drive_url,
      finalScore: r.final_score,
      finalStatus: r.final_status,
      resultRunId: r.result_run_id,
      error: r.error_message,
      createdAt: r.created_at,
    }));
  } catch (err: any) {
    console.warn("[NeonDB] listJobsFromDb warning:", err?.message || err);
    return [];
  }
}

let projectsTableChecked = false;

export async function ensureProjectsTable() {
  if (projectsTableChecked) return;
  const sql = getDb();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        candidate_name VARCHAR(255) NOT NULL,
        visa_route VARCHAR(100) NOT NULL,
        target_field VARCHAR(100) DEFAULT 'Digital Technology',
        applicant_type VARCHAR(50) DEFAULT 'Both',
        status VARCHAR(50) DEFAULT 'draft',
        current_score INTEGER DEFAULT 0,
        latest_run_id VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(organization_id);
    `.catch(() => {});
    projectsTableChecked = true;
  } catch (e: any) {
    console.warn("[NeonDB] Error ensuring projects table:", e?.message);
  }
}

export async function createProjectInDb(params: {
  organizationId: string;
  candidateName: string;
  visaRoute: string;
  targetField?: string;
  applicantType?: string;
}): Promise<any | null> {
  const sql = getDb();
  if (!sql) return null;

  await ensureProjectsTable();

  try {
    const rows = await sql`
      INSERT INTO projects (
        organization_id,
        candidate_name,
        visa_route,
        target_field,
        applicant_type,
        status,
        current_score
      ) VALUES (
        ${params.organizationId}::uuid,
        ${params.candidateName.trim()},
        ${params.visaRoute},
        ${params.targetField || "Digital Technology"},
        ${params.applicantType || "Both"},
        'draft',
        0
      )
      RETURNING *;
    `;

    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: String(r.id),
      organizationId: String(r.organization_id),
      candidateName: r.candidate_name,
      visaRoute: r.visa_route,
      targetField: r.target_field,
      applicantType: r.applicant_type,
      status: r.status,
      currentScore: r.current_score || 0,
      totalRuns: 0,
      activeRunId: "",
      createdAt: r.created_at,
    };
  } catch (err: any) {
    console.error("[NeonDB] createProjectInDb error:", err?.message || err);
    return null;
  }
}

export async function listProjectsFromDb(organizationId: string): Promise<any[]> {
  const sql = getDb();
  if (!sql) return [];

  await ensureProjectsTable();

  try {
    const rows = await sql`
      SELECT * FROM projects
      WHERE organization_id = ${organizationId}::uuid
      ORDER BY created_at DESC;
    `;

    return (rows || []).map((r: any) => ({
      id: String(r.id),
      organizationId: String(r.organization_id),
      candidateName: r.candidate_name,
      visaRoute: r.visa_route,
      targetField: r.target_field,
      applicantType: r.applicant_type,
      status: r.status,
      currentScore: r.current_score || 0,
      totalRuns: 0,
      activeRunId: r.latest_run_id || "",
      createdAt: r.created_at,
    }));
  } catch (err: any) {
    console.warn("[NeonDB] listProjectsFromDb warning:", err?.message || err);
    return [];
  }
}

export async function deleteProjectFromDb(
  projectId: string,
  organizationId: string
): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;

  try {
    await sql`
      DELETE FROM projects
      WHERE id = ${projectId}::uuid AND organization_id = ${organizationId}::uuid;
    `;
    return true;
  } catch (err: any) {
    console.error("[NeonDB] deleteProjectFromDb error:", err?.message || err);
    return false;
  }
}



