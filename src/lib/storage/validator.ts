import crypto from "node:crypto";
import { PilotLimits } from "./provider";

export const DEFAULT_PILOT_LIMITS: PilotLimits = {
  maxVideoCount: parseInt(process.env.MAX_VIDEO_COUNT || "3", 10),
  maxVideoSizeMB: parseInt(process.env.MAX_VIDEO_SIZE_MB || "50", 10),
  maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || "10", 10),
  maxTotalEvidenceMB: parseInt(process.env.MAX_TOTAL_EVIDENCE_MB || "100", 10),
  retentionDays: parseInt(process.env.EVIDENCE_RETENTION_DAYS || "180", 10),
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
  mimeType: string,
  existingVideosCount: number = 0,
  currentTotalSizeBytes: number = 0,
  limits: PilotLimits = DEFAULT_PILOT_LIMITS
): ValidationResult {
  const ext = originalName.slice(originalName.lastIndexOf(".")).toLowerCase();

  // 1. Reject executable and script extensions
  if (DISALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: `Executable or script file type "${ext}" is strictly forbidden.` };
  }

  // 2. Validate MIME type
  if (!ALLOWED_MIME_TYPES.has(mimeType.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported MIME type "${mimeType}". Only images, MP4/WebM videos, audio, and PDF documents are accepted.`,
    };
  }

  const isVideo = mimeType.startsWith("video/");
  const fileSizeMB = buffer.length / (1024 * 1024);

  // 3. Video count limit
  if (isVideo && existingVideosCount >= limits.maxVideoCount) {
    return {
      valid: false,
      error: `Maximum video count limit reached (${limits.maxVideoCount} videos per complaint).`,
    };
  }

  // 4. Video size limit
  if (isVideo && fileSizeMB > limits.maxVideoSizeMB) {
    return {
      valid: false,
      error: `Video size (${fileSizeMB.toFixed(1)} MB) exceeds maximum limit of ${limits.maxVideoSizeMB} MB.`,
    };
  }

  // 5. General file size limit (images, audio, PDF)
  if (!isVideo && fileSizeMB > limits.maxFileSizeMB) {
    return {
      valid: false,
      error: `File size (${fileSizeMB.toFixed(1)} MB) exceeds maximum limit of ${limits.maxFileSizeMB} MB.`,
    };
  }

  // 6. Total complaint evidence size limit
  const newTotalMB = (currentTotalSizeBytes + buffer.length) / (1024 * 1024);
  if (newTotalMB > limits.maxTotalEvidenceMB) {
    return {
      valid: false,
      error: `Total evidence size (${newTotalMB.toFixed(1)} MB) exceeds the maximum limit of ${limits.maxTotalEvidenceMB} MB per complaint.`,
    };
  }

  const sha256Hash = computeSha256(buffer);
  return { valid: true, sha256Hash };
}
