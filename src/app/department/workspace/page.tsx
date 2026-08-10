import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

export const metadata = {
  title: "Department Officer Workspace — Srikalahasti Praja Seva",
  description: "Field department resolution workspace and SLA tracking dashboard for departmental officers.",
};

const DEPARTMENTS = [
  "Revenue",
  "Municipal Administration",
  "Panchayat Raj",
  "Roads & Buildings",
  "AP Transco",
  "Rural Water Supply",
  "Police / Law & Order",
  "Women & Child Welfare",
];

export default async function DepartmentWorkspacePage({
  searchParams,
}: {
  searchParams?: Promise<{ dept?: string }> | { dept?: string };
}) {
  const session = await getSession();
  if (!session || (session.role !== "department_officer" && session.role !== "administrator")) {
    redirect("/staff/login");
  }

  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const dept = resolvedSearchParams.dept;
  const activeDept = dept || "Revenue";

  const allComplaints = await db.complaints.list();

  // Filter by assigned department or AI suggested department
  const deptComplaints = allComplaints.filter(
    (c) =>
      (c.assignedDepartment || c.department || c.aiAnalysis?.department || "Revenue").toLowerCase() ===
      activeDept.toLowerCase()
  );

  const liveDeptCases = deptComplaints.filter((c) => !c.isSample);
  const sampleDeptCases = deptComplaints.filter((c) => c.isSample);

  const pendingCount = deptComplaints.filter((c) =>
    ["New", "AI Processed", "Under Review", "Assigned", "More Information Requested"].includes(c.status)
  ).length;

  const inProgressCount = deptComplaints.filter((c) =>
    ["Assigned", "Escalated", "Action Reported"].includes(c.status)
  ).length;

  const resolvedCount = deptComplaints.filter((c) =>
    ["Resolved", "Closed"].includes(c.status)
  ).length;

  return (
    <div style={theme.page}>
      <GlobalHeader />

      <main style={theme.main}>
        {/* Portal Header */}
        <div style={theme.headerBox}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                🏢 Protected Department Officer Workspace
              </div>
              <h1 style={theme.pageTitle}>{activeDept} Department Queue</h1>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0 }}>
                Logged in as <strong style={{ color: "#f8fafc" }}>{session.username}</strong> ({session.role}) · Srikalahasti Assembly Constituency
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="/reviewer/cases" style={theme.secondaryBtn}>
                Reviewer Queue
              </Link>
              <Link href="/admin/settings" style={theme.secondaryBtn}>
                System Admin
              </Link>
            </div>
          </div>

          {/* Department Selector Tabs */}
          <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
            {DEPARTMENTS.map((d) => (
              <Link
                key={d}
                href={`/department/workspace?dept=${encodeURIComponent(d)}`}
                style={{
                  padding: "0.4rem 0.875rem",
                  borderRadius: "9999px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  background: activeDept.toLowerCase() === d.toLowerCase() ? "#10b981" : "rgba(255,255,255,0.05)",
                  color: activeDept.toLowerCase() === d.toLowerCase() ? "#04091A" : "#f0f4f8",
                  border: "1px solid",
                  borderColor: activeDept.toLowerCase() === d.toLowerCase() ? "#10b981" : "rgba(255,255,255,0.1)",
                }}
              >
                {d}
              </Link>
            ))}
          </div>

          {/* SLA Metrics Grid */}
          <div style={theme.metricsGrid}>
            <div style={{ ...theme.metricCard, borderLeft: "4px solid #10b981" }}>
              <div style={theme.metricLabel}>Total Assigned to {activeDept}</div>
              <div style={theme.metricVal}>{deptComplaints.length}</div>
              <div style={theme.metricSub}>{liveDeptCases.length} Live Citizen · {sampleDeptCases.length} Sample</div>
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

        {/* Live Citizen Department Queue */}
        <section style={theme.section}>
          <div style={theme.sectionHeader}>
            <div>
              <h2 style={theme.sectionTitle}>
                🟢 Live Citizen Complaints ({activeDept}) <span style={theme.badgeCount}>{liveDeptCases.length}</span>
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: "4px 0 0" }}>
                Active citizen grievances assigned to {activeDept} for field resolution.
              </p>
            </div>
          </div>

          {liveDeptCases.length === 0 ? (
            <div style={theme.emptyBox}>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem" }}>
                No active complaints assigned to {activeDept} department at this time.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {liveDeptCases.map((c) => (
                <DeptCaseCard key={c.id} complaint={c} />
              ))}
            </div>
          )}
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
}

function DeptCaseCard({ complaint: c }: { complaint: any }) {
  const ai = c.aiAnalysis;
  const isEmergency = ai?.urgency === "Emergency" || ai?.urgency === "High";

  return (
    <div style={{
      ...theme.card,
      borderLeft: c.isSample
        ? "4px solid #a855f7"
        : isEmergency
        ? "4px solid #ef4444"
        : "4px solid #10b981"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#34d399", fontFamily: "monospace" }}>{c.id}</span>
            {c.isSample ? (
              <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "9999px", background: "rgba(168,85,247,0.15)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.3)", fontWeight: 700 }}>
                SAMPLE RECORD
              </span>
            ) : (
              <span style={{ fontSize: "0.68rem", padding: "2px 8px", borderRadius: "9999px", background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)", fontWeight: 700 }}>
                LIVE SUBMISSION
              </span>
            )}
            <span style={{ fontSize: "0.72rem", color: "#64748b" }}>📍 {c.mandal} {c.village ? `· ${c.village}` : ""}</span>
          </div>

          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f8fafc", margin: "0.4rem 0 0.25rem", lineHeight: 1.3 }}>
            {ai?.title ?? c.description.slice(0, 80) + "..."}
          </h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: "6px",
            background: c.status === "Resolved" ? "rgba(16,185,129,0.15)" : "rgba(234,179,8,0.15)",
            color: c.status === "Resolved" ? "#34d399" : "#facc15",
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
          <strong style={{ color: "#e2e8f0" }}>{new Date(c.createdAt).toLocaleDateString()}</strong>
        </div>
        <div>
          <span style={{ color: "#64748b" }}>Urgency: </span>
          <strong style={{ color: ai?.urgency === "Emergency" || ai?.urgency === "High" ? "#f87171" : "#facc15" }}>
            {ai?.urgency ?? "Routine"}
          </strong>
        </div>
        <div>
          <span style={{ color: "#64748b" }}>Contact: </span>
          <span style={{ color: "#94a3b8" }}>{c.mobileNumberMasked ?? "Anonymous"}</span>
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
  secondaryBtn: { padding: "0.5rem 1rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#f0f4f8", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none" },
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
