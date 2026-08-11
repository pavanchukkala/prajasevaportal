"use client";

import React, { useState, FormEvent } from "react";
import { CANONICAL_DEPARTMENTS, getDepartmentLabel } from "@/lib/departments";

interface Props {
  complaintId: string;
  initialMediaUrls: string[];
  currentStatus: string;
  currentDept?: string;
  currentNotes?: string | string[];
}

export function EvidenceAndActionManager({
  complaintId,
  initialMediaUrls,
  currentStatus: initStatus,
  currentDept = "",
  currentNotes = "",
}: Props) {
  const [mediaUrls, setMediaUrls] = useState<string[]>(initialMediaUrls);
  const [status, setStatus] = useState<string>(initStatus);
  const [assignedDepartment, setAssignedDepartment] = useState<string>(currentDept || "revenue");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [internalNote, setInternalNote] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  async function updateQuickStatus(newStatus: string) {
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          assignedDepartment,
          assignedTo,
          internalNote: `Quick Action: Status updated to ${newStatus}`,
        }),
      });
      const data = await res.json();
      if (res.ok && (data.success || data.id)) {
        setStatus(newStatus);
        setFeedback({ text: `✓ Status updated to "${newStatus}". Reflected in tracking.`, type: "success" });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setFeedback({ text: data.error || "Failed to update status.", type: "error" });
      }
    } catch {
      setFeedback({ text: "Error updating status.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDetailedUpdate(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/complaints/${complaintId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          assignedDepartment,
          assignedTo,
          internalNote: internalNote.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && (data.success || data.id)) {
        setFeedback({ text: "✓ Executive status & case updates saved successfully. Reflected in public tracking.", type: "success" });
        setInternalNote("");
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setFeedback({ text: data.error || "Failed to update case.", type: "error" });
      }
    } catch {
      setFeedback({ text: "Network error saving case updates.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteEvidence(url: string) {
    let filename = url.split("?")[0].split("/").pop() || "";
    try {
      filename = decodeURIComponent(filename);
    } catch {}

    if (!window.confirm(`Are you sure you want to permanently delete evidence file "${filename}"?`)) {
      return;
    }

    setIsDeleting(filename);
    try {
      const res = await fetch(`/api/evidence/${complaintId}/${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok || data.success) {
        setMediaUrls((prev) => prev.filter((item) => item !== url));
        alert(`Evidence file "${filename}" permanently deleted.`);
      } else {
        alert(data.error || "Failed to delete file.");
      }
    } catch {
      alert("Error deleting evidence file.");
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <div>
      {/* Evidence Files Section */}
      <div style={{ backgroundColor: "rgba(15,23,42,0.8)", padding: "16px", borderRadius: "8px", border: "1px solid #38bdf8", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "14px", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, fontWeight: 800 }}>
            🎥 Attached Evidence Files ({mediaUrls.length})
          </h3>
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>HTTP Range Streaming Enabled</span>
        </div>

        {mediaUrls.length === 0 ? (
          <p style={{ color: "#94a3b8", fontStyle: "italic", margin: 0 }}>No evidence files currently attached to this case.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
            {mediaUrls.map((url: string, i: number) => {
              const isImage = url.match(/\.(jpeg|jpg|png|webp|gif)$/i);
              const isVideo = url.match(/\.(mp4|webm|mov|avi|3gp|mkv)$/i);
              const isAudio = url.match(/\.(mp3|wav|ogg|m4a)$/i);

              let filename = url.split("?")[0].split("/").pop() || `File #${i + 1}`;
              try {
                filename = decodeURIComponent(filename);
              } catch {}

              return (
                <div key={i} style={{ backgroundColor: "#1e293b", borderRadius: "8px", padding: "14px", border: "1px solid #334155" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: "bold", color: "#f8fafc", fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
                      📎 {filename}
                    </span>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <a href={url} target="_blank" rel="noreferrer" style={{ color: "#fbbf24", textDecoration: "none", fontSize: "12px", fontWeight: "bold" }}>
                        Open File ↗
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvidence(url)}
                        disabled={isDeleting === filename}
                        style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid #ef4444", borderRadius: "4px", padding: "3px 8px", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                      >
                        {isDeleting === filename ? "Deleting..." : "🗑️ Delete Evidence"}
                      </button>
                    </div>
                  </div>

                  {isImage && (
                    <img src={url} alt={`Evidence #${i + 1}`} style={{ maxWidth: "100%", maxHeight: "360px", borderRadius: "6px", border: "1px solid #334155", display: "block" }} />
                  )}

                  {isVideo && (
                    <div style={{ backgroundColor: "#000000", borderRadius: "6px", overflow: "hidden", border: "1px solid #334155" }}>
                      <video controls preload="metadata" style={{ width: "100%", maxHeight: "380px" }}>
                        <source src={url} />
                        Your browser does not support HTML5 video playback.
                      </video>
                    </div>
                  )}

                  {isAudio && (
                    <audio controls style={{ width: "100%" }}>
                      <source src={url} />
                    </audio>
                  )}

                  {!isImage && !isVideo && !isAudio && (
                    <div style={{ padding: "8px", background: "#0f172a", borderRadius: "4px", fontSize: "12px", color: "#94a3b8" }}>
                      Document / Binary Evidence File. Click "Open File" above to inspect.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Panel Controls */}
      <div style={{ backgroundColor: "#1e293b", borderRadius: "8px", padding: "20px", border: "1px solid #fbbf24", marginTop: "24px" }}>
        <h2 style={{ fontSize: "18px", color: "#fbbf24", margin: "0 0 14px", borderBottom: "1px solid #334155", paddingBottom: "10px", fontWeight: 800 }}>
          ⚡ Executive Status Actions & Triage
        </h2>

        {feedback && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              marginBottom: "14px",
              fontSize: "0.85rem",
              fontWeight: 700,
              background: feedback.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
              border: feedback.type === "success" ? "1px solid #10b981" : "1px solid #ef4444",
              color: feedback.type === "success" ? "#34d399" : "#f87171",
            }}
          >
            {feedback.text}
          </div>
        )}

        {/* Quick Action Status Buttons */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "8px", fontWeight: 700, textTransform: "uppercase" }}>
            Quick Status Update
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateQuickStatus("Viewed")}
              style={{ backgroundColor: status === "Viewed" ? "#2563eb" : "#1e40af", color: "#ffffff", padding: "9px 6px", borderRadius: "6px", border: "none", fontWeight: 800, fontSize: "12px", cursor: isSubmitting ? "not-allowed" : "pointer" }}
            >
              👁️ Marked Viewed
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateQuickStatus("Contacted (No Response)")}
              style={{ backgroundColor: status === "Contacted (No Response)" ? "#d97706" : "#b45309", color: "#ffffff", padding: "9px 6px", borderRadius: "6px", border: "none", fontWeight: 800, fontSize: "12px", cursor: isSubmitting ? "not-allowed" : "pointer" }}
            >
              📞 Contacted (No Resp)
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateQuickStatus("Solved")}
              style={{ backgroundColor: status === "Solved" ? "#059669" : "#047857", color: "#ffffff", padding: "9px 6px", borderRadius: "6px", border: "none", fontWeight: 800, fontSize: "12px", cursor: isSubmitting ? "not-allowed" : "pointer" }}
            >
              ✅ Marked Solved
            </button>
          </div>
        </div>

        {/* Detailed Status & Assignment Form */}
        <form style={{ display: "flex", flexDirection: "column", gap: "14px" }} onSubmit={handleDetailedUpdate}>
          <div>
            <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Detailed Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc", borderRadius: "4px" }}
            >
              <option value="New">New</option>
              <option value="AI Processed">AI Processed</option>
              <option value="Viewed">👁️ Viewed</option>
              <option value="Contacted (No Response)">📞 Contacted (No Response)</option>
              <option value="Under Review">Under Review</option>
              <option value="More Information Requested">More Information Requested</option>
              <option value="Assigned">Assigned</option>
              <option value="Escalated">Escalated</option>
              <option value="Action Reported">Action Reported</option>
              <option value="Solved">✅ Solved</option>
              <option value="Resolved">Resolved</option>
              <option value="Reopened">Reopened</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Target Department</label>
            <select
              value={assignedDepartment}
              onChange={(e) => setAssignedDepartment(e.target.value)}
              style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc", borderRadius: "4px" }}
            >
              {CANONICAL_DEPARTMENTS.map((d) => (
                <option key={d.key} value={d.key}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Assign to Staff Reviewer / Officer</label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="e.g. Officer Name or ID (Optional)"
              style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc", borderRadius: "4px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Internal Action & Resolution Notes (Appends)</label>
            <textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              rows={3}
              placeholder="Describe action taken, field inspection details, or resolution status..."
              style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc", borderRadius: "4px", resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{ width: "100%", padding: "12px", backgroundColor: isSubmitting ? "#d97706" : "#fbbf24", color: "#0f172a", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: isSubmitting ? "not-allowed" : "pointer", fontSize: "15px" }}
          >
            {isSubmitting ? "Saving Case Updates..." : "Save Case Updates"}
          </button>
        </form>
      </div>
    </div>
  );
}
