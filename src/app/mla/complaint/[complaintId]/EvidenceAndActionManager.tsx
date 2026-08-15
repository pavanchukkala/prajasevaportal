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

  async function updateStageAction(newStatus: string, notePrefix?: string) {
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
          internalNote: notePrefix ? `${notePrefix}: ${newStatus}` : `Stage updated to ${newStatus}`,
        }),
      });
      const data = await res.json();
      if (res.ok && (data.success || data.id)) {
        setStatus(newStatus);
        setFeedback({
          text: `✓ Case stage updated to "${newStatus}". Reflected in public tracking and Action Dashboard.`,
          type: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setFeedback({ text: data.error || "Failed to update case stage.", type: "error" });
      }
    } catch {
      setFeedback({ text: "Error updating case stage.", type: "error" });
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
        setFeedback({ text: "✓ Action saved successfully. Reflected in tracking.", type: "success" });
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
      {/* Evidence Files Section & Deletion Controls */}
      <div style={{ backgroundColor: "rgba(15,23,42,0.8)", padding: "16px", borderRadius: "10px", border: "1px solid #38bdf8", marginBottom: "20px" }}>
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
              // Strip query params before extension detection (handles signed URLs like ?expires=...&sig=...)
              const urlBase = url.split("?")[0];
              const isImage = /\.(jpeg|jpg|png|webp|gif)$/i.test(urlBase);
              const isVideo = /\.(mp4|webm|mov|avi|3gp|mkv)$/i.test(urlBase);
              const isAudio = /\.(mp3|wav|ogg|m4a)$/i.test(urlBase);

              let filename = urlBase.split("/").pop() || `File #${i + 1}`;
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
                        style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#f87171", border: "1px solid #ef4444", borderRadius: "4px", padding: "4px 10px", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}
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

      {/* Expanded Action Panel Controls */}
      <div style={{ backgroundColor: "#1e293b", borderRadius: "10px", padding: "22px", border: "1px solid #fbbf24", marginTop: "24px" }}>
        <h2 style={{ fontSize: "18px", color: "#fbbf24", margin: "0 0 14px", borderBottom: "1px solid #334155", paddingBottom: "10px", fontWeight: 800 }}>
          ⚡ Executive Stage Actions & Resolution Workflow
        </h2>

        {feedback && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              marginBottom: "14px",
              fontSize: "0.85rem",
              fontWeight: 800,
              background: feedback.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
              border: feedback.type === "success" ? "1px solid #10b981" : "1px solid #ef4444",
              color: feedback.type === "success" ? "#34d399" : "#f87171",
            }}
          >
            {feedback.text}
          </div>
        )}

        {/* EXPANDED STAGE ACTION BUTTONS */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "10px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Direct Action Stage Controls (Updates Public Tracking & Action Dashboard)
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
            {/* 1. Mark Viewed */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateStageAction("Viewed", "Marked as Viewed by Staff")}
              style={{
                backgroundColor: status === "Viewed" ? "#2563eb" : "rgba(37,99,235,0.15)",
                color: status === "Viewed" ? "#ffffff" : "#60a5fa",
                border: "1px solid #2563eb",
                padding: "10px 8px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "12px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              👁️ Mark Viewed
            </button>

            {/* 2. Contacted - More Details Requested */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateStageAction("More Information Requested", "Contacted Citizen for Details")}
              style={{
                backgroundColor: status === "More Information Requested" ? "#d97706" : "rgba(217,119,6,0.15)",
                color: status === "More Information Requested" ? "#ffffff" : "#fbbf24",
                border: "1px solid #d97706",
                padding: "10px 8px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "12px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              📞 Contacted (More Details)
            </button>

            {/* 3. Contacted - No Response */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateStageAction("Contacted (No Response)", "Contacted Citizen - No Answer")}
              style={{
                backgroundColor: status === "Contacted (No Response)" ? "#ea580c" : "rgba(234,88,12,0.15)",
                color: status === "Contacted (No Response)" ? "#ffffff" : "#fb923c",
                border: "1px solid #ea580c",
                padding: "10px 8px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "12px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              📵 Contacted (No Response)
            </button>

            {/* 4. Assign Department */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateStageAction("Assigned", `Assigned to ${getDepartmentLabel(assignedDepartment)}`)}
              style={{
                backgroundColor: status === "Assigned" ? "#0284c7" : "rgba(2,132,199,0.15)",
                color: status === "Assigned" ? "#ffffff" : "#38bdf8",
                border: "1px solid #0284c7",
                padding: "10px 8px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "12px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              🏢 Assign Department
            </button>

            {/* 5. Escalate Case */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateStageAction("Escalated", "Escalated for Priority Review")}
              style={{
                backgroundColor: status === "Escalated" ? "#dc2626" : "rgba(220,38,38,0.15)",
                color: status === "Escalated" ? "#ffffff" : "#f87171",
                border: "1px solid #dc2626",
                padding: "10px 8px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "12px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              🚨 Escalate Case
            </button>

            {/* 6. Field Action Reported */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateStageAction("Action Reported", "Field Action Report Filed")}
              style={{
                backgroundColor: status === "Action Reported" ? "#7c3aed" : "rgba(124,58,237,0.15)",
                color: status === "Action Reported" ? "#ffffff" : "#c084fc",
                border: "1px solid #7c3aed",
                padding: "10px 8px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "12px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              ⚙️ Field Action Reported
            </button>

            {/* 7. Mark Solved (Moves to Solved Cases List) */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateStageAction("Solved", "Case Solved & Verified")}
              style={{
                backgroundColor: status === "Solved" ? "#059669" : "rgba(5,150,105,0.2)",
                color: status === "Solved" ? "#ffffff" : "#34d399",
                border: "1.5px solid #059669",
                padding: "10px 8px",
                borderRadius: "8px",
                fontWeight: 900,
                fontSize: "12px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                gridColumn: "span 1",
              }}
            >
              ✅ Mark Solved (Move to Solved)
            </button>

            {/* 8. Close Case */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => updateStageAction("Closed", "Case Closed")}
              style={{
                backgroundColor: status === "Closed" ? "#475569" : "rgba(71,85,105,0.2)",
                color: status === "Closed" ? "#ffffff" : "#94a3b8",
                border: "1px solid #475569",
                padding: "10px 8px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "12px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              🔒 Close Case
            </button>
          </div>
        </div>

        {/* Detailed Status & Department Assignment Form */}
        <form style={{ display: "flex", flexDirection: "column", gap: "14px" }} onSubmit={handleDetailedUpdate}>
          <div>
            <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Detailed Stage Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc", borderRadius: "6px" }}
            >
              <option value="New">New</option>
              <option value="AI Processed">AI Processed</option>
              <option value="Viewed">👁️ Viewed</option>
              <option value="More Information Requested">📞 More Information Requested</option>
              <option value="Contacted (No Response)">📵 Contacted (No Response)</option>
              <option value="Under Review">Under Review</option>
              <option value="Assigned">🏢 Assigned</option>
              <option value="Escalated">🚨 Escalated</option>
              <option value="Action Reported">⚙️ Action Reported</option>
              <option value="Solved">✅ Solved (Moves to Solved Cases List)</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">🔒 Closed</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Target Department</label>
            <select
              value={assignedDepartment}
              onChange={(e) => setAssignedDepartment(e.target.value)}
              style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc", borderRadius: "6px" }}
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
              style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc", borderRadius: "6px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Internal Action & Resolution Notes (Appends)</label>
            <textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              rows={3}
              placeholder="Describe action taken, constituent phone conversation notes, or resolution status..."
              style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc", borderRadius: "6px", resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{ width: "100%", padding: "12px", backgroundColor: isSubmitting ? "#d97706" : "#fbbf24", color: "#0f172a", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: isSubmitting ? "not-allowed" : "pointer", fontSize: "15px" }}
          >
            {isSubmitting ? "Saving Case Updates..." : "Save Case Updates"}
          </button>
        </form>
      </div>
    </div>
  );
}
