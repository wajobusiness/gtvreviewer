import { NextRequest, NextResponse } from "next/server";
import { getReportBySlug } from "@/lib/reports";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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

