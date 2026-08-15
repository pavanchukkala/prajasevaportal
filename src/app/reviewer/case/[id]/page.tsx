import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";
import ReviewerActionForm from "./ReviewerActionForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `Reviewer Triage: Case ${id} — Srikalahasti Praja Seva`,
  };
}

function formatFileName(url: string, idx: number): string {
  try {
    const raw = url.split("?")[0];
    const parts = raw.split("/");
    const name = parts[parts.length - 1];
    if (name.includes("-")) {
      const subParts = name.split("-");
      if (subParts.length > 2) {
        return subParts.slice(2).join("-");
      }
    }
    return name || `Evidence_${idx + 1}`;
  } catch {
    return `Evidence_${idx + 1}`;
  }
}

export default async function ReviewerCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Session & Access Control Verification
  const session = await getSession();
  if (!session) {
    redirect(`/staff/login?redirect=/reviewer/case/${encodeURIComponent(id)}`);
  }

  // 2. Role Authorization Check (Reviewer & Admin only)
  if (session.role !== "reviewer" && session.role !== "administrator") {
    return (
      <div style={theme.page}>
        <GlobalHeader />
        <main style={{ ...theme.main, textAlign: "center", padding: "4rem 1rem" }}>
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: "16px", padding: "2.5rem", maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🚫</div>
            <h1 style={{ color: "#ef4444", fontSize: "1.5rem", fontWeight: 900, margin: "0 0 0.5rem" }}>
              Access Denied
            </h1>
            <p style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Your account <strong>({session.username})</strong> with role <strong>{session.role}</strong> does not have permission to view confidential reviewer triage pages.
            </p>
            <Link href="/staff/login" style={theme.secondaryBtn}>
              🚪 Switch Authorized Account
            </Link>
          </div>
        </main>
        <GlobalFooter />
      </div>
    );
  }

  // 3. Database Case Retrieval with Fallback Try/Catch
  let complaint = null;
  try {
    complaint = await db.complaints.getById(id);
  } catch (err) {
    console.error("[Reviewer DB Error] Failed to retrieve case:", err);
  }

  // 4. Handle Missing or Invalid Case ID
  if (!complaint) {
    return (
      <div style={theme.page}>
        <GlobalHeader />
        <main style={{ ...theme.main, textAlign: "center", padding: "4rem 1rem" }}>
          <div style={{ background: "rgba(13,33,55,0.7)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: "16px", padding: "3rem", maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🔍</div>
            <h1 style={{ color: "#f8fafc", fontSize: "1.5rem", fontWeight: 900, margin: "0 0 0.5rem" }}>
              Case Not Found
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "0 0 1.5rem" }}>
              No live complaint or triage record was found matching identifier: <code style={{ color: "#38bdf8", fontFamily: "monospace" }}>{id}</code>
            </p>
            <Link href="/reviewer/cases" style={theme.inspectBtn}>
              ← Return to Reviewer Queue
            </Link>
          </div>
        </main>
        <GlobalFooter />
      </div>
    );
  }

  const ai = complaint.aiAnalysis;
  const isEmergency = ai?.urgency === "Emergency" || ai?.urgency === "Critical" || ai?.urgency === "High" || ai?.safetyEscalationRequired;
  const mediaList: string[] = complaint.mediaUrls || [];

  return (
    <div style={theme.page}>
      <GlobalHeader />

      <main style={theme.main}>
        {/* Navigation & Status Header */}
        <div style={{ marginBottom: "1.5rem" }}>
          <Link href="/reviewer/cases" style={theme.backLink}>
            ← Back to Reviewer Triage Queue
          </Link>
        </div>

        {complaint.isSample && (
          <div style={theme.sampleBanner}>
            🟣 SAMPLE PRESENTATION RECORD — Demonstration data for system workflow testing.
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {/* Top Title Card */}
          <div style={theme.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#38bdf8", fontFamily: "monospace" }}>
                    {complaint.id}
                  </span>
                  <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "9999px", background: "rgba(56,189,248,0.15)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.3)", fontWeight: 700 }}>
                    {complaint.status}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    Submitted: {complaint.createdAt ? new Date(complaint.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Date Not Available"}
                  </span>
                </div>

                <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#ffffff", margin: "0 0 0.5rem", lineHeight: 1.3 }}>
                  {ai?.title ?? (complaint.description ? complaint.description.slice(0, 75) + "..." : "Grievance Report")}
                </h1>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                  📍 Mandal: <strong style={{ color: "#f8fafc" }}>{complaint.mandal || "Not Specified"}</strong> · Village/Ward: <strong style={{ color: "#f8fafc" }}>{complaint.village || "Not Specified"}</strong>
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tracking Token</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#facc15", fontFamily: "monospace" }}>{complaint.trackingToken}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
            {/* Left Column: Description, Evidence List, Contact, Audit Log */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Original Description */}
              <div style={theme.card}>
                <h3 style={theme.cardTitle}>Original Citizen Statement</h3>
                <div style={{ background: "rgba(4,9,26,0.6)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", color: "#f1f5f9", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {complaint.description || "No description provided."}
                </div>
              </div>

              {/* Evidence List Component */}
              <div style={theme.card}>
                <h3 style={theme.cardTitle}>Attached Evidence Files ({mediaList.length})</h3>
                {mediaList.length === 0 ? (
                  <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0, fontStyle: "italic" }}>
                    No media or evidence files were attached to this submission.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {mediaList.map((url: string, idx: number) => {
                      const isImage = url.match(/\.(jpeg|jpg|png|webp|gif)/i);
                      const isVideo = url.match(/\.(mp4|webm|mov|avi|3gp|mkv)/i);
                      const isAudio = url.match(/\.(mp3|wav|ogg|m4a)/i);
                      const displayName = formatFileName(url, idx);

                      return (
                        <div
                          key={idx}
                          style={{
                            background: "rgba(4,9,26,0.7)",
                            padding: "0.875rem",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginBottom: isVideo || isImage || isAudio ? "8px" : "0" }}>
                            <span style={{ color: "#f8fafc", fontSize: "0.82rem", fontWeight: 700 }}>
                              {isImage ? "🖼️ Image" : isVideo ? "🎥 Video" : isAudio ? "🎵 Audio" : "📄 Document"}: {displayName}
                            </span>
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#fbbf24", textDecoration: "none", fontWeight: "bold", fontSize: "0.78rem" }}
                            >
                              Download / Open File &rarr;
                            </a>
                          </div>

                          {isVideo && (
                            <video controls style={{ width: "100%", maxHeight: "240px", borderRadius: "6px", backgroundColor: "#000", marginTop: "4px" }}>
                              <source src={url} />
                              Your browser does not support HTML5 video streaming.
                            </video>
                          )}

                          {isImage && (
                            <img src={url} alt="Evidence" style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "6px", objectFit: "contain", marginTop: "4px" }} />
                          )}

                          {isAudio && (
                            <audio controls style={{ width: "100%", marginTop: "4px" }}>
                              <source src={url} />
                            </audio>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Citizen Contact & Privacy Protection */}
              <div style={theme.card}>
                <h3 style={theme.cardTitle}>Citizen Contact & Privacy Status</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.85rem" }}>
                  <div>
                    <span style={{ color: "#64748b" }}>Contact Number: </span>
                    <strong style={{ color: "#38bdf8" }}>
                      {complaint.mobileNumberMasked ?? (complaint.mobileNumber ? `+91 ${complaint.mobileNumber}` : (complaint.isAnonymous ? "Anonymous Submission" : "Not Provided"))}
                    </strong>
                    {complaint.mobileNumberMasked && (
                      <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "2px" }}>
                        🔒 Masked for privacy protection.
                      </div>
                    )}
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>SMS Notification Consent: </span>
                    <strong style={{ color: complaint.consentGiven ? "#34d399" : "#f87171" }}>
                      {complaint.consentGiven ? "Yes (Transactional Notices Only)" : "No Consent Given"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Internal Reviewer Notes */}
              <div style={theme.card}>
                <h3 style={theme.cardTitle}>Internal Confidential Reviewer Notes</h3>
                {complaint.internalNotes && complaint.internalNotes.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {complaint.internalNotes.map((note, idx) => (
                      <div key={idx} style={{ background: "rgba(234,179,8,0.05)", borderLeft: "3px solid #eab308", padding: "0.75rem", borderRadius: "6px", fontSize: "0.85rem", color: "#fef08a" }}>
                        {note}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0, fontStyle: "italic" }}>
                    No internal reviewer notes attached yet. Use the triage action panel to record confidential notes.
                  </p>
                )}
              </div>

              {/* Audit Timeline */}
              <div style={theme.card}>
                <h3 style={theme.cardTitle}>Audit & Lifecycle Timeline</h3>
                {complaint.auditLog && complaint.auditLog.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                    {complaint.auditLog.map((entry, idx) => {
                      const cleanAction = (entry.action || "").split("?")[0];
                      return (
                        <div key={idx} style={{ borderLeft: "2px solid #38bdf8", paddingLeft: "1rem", position: "relative", overflow: "hidden" }}>
                          <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                            {entry.timestamp ? new Date(entry.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Timestamp Not Available"} · <strong style={{ color: "#94a3b8" }}>{entry.actor || "System"}</strong>
                          </div>
                          <div style={{ fontSize: "0.875rem", color: "#f8fafc", fontWeight: 600, marginTop: "2px", wordBreak: "break-word", overflowWrap: "anywhere" }}>
                            {cleanAction}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0, fontStyle: "italic" }}>
                    No audit history recorded yet.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: AI Assessment & Action Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* AI Assessment Card */}
              <div style={{ ...theme.card, border: "1px solid rgba(56,189,248,0.3)" }}>
                <h3 style={{ ...theme.cardTitle, color: "#38bdf8" }}>AI Safety Assessment</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
                  <div>
                    <span style={{ color: "#64748b" }}>Category: </span>
                    <strong style={{ color: "#f8fafc" }}>{ai?.category ?? "General Civic"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Suggested Department: </span>
                    <strong style={{ color: "#38bdf8" }}>{ai?.department ?? "To Be Assigned"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Urgency Level: </span>
                    <strong style={{ color: isEmergency ? "#f87171" : "#facc15" }}>
                      {ai?.urgency ?? "Routine"}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Credibility Band: </span>
                    <span style={{ color: "#cbd5e1" }}>{ai?.credibilityBand ?? "Medium Credibility"}</span>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Evidence Completeness: </span>
                    <span style={{ color: "#cbd5e1" }}>{ai?.evidenceCompleteness ?? "Sufficient"}</span>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Human-Review Requirement: </span>
                    <strong style={{ color: ai?.humanReviewRequired ? "#facc15" : "#34d399" }}>
                      {ai?.humanReviewRequired ? "Yes (Required)" : "Routine Processing"}
                    </strong>
                  </div>
                </div>

                {ai?.recommendedAction && (
                  <div style={{ marginTop: "1rem", background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: "8px", padding: "0.75rem" }}>
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#38bdf8", textTransform: "uppercase" }}>Recommended Action</div>
                    <div style={{ fontSize: "0.82rem", color: "#e2e8f0", marginTop: "4px" }}>{ai.recommendedAction}</div>
                  </div>
                )}

                {ai?.legalDisclaimer && (
                  <div style={{ marginTop: "1rem", fontSize: "0.72rem", color: "#64748b", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.75rem", lineHeight: 1.4 }}>
                    ℹ {ai.legalDisclaimer}
                  </div>
                )}
              </div>

              {/* Case Reviewer Triage Action Form (Client Component) */}
              <div style={{ ...theme.card, border: "1px solid rgba(234,179,8,0.3)" }}>
                <h3 style={{ ...theme.cardTitle, color: "#facc15" }}>Reviewer Triage Actions</h3>
                <ReviewerActionForm
                  complaintId={complaint.id}
                  currentStatus={complaint.status}
                  currentDept={complaint.assignedDepartment || complaint.department || ai?.department || ""}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}

const theme = {
  page: { minHeight: "100vh", background: "#04091A", color: "#f8fafc", display: "flex", flexDirection: "column" as const },
  main: { flex: 1, maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "2rem 1rem" },
  backLink: { color: "#38bdf8", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700 },
  card: { background: "rgba(13,33,55,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1.25rem" },
  cardTitle: { fontSize: "1rem", fontWeight: 800, color: "#ffffff", margin: "0 0 1rem", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.5rem" },
  sampleBanner: { background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc", padding: "0.75rem 1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", marginBottom: "1rem" },
  secondaryBtn: { padding: "0.5rem 1rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#f0f4f8", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none" },
  inspectBtn: { padding: "0.5rem 1rem", borderRadius: "8px", background: "linear-gradient(135deg, #0284c7, #38bdf8)", color: "#04091A", fontSize: "0.85rem", fontWeight: 800, textDecoration: "none", display: "inline-block" },
};
