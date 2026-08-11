import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import RoleNavHeader from "@/components/layout/RoleNavHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import { CANONICAL_DEPARTMENTS, isSameDepartment, normalizeDepartmentKey, getDepartmentLabel } from "@/lib/departments";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Department Officer Workspace — Srikalahasti Praja Seva",
  description: "Field department resolution workspace and SLA tracking dashboard for departmental officers.",
};

export default async function DepartmentWorkspacePage({
  searchParams,
}: {
  searchParams?: Promise<{ dept?: string }> | { dept?: string };
}) {
  const session = await getSession();
  if (!session || (session.role !== "department_officer" && session.role !== "administrator")) {
    redirect("/staff/login?redirect=/department/workspace");
  }

  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const deptParam = resolvedSearchParams.dept;
  const activeDeptKey = normalizeDepartmentKey(deptParam || "revenue");
  const activeDeptLabel = getDepartmentLabel(activeDeptKey);

  let allComplaints: any[] = [];
  let dbError: string | null = null;

  try {
    allComplaints = await db.complaints.list();
  } catch (err: any) {
    console.error("[Department Workspace DB Error]:", err);
    dbError = "Database unavailable. Please retry.";
  }

  const liveComplaints = allComplaints.filter((c) => !c.isSample);
  const sampleComplaints = allComplaints.filter((c) => c.isSample);

  // Department-assigned cases matching canonical department key
  const assignedDeptCases = liveComplaints.filter((c) =>
    isSameDepartment(c.assignedDepartment || c.department || c.aiAnalysis?.department, activeDeptKey)
  );

  // Unassigned live citizen complaints awaiting triage
  const unassignedCases = liveComplaints.filter(
    (c) =>
      (!c.assignedDepartment || normalizeDepartmentKey(c.assignedDepartment) === "unassigned") &&
      c.status !== "Resolved" &&
      c.status !== "Closed" &&
      c.status !== "Solved"
  );

  const pendingCount = assignedDeptCases.filter((c) =>
    ["New", "AI Processed", "Under Review", "Assigned", "More Information Requested"].includes(c.status)
  ).length;

  const inProgressCount = assignedDeptCases.filter((c) =>
    ["Assigned", "Escalated", "Action Reported"].includes(c.status)
  ).length;

  const resolvedCount = assignedDeptCases.filter((c) =>
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
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                🏢 Protected Department Officer Workspace
              </div>
              <h1 style={theme.pageTitle}>{activeDeptLabel} Queue</h1>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0 }}>
                Logged in as <strong style={{ color: "#f8fafc" }}>{session.username}</strong> ({session.role}) · Srikalahasti Assembly Constituency
              </p>
            </div>
          </div>

          {/* Department Selector Tabs */}
          <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
            {CANONICAL_DEPARTMENTS.map((d) => {
              const isActive = activeDeptKey === d.key;
              const count = liveComplaints.filter((c) =>
                isSameDepartment(c.assignedDepartment || c.department || c.aiAnalysis?.department, d.key)
              ).length;

              return (
                <Link
                  key={d.key}
                  href={`/department/workspace?dept=${encodeURIComponent(d.key)}`}
                  style={{
                    padding: "0.4rem 0.875rem",
                    borderRadius: "9999px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    background: isActive ? "#10b981" : "rgba(255,255,255,0.05)",
                    color: isActive ? "#04091A" : "#f0f4f8",
                    border: "1px solid",
                    borderColor: isActive ? "#10b981" : "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>{d.shortName}</span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      padding: "1px 6px",
                      borderRadius: "10px",
                      backgroundColor: isActive ? "#04091A" : "rgba(255,255,255,0.15)",
                      color: isActive ? "#34d399" : "#cbd5e1",
                    }}
                  >
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* SLA Metrics Grid */}
          <div style={theme.metricsGrid}>
            <div style={{ ...theme.metricCard, borderLeft: "4px solid #10b981" }}>
              <div style={theme.metricLabel}>Total Assigned to {activeDeptLabel}</div>
              <div style={theme.metricVal}>{assignedDeptCases.length}</div>
              <div style={theme.metricSub}>Live Citizen Grievances</div>
            </div>
            <div style={{ ...theme.metricCard, borderLeft: "4px solid #facc15" }}>
              <div style={theme.metricLabel}>Pending Department Action</div>
              <div style={{ ...theme.metricVal, color: "#facc15" }}>{pendingCount}</div>
              <div style={theme.metricSub}>Awaiting Field Inspection / Work Order</div>
            </div>
            <div style={{ ...theme.metricCard, borderLeft: "4px solid #38bdf8" }}>
              <div style={theme.metricLabel}>In Progress / Action Reported</div>
              <div style={{ ...theme.metricVal, color: "#38bdf8" }}>{inProgressCount}</div>
              <div style={theme.metricSub}>Field Work Ongoing</div>
            </div>
            <div style={{ ...theme.metricCard, borderLeft: "4px solid #34d399" }}>
              <div style={theme.metricLabel}>Resolved & Closed</div>
              <div style={{ ...theme.metricVal, color: "#34d399" }}>{resolvedCount}</div>
              <div style={theme.metricSub}>Target SLA Compliance Metric</div>
            </div>
          </div>
        </div>

        {/* DB Error Banner */}
        {dbError && (
          <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", padding: "1rem", borderRadius: "12px", color: "#f87171", marginBottom: "1.5rem" }}>
            <strong>⚠ {dbError}</strong>
          </div>
        )}

        {/* Live Citizen Department Queue */}
        <section style={theme.section}>
          <div style={theme.sectionHeader}>
            <div>
              <h2 style={theme.sectionTitle}>
                🟢 Live Citizen Complaints ({activeDeptLabel}) <span style={theme.badgeCount}>{assignedDeptCases.length}</span>
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: "4px 0 0" }}>
                Active citizen grievances assigned to {activeDeptLabel} for field resolution.
              </p>
            </div>
          </div>

          {assignedDeptCases.length === 0 ? (
            <div style={theme.emptyBox}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🟢</div>
              <h3 style={{ color: "#f8fafc", margin: "0 0 0.25rem", fontSize: "1rem" }}>
                No live complaints are currently assigned to this department.
              </h3>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.85rem" }}>
                All assigned cases have been triaged or resolved. Check unassigned complaints below.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {assignedDeptCases.map((c) => (
                <DeptCaseCard key={c.id} complaint={c} />
              ))}
            </div>
          )}
        </section>

        {/* Unassigned Complaints Section */}
        <section style={{ ...theme.section, marginTop: "2rem", border: "1px solid rgba(234,179,8,0.2)" }}>
          <div style={theme.sectionHeader}>
            <div>
              <h2 style={{ ...theme.sectionTitle, color: "#facc15" }}>
                📋 Unassigned Live Citizen Complaints <span style={{ ...theme.badgeCount, background: "rgba(234,179,8,0.15)", color: "#facc15", border: "1px solid rgba(234,179,8,0.3)" }}>{unassignedCases.length}</span>
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: "4px 0 0" }}>
                New live citizen submissions awaiting department triage assignment.
              </p>
            </div>
          </div>

          {unassignedCases.length === 0 ? (
            <div style={theme.emptyBox}>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.85rem" }}>
                No unassigned citizen complaints currently in the processing queue.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {unassignedCases.map((c) => (
                <DeptCaseCard key={c.id} complaint={c} unassigned />
              ))}
            </div>
          )}
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
}

function DeptCaseCard({ complaint: c, unassigned }: { complaint: any; unassigned?: boolean }) {
  const ai = c.aiAnalysis;
  const isEmergency = ai?.urgency === "Emergency" || ai?.urgency === "High" || ai?.urgency === "Critical";

  return (
    <div
      style={{
        ...theme.card,
        borderLeft: unassigned
          ? "4px solid #facc15"
          : isEmergency
          ? "4px solid #ef4444"
          : "4px solid #10b981",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: unassigned ? "#facc15" : "#34d399", fontFamily: "monospace" }}>{c.id}</span>
            {unassigned ? (
              <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "9999px", background: "rgba(234,179,8,0.15)", color: "#facc15", border: "1px solid rgba(234,179,8,0.3)", fontWeight: 700 }}>
                UNASSIGNED QUEUE
              </span>
            ) : (
              <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "9999px", background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)", fontWeight: 700 }}>
                LIVE CITIZEN
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
            background: c.status === "Resolved" || c.status === "Solved" ? "rgba(16,185,129,0.15)" : "rgba(234,179,8,0.15)",
            color: c.status === "Resolved" || c.status === "Solved" ? "#34d399" : "#facc15",
            border: "1px solid rgba(255,255,255,0.1)",
          }}>
            {c.status}
          </span>
          <Link href={`/department/case/${c.id}`} style={theme.actionBtn}>
            Field Action & Resolution →
          </Link>
        </div>
      </div>

      <p style={{ fontSize: "0.875rem", color: "#cbd5e1", lineHeight: 1.5, margin: "0 0 0.875rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {c.description}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.5rem", background: "rgba(15,23,42,0.6)", padding: "0.75rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)", fontSize: "0.78rem" }}>
        <div>
          <span style={{ color: "#64748b" }}>Submitted: </span>
          <strong style={{ color: "#e2e8f0" }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString("en-IN") : "Recent"}</strong>
        </div>
        <div>
          <span style={{ color: "#64748b" }}>Urgency: </span>
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
  headerBox: { background: "rgba(13,33,55,0.7)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: "16px", padding: "1.5rem", backdropFilter: "blur(20px)", marginBottom: "2rem" },
  pageTitle: { fontSize: "1.75rem", fontWeight: 900, color: "#ffffff", margin: "0.25rem 0 0.5rem", letterSpacing: "-0.02em" },
  actionBtn: { padding: "0.4rem 0.875rem", borderRadius: "6px", background: "linear-gradient(135deg, #059669, #10b981)", color: "#ffffff", fontSize: "0.78rem", fontWeight: 800, textDecoration: "none" },
  metricsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginTop: "1.25rem" },
  metricCard: { background: "rgba(4,9,26,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem" },
  metricLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.05em" },
  metricVal: { fontSize: "1.75rem", fontWeight: 900, color: "#ffffff", margin: "0.2rem 0" },
  metricSub: { fontSize: "0.72rem", color: "#94a3b8" },
  section: { background: "rgba(13,33,55,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "1.5rem" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-center", marginBottom: "1.25rem" },
  sectionTitle: { fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" },
  badgeCount: { fontSize: "0.75rem", padding: "2px 8px", borderRadius: "9999px", background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)" },
  card: { background: "rgba(13,33,55,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1.25rem" },
  emptyBox: { padding: "2rem", textAlign: "center" as const, background: "rgba(4,9,26,0.6)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.1)" },
};
