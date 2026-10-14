import { NextRequest, NextResponse } from "next/server";
import { jobManager } from "@/lib/queue/jobManager";
import { getJobFromDb } from "@/lib/db/neon";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let job = jobManager.getJob(id);

  if (!job) {
    job = await getJobFromDb(id);
  }

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ job });
}

