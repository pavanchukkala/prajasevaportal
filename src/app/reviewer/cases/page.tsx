import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import RoleNavHeader from "@/components/layout/RoleNavHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import { normalizeDepartmentKey, getDepartmentLabel } from "@/lib/departments";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Case Reviewer Triage Portal — Srikalahasti Praja Seva",
  description: "AI-assisted triage and preliminary review workspace for authorized case reviewers.",
};

export default async function ReviewerCasesPage() {
  const session = await getSession();
  if (!session || (session.role !== "reviewer" && session.role !== "administrator")) {
    redirect("/staff/login?redirect=/reviewer/cases");
  }

  let allComplaints: any[] = [];
  let dbError: string | null = null;

  try {
    allComplaints = await db.complaints.list();
  } catch (err: any) {
    console.error("[Reviewer DB Error]:", err);
    dbError = "Database unavailable. Please retry.";
  }

  const liveCases = allComplaints.filter((c) => !c.isSample);
  const sampleCases = allComplaints.filter((c) => c.isSample);

  // Unassigned complaints needing initial triage
  const unassignedCases = liveCases.filter(
    (c) =>
      (!c.assignedDepartment || normalizeDepartmentKey(c.assignedDepartment) === "unassigned") &&
      c.status !== "Resolved" &&
      c.status !== "Closed" &&
      c.status !== "Solved"
  );

  const safetyEscalations = liveCases.filter(
    (c) => c.aiAnalysis?.humanReviewRequired || c.aiAnalysis?.urgency === "Emergency" || c.aiAnalysis?.urgency === "High"
  ).length;

  const pendingTriageCount = liveCases.filter((c) =>
    ["New", "AI Processed", "Under Review", "More Information Requested"].includes(c.status)
  ).length;

  const resolvedCount = liveCases.filter((c) =>
    ["Solved", "Resolved", "Closed"].includes(c.status)
  ).length;

  return (
    <div style={theme.page}>
      <RoleNavHeader user={session} />

      <main style={theme.main}>
        {/* Portal Header */}
        <div style={theme.headerBox}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                🛡 Protected Case Reviewer Workspace
              </div>
              <h1 style={theme.pageTitle}>Case Reviewer Triage Queue</h1>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0 }}>
                Logged in as <strong style={{ color: "#f8fafc" }}>{session.username}</strong> ({session.role}) · Srikalahasti Constituency No. 168
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={theme.metricsGrid}>
            <div style={theme.metricCard}>
              <div style={theme.metricLabel}>Total Live Records</div>
              <div style={theme.metricVal}>{liveCases.length}</div>
              <div style={theme.metricSub}>{unassignedCases.length} Unassigned · {sampleCases.length} Sample</div>
            </div>
            <div style={{ ...theme.metricCard, borderLeft: "4px solid #ef4444" }}>
              <div style={theme.metricLabel}>Safety Escalations / High Urgency</div>
              <div style={{ ...theme.metricVal, color: "#f87171" }}>{safetyEscalations}</div>
              <div style={theme.metricSub}>Requires Priority Human Triage</div>
            </div>
            <div style={{ ...theme.metricCard, borderLeft: "4px solid #38bdf8" }}>
              <div style={theme.metricLabel}>New / Pending Triage</div>
              <div style={{ ...theme.metricVal, color: "#38bdf8" }}>{pendingTriageCount}</div>
              <div style={theme.metricSub}>Awaiting Department Assignment</div>
            </div>
            <div style={{ ...theme.metricCard, borderLeft: "4px solid #10b981" }}>
              <div style={theme.metricLabel}>Resolved & Closed</div>
              <div style={{ ...theme.metricVal, color: "#34d399" }}>{resolvedCount}</div>
              <div style={theme.metricSub}>Verified Closed Cases</div>
            </div>
          </div>
        </div>

        {/* Database Error State */}
        {dbError && (
          <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", padding: "1rem", borderRadius: "12px", color: "#f87171", marginBottom: "1.5rem" }}>
            <strong>⚠ {dbError}</strong>
          </div>
        )}

        {/* Unassigned Live Citizen Complaints Section */}
        <section style={{ ...theme.section, marginBottom: "2rem", border: "1px solid rgba(234,179,8,0.2)" }}>
          <div style={theme.sectionHeader}>
            <div>
              <h2 style={{ ...theme.sectionTitle, color: "#facc15" }}>
                📋 Unassigned Live Citizen Complaints <span style={{ ...theme.badgeCount, background: "rgba(234,179,8,0.15)", color: "#facc15", border: "1px solid rgba(234,179,8,0.3)" }}>{unassignedCases.length}</span>
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: "4px 0 0" }}>
                Newly submitted grievances requiring reviewer department triage assignment.
              </p>
            </div>
          </div>

          {unassignedCases.length === 0 ? (
            <div style={theme.emptyBox}>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem" }}>
                🟢 All live citizen complaints have been triaged and assigned to departments.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {unassignedCases.map((c) => (
                <CaseReviewCard key={c.id} complaint={c} unassigned />
              ))}
            </div>
          )}
        </section>

        {/* All Live Citizen Complaints Queue */}
        <section style={theme.section}>
          <div style={theme.sectionHeader}>
            <div>
              <h2 style={theme.sectionTitle}>
                🟢 All Live Citizen Complaints <span style={theme.badgeCount}>{liveCases.length}</span>
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: "4px 0 0" }}>
                Complete live citizen grievance queue across Srikalahasti Constituency.
              </p>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
              Last synced: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {liveCases.length === 0 ? (
            <div style={theme.emptyBox}>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem" }}>
                🟢 No citizen complaints currently in the database. Submissions via `/submit` will appear here instantly.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {liveCases.map((c) => (
                <CaseReviewCard key={c.id} complaint={c} />
              ))}
            </div>
          )}
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
}

function CaseReviewCard({ complaint: c, unassigned }: { complaint: any; unassigned?: boolean }) {
  const ai = c.aiAnalysis;
  const isEmergency = ai?.urgency === "Emergency" || ai?.urgency === "High" || ai?.urgency === "Critical";
  const deptLabel = getDepartmentLabel(c.assignedDepartment || c.department || ai?.department);

  return (
    <div style={{
      ...theme.card,
      borderLeft: unassigned
        ? "4px solid #facc15"
        : c.isSample
        ? "4px solid #a855f7"
        : isEmergency
        ? "4px solid #ef4444"
        : "4px solid #0284c7"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#38bdf8", fontFamily: "monospace" }}>{c.id}</span>
            {unassigned ? (
              <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "9999px", background: "rgba(234,179,8,0.15)", color: "#facc15", border: "1px solid rgba(234,179,8,0.3)", fontWeight: 700 }}>
                UNASSIGNED
              </span>
            ) : c.isSample ? (
              <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "9999px", background: "rgba(168,85,247,0.15)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.3)", fontWeight: 700 }}>
                SAMPLE RECORD
              </span>
            ) : (
              <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "9999px", background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)", fontWeight: 700 }}>
                LIVE SUBMISSION
              </span>
            )}
            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>📍 {c.mandal || "Srikalahasti"} {c.village ? `· ${c.village}` : ""}</span>
          </div>

          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f8fafc", margin: "0.4rem 0 0.25rem", lineHeight: 1.3 }}>
            {ai?.title ?? (c.description ? c.description.slice(0, 80) + "..." : "Grievance Report")}
          </h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: "6px",
            background: c.status === "New" ? "rgba(56,189,248,0.15)" : c.status === "Resolved" || c.status === "Solved" ? "rgba(16,185,129,0.15)" : "rgba(234,179,8,0.15)",
            color: c.status === "New" ? "#38bdf8" : c.status === "Resolved" || c.status === "Solved" ? "#34d399" : "#facc15",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            {c.status}
          </span>
          <Link href={`/reviewer/case/${c.id}`} style={theme.inspectBtn}>
            Review & Triage →
          </Link>
        </div>
      </div>

      <p style={{ fontSize: "0.875rem", color: "#cbd5e1", lineHeight: 1.5, margin: "0 0 0.875rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {c.description}
      </p>

      {/* AI Triage Meta Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.5rem", background: "rgba(15,23,42,0.6)", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)", fontSize: "0.78rem" }}>
        <div>
          <span style={{ color: "#64748b" }}>Category: </span>
          <strong style={{ color: "#e2e8f0" }}>{ai?.category ?? "General Civic"}</strong>
        </div>
        <div>
          <span style={{ color: "#64748b" }}>Target Dept: </span>
          <strong style={{ color: c.assignedDepartment ? "#34d399" : "#facc15" }}>{deptLabel}</strong>
        </div>
        <div>
          <span style={{ color: "#64748b" }}>AI Urgency: </span>
          <strong style={{ color: isEmergency ? "#f87171" : "#facc15" }}>
            {ai?.urgency ?? "Routine"}
          </strong>
        </div>
        <div>
          <span style={{ color: "#64748b" }}>Contact: </span>
          <span style={{ color: "#94a3b8" }}>{c.mobileNumberMasked ?? (c.isAnonymous ? "Anonymous" : "Not Provided")}</span>
        </div>
      </div>
    </div>
  );
}

const theme = {
  page: { minHeight: "100vh", background: "#04091A", color: "#f8fafc", display: "flex", flexDirection: "column" as const },
  main: { flex: 1, maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "2rem 1rem" },
  headerBox: { background: "rgba(13,33,55,0.7)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "16px", padding: "1.5rem", backdropFilter: "blur(20px)", marginBottom: "2rem" },
  pageTitle: { fontSize: "1.75rem", fontWeight: 900, color: "#ffffff", margin: "0.25rem 0 0.5rem", letterSpacing: "-0.02em" },
  inspectBtn: { padding: "0.4rem 0.875rem", borderRadius: "6px", background: "linear-gradient(135deg, #0284c7, #38bdf8)", color: "#04091A", fontSize: "0.78rem", fontWeight: 800, textDecoration: "none" },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginTop: "1.25rem" },
  metricCard: { background: "rgba(4,9,26,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem" },
  metricLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.05em" },
  metricVal: { fontSize: "1.75rem", fontWeight: 900, color: "#ffffff", margin: "0.2rem 0" },
  metricSub: { fontSize: "0.72rem", color: "#94a3b8" },
  section: { background: "rgba(13,33,55,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "1.5rem" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-center", marginBottom: "1.25rem" },
  sectionTitle: { fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" },
  badgeCount: { fontSize: "0.75rem", padding: "2px 8px", borderRadius: "9999px", background: "rgba(56,189,248,0.15)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.3)" },
  card: { background: "rgba(13,33,55,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1.25rem" },
  emptyBox: { padding: "2rem", textAlign: "center" as const, background: "rgba(4,9,26,0.6)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.1)" },
};
