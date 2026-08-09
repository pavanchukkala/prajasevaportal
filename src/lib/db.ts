// ============================================================
// In-Memory Database — Development / Prototype
// Replace with Supabase/PostgreSQL for production
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
  status: "New" | "AI Processed" | "Under Review" | "More Information Requested" | "Assigned" | "Escalated" | "Action Reported" | "Resolved" | "Reopened" | "Closed";
  // Contact — only stored when consent given; NEVER publicly exposed
  mobileNumber?: string;          // raw — server only
  mobileNumberMasked?: string;    // e.g. +91 ******4321
  mobileVerified?: boolean;
  consentGiven?: boolean;
  consentTimestamp?: string;
  consentPurpose?: string;
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

// ── In-memory store using Node.js global to persist across hot-reloads ──────
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

// ── Sample presentation records ─────────────────────────────────────────────
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
      { timestamp: "2026-08-07T09:15:00Z", action: "Complaint received", actor: "system" },
      { timestamp: "2026-08-07T09:16:30Z", action: "AI preliminary assessment generated (local_fallback mode)", actor: "ai_system" },
      { timestamp: "2026-08-07T10:00:00Z", action: "Status changed to Under Review", actor: "system" },
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
      { timestamp: "2026-08-08T11:30:00Z", action: "Complaint received", actor: "system" },
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
      { timestamp: "2026-08-08T14:00:00Z", action: "Complaint received", actor: "system" },
      { timestamp: "2026-08-08T14:02:00Z", action: "AI preliminary assessment generated (local_fallback mode)", actor: "ai_system" },
      { timestamp: "2026-08-08T14:05:00Z", action: "Status changed to Under Review — high sensitivity case", actor: "system" },
    ],
  },
];

// ── DB interface ────────────────────────────────────────────────────────────
export const db = {
  complaints: {
    async insert(
      data: Omit<ComplaintData, "id" | "trackingToken" | "createdAt" | "status" | "auditLog">
    ): Promise<ComplaintData> {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const now = new Date().toISOString();
      const year = new Date().getFullYear();
      const rand = Math.floor(10000 + Math.random() * 90000);
      const id = `SKT-${year}-${rand}`;
      const trackingToken = `TKN-${rand}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

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

      // Persist in memory store
      getStore().push(complaint);
      return complaint;
    },

    async updateStatus(
      id: string,
      updates: {
        status?: ComplaintData["status"];
        assignedTo?: string;
        assignedDepartment?: string;
        internalNote?: string;
        actor?: string;
      }
    ): Promise<ComplaintData | null> {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const store = getStore();
      const idx = store.findIndex((c) => c.id === id);
      if (idx === -1) return null;

      const now = new Date().toISOString();
      const complaint = store[idx];
      const actor = updates.actor ?? "reviewer";

      if (updates.status && updates.status !== complaint.status) {
        complaint.auditLog = [
          ...(complaint.auditLog ?? []),
          { timestamp: now, action: `Status changed from "${complaint.status}" to "${updates.status}"`, actor },
        ];
        complaint.status = updates.status;
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
          { timestamp: now, action: `Department assigned: ${updates.assignedDepartment}`, actor },
        ];
      }
      if (updates.internalNote) {
        complaint.internalNotes = [...(complaint.internalNotes ?? []), updates.internalNote];
        complaint.auditLog = [
          ...(complaint.auditLog ?? []),
          { timestamp: now, action: `Internal note added by reviewer`, actor },
        ];
      }
      complaint.updatedAt = now;
      store[idx] = complaint;
      return complaint;
    },

    async getById(id: string): Promise<ComplaintData | null> {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return getStore().find((c) => c.id === id) ?? null;
    },

    async getByTrackingToken(token: string): Promise<ComplaintData | null> {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return getStore().find((c) => c.trackingToken === token) ?? null;
    },

    async list(): Promise<ComplaintData[]> {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return [...getStore()].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },

    async listLive(): Promise<ComplaintData[]> {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return getStore()
        .filter((c) => !c.isSample)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
  },

  storage: {
    async uploadFile(_file: File, path: string): Promise<string> {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // In production: upload to S3/Supabase Storage
      return `https://mock-storage.local/${path}`;
    },
  },

  notifications: {
    async log(entry: Omit<NotificationLog, "sentAt">): Promise<void> {
      // In production: persist to DB; here we console log for transparency
      console.log("[NotificationLog]", { ...entry, sentAt: new Date().toISOString() });
    },
  },
};
