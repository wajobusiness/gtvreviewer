import { NextRequest, NextResponse } from "next/server";
import { searchAllReports } from "@/lib/reports";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  const results = searchAllReports(q);
  return NextResponse.json({ results });
}

