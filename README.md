# Srikalahasti Praja Seva Intelligence Platform

An AI-assisted citizen grievance and constituency intelligence platform for **Srikalahasti Assembly Constituency (No. 168)**, Tirupati District, Andhra Pradesh.

---

## 🚀 Deployment & Environment Setup

### 1. Environment Configuration (`.env.local`)

Copy `.env.example` to `.env.local` and set required environment variables:

```bash
# Staff Authentication Secrets
PSIP_AUTH_SECRET=your-random-32-character-secret-key

# Database Connection (Optional — defaults to persistent SQLite at data/psip_complaints.json)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Firebase Storage (Optional — defaults to Local Disk Storage at data/uploads/)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# SMS Provider (Optional — defaults to 'none' / transaction audit log)
SMS_PROVIDER=none # none | twilio | msg91

# Twilio SMS (if SMS_PROVIDER=twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+1...

# MSG91 SMS (if SMS_PROVIDER=msg91)
MSG91_AUTH_KEY=...
MSG91_TEMPLATE_ID=...
```

---

## 🔒 Firebase Storage Security Rules

Add the following security rules to your Firebase Console under **Storage Rules**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /evidence/{complaintId}/{allPaths=**} {
      // Disallow all direct public read/write from client SDKs
      // Uploads and signed URL generation occur strictly server-side
      allow read, write: if false;
    }
  }
}
```

---

## ⚙️ Pilot Evidence Upload Limits & Retention

Pilot limits are enforced by `src/lib/storage/validator.ts`:

- **Max Video Count**: 3 videos per complaint (`MAX_VIDEO_COUNT=3`)
- **Max Video Size**: 50 MB per video (`MAX_VIDEO_SIZE_MB=50`)
- **Max Image / Audio / PDF Size**: 10 MB per file (`MAX_FILE_SIZE_MB=10`)
- **Max Total Evidence Size**: 100 MB per complaint (`MAX_TOTAL_EVIDENCE_MB=100`)
- **Evidence Retention Period**: 180 days (`EVIDENCE_RETENTION_DAYS=180`)

---

## 🔍 System Inspection & Health Verification

Inspect platform status at any time via the `/api/health` endpoint:

```bash
curl http://localhost:3000/api/health
```

Sample JSON output:
```json
{
  "status": "ok",
  "service": "Srikalahasti Praja Seva Intelligence Platform",
  "version": "1.0.0",
  "database_provider": "sqlite_file",
  "database_connectivity": "connected",
  "storage_provider": "local_storage",
  "notification_provider": "none",
  "ai_provider": "rule_based_analyzer"
}
```

---

## 🛑 How to Disable Public Grievance Submissions

To pause or disable new public grievance submissions (e.g. during maintenance or electoral code of conduct periods), set:

```bash
DISABLE_PUBLIC_SUBMISSIONS=true
```

When set, `/submit` renders a notice informing citizens that submissions are temporarily paused.
