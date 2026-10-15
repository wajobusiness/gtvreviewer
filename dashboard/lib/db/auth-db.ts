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

    // 5. Ensure password_reset_tokens table exists
    await sql`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
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

/**
 * Creates a secure password reset token valid for 1 hour.
 */
export async function createPasswordResetToken(email: string): Promise<string | null> {
  const sql = getDb();
  if (!sql) return null;

  await ensureAuthSchema();

  try {
    const cleanEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(cleanEmail);
    if (!user) {
      return null; // Email not registered
    }

    const { randomBytes } = await import("node:crypto");
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await sql`
      INSERT INTO password_reset_tokens (email, token, expires_at)
      VALUES (${cleanEmail}, ${token}, ${expiresAt});
    `;

    return token;
  } catch (err: any) {
    console.error("[NeonDB:Auth] createPasswordResetToken error:", err?.message || err);
    return null;
  }
}

/**
 * Verifies a reset token and returns the corresponding email if valid.
 */
export async function verifyResetToken(token: string): Promise<string | null> {
  const sql = getDb();
  if (!sql) return null;

  await ensureAuthSchema();

  try {
    const rows = await sql`
      SELECT email, expires_at, used
      FROM password_reset_tokens
      WHERE token = ${token.trim()}
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) return null;
    const record = rows[0];

    if (record.used) return null;
    if (new Date(record.expires_at).getTime() < Date.now()) return null;

    return String(record.email);
  } catch (err: any) {
    console.error("[NeonDB:Auth] verifyResetToken error:", err?.message || err);
    return null;
  }
}

/**
 * Updates user password with a verified reset token.
 */
export async function resetUserPasswordWithToken(
  token: string,
  newPasswordHash: string
): Promise<boolean> {
  const sql = getDb();
  if (!sql) return false;

  await ensureAuthSchema();

  try {
    const email = await verifyResetToken(token);
    if (!email) return false;

    // 1. Update user password
    await sql`
      UPDATE users
      SET password_hash = ${newPasswordHash},
          updated_at = CURRENT_TIMESTAMP
      WHERE LOWER(email) = LOWER(${email});
    `;

    // 2. Mark token as used
    await sql`
      UPDATE password_reset_tokens
      SET used = TRUE
      WHERE token = ${token.trim()};
    `;

    return true;
  } catch (err: any) {
    console.error("[NeonDB:Auth] resetUserPasswordWithToken error:", err?.message || err);
    return false;
  }
}

