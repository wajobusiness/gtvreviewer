import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        user: null,
        organization: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        fullName: session.fullName,
        role: session.role,
      },
      organization: {
        id: session.organizationId,
        name: session.organizationName || "My Workspace",
        slug: "workspace",
        tier: session.organizationTier || "STARTER",
        seatsUsed: 1,
        seatsMax: 5,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { authenticated: false, user: null, error: err?.message },
      { status: 500 }
    );
  }
}

