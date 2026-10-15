import { NextRequest, NextResponse } from "next/server";
import { jobManager } from "@/lib/queue/jobManager";
import { listJobsFromDb } from "@/lib/db/neon";
import { getCurrentSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to create an analysis job." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const projectId = body.projectId || `proj-${Date.now()}`;
    const candidateName = body.candidateName || (session.role === "CANDIDATE" ? session.fullName : "Candidate Applicant");
    const visaRoute = body.visaRoute || "Exceptional Promise";
    const targetField = body.targetField || "Digital Technology";
    const applicantType = body.applicantType || "Both";
    const documents = body.documents || [];
    const additionalInstructions = body.additionalInstructions || "";
    const sourceType = body.sourceType as "LOCAL_UPLOAD" | "GOOGLE_DRIVE" | undefined;
    const googleDriveUrl = body.googleDriveUrl as string | undefined;

    const job = jobManager.createJob(projectId, candidateName, visaRoute, {
      targetField,
      applicantType,
      documents,
      sourceType,
      googleDriveUrl,
      additionalInstructions,
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      status: job.status,
      job,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create job" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") || undefined;

  let jobs = jobManager.listJobs(projectId);
  if (!jobs || jobs.length === 0) {
    jobs = await listJobsFromDb(projectId);
  }
  return NextResponse.json({ jobs });
}
