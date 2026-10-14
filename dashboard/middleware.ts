import { NextResponse, type NextRequest } from "next/server";

// Secret used to sign session cookies (must match lib/auth/session.ts)
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "gtv-reviewer-production-secure-session-key-2026-auth";

/**
 * Edge-compatible session signature and expiration verification using Web Crypto API.
 */
async function verifySessionToken(token: string | undefined): Promise<{
  valid: boolean;
  role?: string;
  userId?: string;
}> {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false };
  }

  const [data, sig] = token.split(".");
  if (!data || !sig) {
    return { valid: false };
  }

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(AUTH_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Decode base64url signature
    const base64Sig = sig.replace(/-/g, "+").replace(/_/g, "/");
    const paddedSig = base64Sig.padEnd(base64Sig.length + ((4 - (base64Sig.length % 4)) % 4), "=");
    const sigBytes = Uint8Array.from(atob(paddedSig), (c) => c.charCodeAt(0));

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(data));
    if (!isValid) {
      return { valid: false };
    }

    // Decode and check payload expiration
    const base64Data = data.replace(/-/g, "+").replace(/_/g, "/");
    const paddedData = base64Data.padEnd(base64Data.length + ((4 - (base64Data.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(paddedData));

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false };
    }

    return {
      valid: true,
      role: payload.role,
      userId: payload.userId,
    };
  } catch {
    return { valid: false };
  }
}

// Protected route paths requiring active authentication
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/projects",
  "/upload",
  "/compare",
  "/export",
  "/reports",
  "/evidence",
  "/requirements",
  "/letters",
  "/consistency",
  "/panel",
  "/analytics",
  "/summary",
  "/settings",
  "/billing",
  "/admin",
  "/jobs",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("gt_session")?.value;
  const { valid, role } = await verifySessionToken(sessionToken);

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  // 1. If unauthenticated user attempts to visit protected route -> redirect to /login
  if (isProtected && !valid) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If authenticated user attempts to visit /login or /register -> redirect to /dashboard
  if ((pathname === "/login" || pathname === "/register") && valid) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. If accessing /admin and user is not ADMIN -> redirect to /dashboard
  if ((pathname === "/admin" || pathname.startsWith("/admin/")) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/dashboard",
    "/projects/:path*",
    "/projects",
    "/upload",
    "/compare",
    "/export",
    "/reports/:path*",
    "/reports",
    "/evidence",
    "/requirements",
    "/letters",
    "/consistency",
    "/panel",
    "/analytics",
    "/summary",
    "/settings",
    "/billing",
    "/admin/:path*",
    "/admin",
    "/jobs/:path*",
    "/login",
    "/register",
  ],
};

