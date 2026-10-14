import { NextRequest, NextResponse } from "next/server";
import { jobManager } from "@/lib/queue/jobManager";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const projectId = body.projectId || "proj-001";
    const candidateName = body.candidateName || "Alex Taylor (Sample Candidate)";
    const visaRoute = body.visaRoute || "Exceptional Promise";
    const sourceType = body.sourceType as "LOCAL_UPLOAD" | "GOOGLE_DRIVE" | undefined;
    const googleDriveUrl = body.googleDriveUrl as string | undefined;

    const job = jobManager.createJob(projectId, candidateName, visaRoute, {
      sourceType,
      googleDriveUrl,
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
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") || undefined;

  const jobs = jobManager.listJobs(projectId);
  return NextResponse.json({ jobs });
}

