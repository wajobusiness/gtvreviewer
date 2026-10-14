import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string | null;
    const projectId = formData.get("projectId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate PDF
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Invalid file type. Tech Nation requires PDF format only." },
        { status: 400 }
      );
    }

    // File metadata mock upload confirmation
    const fileId = `doc-${Date.now()}`;
    const fileSizeKb = Math.round(file.size / 1024);

    return NextResponse.json({
      success: true,
      fileId,
      fileName: file.name,
      fileSizeKb,
      category: category || "Mandatory Criterion",
      projectId: projectId || "proj-001",
      uploadedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Upload failed" },
      { status: 500 }
    );
  }
}

