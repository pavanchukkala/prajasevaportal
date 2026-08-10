import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

export const metadata = {
  title: "Case Reviewer Triage Portal — Srikalahasti Praja Seva",
  description: "AI-assisted triage and preliminary review workspace for authorized case reviewers.",
};

export default async function ReviewerCasesPage() {
  const session = await getSession();
  if (!session || (session.role !== "reviewer" && session.role !== "administrator")) {
    redirect("/staff/login");
  }

  const complaints = await db.complaints.list();
  const liveCases = complaints.filter((c) => !c.isSample);
  const sampleCases = complaints.filter((c) => c.isSample);
  const stats = await db.complaints.getStats();

  const safetyEscalations = complaints.filter(
    (c) => c.aiAnalysis?.humanReviewRequired || c.aiAnalysis?.urgency === "Emergency" || c.aiAnalysis?.urgency === "High"
  ).length;

  return (
    <div style={theme.page}>
      <GlobalHeader />

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

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="/mla/dashboard" style={theme.secondaryBtn}>
                MLA Dashboard
              </Link>
              <Link href="/admin/settings" style={theme.secondaryBtn}>
                System Admin
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={theme.metricsGrid}>
            <div style={theme.metricCard}>
              <div style={theme.metricLabel}>Total Database Records</div>
              <div style={theme.metricVal}>{stats.total}</div>
              <div style={theme.metricSub}>{stats.live} Live Citizen · {stats.sample} Sample</div>
            </div>
            <div style={{ ...theme.metricCard, borderLeft: "4px solid #ef4444" }}>
              <div style={theme.metricLabel}>Safety Escalations / High Urgency</div>
              <div style={{ ...theme.metricVal, color: "#f87171" }}>{safetyEscalations}</div>
              <div style={theme.metricSub}>Requires Priority Human Triage</div>
            </div>
            <div style={{ ...theme.metricCard, borderLeft: "4px solid #38bdf8" }}>
              <div style={theme.metricLabel}>New / Pending Triage</div>
              <div style={{ ...theme.metricVal, color: "#38bdf8" }}>{stats.new}</div>
              <div style={theme.metricSub}>Awaiting Initial Department Assignment</div>
            </div>
            <div style={{ ...theme.metricCard, borderLeft: "4px solid #10b981" }}>
              <div style={theme.metricLabel}>Active Under Review</div>
              <div style={{ ...theme.metricVal, color: "#34d399" }}>{stats.underReview}</div>
              <div style={theme.metricSub}>Assigned to Dept / Staff Review</div>
            </div>
          </div>
        </div>

        {/* Live Citizen Submissions Section */}
        <section style={theme.section}>
          <div style={theme.sectionHeader}>
            <div>
              <h2 style={theme.sectionTitle}>
                🟢 Live Citizen Complaints <span style={theme.badgeCount}>{liveCases.length}</span>
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "0.82rem", margin: "4px 0 0" }}>
                Real citizen grievances submitted via public portal. Ordered by most recent.
              </p>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
              Last synced: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {liveCases.length === 0 ? (
            <div style={theme.emptyBox}>
              <p style={{ color: "#94a3b8", margin: 0, fontSize: "0.95rem" }}>
                🟢 No pending citizen complaints in the queue. Submissions via `/submit` will appear here instantly in real-time.
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

function CaseReviewCard({ complaint: c }: { complaint: any }) {
  const ai = c.aiAnalysis;
  const isEmergency = ai?.urgency === "Emergency" || ai?.urgency === "High";

  return (
    <div style={{
      ...theme.card,
      borderLeft: c.isSample
        ? "4px solid #a855f7"
        : isEmergency
        ? "4px solid #ef4444"
        : "4px solid #0284c7"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#38bdf8", fontFamily: "monospace" }}>{c.id}</span>
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
            background: c.status === "New" ? "rgba(56,189,248,0.15)" : c.status === "Resolved" ? "rgba(16,185,129,0.15)" : "rgba(234,179,8,0.15)",
            color: c.status === "New" ? "#38bdf8" : c.status === "Resolved" ? "#34d399" : "#facc15",
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
          <strong style={{ color: "#38bdf8" }}>{c.assignedDepartment || c.department || ai?.department || "Unassigned"}</strong>
        </div>
        <div>
          <span style={{ color: "#64748b" }}>AI Urgency: </span>
          <strong style={{ color: ai?.urgency === "Emergency" || ai?.urgency === "High" ? "#f87171" : "#facc15" }}>
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
  secondaryBtn: { padding: "0.5rem 1rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#f0f4f8", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none" },
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
