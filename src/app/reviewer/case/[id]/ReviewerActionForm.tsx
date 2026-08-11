"use client";

import React, { useState } from "react";

interface ReviewerActionFormProps {
  complaintId: string;
  currentStatus: string;
  currentDept: string;
}

export default function ReviewerActionForm({
  complaintId,
  currentStatus,
  currentDept,
}: ReviewerActionFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const status = formData.get("status") as string;
    const assignedDepartment = formData.get("assignedDepartment") as string;
    const internalNote = formData.get("internalNote") as string;

    try {
      const res = await fetch(`/api/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          assignedDepartment,
          internalNote,
        }),
      });

      const data = await res.json();
      if (res.ok && (data.success || data.complaint)) {
        setFeedback({ type: "success", message: "Case triage updated successfully!" });
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to update case." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error updating case status." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={handleSubmit}>
      {feedback && (
        <div
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            fontSize: "0.82rem",
            fontWeight: 700,
            backgroundColor: feedback.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
            border: feedback.type === "success" ? "1px solid #10b981" : "1px solid #ef4444",
            color: feedback.type === "success" ? "#34d399" : "#f87171",
          }}
        >
          {feedback.message}
        </div>
      )}

      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.35rem" }}>
          Update Status
        </label>
        <select name="status" defaultValue={currentStatus} style={inputStyle}>
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
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.35rem" }}>
          Assign Department
        </label>
        <select name="assignedDepartment" defaultValue={currentDept || "Revenue"} style={inputStyle}>
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
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.35rem" }}>
          Internal Confidential Note
        </label>
        <textarea
          name="internalNote"
          rows={3}
          placeholder="Add confidential review comments..."
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <button type="submit" disabled={submitting} style={submitBtnStyle}>
        {submitting ? "Saving Triage..." : "Save Triage & Assign Department"}
      </button>
    </form>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.6rem 0.875rem",
  background: "rgba(4,9,26,0.8)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "8px",
  color: "#f8fafc",
  fontSize: "0.85rem",
  outline: "none",
  boxSizing: "border-box" as const,
};

const submitBtnStyle = {
  width: "100%",
  padding: "0.75rem",
  background: "linear-gradient(135deg, #facc15, #eab308)",
  color: "#04091A",
  fontWeight: 800,
  fontSize: "0.9rem",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};
