# STORAGE_STATUS.md — Evidence Storage & Media Upload Audit Report

**Date:** 2026-08-09  
**Status:** ✅ COMPLETED & VERIFIED

---

## 1. Storage Architecture Overview

The evidence storage layer has been upgraded from mock storage URLs to a production-ready dual-provider architecture (`IStorageProvider`).

| Provider | Trigger Condition | Storage Target | Download Authorization |
| :--- | :--- | :--- | :--- |
| **Firebase Storage** | `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` set | Firebase Cloud Storage Bucket (`FIREBASE_STORAGE_BUCKET`) | Short-lived signed token URL for authorized staff |
| **Local Storage** | Firebase environment variables omitted | Private server disk (`data/uploads/[complaintId]/`) | Protected session route `/api/evidence/[complaintId]/[fileId]` |

- 🔒 **No Fake URLs**: Removed all `https://mock-storage.local/...` dummy URLs.
- 🔒 **Metadata Separation**: Only file metadata and SHA-256 hashes are stored in the database.
- 🔒 **Access Control**: Public download URLs are never generated. Evidence files are strictly accessible only to authenticated staff reviewers.

---

## 2. Pilot Evidence Upload Limits & Validation

All uploads are enforced by [`src/lib/storage/validator.ts`](file:///C:/Users/chukk/Downloads/srikalahasti-praja-seva/src/lib/storage/validator.ts) against configurable environment variables:

| Limit Parameter | Default Value | Configurable Env Variable | Enforcement Action |
| :--- | :--- | :--- | :--- |
| **Max Video Files** | `3` videos / complaint | `MAX_VIDEO_COUNT` | Rejects 4th video upload |
| **Max Video Size** | `50` MB / video | `MAX_VIDEO_SIZE_MB` | Rejects videos $>50$ MB |
| **Max Image / Audio / PDF Size** | `10` MB / file | `MAX_FILE_SIZE_MB` | Rejects files $>10$ MB |
| **Max Total Evidence Size** | `100` MB / complaint | `MAX_TOTAL_EVIDENCE_MB` | Rejects upload exceeding sum |
| **Data Retention Period** | `180` days | `EVIDENCE_RETENTION_DAYS` | Configurable retention threshold |

### Security Validation Rules
1. **Allowed MIME Types**: `image/jpeg`, `image/png`, `image/webp`, `video/mp4`, `video/webm`, `audio/mpeg`, `audio/wav`, `audio/ogg`, `application/pdf`.
2. **Disallowed Extensions**: `.exe`, `.bat`, `.cmd`, `.sh`, `.vbs`, `.js`, `.ts`, `.php`, `.py`, `.dll`, `.msi`, `.so`.
3. **SHA-256 Integrity Hash**: Calculated for every uploaded file prior to storage.

---

## 3. Database Metadata Schema

When a file is uploaded, the following metadata record is returned and stored in the database:
```json
{
  "fileId": "EVID-1786270800000-a1b2c3d4",
  "complaintId": "SKT-2026-25175",
  "originalName": "water_leak_site.jpg",
  "mimeType": "image/jpeg",
  "sizeBytes": 2048500,
  "sha256Hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "storageProvider": "local_storage",
  "privatePath": "data/uploads/SKT-2026-25175/EVID-1786270800000-a1b2c3d4.jpg",
  "uploadedAt": "2026-08-09T15:20:00.000Z"
}
```
