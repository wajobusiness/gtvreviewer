/**
 * lib/auth/session.ts
 *
 * Secure signed session token management and cookie handling for Next.js 15.
 * Uses HMAC-SHA256 signature verification to prevent tampering.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { UserRole } from "@/types/auth";

export const SESSION_COOKIE_NAME = "gt_session";

// Secret used to sign session cookies. Falls back to a deterministic development key if not configured.
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "gtv-reviewer-production-secure-session-key-2026-auth";

export interface SessionPayload {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationId: string;
  organizationName?: string;
  organizationTier?: "STARTER" | "PROFESSIONAL" | "FIRM_ENTERPRISE";
  exp: number; // Unix timestamp in seconds
}

/**
 * Signs a session payload and returns a base64url-encoded token with HMAC-SHA256 signature.
 * Default expiration: 7 days.
 */
export function signSession(
  payload: Omit<SessionPayload, "exp">,
  expiresInSeconds = 7 * 24 * 3600
): string {
  const fullPayload: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const data = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const sig = createHmac("sha256", AUTH_SECRET).update(data).digest("base64url");
  return `${data}.${sig}`;
}

/**
 * Verifies a signed session token. Returns the decoded payload if valid and not expired, or null.
 */
export function verifySession(token: string | undefined | null): SessionPayload | null {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [data, sig] = token.split(".");
  if (!data || !sig) {
    return null;
  }

  try {
    const expectedSig = createHmac("sha256", AUTH_SECRET).update(data).digest("base64url");
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expectedBuf.length) {
      return null;
    }

    if (!timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(Buffer.from(data, "base64url").toString("utf-8"));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Set session cookie in Next.js 15 response.
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 3600, // 7 days
  });
}

/**
 * Read current session from cookies.
 */
export async function getCurrentSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySession(token);
  } catch {
    return null;
  }
}

/**
 * Clear session cookie on logout.
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

