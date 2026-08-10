import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import MLAChatbot from "@/components/mla/MLAChatbot";

export default async function MLADashboard({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string; mandal?: string }> | { tab?: string; mandal?: string };
}) {
  const session = await getSession();
  if (!session) {
    redirect("/staff/login");
  }

  const allComplaints = await db.complaints.list();
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const currentTab = resolvedSearchParams.tab || "active";
  const currentMandal = resolvedSearchParams.mandal || "all";

  // Filter complaints based on status category & mandal
  let filtered = allComplaints;

  if (currentMandal !== "all") {
    filtered = filtered.filter((c: any) => (c.mandal || "").toLowerCase() === currentMandal.toLowerCase());
  }

  if (currentTab === "active") {
    filtered = filtered.filter((c: any) =>
      ["New", "AI Processed", "Under Review", "More Information Requested", "Assigned", "Escalated"].includes(c.status)
    );
  } else if (currentTab === "reported") {
    filtered = filtered.filter((c: any) => c.status === "Action Reported");
  } else if (currentTab === "solved") {
    filtered = filtered.filter((c: any) => c.status === "Resolved" || c.status === "Closed");
  }

  const total = allComplaints.length;
  const activeCount = allComplaints.filter((c: any) =>
    ["New", "AI Processed", "Under Review", "More Information Requested", "Assigned", "Escalated"].includes(c.status)
  ).length;
  const reportedCount = allComplaints.filter((c: any) => c.status === "Action Reported").length;
  const solvedCount = allComplaints.filter((c: any) => c.status === "Resolved" || c.status === "Closed").length;
  const highPriority = allComplaints.filter(
    (c: any) => c.aiAnalysis?.urgency === "Emergency" || c.aiAnalysis?.urgency === "Critical" || c.aiAnalysis?.urgency === "High"
  ).length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "sans-serif", paddingBottom: "80px" }}>
      {/* Banner */}
      <div style={{ backgroundColor: "#fbbf24", color: "#0f172a", padding: "10px 16px", textAlign: "center", fontWeight: 800, fontSize: "13px" }}>
        🏛️ SRIKALAHASTI CONSTITUENCY EXECUTIVE MLA INTELLIGENCE DASHBOARD · GROQ LLM REAL-TIME AUDIT ACTIVE
      </div>

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 16px" }}>
        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ color: "#fbbf24", fontSize: "28px", margin: 0, fontWeight: 900 }}>MLA Case & Action Dashboard</h1>
            <p style={{ color: "#cbd5e1", margin: "6px 0 0", fontSize: "14px" }}>
              Logged in as <strong>{session.username}</strong> ({session.role}) · Assembly Constituency No. 168
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link href="/reviewer/cases" style={{ backgroundColor: "#1e293b", color: "#38bdf8", border: "1px solid #38bdf8", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "13px" }}>
              Reviewer Queue
            </Link>
            <Link href="/department/workspace" style={{ backgroundColor: "#1e293b", color: "#34d399", border: "1px solid #34d399", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "13px" }}>
              Dept Workspace
            </Link>
          </div>
        </header>

        {/* Executive Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          <StatCard title="Total Citizen Cases" value={total} color="#3b82f6" />
          <StatCard title="Active / Pending Action" value={activeCount} color="#facc15" highlight />
          <StatCard title="Action Reported" value={reportedCount} color="#38bdf8" />
          <StatCard title="Resolved / Solved Cases" value={solvedCount} color="#10b981" />
          <StatCard title="Critical / Emergency" value={highPriority} color="#ef4444" danger />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", paddingBottom: "14px", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <TabLink active={currentTab === "all"} href={`?tab=all&mandal=${currentMandal}`} label={`All Cases (${total})`} />
            <TabLink active={currentTab === "active"} href={`?tab=active&mandal=${currentMandal}`} label={`⏳ Active Pending (${activeCount})`} />
            <TabLink active={currentTab === "reported"} href={`?tab=reported&mandal=${currentMandal}`} label={`📋 Action Reported (${reportedCount})`} />
            <TabLink active={currentTab === "solved"} href={`?tab=solved&mandal=${currentMandal}`} label={`✅ Resolved / Solved (${solvedCount})`} />
          </div>

          {/* Mandal Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#94a3b8" }}>Mandal:</span>
            <select
              defaultValue={currentMandal}
              onChange={(e) => {
                const val = e.target.value;
                window.location.href = `?tab=${currentTab}&mandal=${val}`;
              }}
              style={{ backgroundColor: "#1e293b", border: "1px solid #334155", color: "#f8fafc", padding: "6px 12px", borderRadius: "6px", fontSize: "13px", outline: "none" }}
            >
              <option value="all">All Mandals</option>
              <option value="Srikalahasti">Srikalahasti</option>
              <option value="Yerpedu">Yerpedu</option>
              <option value="Thottambedu">Thottambedu</option>
              <option value="Renigunta">Renigunta</option>
            </select>
          </div>
        </div>

        {/* Cases Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "24px" }}>
          {filtered.map((c: any) => {
            const ai = c.aiAnalysis;
            const isEmergency = ai?.urgency === "Emergency" || ai?.urgency === "Critical" || ai?.urgency === "High";
            const mediaList: string[] = c.mediaUrls || [];

            return (
              <div
                key={c.id}
                style={{
                  backgroundColor: "#1e293b",
                  borderRadius: "14px",
                  padding: "24px",
                  border: isEmergency ? "2px solid #ef4444" : c.status === "Resolved" ? "1px solid #10b981" : "1px solid #334155",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  {/* Status Badges */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap", alignItems: "center" }}>
                    <Badge label={c.status} color={c.status === "Resolved" || c.status === "Closed" ? "#10b981" : c.status === "Action Reported" ? "#38bdf8" : "#facc15"} />
                    <Badge label="LIVE CITIZEN" color="#34d399" />
                    {ai?.urgency && (
                      <Badge
                        label={`Urgency: ${ai.urgency}`}
                        color={ai.urgency === "Critical" || ai.urgency === "Emergency" ? "#ef4444" : ai.urgency === "High" ? "#f59e0b" : "#38bdf8"}
                      />
                    )}
                  </div>

                  {/* AI Executive Title */}
                  <h2 style={{ fontSize: "1.15rem", color: "#fbbf24", margin: "0 0 10px", lineHeight: "1.4", fontWeight: 800 }}>
                    {ai?.title || (c.description ? c.description.slice(0, 70) + "..." : "Grievance Case")}
                  </h2>

                  <p style={{ fontSize: "0.875rem", color: "#cbd5e1", lineHeight: "1.6", marginBottom: "16px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {c.description}
                  </p>

                  {/* Evidence Display Section */}
                  <div style={{ backgroundColor: "rgba(15,23,42,0.8)", borderRadius: "10px", padding: "12px", marginBottom: "16px", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.82rem" }}>
                    <div style={{ fontWeight: 800, color: "#38bdf8", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>📎 Attached Evidence Files ({mediaList.length})</span>
                    </div>

                    {mediaList.length === 0 ? (
                      <span style={{ color: "#64748b", fontStyle: "italic" }}>No media files attached to this complaint.</span>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {mediaList.map((url: string, idx: number) => {
                          const isImage = url.match(/\.(jpeg|jpg|png|webp|gif)$/i);
                          const isVideo = url.match(/\.(mp4|webm|mov|avi|3gp|mkv)$/i);
                          const filename = url.split("/").pop() || `Evidence #${idx + 1}`;

                          return (
                            <div key={idx} style={{ background: "rgba(30,41,59,0.8)", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ color: "#f8fafc", fontSize: "0.78rem" }}>
                                {isImage ? "🖼️ Image" : isVideo ? "🎥 Video" : "📄 Document"}: {filename}
                              </span>
                              <a href={url} target="_blank" rel="noreferrer" style={{ color: "#fbbf24", textDecoration: "none", fontWeight: "bold", fontSize: "0.75rem" }}>
                                View Evidence &rarr;
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Intelligence Meta Box */}
                  <div style={{ backgroundColor: "rgba(15,23,42,0.6)", borderRadius: "8px", padding: "12px", marginBottom: "16px", fontSize: "0.82rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "6px" }}>
                      <div><span style={{ color: "#64748b" }}>Case ID:</span> <strong style={{ color: "#38bdf8", fontFamily: "monospace" }}>{c.id}</strong></div>
                      <div><span style={{ color: "#64748b" }}>Mandal:</span> <strong style={{ color: "#f8fafc" }}>{c.mandal}</strong></div>
                    </div>
                    <div><span style={{ color: "#64748b" }}>Dept:</span> <strong style={{ color: "#f59e0b" }}>{c.assignedDepartment || c.department || ai?.department || "Unassigned"}</strong></div>
                    {ai?.recommendedAction && (
                      <div style={{ color: "#94a3b8", marginTop: "8px", fontSize: "0.78rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "8px", lineHeight: 1.5 }}>
                        💡 <strong>Legal Directive:</strong> {ai.recommendedAction}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <Link
                    href={`/mla/complaint/${c.id}`}
                    style={{
                      display: "block",
                      textAlign: "center",
                      backgroundColor: "#fbbf24",
                      color: "#0f172a",
                      padding: "10px 16px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: "13px",
                    }}
                  >
                    Inspect Full Case & Action Log &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ color: "#94a3b8", padding: "32px", textAlign: "center", gridColumn: "1 / -1", backgroundColor: "#1e293b", borderRadius: "12px", border: "1px dashed #334155" }}>
              🟢 No complaints currently listed under this tab category.
            </div>
          )}
        </div>
      </main>

      {/* Floating MLA Intelligence Assistant Chatbot */}
      <MLAChatbot />
    </div>
  );
}

function StatCard({ title, value, color, highlight, danger }: { title: string; value: number; color: string; highlight?: boolean; danger?: boolean }) {
  return (
    <div
      style={{
        backgroundColor: "#1e293b",
        padding: "20px",
        borderRadius: "12px",
        borderLeft: `4px solid ${color}`,
        boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
      }}
    >
      <div style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "6px", fontWeight: 600 }}>{title}</div>
      <div style={{ color: "#f8fafc", fontSize: "28px", fontWeight: 900 }}>{value}</div>
    </div>
  );
}

function TabLink({ active, href, label }: { active: boolean; href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        padding: "8px 16px",
        color: active ? "#0f172a" : "#cbd5e1",
        backgroundColor: active ? "#fbbf24" : "transparent",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: active ? 800 : 600,
        fontSize: "13px",
        border: active ? "1px solid #fbbf24" : "1px solid #334155",
      }}
    >
      {label}
    </Link>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
        padding: "3px 10px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: 800,
      }}
    >
      {label}
    </span>
  );
}
