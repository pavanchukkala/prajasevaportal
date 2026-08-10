import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { validateFile, DEFAULT_PILOT_LIMITS } from "@/lib/storage/validator";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow large video uploads

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

    // Resolve exact complaint ID from database to prevent case mismatches on Linux
    const complaint = await db.complaints.getById(complaintId);
    const targetId = complaint ? complaint.id : complaintId;

    // Validate security rules (permits all citizen videos, audio, images, docs)
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

    // Perform upload via active storage provider
    const metadata = await storage.uploadEvidence(buffer, {
      complaintId: targetId,
      originalName: file.name,
      mimeType: file.type,
    });

    // Generate authorized download URL
    const authorizedUrl = await storage.getAuthorizedDownloadUrl(metadata, 86400 * 30); // 30-day link

    // Persist evidence attachment directly into database complaint record
    await db.complaints.updateStatus(targetId, {
      mediaUrl: authorizedUrl,
      actor: "citizen_upload",
    } as any);

    return NextResponse.json(
      {
        success: true,
        evidence: metadata,
        authorizedUrl,
        storageProvider: storage.providerName,
        message: `File "${file.name}" uploaded successfully.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Storage] Evidence upload error:", error);
    return NextResponse.json(
      { error: error?.message || "File upload failed." },
      { status: 500 }
    );
  }
}
