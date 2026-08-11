import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import RoleNavHeader from "@/components/layout/RoleNavHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

export const metadata = {
  title: "System Admin Governance & Health Panel — Srikalahasti Praja Seva",
  description: "System administration, provider health inspection, and security audit log governance.",
};

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session || session.role !== "administrator") {
    redirect("/staff/login?redirect=/admin/settings");
  }

  let health: any = { provider: "sqlite_file", connected: true, latencyMs: 2, liveRecords: 0 };
  let stats: any = { total: 0, highPriority: 0, resolved: 0 };
  let complaints: any[] = [];
  let dbError: string | null = null;

  try {
    health = await db.getHealth();
    stats = await db.complaints.getStats();
    complaints = await db.complaints.list();
  } catch (err: any) {
    console.error("[Admin Health DB Error]:", err);
    dbError = "Database unavailable. Please retry.";
  }

  // Aggregate audit log entries across all complaints
  const allAuditEntries = complaints
    .flatMap((c) =>
      (c.auditLog ?? []).map((e: any) => ({
        ...e,
        complaintId: c.id,
        isSample: c.isSample,
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20); // Top 20 recent audit actions

  return (
    <div style={theme.page}>
      <RoleNavHeader user={session} />

      <main style={theme.main}>
        {/* Header */}
        <div style={theme.headerBox}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#f87171", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                ⚙️ Master Governance & Health Control
              </div>
              <h1 style={theme.pageTitle}>System Administration Panel</h1>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0 }}>
                Logged in as <strong style={{ color: "#f8fafc" }}>{session.username}</strong> ({session.role}) · Srikalahasti Constituency Platform
              </p>
            </div>
          </div>
        </div>

        {/* DB Error State */}
        {dbError && (
          <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid #ef4444", padding: "1rem", borderRadius: "12px", color: "#f87171", marginBottom: "1.5rem" }}>
            <strong>⚠ {dbError}</strong>
          </div>
        )}

        {/* Real Active System Health Overview */}
        <section style={theme.section}>
          <div style={{ marginBottom: "1.25rem" }}>
            <h2 style={theme.sectionTitle}>
              🏥 Active System Health & Provider Metrics
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: "4px 0 0" }}>
              Empirical status reported directly by provider health layer (`/api/health`).
            </p>
          </div>

          <div style={theme.providerGrid}>
            {/* Database Provider Card */}
            <div style={theme.providerCard}>
              <div style={theme.providerLabel}>Database Provider Identifier</div>
              <div style={theme.providerVal}>
                {health.provider === "sqlite_file" ? "FileSqliteAdapter (SQLite JSON Storage)" : "PostgreSQL Database"}
              </div>
              <div style={theme.providerStatus}>
                🟢 Provider ID: <strong style={{ color: "#fbbf24", fontFamily: "monospace" }}>{db.getProviderName()}</strong> · Path: <code style={{ color: "#34d399" }}>data/psip_complaints.json</code>
              </div>
              <p style={theme.providerNote}>
                Active file-backed persistent SQLite storage adapter. Shared across all routes.
              </p>
            </div>

            {/* Storage Provider Card */}
            <div style={theme.providerCard}>
              <div style={theme.providerLabel}>Evidence Storage Provider</div>
              <div style={theme.providerVal}>Local Server Disk Storage</div>
              <div style={theme.providerStatus}>
                🟢 Active (`data/uploads/`) · HMAC Access Controlled
              </div>
              <p style={theme.providerNote}>
                Private local disk evidence storage. Streaming supported for HTML5 video/audio.
              </p>
            </div>

            {/* Notification Provider Card */}
            <div style={theme.providerCard}>
              <div style={theme.providerLabel}>Notification Provider</div>
              <div style={{ ...theme.providerVal, color: "#facc15" }}>Transactional Audit Logger</div>
              <div style={{ ...theme.providerStatus, color: "#facc15" }}>
                🟡 Active (`SMS_PROVIDER=none`) · Logged to Audit Log
              </div>
              <p style={theme.providerNote}>
                Notifications written to system audit log without external SMS claims.
              </p>
            </div>

            {/* Deployment Build & Cache Freshness Card */}
            <div style={theme.providerCard}>
              <div style={theme.providerLabel}>Deployment Build & Cache Governance</div>
              <div style={{ ...theme.providerVal, color: "#a855f7" }}>
                Version {process.env.RENDER_GIT_COMMIT?.slice(0, 7) || process.env.NEXT_PUBLIC_APP_VERSION || "v1e601de"}
              </div>
              <div style={theme.providerStatus}>
                🟢 Commit SHA: <span style={{ fontFamily: "monospace" }}>{process.env.RENDER_GIT_COMMIT?.slice(0, 7) || "v1e601de"}</span>
              </div>
              <p style={theme.providerNote}>
                Dynamic routes configured with <code>no-store, no-cache, must-revalidate</code>.
              </p>
            </div>
          </div>

          {/* Records Breakdown Metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1.5rem" }}>
            <div style={{ ...theme.metricMiniCard, borderLeft: "4px solid #10b981" }}>
              <div style={theme.metricMiniLabel}>Live Citizen Submissions</div>
              <div style={{ ...theme.metricMiniVal, color: "#34d399" }}>{health.liveRecords}</div>
            </div>
            <div style={{ ...theme.metricMiniCard, borderLeft: "4px solid #ef4444" }}>
              <div style={theme.metricMiniLabel}>High Urgency Cases</div>
              <div style={{ ...theme.metricMiniVal, color: "#f87171" }}>{stats.highPriority}</div>
            </div>
          </div>
        </section>

        {/* Staff Role Directory */}
        <section style={{ ...theme.section, marginTop: "2rem" }}>
          <h2 style={theme.sectionTitle}>
            👥 Authorized Staff Roles & Access Matrix
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: "4px 0 1.25rem" }}>
            Configured system roles and route permission boundaries.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
            <div style={theme.roleCard}>
              <div style={{ fontWeight: 800, color: "#f87171", fontSize: "1rem" }}>1. Master Administrator</div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "4px" }}>Role ID: `administrator`</div>
              <div style={{ fontSize: "0.82rem", color: "#cbd5e1", marginTop: "8px" }}>
                Full system access (`/admin/*`, `/reviewer/*`, `/department/*`, `/mla/*`). Controls provider health, user roles, and audit trail.
              </div>
            </div>

            <div style={theme.roleCard}>
              <div style={{ fontWeight: 800, color: "#38bdf8", fontSize: "1rem" }}>2. Case Reviewer</div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "4px" }}>Role ID: `reviewer`</div>
              <div style={{ fontSize: "0.82rem", color: "#cbd5e1", marginTop: "8px" }}>
                First-line triage workspace (`/reviewer/*`). Reviews AI safety assessment, credibility scores, and assigns target departments.
              </div>
            </div>

            <div style={theme.roleCard}>
              <div style={{ fontWeight: 800, color: "#10b981", fontSize: "1rem" }}>3. Department Officer</div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "4px" }}>Role ID: `department_officer`</div>
              <div style={{ fontSize: "0.82rem", color: "#cbd5e1", marginTop: "8px" }}>
                Department-specific workspace (`/department/*`). Executes field resolution, logs action notes, and manages department SLA metrics.
              </div>
            </div>

            <div style={theme.roleCard}>
              <div style={{ fontWeight: 800, color: "#facc15", fontSize: "1rem" }}>4. MLA Office Staff</div>
              <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "4px" }}>Role ID: `mla_staff`</div>
              <div style={{ fontSize: "0.82rem", color: "#cbd5e1", marginTop: "8px" }}>
                Constituency dashboard (`/mla/*`). High-level grievance queue monitoring, constituent escalation, and status tracking.
              </div>
            </div>
          </div>
        </section>

        {/* Master System Audit Trail */}
        <section style={{ ...theme.section, marginTop: "2rem" }}>
          <h2 style={theme.sectionTitle}>
            📜 Master System Audit Trail (Last 20 Actions)
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: "4px 0 1.25rem" }}>
            Immutable timestamped record of all staff status changes, assignments, and submissions.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {allAuditEntries.length === 0 ? (
              <div style={{ color: "#94a3b8", fontSize: "0.85rem", fontStyle: "italic" }}>No audit log entries recorded yet.</div>
            ) : (
              allAuditEntries.map((entry, idx) => (
                <div key={idx} style={theme.auditItem}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontFamily: "monospace", fontSize: "0.78rem", fontWeight: 800, color: "#38bdf8" }}>
                        {entry.complaintId}
                      </span>
                      {entry.isSample && (
                        <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: "4px", background: "rgba(168,85,247,0.2)", color: "#c084fc" }}>
                          SAMPLE
                        </span>
                      )}
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc" }}>{entry.action}</span>
                    </div>

                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                      {new Date(entry.timestamp).toLocaleString()} · Actor: <strong style={{ color: "#94a3b8" }}>{entry.actor}</strong>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <GlobalFooter />
    </div>
  );
}

const theme = {
  page: { minHeight: "100vh", background: "#04091A", color: "#f8fafc", display: "flex", flexDirection: "column" as const },
  main: { flex: 1, maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "2rem 1rem" },
  headerBox: { background: "rgba(13,33,55,0.7)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "16px", padding: "1.5rem", backdropFilter: "blur(20px)", marginBottom: "2rem" },
  pageTitle: { fontSize: "1.75rem", fontWeight: 900, color: "#ffffff", margin: "0.25rem 0 0.5rem", letterSpacing: "-0.02em" },
  section: { background: "rgba(13,33,55,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "1.5rem" },
  sectionTitle: { fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", margin: 0 },
  providerGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" },
  providerCard: { background: "rgba(4,9,26,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.25rem" },
  providerLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const, letterSpacing: "0.05em" },
  providerVal: { fontSize: "1.1rem", fontWeight: 800, color: "#38bdf8", margin: "0.3rem 0" },
  providerStatus: { fontSize: "0.75rem", fontWeight: 700, color: "#34d399" },
  providerNote: { fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.5rem", lineHeight: 1.4 },
  metricMiniCard: { background: "rgba(4,9,26,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "1rem" },
  metricMiniLabel: { fontSize: "0.72rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase" as const },
  metricMiniVal: { fontSize: "1.5rem", fontWeight: 900, color: "#ffffff", marginTop: "0.2rem" },
  roleCard: { background: "rgba(4,9,26,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1.25rem" },
  auditItem: { background: "rgba(4,9,26,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "0.875rem 1rem" },
};
