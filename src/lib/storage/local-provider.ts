import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { IStorageProvider, EvidenceMetadata } from "./provider";
import { computeSha256 } from "./validator";

export class LocalStorageProvider implements IStorageProvider {
  public providerName = "local_storage" as const;
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "data", "uploads");
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  public async uploadEvidence(
    buffer: Buffer,
    metadata: { complaintId: string; originalName: string; mimeType: string }
  ): Promise<EvidenceMetadata> {
    const fileId = `EVID-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
    const complaintDir = path.join(this.uploadDir, metadata.complaintId);
    if (!fs.existsSync(complaintDir)) {
      fs.mkdirSync(complaintDir, { recursive: true });
    }

    const ext = metadata.originalName.slice(metadata.originalName.lastIndexOf("."));
    const fileName = `${fileId}${ext}`;
    const filePath = path.join(complaintDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const sha256Hash = computeSha256(buffer);
    const relativePath = path.join("data", "uploads", metadata.complaintId, fileName);

    return {
      fileId,
      complaintId: metadata.complaintId,
      originalName: metadata.originalName,
      mimeType: metadata.mimeType,
      sizeBytes: buffer.length,
      sha256Hash,
      storageProvider: "local_storage",
      privatePath: relativePath,
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
      .update(`${evidence.complaintId}:${evidence.fileId}:${expiresAt}`)
      .digest("hex");

    return `/api/evidence/${evidence.complaintId}/${evidence.fileId}?expires=${expiresAt}&sig=${sig}`;
  }
}
