import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { signSession, setSessionCookie } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/db/auth-db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // 1. Validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 }
      );
    }

    // 2. Query user from Neon DB
    let userRecord;
    try {
      userRecord = await findUserByEmail(email);
    } catch (dbErr: any) {
      return NextResponse.json(
        { error: `Database error during login: ${dbErr?.message || "Connection refused"}` },
        { status: 503 }
      );
    }

    if (!userRecord || !userRecord.passwordHash) {
      // Return 401 with generic message to avoid email enumeration
      return NextResponse.json(
        { error: "Invalid email or password. Please verify your credentials." },
        { status: 401 }
      );
    }

    // 3. Verify password hash
    const isValid = verifyPassword(password, userRecord.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password. Please verify your credentials." },
        { status: 401 }
      );
    }

    // 4. Issue secure signed session cookie
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

    return NextResponse.json({
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
    });
  } catch (err: any) {
    console.error("[API:Auth:Login] Error:", err);
    return NextResponse.json(
      { error: err?.message || "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}

