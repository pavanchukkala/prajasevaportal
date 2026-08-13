import { redirect } from "next/navigation";
import { getSession, SessionUser } from "@/lib/auth";
import { ComplaintData, ComplaintStatus, db } from "@/lib/db";
import { APP_VERSION, BUILD_ID } from "@/lib/version";

export const MLA_ALLOWED_ROLES = ["mla_staff", "administrator"] as const;
export const CANONICAL_DEPARTMENTS = [
  "revenue", "municipal", "panchayat_raj", "roads_buildings", "ap_transco", "rural_water_supply", "police", "women_child_welfare", "health", "education", "civil_supplies",
] as const;
export const MANDALS = ["Srikalahasti", "Renigunta", "Yerpedu", "Thottambedu"] as const;
export const MLA_LOGIN_REDIRECT = "/staff/login?redirect=/mla/dashboard";

export type MLASession = SessionUser & { role: "mla_staff" | "administrator" };
export type MLAFilter = Record<string, string | undefined>;

export async function requireMLASession(): Promise<MLASession> {
  const session = await getSession();
  if (!session) redirect(MLA_LOGIN_REDIRECT);
  if (!isMLARole(session.role)) redirect("/staff/login?error=unauthorized&redirect=/mla/dashboard");
  return session as MLASession;
}

export function isMLARole(role: string): role is MLASession["role"] {
  return role === "mla_staff" || role === "administrator";
}

export async function getMLAData() {
  const [all, health] = await Promise.all([db.complaints.list(), db.getHealth()]);
  const refreshedAt = new Date().toISOString();
  const live = all.filter((c) => !c.isSample);
  const sample = all.filter((c) => c.isSample);
  return { all, live, sample, health, refreshedAt, metrics: buildMetrics(all, refreshedAt), system: buildSystemStatus(health, refreshedAt) };
}

export function buildSystemStatus(health: Awaited<ReturnType<typeof db.getHealth>>, refreshedAt: string) {
  return {
    databaseProvider: health.provider,
    storageProvider: process.env.NEXT_PUBLIC_STORAGE_PROVIDER || process.env.STORAGE_PROVIDER || "local_file_storage",
    aiProvider: process.env.GEMINI_API_KEY ? "gemini" : "local_triage_analyzer",
    notificationProvider: process.env.MSG91_AUTH_KEY ? "msg91" : process.env.TWILIO_ACCOUNT_SID ? "twilio" : "notification_log_only",
    liveRecordCount: health.liveRecords,
    sampleRecordCount: health.sampleRecords,
    buildId: BUILD_ID,
    commitSha: APP_VERSION,
    lastRefresh: refreshedAt,
  };
}

export function buildMetrics(complaints: ComplaintData[], refreshedAt = new Date().toISOString()) {
  const live = complaints.filter((c) => !c.isSample);
  return {
    totalLive: live.length,
    safety: live.filter((c) => isSafety(c)).length,
    highPriority: live.filter((c) => ["Emergency", "Critical", "High"].includes(priority(c))).length,
    unassigned: live.filter((c) => !department(c) || department(c) === "unassigned").length,
    underReview: live.filter((c) => ["New", "AI Processed", "Viewed", "Under Review", "More Information Requested"].includes(c.status)).length,
    assigned: live.filter((c) => ["Assigned", "Escalated", "Action Reported"].includes(c.status) || !!department(c)).length,
    overdue: live.filter(isOverdue).length,
    resolved: live.filter((c) => ["Solved", "Resolved", "Closed"].includes(c.status)).length,
    reopened: live.filter((c) => c.status === "Reopened").length,
    lastDatabaseUpdate: latestDate(complaints.map((c) => c.updatedAt || c.createdAt)),
    lastDashboardRefresh: refreshedAt,
  };
}

export function priority(c: ComplaintData) { return c.aiAnalysis?.urgency || "Routine"; }
export function isSafety(c: ComplaintData) { return !!c.aiAnalysis?.safetyEscalationRequired || ["Emergency", "Critical"].includes(priority(c)); }
export function department(c: ComplaintData) { return canonicalDepartment(c.assignedDepartment || c.department || c.aiAnalysis?.department || "unassigned"); }
export function canonicalDepartment(value: string) { return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "unassigned"; }
export function titleOf(c: ComplaintData) { return c.aiAnalysis?.title || `${c.aiAnalysis?.category || "Citizen grievance"} case ${c.id}`; }
export function isOverdue(c: ComplaintData) { return !["Solved", "Resolved", "Closed"].includes(c.status) && Date.now() - new Date(c.updatedAt || c.createdAt).getTime() > 1000 * 60 * 60 * 24 * (isSafety(c) ? 1 : 7); }
export function evidenceCount(c: ComplaintData) { return (c.mediaUrls?.length || 0) + (c.audioUrl ? 1 : 0); }
export function maskContact(c: ComplaintData) { return c.mobileNumberMasked || (c.mobileNumber ? `+91 ******${c.mobileNumber.replace(/\D/g, "").slice(-4)}` : "Not provided / anonymous"); }
export function latestDate(values: (string | undefined)[]) { return values.filter(Boolean).sort().at(-1) || null; }

export function filterCases(complaints: ComplaintData[], f: MLAFilter) {
  let rows = [...complaints];
  const q = f.q?.toLowerCase().trim();
  if (q) rows = rows.filter((c) => c.id.toLowerCase().includes(q) || titleOf(c).toLowerCase().includes(q));
  if (f.mandal) rows = rows.filter((c) => c.mandal === f.mandal);
  if (f.village) rows = rows.filter((c) => (c.village || "").toLowerCase().includes(f.village!.toLowerCase()));
  if (f.department) rows = rows.filter((c) => department(c) === f.department);
  if (f.category) rows = rows.filter((c) => (c.aiAnalysis?.category || "").toLowerCase().includes(f.category!.toLowerCase()));
  if (f.urgency) rows = rows.filter((c) => priority(c) === f.urgency);
  if (f.safety) rows = rows.filter((c) => String(isSafety(c)) === f.safety);
  if (f.status) rows = rows.filter((c) => c.status === f.status);
  if (f.source === "live") rows = rows.filter((c) => !c.isSample);
  if (f.source === "sample") rows = rows.filter((c) => c.isSample);
  const rank: Record<string, number> = { Emergency: 5, Critical: 4, High: 3, Priority: 2, Routine: 1 };
  rows.sort((a, b) => f.sort === "oldest" ? +new Date(a.createdAt) - +new Date(b.createdAt) : f.sort === "urgency" ? (rank[priority(b)] || 0) - (rank[priority(a)] || 0) : f.sort === "confidence" ? (b.aiAnalysis?.confidenceScore || 0) - (a.aiAnalysis?.confidenceScore || 0) : f.sort === "overdue" ? Number(isOverdue(b)) - Number(isOverdue(a)) : +new Date(b.createdAt) - +new Date(a.createdAt));
  return rows;
}

export function actionType(entry: { action: string }) {
  const a = entry.action.toLowerCase();
  if (a.includes("received")) return "Complaint received";
  if (a.includes("ai")) return "AI triage completed";
  if (a.includes("assigned")) return "Department assigned";
  if (a.includes("information")) return "Clarification requested";
  if (a.includes("action reported")) return "Field action reported";
  if (a.includes("escalated")) return "Escalated";
  if (a.includes("resolved") || a.includes("solved")) return "Resolved";
  if (a.includes("notified")) return "Citizen notified";
  return "Human review completed";
}

export const VALID_MLA_STATUSES: ComplaintStatus[] = ["Under Review", "Assigned", "Escalated", "Action Reported", "More Information Requested", "Resolved", "Reopened"];
