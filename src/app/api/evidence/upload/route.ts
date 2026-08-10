import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import { validateFile, DEFAULT_PILOT_LIMITS } from "@/lib/storage/validator";
import { db } from "@/lib/db";

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

    // Retrieve existing complaint evidence for limit checking
    const complaint = await db.complaints.getById(complaintId);
    const existingMedia = complaint?.mediaUrls || [];
    const existingVideoCount = existingMedia.filter((m: string) => m.includes(".mp4") || m.includes(".webm")).length;

    // Validate pilot rules
    const validation = validateFile(
      buffer,
      file.name,
      file.type,
      existingVideoCount,
      0,
      DEFAULT_PILOT_LIMITS
    );

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Perform upload via active storage provider
    const metadata = await storage.uploadEvidence(buffer, {
      complaintId,
      originalName: file.name,
      mimeType: file.type,
    });

    // Generate authorized short-lived download URL
    const authorizedUrl = await storage.getAuthorizedDownloadUrl(metadata);

    // Persist evidence attachment on complaint in database
    await db.complaints.updateStatus(complaintId, {
      mediaUrl: authorizedUrl,
      actor: "citizen_upload",
    } as any);

    return NextResponse.json(
      {
        success: true,
        evidence: metadata,
        authorizedUrl,
        storageProvider: storage.providerName,
        message: `File "${file.name}" uploaded successfully using ${storage.providerName}.`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Storage] Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "File upload failed." },
      { status: 500 }
    );
  }
}
