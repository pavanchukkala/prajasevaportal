// ============================================================
// In-Memory Database — Development / Prototype
// ⚠  Production limitation: all data is lost on server restart.
// Replace with Supabase/PostgreSQL + file storage for production.
// ============================================================

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

// ── Global store — persists across Next.js hot-reloads ───────────────────────
declare global {
  // eslint-disable-next-line no-var
  var __psipComplaintsStore: ComplaintData[] | undefined;
}

function getStore(): ComplaintData[] {
  if (!global.__psipComplaintsStore) {
    global.__psipComplaintsStore = [...SAMPLE_COMPLAINTS];
  }
  return global.__psipComplaintsStore;
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

// ── DB interface ─────────────────────────────────────────────────────────────
export const db = {
  complaints: {
    async insert(
      data: Omit<ComplaintData, "id" | "trackingToken" | "createdAt" | "status" | "auditLog">
    ): Promise<ComplaintData> {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const now = new Date().toISOString();
      const year = new Date().getFullYear();
      const rand = Math.floor(10000 + Math.random() * 90000);
      const id = `SKT-${year}-${rand}`;
      const tokenSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const trackingToken = `TKN-${rand}-${tokenSuffix}`;

      const complaint: ComplaintData = {
        ...data,
        id,
        trackingToken,
        createdAt: now,
        updatedAt: now,
        status: "New",
        dataSource: data.dataSource ?? "citizen_submission",
        isSample: data.isSample ?? false,
        auditLog: [
          { timestamp: now, action: "Complaint received via public portal", actor: "system" },
        ],
        notificationLog: [],
      };

      getStore().push(complaint);
      return complaint;
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
      await new Promise((resolve) => setTimeout(resolve, 100));
      const store = getStore();
      const idx = store.findIndex((c) => c.id === id);
      if (idx === -1) return null;

      const now = new Date().toISOString();
      const complaint = { ...store[idx] };
      const actor = updates.actor ?? "reviewer";

      if (updates.status && updates.status !== complaint.status) {
        const prev = complaint.status;
        complaint.status = updates.status;
        complaint.auditLog = [
          ...(complaint.auditLog ?? []),
          {
            timestamp: now,
            action: `Status changed from "${prev}" to "${updates.status}"`,
            actor,
          },
        ];
      }
      if (updates.assignedTo) {
        complaint.assignedTo = updates.assignedTo;
        complaint.auditLog = [
          ...(complaint.auditLog ?? []),
          { timestamp: now, action: `Assigned to: ${updates.assignedTo}`, actor },
        ];
      }
      if (updates.assignedDepartment) {
        complaint.assignedDepartment = updates.assignedDepartment;
        complaint.auditLog = [
          ...(complaint.auditLog ?? []),
          {
            timestamp: now,
            action: `Department assigned: ${updates.assignedDepartment}`,
            actor,
          },
        ];
      }
      if (updates.internalNote) {
        complaint.internalNotes = [
          ...(complaint.internalNotes ?? []),
          updates.internalNote,
        ];
        complaint.auditLog = [
          ...(complaint.auditLog ?? []),
          { timestamp: now, action: "Internal note added", actor },
        ];
      }
      complaint.updatedAt = now;
      store[idx] = complaint;
      return complaint;
    },

    async getById(id: string): Promise<ComplaintData | null> {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return getStore().find((c) => c.id === id) ?? null;
    },

    async getByTrackingToken(token: string): Promise<ComplaintData | null> {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return getStore().find((c) => c.trackingToken === token) ?? null;
    },

    async list(): Promise<ComplaintData[]> {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return [...getStore()].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },

    async listLive(): Promise<ComplaintData[]> {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return getStore()
        .filter((c) => !c.isSample)
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },

    async listByDepartment(dept: string): Promise<ComplaintData[]> {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return getStore()
        .filter(
          (c) =>
            (c.department ?? c.aiAnalysis?.department ?? "")
              .toLowerCase()
              .includes(dept.toLowerCase()) ||
            (c.assignedDepartment ?? "").toLowerCase().includes(dept.toLowerCase())
        )
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },

    async listByStatus(status: ComplaintStatus): Promise<ComplaintData[]> {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return getStore()
        .filter((c) => c.status === status)
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },

    async listAssignedTo(username: string): Promise<ComplaintData[]> {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return getStore()
        .filter((c) => c.assignedTo === username)
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    },

    getStats(): {
      total: number;
      live: number;
      sample: number;
      new: number;
      underReview: number;
      resolved: number;
      highPriority: number;
    } {
      const store = getStore();
      return {
        total: store.length,
        live: store.filter((c) => !c.isSample).length,
        sample: store.filter((c) => c.isSample).length,
        new: store.filter((c) => c.status === "New" || c.status === "AI Processed").length,
        underReview: store.filter((c) =>
          ["Under Review", "Assigned", "Escalated"].includes(c.status)
        ).length,
        resolved: store.filter((c) => c.status === "Resolved" || c.status === "Closed").length,
        highPriority: store.filter(
          (c) => c.aiAnalysis?.urgency === "High" || c.aiAnalysis?.urgency === "Emergency"
        ).length,
      };
    },
  },

  storage: {
    // ⚠  Production limitation: file storage is not implemented.
    // Evidence files are not actually saved. Implement with S3 or
    // Supabase Storage for production.
    async uploadFile(_file: File, path: string): Promise<string> {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return `https://mock-storage.local/${path}`;
    },
  },

  notifications: {
    // ⚠  Production limitation: no SMS/WhatsApp provider connected.
    // All notifications are logged but NOT actually sent.
    // Connect MSG91, Twilio, or WhatsApp Business API for production.
    async log(entry: Omit<NotificationLog, "sentAt">): Promise<void> {
      const logEntry = { ...entry, sentAt: new Date().toISOString() };
      console.log("[NotificationLog]", logEntry);

      // Persist to complaint's notificationLog
      const store = getStore();
      const complaint = store.find((c) => c.id === entry.complaintId);
      if (complaint) {
        complaint.notificationLog = [
          ...(complaint.notificationLog ?? []),
          logEntry,
        ];
      }
    },

    getQueuedForComplaint(complaintId: string): NotificationLog[] {
      const store = getStore();
      const complaint = store.find((c) => c.id === complaintId);
      return complaint?.notificationLog ?? [];
    },
  },
};

// ── Safe public projection ───────────────────────────────────────────────────
// Returns only fields safe to show to citizens (no mobile, no internal notes)
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
    "More Information Requested": "Reviewers have requested more information. You may submit a new complaint with additional details.",
    "Assigned": "Your complaint has been assigned to the relevant department.",
    "Escalated": "Your complaint has been escalated for priority review.",
    "Action Reported": "Action has been reported on this complaint.",
    "Resolved": "This complaint has been resolved. If the issue persists, you may submit a new complaint.",
    "Reopened": "This complaint has been reopened for further review.",
    "Closed": "This complaint has been closed.",
  };
  return map[status] ?? "Your complaint is in the processing queue.";
}

// ── Staff-safe projection ────────────────────────────────────────────────────
// Shows internal data to authenticated staff but NEVER the raw mobile number
export function toStaffView(c: ComplaintData) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mobileNumber: _raw, ...safe } = c;
  return safe;
}
