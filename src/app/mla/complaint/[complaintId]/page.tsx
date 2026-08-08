import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ complaintId: string }> }) {
  const { complaintId } = await params;
  return { title: `Case ${complaintId} | MLA Dashboard | Praja Seva` };
}

export default async function CaseDetailPage({ params }: { params: Promise<{ complaintId: string }> }) {
  const session = await getSession();
  if (!session) redirect("/staff/login");

  const { complaintId } = await params;
  const complaint = await db.complaints.getById(complaintId);

  if (!complaint) notFound();

  const urgencyColor = complaint.aiAnalysis?.urgency === "High" || complaint.aiAnalysis?.urgency === "Emergency" ? "#ef4444" : complaint.aiAnalysis?.urgency === "Priority" ? "#f97316" : "#22c55e";
  const credColor = complaint.aiAnalysis?.credibilityBand === "High" ? "#22c55e" : complaint.aiAnalysis?.credibilityBand === "Medium" ? "#eab308" : "#ef4444";

  const card = {
    background: "rgba(13,33,55,0.6)",
    border: "1px solid rgba(212,160,23,0.12)",
    borderRadius: "16px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  } as const;

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8", paddingBottom: "4rem" }}>
      {/* HEADER */}
      <header style={{ background: "rgba(13,33,55,0.95)", borderBottom: "1px solid rgba(212,160,23,0.15)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/mla/dashboard" style={{ color: "#D4A017", textDecoration: "none", fontSize: "0.85rem" }}>← Dashboard</Link>
            <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontWeight: 700, color: "#94a3b8", fontSize: "0.85rem" }}>Case {complaintId}</span>
          </div>
          <div style={{ padding: "0.25rem 0.75rem", background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.3)", borderRadius: "9999px", fontSize: "0.6rem", fontWeight: 700, color: "#eab308", letterSpacing: "0.1em" }}>
            SAMPLE PRESENTATION RECORD
          </div>
        </div>
      </header>

      <div style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 1.5rem" }}>

        {/* TITLE BLOCK */}
        <div style={{ ...card, border: "1px solid rgba(212,160,23,0.25)" }}>
          <div style={{ fontSize: "0.65rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>AI-Generated Case Summary</div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff", lineHeight: 1.3, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
            {complaint.aiAnalysis?.title ?? complaint.description.slice(0, 100)}
          </h1>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ padding: "0.3rem 0.75rem", borderRadius: "8px", background: "rgba(212,160,23,0.1)", color: "#D4A017", fontSize: "0.8rem", fontWeight: 700 }}>{complaint.id}</span>
            <span style={{ padding: "0.3rem 0.75rem", borderRadius: "8px", background: `${urgencyColor}22`, color: urgencyColor, fontSize: "0.8rem", fontWeight: 700 }}>🔴 {complaint.aiAnalysis?.urgency} Urgency</span>
            <span style={{ padding: "0.3rem 0.75rem", borderRadius: "8px", background: `${credColor}22`, color: credColor, fontSize: "0.8rem", fontWeight: 700 }}>Credibility: {complaint.aiAnalysis?.credibilityBand} ({complaint.aiAnalysis?.confidenceScore}%)</span>
            <span style={{ padding: "0.3rem 0.75rem", borderRadius: "8px", background: "rgba(96,165,250,0.1)", color: "#60a5fa", fontSize: "0.8rem", fontWeight: 700 }}>{complaint.status}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

          {/* LEFT: Details */}
          <div>
            <div style={card}>
              <div style={{ fontWeight: 700, color: "#D4A017", marginBottom: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Original Complaint</div>
              <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem" }}>{complaint.description}</p>
              <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {[
                  ["Mandal", complaint.mandal],
                  ["Village/Ward", complaint.village ?? "Not specified"],
                  ["Department", complaint.aiAnalysis?.department ?? complaint.department ?? "To Be Determined"],
                  ["Category", complaint.aiAnalysis?.category ?? "General"],
                  ["Submitted", complaint.createdAt.split("T")[0]],
                  ["Evidence", complaint.mediaUrls.length > 0 ? `${complaint.mediaUrls.length} file(s)` : "None uploaded"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: "0.65rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>{k}</div>
                    <div style={{ fontSize: "0.9rem", color: "#ffffff", fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AUDIT TRAIL */}
            <div style={card}>
              <div style={{ fontWeight: 700, color: "#D4A017", marginBottom: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Status Timeline</div>
              {[
                { time: complaint.createdAt.split("T")[0], action: "Complaint Received", status: "✅" },
                { time: complaint.createdAt.split("T")[0], action: "AI Preliminary Assessment Generated", status: "🧠" },
                { time: complaint.createdAt.split("T")[0], action: "Assigned for Human Review", status: "👁" },
              ].map((e, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", padding: "0.75rem 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <span style={{ fontSize: "1rem" }}>{e.status}</span>
                  <div>
                    <div style={{ fontSize: "0.85rem", color: "#ffffff", fontWeight: 600 }}>{e.action}</div>
                    <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "2px" }}>{e.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: AI Analysis */}
          <div>
            <div style={card}>
              <div style={{ fontWeight: 700, color: "#D4A017", marginBottom: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>AI Preliminary Assessment</div>

              {/* Credibility meter */}
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#94a3b8" }}>Credibility Score</span>
                  <span style={{ color: credColor, fontWeight: 700 }}>{complaint.aiAnalysis?.credibilityBand} ({complaint.aiAnalysis?.confidenceScore}%)</span>
                </div>
                <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: "9999px", height: "6px", overflow: "hidden" }}>
                  <div style={{ width: `${complaint.aiAnalysis?.confidenceScore ?? 0}%`, height: "100%", background: `linear-gradient(90deg, ${credColor}88, ${credColor})`, borderRadius: "9999px" }} />
                </div>
              </div>

              {/* Recommended action */}
              <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.65rem", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontWeight: 700 }}>Recommended Human Action</div>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>{complaint.aiAnalysis?.recommendedAction}</p>
              </div>

              {/* Missing info */}
              {(complaint.aiAnalysis?.missingInformation ?? []).length > 0 && (
                <div style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)", borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.65rem", color: "#eab308", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontWeight: 700 }}>Missing Information</div>
                  <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                    {complaint.aiAnalysis?.missingInformation.map((m, i) => (
                      <li key={i} style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "0.25rem" }}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legal disclaimer */}
              <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "8px", padding: "0.875rem", fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.6 }}>
                ⚠️ {complaint.aiAnalysis?.legalDisclaimer}
              </div>
            </div>

            {/* ACTION PANEL */}
            <div style={card}>
              <div style={{ fontWeight: 700, color: "#D4A017", marginBottom: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Review Actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <button style={{ padding: "0.75rem 1rem", background: "linear-gradient(135deg, #D4A017, #F3E5AB)", color: "#060f1a", fontWeight: 700, borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>✅ Assign to Department</button>
                <button style={{ padding: "0.75rem 1rem", background: "rgba(96,165,250,0.1)", color: "#60a5fa", fontWeight: 700, borderRadius: "10px", border: "1px solid rgba(96,165,250,0.3)", cursor: "pointer", fontSize: "0.9rem" }}>📋 Request More Information</button>
                <button style={{ padding: "0.75rem 1rem", background: "rgba(239,68,68,0.1)", color: "#f87171", fontWeight: 700, borderRadius: "10px", border: "1px solid rgba(239,68,68,0.3)", cursor: "pointer", fontSize: "0.9rem" }}>🚨 Escalate</button>
                <button style={{ padding: "0.75rem 1rem", background: "rgba(255,255,255,0.05)", color: "#64748b", fontWeight: 700, borderRadius: "10px", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontSize: "0.9rem" }}>🔒 Close Case</button>
              </div>
              <p style={{ marginTop: "1rem", fontSize: "0.72rem", color: "#475569", lineHeight: 1.5 }}>In the demo version, actions are not persisted. In production, these would update the database and generate audit entries.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
