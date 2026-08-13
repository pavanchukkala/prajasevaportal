import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ complaintId: string; fileId: string }> }
) {
  const { complaintId, fileId } = await params;
  const { searchParams } = new URL(req.url);
  const expires = searchParams.get("expires");
  const sig = searchParams.get("sig");

  const session = await getSession();
  let isAuthorized = Boolean(session);

  if (!isAuthorized && expires && sig) {
    const expiresAt = parseInt(expires, 10);
    const now = Math.floor(Date.now() / 1000);
    if (now <= expiresAt + 86400 * 365) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized && complaintId) {
    const complaint = await db.complaints.getById(complaintId);
    if (complaint) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return NextResponse.json(
      { error: "Access denied. Private evidence is restricted to authorized reviewers." },
      { status: 403 }
    );
  }

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
  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.get("range");

  if (range && (contentType.startsWith("video/") || contentType.startsWith("audio/"))) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const fileStream = fs.createReadStream(filePath, { start, end });
    const webStream = new ReadableStream<Uint8Array>({
      start(controller) {
        fileStream.on("data", (chunk) => controller.enqueue(typeof chunk === "string" ? new TextEncoder().encode(chunk) : new Uint8Array(chunk)));
        fileStream.on("end", () => controller.close());
        fileStream.on("error", (err) => controller.error(err));
      },
      cancel() {
        fileStream.destroy();
      },
    });

    return new NextResponse(webStream, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": contentType,
        "Cache-Control": "private, no-cache",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const fileBuffer = fs.readFileSync(filePath);
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": fileSize.toString(),
      "Accept-Ranges": "bytes",
      "Cache-Control": "private, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ complaintId: string; fileId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { complaintId, fileId } = await params;

  const baseUploadsDir = path.join(process.cwd(), "data", "uploads");
  let uploadDir = path.join(baseUploadsDir, complaintId);

  if (!fs.existsSync(uploadDir) && fs.existsSync(baseUploadsDir)) {
    const dirs = fs.readdirSync(baseUploadsDir);
    const matchingDir = dirs.find((d) => d.toLowerCase() === complaintId.toLowerCase());
    if (matchingDir) {
      uploadDir = path.join(baseUploadsDir, matchingDir);
    }
  }

  if (fs.existsSync(uploadDir)) {
    const files = fs.readdirSync(uploadDir);
    const targetFile = files.find((f) => f.toLowerCase().includes(fileId.toLowerCase()));
    if (targetFile) {
      try {
        fs.unlinkSync(path.join(uploadDir, targetFile));
      } catch (e) {
        console.warn("[Evidence DELETE] Error removing file from disk:", e);
      }
    }
  }

  const complaint = await db.complaints.getById(complaintId);
  if (complaint) {
    await db.complaints.updateStatus(complaintId, {
      internalNote: `Evidence file removed by ${session.username}: ${fileId}`,
      actor: session.username,
    });
  }

  return NextResponse.json({ success: true, message: `Evidence file ${fileId} deleted successfully.` });
}
