import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import {
  createProjectInDb,
  listProjectsFromDb,
  deleteProjectFromDb,
} from "@/lib/db/neon";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const projects = await listProjectsFromDb(session.organizationId);
    return NextResponse.json({ projects });
  } catch (err: any) {
    console.error("[API:Projects:GET] Error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve projects." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { candidateName, visaRoute, targetField, applicantType } = body;

    if (!candidateName || typeof candidateName !== "string" || !candidateName.trim()) {
      return NextResponse.json(
        { error: "Candidate full name is required." },
        { status: 400 }
      );
    }

    if (!visaRoute || !["Exceptional Talent", "Exceptional Promise"].includes(visaRoute)) {
      return NextResponse.json(
        { error: "A valid visa route ('Exceptional Talent' or 'Exceptional Promise') is required." },
        { status: 400 }
      );
    }

    const created = await createProjectInDb({
      organizationId: session.organizationId,
      candidateName: candidateName.trim(),
      visaRoute,
      targetField: targetField || "Digital Technology",
      applicantType: applicantType || "Both",
    });

    if (!created) {
      return NextResponse.json(
        { error: "Failed to create candidate portfolio in database." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, project: created });
  } catch (err: any) {
    console.error("[API:Projects:POST] Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while creating project." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required." }, { status: 400 });
    }

    const success = await deleteProjectFromDb(projectId, session.organizationId);
    if (!success) {
      return NextResponse.json(
        { error: "Could not delete project or permission denied." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[API:Projects:DELETE] Error:", err);
    return NextResponse.json(
      { error: "Failed to delete project." },
      { status: 500 }
    );
  }
}

