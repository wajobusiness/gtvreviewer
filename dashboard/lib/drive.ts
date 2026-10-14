export interface GoogleDriveParseResult {
  type: "folder" | "file" | "unknown";
  id: string | null;
}

export function extractGoogleDriveId(url: string): GoogleDriveParseResult {
  if (!url || typeof url !== "string") {
    return { type: "unknown", id: null };
  }

  // Folder patterns: /folders/{id} or /folders/{id}?usp=sharing
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) {
    return { type: "folder", id: folderMatch[1] };
  }

  // File patterns: /file/d/{id} or /d/{id}
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return { type: "file", id: fileMatch[1] };
  }

  // Query param pattern: ?id={id}
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch) {
    return { type: "folder", id: idParamMatch[1] };
  }

  return { type: "unknown", id: null };
}

export function isValidGoogleDriveUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  const isDomainValid = trimmed.includes("drive.google.com") || trimmed.includes("docs.google.com");
  const parsed = extractGoogleDriveId(trimmed);
  return isDomainValid && parsed.id !== null;
}
