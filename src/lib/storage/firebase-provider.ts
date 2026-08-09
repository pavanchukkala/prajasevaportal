import crypto from "node:crypto";
import { IStorageProvider, EvidenceMetadata } from "./provider";
import { computeSha256 } from "./validator";

export class FirebaseStorageProvider implements IStorageProvider {
  public providerName = "firebase_storage" as const;
  private projectId: string;
  private clientEmail: string;
  private privateKey: string;
  private bucket: string;

  constructor() {
    this.projectId = process.env.FIREBASE_PROJECT_ID || "";
    this.clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "";
    this.privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
    this.bucket = process.env.FIREBASE_STORAGE_BUCKET || `${this.projectId}.appspot.com`;

    if (!this.projectId || !this.clientEmail || !this.privateKey) {
      throw new Error("Firebase storage configuration missing required environment variables.");
    }
  }

  public async uploadEvidence(
    buffer: Buffer,
    metadata: { complaintId: string; originalName: string; mimeType: string }
  ): Promise<EvidenceMetadata> {
    const fileId = `EVID-FB-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const ext = metadata.originalName.slice(metadata.originalName.lastIndexOf("."));
    const objectPath = `evidence/${metadata.complaintId}/${fileId}${ext}`;

    // Upload via Firebase Storage REST API
    const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(this.bucket)}/o?uploadType=media&name=${encodeURIComponent(objectPath)}`;

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": metadata.mimeType,
      },
      body: new Uint8Array(buffer),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Firebase storage upload failed: ${res.status} — ${errText}`);
    }

    const sha256Hash = computeSha256(buffer);

    return {
      fileId,
      complaintId: metadata.complaintId,
      originalName: metadata.originalName,
      mimeType: metadata.mimeType,
      sizeBytes: buffer.length,
      sha256Hash,
      storageProvider: "firebase_storage",
      privatePath: objectPath,
      uploadedAt: new Date().toISOString(),
    };
  }

  public async getAuthorizedDownloadUrl(
    evidence: EvidenceMetadata,
    expiresInSeconds = 900
  ): Promise<string> {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const secret = process.env.PSIP_AUTH_SECRET || "psip-evidence-secret-key-2026";
    const sig = crypto
      .createHmac("sha256", secret)
      .update(`fb:${evidence.complaintId}:${evidence.fileId}:${expiresAt}`)
      .digest("hex");

    return `/api/evidence/${evidence.complaintId}/${evidence.fileId}?expires=${expiresAt}&sig=${sig}`;
  }
}
