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
    title: `Department Field Action: Case ${id} — Srikalahasti Praja Seva`,
  };
}

export default async function DeptCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || (session.role !== "department_officer" && session.role !== "administrator")) {
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
          <Link href="/department/workspace" style={theme.secondaryBtn}>
            ← Back to Department Workspace
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
        <div style={{ marginBottom: "1.5rem" }}>
          <Link href="/department/workspace" style={theme.backLink}>
            ← Back to Department Workspace
          </Link>
        </div>

        {complaint.isSample && (
          <div style={theme.sampleBanner}>
            🟣 SAMPLE PRESENTATION RECORD — Demonstration data for system workflow testing.
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {/* Header Card */}
          <div style={theme.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#34d399", fontFamily: "monospace" }}>
                    {complaint.id}
                  </span>
                  <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "9999px", background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.3)", fontWeight: 700 }}>
                    {complaint.status}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    Assigned Dept: <strong style={{ color: "#f8fafc" }}>{complaint.assignedDepartment || complaint.department || ai?.department || "Unassigned"}</strong>
                  </span>
                </div>

                <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "#ffffff", margin: "0 0 0.5rem", lineHeight: 1.3 }}>
                  {ai?.title ?? "Field Grievance Action Task"}
                </h1>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>
                  📍 Mandal: <strong style={{ color: "#f8fafc" }}>{complaint.mandal}</strong> · Village: <strong style={{ color: "#f8fafc" }}>{complaint.village || "N/A"}</strong>
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase" }}>Tracking Code</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#facc15", fontFamily: "monospace" }}>{complaint.trackingToken}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
            {/* Left Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={theme.card}>
                <h3 style={theme.cardTitle}>Citizen Complaint Description</h3>
                <div style={{ background: "rgba(4,9,26,0.6)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", color: "#f1f5f9", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {complaint.description}
                </div>
              </div>

              <div style={theme.card}>
                <h3 style={theme.cardTitle}>Contact Details & Consent Status</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.85rem" }}>
                  <div>
                    <span style={{ color: "#64748b" }}>Contact: </span>
                    <strong style={{ color: "#34d399" }}>
                      {complaint.mobileNumberMasked ?? (complaint.isAnonymous ? "Anonymous Submission" : "Not Provided")}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Status Notice Consent: </span>
                    <strong style={{ color: complaint.consentGiven ? "#34d399" : "#f87171" }}>
                      {complaint.consentGiven ? "Granted" : "Not Granted"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Existing Internal Notes */}
              <div style={theme.card}>
                <h3 style={theme.cardTitle}>Department Action & Resolution Log</h3>
                {complaint.internalNotes && complaint.internalNotes.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {complaint.internalNotes.map((note, idx) => (
                      <div key={idx} style={{ background: "rgba(16,185,129,0.05)", borderLeft: "3px solid #10b981", padding: "0.75rem", borderRadius: "6px", fontSize: "0.85rem", color: "#a7f3d0" }}>
                        {note}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#64748b", fontSize: "0.85rem", margin: 0, fontStyle: "italic" }}>
                    No field resolution notes logged yet. Use the field action panel to report resolution progress.
                  </p>
                )}
              </div>

              {/* Audit Timeline */}
              <div style={theme.card}>
                <h3 style={theme.cardTitle}>System Action Timeline</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  {complaint.auditLog?.map((entry, idx) => (
                    <div key={idx} style={{ borderLeft: "2px solid #10b981", paddingLeft: "1rem" }}>
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

            {/* Right Column: Field Action Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ ...theme.card, border: "1px solid rgba(16,185,129,0.3)" }}>
                <h3 style={{ ...theme.cardTitle, color: "#34d399" }}>Field Officer Action Panel</h3>
                <DeptActionForm complaintId={complaint.id} currentStatus={complaint.status} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <GlobalFooter />
    </div>
  );
}

function DeptActionForm({ complaintId, currentStatus }: { complaintId: string; currentStatus: string }) {
  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      action={async (formData: FormData) => {
        "use server";
        const status = formData.get("status") as string;
        const internalNote = formData.get("internalNote") as string;

        await db.complaints.updateStatus(complaintId, {
          status: status as any,
          internalNote,
          actor: "dept_officer",
        });

        redirect(`/department/case/${complaintId}`);
      }}
    >
      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.35rem" }}>Update Field Progress</label>
        <select name="status" defaultValue={currentStatus} style={theme.input}>
          <option value="Under Review">Under Review (Field Inspection Planned)</option>
          <option value="More Information Requested">More Information Requested from Citizen</option>
          <option value="Assigned">Assigned to Field Team</option>
          <option value="Action Reported">Action Reported (Work Order Issued / Work In Progress)</option>
          <option value="Escalated">Escalated to Higher Authority</option>
          <option value="Resolved">Resolved (Work Completed)</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.35rem" }}>Resolution / Action Report Note</label>
        <textarea name="internalNote" rows={4} placeholder="Describe field inspection, work order number, or resolution proof..." style={{ ...theme.input, resize: "vertical" }} required />
      </div>

      <button type="submit" style={theme.submitBtn}>
        Submit Department Action & Update Status
      </button>
    </form>
  );
}

const theme = {
  page: { minHeight: "100vh", background: "#04091A", color: "#f8fafc", display: "flex", flexDirection: "column" as const },
  main: { flex: 1, maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "2rem 1rem" },
  backLink: { color: "#34d399", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700 },
  card: { background: "rgba(13,33,55,0.7)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1.25rem" },
  cardTitle: { fontSize: "1rem", fontWeight: 800, color: "#ffffff", margin: "0 0 1rem", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "0.5rem" },
  sampleBanner: { background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#c084fc", padding: "0.75rem 1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", marginBottom: "1rem" },
  input: { width: "100%", padding: "0.6rem 0.875rem", background: "rgba(4,9,26,0.8)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", color: "#f8fafc", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" as const },
  submitBtn: { width: "100%", padding: "0.75rem", background: "linear-gradient(135deg, #059669, #10b981)", color: "#ffffff", fontWeight: 800, fontSize: "0.9rem", border: "none", borderRadius: "8px", cursor: "pointer" },
  secondaryBtn: { padding: "0.5rem 1rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)", color: "#f0f4f8", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none" },
};
