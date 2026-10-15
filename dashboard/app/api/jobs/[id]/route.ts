import { NextRequest, NextResponse } from "next/server";
import { jobManager } from "@/lib/queue/jobManager";
import { getJobFromDb } from "@/lib/db/neon";
import { getCurrentSession } from "@/lib/auth/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

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

