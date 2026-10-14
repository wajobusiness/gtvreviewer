import { NextRequest, NextResponse } from "next/server";
import { jobManager } from "@/lib/queue/jobManager";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const projectId = body.projectId || `proj-${Date.now()}`;
    const candidateName = body.candidateName || "Candidate Applicant";
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
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId") || undefined;

  const jobs = jobManager.listJobs(projectId);
  return NextResponse.json({ jobs });
}
