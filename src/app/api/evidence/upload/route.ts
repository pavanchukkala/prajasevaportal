import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { validateFile, DEFAULT_PILOT_LIMITS } from "@/lib/storage/validator";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const complaintId = formData.get("complaintId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }
    if (!complaintId) {
      return NextResponse.json({ error: "Complaint ID is required." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const complaint = await db.complaints.getById(complaintId);
    const targetId = complaint ? complaint.id : complaintId;

    const validation = validateFile(
      buffer,
      file.name,
      file.type,
      0,
      0,
      DEFAULT_PILOT_LIMITS
    );

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const metadata = await storage.uploadEvidence(buffer, {
      complaintId: targetId,
      originalName: file.name,
      mimeType: file.type,
    });

    const authorizedUrl = await storage.getAuthorizedDownloadUrl(metadata, 86400 * 30);

    await db.complaints.updateStatus(targetId, {
      mediaUrl: authorizedUrl,
      actor: "citizen_upload",
    });

    return NextResponse.json(
      {
        success: true,
        evidence: metadata,
        authorizedUrl,
        storageProvider: storage.providerName,
        message: `File "${file.name}" uploaded successfully.`,
      },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "File upload failed.";
    console.error("[Storage] Evidence upload error:", error);
    return NextResponse.json(
      { error: message },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
