import { NextRequest, NextResponse } from "next/server";
import { extractTextFromBuffer } from "@/lib/extractor/textExtractor";

const ALLOWED_EXTENSIONS = ["pdf", "docx", "doc", "txt", "md", "png", "jpg", "jpeg"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = formData.get("category") as string | null;
    const projectId = formData.get("projectId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        {
          error: `Unsupported file format (.${ext}). Supported formats: PDF, DOCX, TXT, PNG, JPG.`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extracted = await extractTextFromBuffer(buffer, file.name);

    const fileId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fileSizeKb = Math.round(file.size / 1024);

    return NextResponse.json({
      success: true,
      fileId,
      fileName: file.name,
      fileSizeKb,
      pageCount: extracted.pageCount,
      wordCount: extracted.wordCount,
      category: category || "Mandatory Criterion (Leadership / Recognition)",
      projectId: projectId || "proj-default",
      contentText: extracted.text,
      uploadedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[UploadAPI] Error parsing file:", err);
    return NextResponse.json(
      { error: err.message || "Upload and text extraction failed" },
      { status: 500 }
    );
  }
}
