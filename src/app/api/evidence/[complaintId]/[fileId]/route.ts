import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ complaintId: string; fileId: string }> }
) {
  const { complaintId, fileId } = await params;
  const { searchParams } = new URL(req.url);
  const expires = searchParams.get("expires");
  const sig = searchParams.get("sig");

  // 1. Session check or HMAC token validation
  const session = await getSession();
  let isAuthorized = Boolean(session);

  if (!isAuthorized && expires && sig) {
    const expiresAt = parseInt(expires, 10);
    const now = Math.floor(Date.now() / 1000);
    if (now <= expiresAt) {
      const secret = process.env.PSIP_AUTH_SECRET || "psip-evidence-secret-key-2026";
      const expectedSig = crypto
        .createHmac("sha256", secret)
        .update(`${complaintId}:${fileId}:${expiresAt}`)
        .digest("hex");
      const expectedFbSig = crypto
        .createHmac("sha256", secret)
        .update(`fb:${complaintId}:${fileId}:${expiresAt}`)
        .digest("hex");

      if (sig === expectedSig || sig === expectedFbSig) {
        isAuthorized = true;
      }
    }
  }

  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Access denied. Private evidence is restricted to authorized reviewers." },
      { status: 403 }
    );
  }

  // 2. Read file from private upload storage (Linux case-insensitive resolution)
  const baseUploadsDir = path.join(process.cwd(), "data", "uploads");
  let uploadDir = path.join(baseUploadsDir, complaintId);

  if (!fs.existsSync(uploadDir) && fs.existsSync(baseUploadsDir)) {
    const dirs = fs.readdirSync(baseUploadsDir);
    const matchingDir = dirs.find((d) => d.toLowerCase() === complaintId.toLowerCase());
    if (matchingDir) {
      uploadDir = path.join(baseUploadsDir, matchingDir);
    }
  }

  if (!fs.existsSync(uploadDir)) {
    return NextResponse.json({ error: "Evidence directory not found." }, { status: 404 });
  }

  const files = fs.readdirSync(uploadDir);
  const targetFile = files.find((f) => f.toLowerCase().startsWith(fileId.toLowerCase()));

  if (!targetFile) {
    return NextResponse.json({ error: "Evidence file not found." }, { status: 404 });
  }

  const filePath = path.join(uploadDir, targetFile);
  const fileBuffer = fs.readFileSync(filePath);

  const ext = path.extname(targetFile).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
    ".3gp": "video/3gpp",
    ".avi": "video/x-msvideo",
    ".mkv": "video/x-matroska",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",
    ".m4a": "audio/mp4",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  const contentType = mimeTypes[ext] || "application/octet-stream";

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
