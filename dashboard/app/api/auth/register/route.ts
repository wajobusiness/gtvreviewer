import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { signSession, setSessionCookie } from "@/lib/auth/session";
import { findUserByEmail, createUser } from "@/lib/db/auth-db";
import { UserRole } from "@/types/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, orgName, accountType } = body;

    // 1. Validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters in length." },
        { status: 400 }
      );
    }

    if (!fullName || typeof fullName !== "string" || fullName.trim().length === 0) {
      return NextResponse.json(
        { error: "Full legal name is required." },
        { status: 400 }
      );
    }

    const role: UserRole = accountType === "CANDIDATE" ? "CANDIDATE" : "SOLICITOR";

    // 2. Check if user already exists
    let existing;
    try {
      existing = await findUserByEmail(email);
    } catch (dbErr: any) {
      return NextResponse.json(
        { error: `Database error during registration: ${dbErr?.message || "Connection refused"}` },
        { status: 503 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    // 3. Hash password with PBKDF2
    const passwordHash = hashPassword(password);

    // 4. Create user and tenant organization in Neon PostgreSQL
    const userRecord = await createUser({
      email,
      passwordHash,
      fullName,
      role,
      orgName: orgName || (role === "SOLICITOR" ? `${fullName}'s Legal Practice` : `${fullName}'s Application Workspace`),
    });

    // 5. Issue secure signed session cookie
    const token = signSession({
      userId: userRecord.id,
      email: userRecord.email,
      fullName: userRecord.fullName,
      role: userRecord.role,
      organizationId: userRecord.organizationId,
      organizationName: userRecord.organizationName,
      organizationTier: userRecord.organizationTier,
    });

    await setSessionCookie(token);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: userRecord.id,
          email: userRecord.email,
          fullName: userRecord.fullName,
          role: userRecord.role,
        },
        organization: {
          id: userRecord.organizationId,
          name: userRecord.organizationName,
          slug: "workspace",
          tier: userRecord.organizationTier,
          seatsUsed: 1,
          seatsMax: 5,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[API:Auth:Register] Error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}

