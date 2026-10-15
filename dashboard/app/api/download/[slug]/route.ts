import { NextRequest, NextResponse } from "next/server";
import { getReportBySlug } from "@/lib/reports";
import { getCurrentSession } from "@/lib/auth/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return new NextResponse("Unauthorized. Please sign in.", { status: 401 });
  }

  const { slug } = await params;
  const report = await Promise.resolve(getReportBySlug(slug));

  if (!report) {
    return new NextResponse("Report not found", { status: 404 });
  }

  return new NextResponse(report.content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${report.meta.filename}"`,
    },
  });
}

