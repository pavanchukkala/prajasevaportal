import crypto from "node:crypto";
import { PilotLimits } from "./provider";

export const DEFAULT_PILOT_LIMITS: PilotLimits = {
  maxVideoCount: parseInt(process.env.MAX_VIDEO_COUNT || "50", 10),
  maxVideoSizeMB: parseInt(process.env.MAX_VIDEO_SIZE_MB || "500", 10),
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || "200", 10),
  maxTotalEvidenceMB: parseInt(process.env.MAX_TOTAL_EVIDENCE_MB || "2000", 10),
  retentionDays: parseInt(process.env.EVIDENCE_RETENTION_DAYS || "365", 10),
};

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "application/pdf",
]);

const DISALLOWED_EXTENSIONS = new Set([
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".vbs",
  ".js",
  ".ts",
  ".php",
  ".py",
  ".pl",
  ".cgi",
  ".jar",
  ".msi",
  ".dll",
  ".so",
]);

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sha256Hash?: string;
}

export function computeSha256(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export function validateFile(
  buffer: Buffer,
  originalName: string,
  _mimeType: string,
  _existingVideosCount: number = 0,
  _currentTotalSizeBytes: number = 0,
  _limits: PilotLimits = DEFAULT_PILOT_LIMITS
): ValidationResult {
  const ext = originalName.slice(originalName.lastIndexOf(".")).toLowerCase();

  // Protect server operating system from executable binaries
  if (DISALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `Executable file type "${ext}" is not permitted for server security.` };
  }

  // Accept all citizen evidence files (videos, photos, voice notes, documents)
  const sha256Hash = computeSha256(buffer);
  return { valid: true, sha256Hash };
}
