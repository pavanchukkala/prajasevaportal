"use client";

import React, { useState, FormEvent } from "react";
import { CANONICAL_DEPARTMENTS } from "@/lib/departments";

interface DeptActionFormProps {
  complaintId: string;
  currentStatus: string;
}

export default function DeptActionForm({ complaintId, currentStatus }: DeptActionFormProps) {
  const [status, setStatus] = useState(currentStatus || "Assigned");
  const [assignedDepartment, setAssignedDepartment] = useState("revenue");
  const [internalNote, setInternalNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          assignedDepartment,
          internalNote: internalNote.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: `✓ Action logged successfully! Case status: "${data.status}".`, type: "success" });
        setInternalNote("");
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setMessage({ text: data.error || "Failed to update case status.", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "Network error logging department action.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {message && (
        <div
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            fontSize: "0.82rem",
            fontWeight: 700,
            background: message.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
            border: message.type === "success" ? "1px solid #10b981" : "1px solid #ef4444",
            color: message.type === "success" ? "#34d399" : "#f87171",
          }}
        >
          {message.text}
        </div>
      )}

      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.35rem" }}>
          Target Department
        </label>
        <select
          value={assignedDepartment}
          onChange={(e) => setAssignedDepartment(e.target.value)}
          style={inputStyle}
        >
          {CANONICAL_DEPARTMENTS.map((d) => (
            <option key={d.key} value={d.key}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.35rem" }}>
          Update Field Progress & Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={inputStyle}
        >
          <option value="Under Review">Under Review (Field Inspection Planned)</option>
          <option value="More Information Requested">More Information Requested from Citizen</option>
          <option value="Assigned">Assigned to Field Team</option>
          <option value="Action Reported">Action Reported (Work Order Issued / Work In Progress)</option>
          <option value="Escalated">Escalated to Higher Authority</option>
          <option value="Solved">Solved (Field Resolution Completed)</option>
          <option value="Resolved">Resolved (Officially Closed)</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div>
        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.35rem" }}>
          Field Action & Resolution Notes *
        </label>
        <textarea
          rows={4}
          value={internalNote}
          onChange={(e) => setInternalNote(e.target.value)}
          placeholder="Enter work order ID, field inspection findings, or resolution report..."
          required
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: "100%",
          padding: "0.75rem",
          background: submitting ? "rgba(16,185,129,0.5)" : "linear-gradient(135deg, #059669, #10b981)",
          color: "#ffffff",
          fontWeight: 800,
          fontSize: "0.9rem",
          border: "none",
          borderRadius: "8px",
          cursor: submitting ? "not-allowed" : "pointer",
        }}
      >
        {submitting ? "Saving Action Report..." : "Submit Department Action & Update Status"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.65rem 0.875rem",
  background: "rgba(4,9,26,0.8)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "8px",
  color: "#f8fafc",
  fontSize: "0.85rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
};
