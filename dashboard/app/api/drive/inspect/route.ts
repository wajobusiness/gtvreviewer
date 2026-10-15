import { NextRequest, NextResponse } from "next/server";
import { extractGoogleDriveId, inspectPublicGoogleDrive } from "@/lib/drive";
import { getCurrentSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to inspect remote portfolios." },
        { status: 401 }
      );
    }

    const { url } = await request.json().catch(() => ({}));

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json(
        { error: "Please enter a valid Google Drive URL." },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();

    if (!trimmedUrl.includes("drive.google.com") && !trimmedUrl.includes("docs.google.com")) {
      return NextResponse.json(
        {
          error:
            "Invalid URL domain. URL must be a public Google Drive link (e.g. https://drive.google.com/drive/folders/... or /file/d/...).",
        },
        { status: 400 }
      );
    }

    const { type, id } = extractGoogleDriveId(trimmedUrl);

    if (!id) {
      return NextResponse.json(
        { error: "Could not identify a valid Google Drive folder or file ID from the provided link." },
        { status: 400 }
      );
    }

    // Inspect the Google Drive link and retrieve ALL documents of any type
    const { driveId, driveType, files } = await inspectPublicGoogleDrive(trimmedUrl);

    return NextResponse.json({
      success: true,
      url: trimmedUrl,
      driveId,
      driveType,
      isPublic: true,
      accessMessage: `Public Access Verified: ${files.length} document(s) extracted across all supported formats (PDF, Word, Images, Text).`,
      totalFiles: files.length,
      files,
    });
  } catch (err: any) {
    console.error("[DriveInspectAPI] Error inspecting link:", err);
    return NextResponse.json(
      { error: err.message || "Failed to inspect Google Drive link" },
      { status: 500 }
    );
  }
}
