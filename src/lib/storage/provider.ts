export interface EvidenceMetadata {
  fileId: string;
  complaintId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  sha256Hash: string;
  storageProvider: "firebase_storage" | "local_storage";
  privatePath: string;
  uploadedAt: string;
}

export interface PilotLimits {
  maxVideoCount: number;
  maxVideoSizeMB: number;
  maxFileSizeMB: number;
  maxTotalEvidenceMB: number;
  retentionDays: number;
}

export interface IStorageProvider {
  providerName: "firebase_storage" | "local_storage";
  uploadEvidence(
    buffer: Buffer,
    metadata: { complaintId: string; originalName: string; mimeType: string }
  ): Promise<EvidenceMetadata>;
  getAuthorizedDownloadUrl(
    evidence: EvidenceMetadata,
    expiresInSeconds?: number
  ): Promise<string>;
}
