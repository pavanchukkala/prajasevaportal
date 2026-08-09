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
  | "Under Review"
  | "More Information Requested"
  | "Assigned"
  | "Escalated"
  | "Action Reported"
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
  };
  dataSource: "citizen_submission" | "sample_presentation";
  isSample: boolean;
  internalNotes?: string[];
  assignedTo?: string;
  assignedDepartment?: string;
  auditLog?: AuditEntry[];
  notificationLog?: NotificationLog[];
}

// ── Sample presentation records ──────────────────────────────────────────────
export const SAMPLE_COMPLAINTS: ComplaintData[] = [
  {
    id: "SKT-2026-00142",
    trackingToken: "TKN-00142-DEMO",
    description:
      "There appears to be a significant delay in the processing and issuance of welfare certificates at the local village secretariat. Multiple families have waited over 30 days without receiving their documents.",
    mandal: "Yerpedu",
    village: "Yerpedu Town",
    department: "Revenue",
    mediaUrls: [],
    createdAt: "2026-08-07T09:15:00Z",
    updatedAt: "2026-08-07T10:00:00Z",
    status: "Under Review",
    isAnonymous: true,
    consentGiven: false,
    aiAnalysis: {
      title: "Welfare Certificate Issuance Delay — Village Secretariat",
      category: "Welfare Access",
      subcategory: "Certificate Delay",
      department: "Revenue",
      urgency: "Priority",
      evidenceCompleteness: "Partial",
      credibilityBand: "Medium preliminary confidence",
      confidenceScore: 78,
      missingInformation: [
        "Names of affected families not provided",
        "No photographic evidence of queues or notices",
      ],
      duplicateLikelihood: "Low",
      recommendedAction:
        "Route to Mandal Revenue Officer, Yerpedu for verification of processing timelines.",
      humanReviewRequired: true,
      analysisMode: "local_fallback",
      legalDisclaimer:
        "AI-generated preliminary assessment for human review. This is not a legal finding, factual determination, finding of guilt, or replacement for official investigation.",
    },
    dataSource: "sample_presentation",
    isSample: true,
    auditLog: [
      { timestamp: "2026-08-07T09:15:00Z", action: "Complaint received via public portal", actor: "system" },
      { timestamp: "2026-08-07T09:16:30Z", action: "AI preliminary assessment generated (local_fallback mode)", actor: "ai_system" },
      { timestamp: "2026-08-07T10:00:00Z", action: 'Status changed from "New" to "Under Review"', actor: "system" },
    ],
  },
  {
    id: "SKT-2026-00143",
    trackingToken: "TKN-00143-DEMO",
    description:
      "A major underground drinking water pipeline has reportedly burst near the central junction in Ward 12 of Srikalahasti town. Local residents report water contamination affecting approximately 50 households.",
    mandal: "Srikalahasti",
    village: "Ward 12",
    department: "Municipal Administration",
    mediaUrls: [],
    createdAt: "2026-08-08T11:30:00Z",
    updatedAt: "2026-08-08T11:31:00Z",
    status: "AI Processed",
    isAnonymous: true,
    consentGiven: false,
    aiAnalysis: {
      title: "Drinking Water Pipeline Failure — 50 Households Affected",
      category: "Infrastructure — Water Supply",
      subcategory: "Pipeline Failure",
      department: "Municipal Administration",
      urgency: "High",
      evidenceCompleteness: "Partial",
      credibilityBand: "High preliminary confidence",
      confidenceScore: 91,
      missingInformation: [
        "Photographic evidence of burst would strengthen this",
      ],
      duplicateLikelihood: "Low",
      recommendedAction:
        "Alert Municipal Commissioner immediately. Public health risk classification applies.",
      humanReviewRequired: true,
      analysisMode: "local_fallback",
      legalDisclaimer:
        "AI-generated preliminary assessment for human review. This is not a legal finding, factual determination, finding of guilt, or replacement for official investigation.",
    },
    dataSource: "sample_presentation",
    isSample: true,
    auditLog: [
      { timestamp: "2026-08-08T11:30:00Z", action: "Complaint received via public portal", actor: "system" },
      { timestamp: "2026-08-08T11:31:00Z", action: "AI preliminary assessment generated (local_fallback mode)", actor: "ai_system" },
    ],
  },
  {
    id: "SKT-2026-00144",
    trackingToken: "TKN-00144-DEMO",
    description:
      "Complainant reports being asked for an unofficial payment to process a land mutation file at the sub-registrar office in Thottambedu. No receipt was offered.",
    mandal: "Thottambedu",
    village: "Thottambedu",
    department: "Registration & Stamps",
    mediaUrls: [],
    createdAt: "2026-08-08T14:00:00Z",
    updatedAt: "2026-08-08T14:02:00Z",
    status: "Under Review",
    isAnonymous: true,
    consentGiven: false,
    aiAnalysis: {
      title: "Alleged Unofficial Payment Request — Land Mutation",
      category: "Alleged Misconduct — Financial Irregularity",
      subcategory: "Alleged Bribery",
      department: "Registration & Stamps",
      urgency: "High",
      evidenceCompleteness: "Insufficient",
      credibilityBand: "Low preliminary confidence",
      confidenceScore: 58,
      missingInformation: [
        "No documentary or audio evidence provided",
        "Single complainant — no corroborating account",
        "Specific person role not provided",
      ],
      duplicateLikelihood: "Unknown",
      recommendedAction:
        "Flag for human review before escalation. Request additional evidence from complainant before any departmental action.",
      humanReviewRequired: true,
      analysisMode: "local_fallback",
      legalDisclaimer:
        "AI-generated preliminary assessment for human review. This is not a legal finding, factual determination, finding of guilt, or replacement for official investigation. Do not act on this without human review and verification.",
    },
    dataSource: "sample_presentation",
    isSample: true,
    auditLog: [
      { timestamp: "2026-08-08T14:00:00Z", action: "Complaint received via public portal", actor: "system" },
      { timestamp: "2026-08-08T14:02:00Z", action: "AI preliminary assessment generated (local_fallback mode)", actor: "ai_system" },
      { timestamp: "2026-08-08T14:05:00Z", action: 'Status changed to "Under Review" — high sensitivity case', actor: "system" },
    ],
  },
];

// ── Valid status values ──────────────────────────────────────────────────────
export const VALID_STATUSES: ComplaintStatus[] = [
  "New",
  "AI Processed",
  "Under Review",
  "More Information Requested",
  "Assigned",
  "Escalated",
  "Action Reported",
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
    void adapter.init().then(async () => {
      const existing = await adapter.listComplaints();
      if (existing.length === 0) {
        for (const sample of SAMPLE_COMPLAINTS) {
          await adapter.insertComplaint({
            description: sample.description,
            mandal: sample.mandal,
            village: sample.village,
            department: sample.department,
            incidentDate: sample.incidentDate,
            mediaUrls: sample.mediaUrls,
            aiAnalysis: sample.aiAnalysis,
            dataSource: "sample_presentation",
            isSample: true,
            isAnonymous: sample.isAnonymous,
            mobileNumber: sample.mobileNumber,
            mobileNumberMasked: sample.mobileNumberMasked,
            consentGiven: sample.consentGiven,
          });
        }
      }
    });
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
    "Under Review": "Your complaint is under active review by authorized staff.",
    "More Information Requested": "Reviewers have requested more information.",
    "Assigned": "Your complaint has been assigned to the relevant department.",
    "Escalated": "Your complaint has been escalated for priority review.",
    "Action Reported": "Action has been reported on this complaint.",
    "Resolved": "This complaint has been resolved.",
    "Reopened": "This complaint has been reopened for further review.",
    "Closed": "This complaint has been closed.",
  };
  return map[status] ?? "Your complaint is in the processing queue.";
}

// ── Staff-safe projection ────────────────────────────────────────────────────
export function toStaffView(c: ComplaintData) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mobileNumber: _raw, ...safe } = c;
  return safe;
}
