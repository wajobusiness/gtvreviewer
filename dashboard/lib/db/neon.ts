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

