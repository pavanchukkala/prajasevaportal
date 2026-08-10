import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `Reviewer Triage: Case ${id} — Srikalahasti Praja Seva`,
  };
}

export default async function ReviewerCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || (session.role !== "reviewer" && session.role !== "administrator")) {
    redirect("/staff/login");
  }

  const { id } = await params;
  const complaint = await db.complaints.getById(id);

  if (!complaint) {
    return (
      <div style={theme.page}>
        <GlobalHeader />
        <main style={{ ...theme.main, textAlign: "center", padding: "4rem 1rem" }}>
          <h1 style={{ color: "#ef4444" }}>Complaint Not Found</h1>
          <p style={{ color: "#94a3b8" }}>No record found matching identifier: {id}</p>
          <Link href="/reviewer/cases" style={theme.secondaryBtn}>
            ← Back to Reviewer Queue
          </Link>
        </main>
        <GlobalFooter />
      </div>
    );
  }

  const ai = complaint.aiAnalysis;

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
                    Submitted: {new Date(complaint.createdAt).toLocaleString()}
                  </span>
                </div>

                <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#ffffff", margin: "0 0 0.5rem", lineHeight: 1.3 }}>
                  {ai?.title ?? "Grievance Report"}
                </h1>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                  📍 Mandal: <strong style={{ color: "#f8fafc" }}>{complaint.mandal}</strong> · Village/Ward: <strong style={{ color: "#f8fafc" }}>{complaint.village || "Not Specified"}</strong>
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tracking Token</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#facc15", fontFamily: "monospace" }}>{complaint.trackingToken}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
            {/* Left Column: Description, Contact, Audit Log */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Original Description */}
              <div style={theme.card}>
                <h3 style={theme.cardTitle}>Original Citizen Statement</h3>
                <div style={{ background: "rgba(4,9,26,0.6)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", color: "#f1f5f9", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {complaint.description}
                </div>
              </div>

              {/* Citizen Contact & Privacy Protection */}
              <div style={theme.card}>
                <h3 style={theme.cardTitle}>Citizen Contact & Privacy Status</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.85rem" }}>
                  <div>
                    <span style={{ color: "#64748b" }}>Contact Number: </span>
                    <strong style={{ color: "#38bdf8" }}>
                      {complaint.mobileNumberMasked ?? (complaint.isAnonymous ? "Anonymous Submission" : "Not Provided")}
                    </strong>
                    {complaint.mobileNumberMasked && (
                      <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "2px" }}>
                        🔒 Masked for privacy protection. Raw numbers never stored in client payloads.
                      </div>
                    )}
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>SMS Notification Consent: </span>
                    <strong style={{ color: complaint.consentGiven ? "#34d399" : "#f87171" }}>
                      {complaint.consentGiven ? "Yes (Transactional Status Notices Only)" : "No Consent Given"}
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
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {complaint.auditLog?.map((entry, idx) => (
                    <div key={idx} style={{ borderLeft: "2px solid #38bdf8", paddingLeft: "1rem", position: "relative" }}>
                      <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                        {new Date(entry.timestamp).toLocaleString()} · <strong style={{ color: "#94a3b8" }}>{entry.actor}</strong>
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#f8fafc", fontWeight: 600, marginTop: "2px" }}>
                        {entry.action}
                      </div>
                    </div>
                  ))}
                </div>
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
                    <strong style={{ color: ai?.urgency === "Emergency" || ai?.urgency === "High" ? "#f87171" : "#facc15" }}>
                      {ai?.urgency ?? "Routine"}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Credibility Band: </span>
                    <span style={{ color: "#cbd5e1" }}>{ai?.credibilityBand ?? "Medium"}</span>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Evidence Completeness: </span>
                    <span style={{ color: "#cbd5e1" }}>{ai?.evidenceCompleteness ?? "Sufficient"}</span>
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

              {/* Case Reviewer Triage Action Form */}
              <div style={{ ...theme.card, border: "1px solid rgba(234,179,8,0.3)" }}>
                <h3 style={{ ...theme.cardTitle, color: "#facc15" }}>Reviewer Triage Actions</h3>
                <ReviewerActionForm complaintId={complaint.id} currentStatus={complaint.status} currentDept={complaint.assignedDepartment || complaint.department || ai?.department || ""} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}

// Client action component
function ReviewerActionForm({ complaintId, currentStatus, currentDept }: { complaintId: string; currentStatus: string; currentDept: string }) {
  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const status = formData.get("status") as string;
        const assignedDepartment = formData.get("assignedDepartment") as string;
        const internalNote = formData.get("internalNote") as string;

        fetch(`/api/complaints/${complaintId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status,
            assignedDepartment,
            internalNote,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success || data.complaint) {
              alert("Case successfully updated.");
              window.location.reload();
            } else {
              alert("Failed to update case.");
            }
          })
          .catch(() => alert("Error updating case status."));
      }}
    >
      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.35rem" }}>Update Status</label>
        <select name="status" defaultValue={currentStatus} style={theme.input}>
          <option value="New">New</option>
          <option value="AI Processed">AI Processed</option>
          <option value="Under Review">Under Review</option>
          <option value="More Information Requested">More Information Requested</option>
          <option value="Assigned">Assigned to Department</option>
          <option value="Escalated">Escalated Priority</option>
          <option value="Action Reported">Action Reported</option>
          <option value="Resolved">Resolved</option>
          <option value="Reopened">Reopened</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.35rem" }}>Assign Department</label>
        <select name="assignedDepartment" defaultValue={currentDept || "Revenue"} style={theme.input}>
          <option value="Revenue">Revenue (MRO / Tahsildar)</option>
          <option value="Municipal Administration">Municipal Administration</option>
          <option value="Panchayat Raj">Panchayat Raj & Rural Dev</option>
          <option value="Roads & Buildings">Roads & Buildings (R&B)</option>
          <option value="AP Transco">AP Transco (Electricity)</option>
          <option value="Rural Water Supply">Rural Water Supply (RWS)</option>
          <option value="Police / Law & Order">Police / Law & Order</option>
          <option value="Women & Child Welfare">Women & Child Welfare</option>
          <option value="Irrigation">Irrigation Department</option>
        </select>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.35rem" }}>Internal Confidential Note</label>
        <textarea name="internalNote" rows={3} placeholder="Add confidential review comments..." style={{ ...theme.input, resize: "vertical" }} />
      </div>

      <button type="submit" style={theme.submitBtn}>
        Save Triage & Assign Department
      </button>
    </form>
  );
}

const theme = {
  page: { minHeight: "100vh", background: "#04091A", color: "#f8fafc", display: "flex", flexDirection: "column" as const },
  main: { flex: 1, maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "2rem 1rem" },
  backLink: { color: "#38bdf8", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700 },
  card: { background: "rgba(13,33,55,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1.25rem" },
  cardTitle: { fontSize: "1rem", fontWeight: 800, color: "#ffffff", margin: "0 0 1rem", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.5rem" },
  sampleBanner: { background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc", padding: "0.75rem 1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", marginBottom: "1rem" },
  input: { width: "100%", padding: "0.6rem 0.875rem", background: "rgba(4,9,26,0.8)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#f8fafc", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" as const },
  submitBtn: { width: "100%", padding: "0.75rem", background: "linear-gradient(135deg, #facc15, #eab308)", color: "#04091A", fontWeight: 800, fontSize: "0.9rem", border: "none", borderRadius: "8px", cursor: "pointer" },
  secondaryBtn: { padding: "0.5rem 1rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#f0f4f8", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none" },
};
