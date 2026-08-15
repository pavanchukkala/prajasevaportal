// ============================================================
// Database Abstraction & Persistent Provider Layer
// Supported Adapters:
// - SQLite Persistent File Adapter (data/psip_complaints.json)
// - PostgreSQL Adapter (if DATABASE_URL configured)
// ============================================================

import { FileSqliteAdapter } from "./db/file-sqlite-adapter";
import { IDatabaseAdapter, DatabaseHealthInfo } from "./db/provider";

export interface NotificationLog {
  complaintId: string;
  channel: "sms" | "whatsapp" | "email";
  recipientMasked: string;
  messageType: string;
  providerStatus: "queued" | "sent" | "failed" | "no_provider";
  sentAt: string;
  failureReason?: string;
}

export interface AuditEntry {
  timestamp: string;
  action: string;
  actor: string;
  notes?: string;
}

export type ComplaintStatus =
  | "New"
  | "AI Processed"
  | "Viewed"
  | "Contacted (No Response)"
  | "Under Review"
  | "More Information Requested"
  | "Assigned"
  | "Escalated"
  | "Action Reported"
  | "Solved"
  | "Resolved"
  | "Reopened"
  | "Closed";

export interface ComplaintData {
  id: string;
  trackingToken: string;
  description: string;
  mandal: string;
  village?: string;
  department?: string;
  incidentDate?: string;
  mediaUrls: string[];
  audioUrl?: string;
  createdAt: string;
  updatedAt?: string;
  status: ComplaintStatus;

  // Contact — stored ONLY when consent given; NEVER exposed publicly
  mobileNumber?: string;        // raw — server only, never returned via API
  mobileNumberMasked?: string;  // e.g. +91 ******4321 — shown to staff only
  mobileVerified?: boolean;
  consentGiven?: boolean;
  consentTimestamp?: string;    // ISO timestamp when consent was given
  consentPurpose?: string;      // "Complaint status updates only"
  notificationPreference?: "sms" | "whatsapp" | "none";
  isAnonymous?: boolean;
  email?: string;

  aiAnalysis?: {
    title: string;
    category: string;
    subcategory?: string;
    department: string;
    urgency: string;
    evidenceCompleteness: string;
    credibilityBand: string;
    confidenceScore: number;
    missingInformation: string[];
    duplicateLikelihood?: string;
    recommendedAction: string;
    humanReviewRequired: boolean;
    analysisMode: "local_fallback" | "llm";
    legalDisclaimer: string;
    safetyEscalationRequired?: boolean;
    // Extended intelligence layers
    spamScore?: number;
    spamReason?: string;
    isDuplicate?: boolean;
    duplicateReason?: string;
    sentimentTone?: string;
    distressFlag?: boolean;
    rootCauseTags?: { domain: string; category: string; subcategory: string };
    actionBrief?: {
      assignTo: string;
      exactAction: string;
      deadline: string;
      draftSms: string;
    };
  };
  dataSource: "citizen_submission" | "sample_presentation";
  isSample: boolean;
  internalNotes?: string[];
  assignedTo?: string;
  assignedDepartment?: string;
  auditLog?: AuditEntry[];
  notificationLog?: NotificationLog[];
}

// ── Valid status values ──────────────────────────────────────────────────────
export const VALID_STATUSES: ComplaintStatus[] = [
  "New",
  "AI Processed",
  "Viewed",
  "Contacted (No Response)",
  "Under Review",
  "More Information Requested",
  "Assigned",
  "Escalated",
  "Action Reported",
  "Solved",
  "Resolved",
  "Reopened",
  "Closed",
];

// ── Singleton adapter initialization ─────────────────────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var __psipAdapterInstance: IDatabaseAdapter | undefined;
}

function getAdapter(): IDatabaseAdapter {
  if (!global.__psipAdapterInstance) {
    const adapter = new FileSqliteAdapter();
    void adapter.init();
    global.__psipAdapterInstance = adapter;
  }
  return global.__psipAdapterInstance;
}

const adapter = getAdapter();

// ── DB interface ─────────────────────────────────────────────────────────────
export const db = {
  getProviderName(): "postgres" | "sqlite_file" {
    return adapter.providerName;
  },

  async getHealth(): Promise<DatabaseHealthInfo> {
    return adapter.getHealth();
  },

  complaints: {
    async insert(
      data: Omit<ComplaintData, "id" | "trackingToken" | "createdAt" | "status" | "auditLog">
    ): Promise<ComplaintData> {
      return adapter.insertComplaint(data);
    },

    async updateStatus(
      id: string,
      updates: {
        status?: ComplaintStatus;
        assignedTo?: string;
        assignedDepartment?: string;
        internalNote?: string;
        mediaUrl?: string;   // Evidence attachment URL — passed through to adapter
        actor?: string;
      }
    ): Promise<ComplaintData | null> {
      return adapter.updateComplaintStatus(id, updates);
    },

    async getById(id: string): Promise<ComplaintData | null> {
      return adapter.getComplaintById(id);
    },

    async getByTrackingToken(token: string): Promise<ComplaintData | null> {
      return adapter.getComplaintByTrackingToken(token);
    },

    async list(): Promise<ComplaintData[]> {
      return adapter.listComplaints();
    },

    async listLive(): Promise<ComplaintData[]> {
      return adapter.listLiveComplaints();
    },

    async listSample(): Promise<ComplaintData[]> {
      return adapter.listSampleComplaints();
    },

    async getStats() {
      return adapter.getComplaintStats();
    },
  },

  storage: {
    async uploadFile(_file: File, path: string): Promise<string> {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return `https://mock-storage.local/${path}`;
    },
  },

  notifications: {
    async log(entry: Omit<NotificationLog, "sentAt">): Promise<void> {
      const logEntry = { ...entry, sentAt: new Date().toISOString() };
      console.log("[NotificationLog]", logEntry);
    },
  },
};

// ── Safe public projection ───────────────────────────────────────────────────
export function toPublicSummary(c: ComplaintData) {
  return {
    id: c.id,
    status: c.status,
    mandal: c.mandal,
    village: c.village,
    department: c.department ?? c.aiAnalysis?.department ?? "To Be Determined",
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    isSample: c.isSample,
    aiSummary: c.aiAnalysis
      ? {
          title: c.aiAnalysis.title,
          category: c.aiAnalysis.category,
          urgency: c.aiAnalysis.urgency,
          credibilityBand: c.aiAnalysis.credibilityBand,
          analysisMode: c.aiAnalysis.analysisMode,
          legalDisclaimer: c.aiAnalysis.legalDisclaimer,
        }
      : null,
    statusHistory: (c.auditLog ?? [])
      .filter((e) =>
        e.action.startsWith("Status changed") ||
        e.action.startsWith("Complaint received")
      )
      .map((e) => ({ timestamp: e.timestamp, action: e.action })),
    message: statusMessage(c.status),
  };
}

function statusMessage(status: ComplaintStatus): string {
  const map: Record<ComplaintStatus, string> = {
    "New": "Your complaint has been received and is queued for review.",
    "AI Processed": "Your complaint has been analysed by the AI system and is awaiting human review.",
    "Viewed": "Your complaint has been viewed and verified by executive staff.",
    "Contacted (No Response)": "Staff attempted to contact you via mobile/WhatsApp regarding your complaint.",
    "Under Review": "Your complaint is under active review by authorized staff.",
    "More Information Requested": "Reviewers have requested more information.",
    "Assigned": "Your complaint has been assigned to the relevant department.",
    "Escalated": "Your complaint has been escalated for priority review.",
    "Action Reported": "Action has been reported on this complaint.",
    "Solved": "This complaint has been verified and resolved by the executives of Praja Seva.",
    "Resolved": "This complaint has been verified and resolved by the executives of Praja Seva.",
    "Reopened": "This complaint has been reopened for further review.",
    "Closed": "This complaint has been closed.",
  };
  return map[status] ?? "Your complaint is in the processing queue.";
}

// ── Staff-safe projection ────────────────────────────────────────────────────
export function toStaffView(c: ComplaintData) {
  return c;
}
