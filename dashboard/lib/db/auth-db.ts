/**
 * lib/db/auth-db.ts
 *
 * PostgreSQL database operations for Authentication & Workspace Tenants.
 * Connects directly to Neon PostgreSQL serverless client.
 */

import { getDb } from "./neon";
import { UserRole } from "@/types/auth";

export interface DbUserRecord {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  passwordHash: string;
  organizationId: string;
  organizationName: string;
  organizationTier: "STARTER" | "PROFESSIONAL" | "FIRM_ENTERPRISE";
}

let schemaChecked = false;

/**
 * Ensures required auth tables and columns exist in Neon PostgreSQL.
 * Safe to call repeatedly; uses IF NOT EXISTS and IF NOT COLUMN EXISTS.
 */
export async function ensureAuthSchema() {
  if (schemaChecked) return;
  const sql = getDb();
  if (!sql) return;

  try {
    // 1. Ensure organizations table exists
    await sql`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        tier VARCHAR(50) DEFAULT 'STARTER',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Ensure users table exists with password_hash
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'SOLICITOR',
        password_hash VARCHAR(255),
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Ensure password_hash column exists on existing installations
    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    `;

    // 4. Ensure legacy role constraint does not reject CANDIDATE / REVIEWER roles
    await sql`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
    `.catch(() => {});

    schemaChecked = true;
  } catch (err: any) {
    console.warn("[NeonDB:Auth] Schema check notice:", err?.message || err);
  }
}

/**
 * Find user record by email (case-insensitive).
 */
export async function findUserByEmail(email: string): Promise<DbUserRecord | null> {
  const sql = getDb();
  if (!sql) return null;

  await ensureAuthSchema();

  try {
    const rows = await sql`
      SELECT 
        u.id,
        u.email,
        u.full_name,
        u.role,
        u.password_hash,
        u.organization_id,
        COALESCE(o.name, 'My Workspace') AS org_name,
        COALESCE(o.tier, 'STARTER') AS org_tier
      FROM users u
      LEFT JOIN organizations o ON u.organization_id = o.id
      WHERE LOWER(u.email) = LOWER(${email.trim()})
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      id: String(row.id),
      email: String(row.email),
      fullName: String(row.full_name),
      role: (row.role as UserRole) || "SOLICITOR",
      passwordHash: String(row.password_hash || ""),
      organizationId: String(row.organization_id || "org-default"),
      organizationName: String(row.org_name || "My Workspace"),
      organizationTier: (row.org_tier as any) || "STARTER",
    };
  } catch (err: any) {
    console.error("[NeonDB:Auth] findUserByEmail error:", err?.message || err);
    throw err;
  }
}

/**
 * Create a new user with an associated organization in Neon PostgreSQL.
 */
export async function createUser(params: {
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  orgName?: string;
}): Promise<DbUserRecord> {
  const sql = getDb();
  if (!sql) {
    throw new Error("Database connection is not configured. Please set DATABASE_URL.");
  }

  await ensureAuthSchema();

  const { email, passwordHash, fullName, role, orgName } = params;
  const cleanEmail = email.trim().toLowerCase();
  const cleanOrgName = orgName?.trim() || `${fullName}'s Workspace`;
  const orgSlug = `${cleanOrgName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now().toString().slice(-6)}`;

  try {
    // 1. Create Organization
    const orgRows = await sql`
      INSERT INTO organizations (name, slug, tier)
      VALUES (${cleanOrgName}, ${orgSlug}, 'STARTER')
      RETURNING id, name, tier;
    `;

    const orgId = orgRows[0].id;
    const orgTier = orgRows[0].tier;

    // 2. Create User linked to Organization
    const userRows = await sql`
      INSERT INTO users (
        organization_id,
        email,
        full_name,
        role,
        password_hash
      ) VALUES (
        ${orgId},
        ${cleanEmail},
        ${fullName.trim()},
        ${role},
        ${passwordHash}
      )
      RETURNING id, email, full_name, role, password_hash, organization_id;
    `;

    const created = userRows[0];
    return {
      id: String(created.id),
      email: String(created.email),
      fullName: String(created.full_name),
      role: (created.role as UserRole) || role,
      passwordHash: String(created.password_hash),
      organizationId: String(orgId),
      organizationName: cleanOrgName,
      organizationTier: orgTier || "STARTER",
    };
  } catch (err: any) {
    console.error("[NeonDB:Auth] createUser error:", err?.message || err);
    throw err;
  }
}

