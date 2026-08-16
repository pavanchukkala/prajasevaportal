"use client";

import React, { useState, FormEvent } from "react";
import { CANONICAL_DEPARTMENTS, getDepartmentLabel } from "@/lib/departments";

interface AIAnalysis {
  department?: string;
  urgency?: string;
  actionBrief?: {
    assignTo: string;
    exactAction: string;
    deadline: string;
    draftSms: string;
  };
  spamScore?: number;
  sentimentTone?: string;
  distressFlag?: boolean;
  rootCauseTags?: { domain: string; category: string; subcategory: string };
  safetyEscalationRequired?: boolean;
}

interface Props {
  complaintId: string;
  initialMediaUrls: string[];
  currentStatus: string;
  currentDept?: string;
  currentNotes?: string | string[];
  aiAnalysis?: AIAnalysis;
}

export function EvidenceAndActionManager({
  complaintId,
  initialMediaUrls,
  currentStatus: initStatus,
  currentDept = "",
  currentNotes = "",
  aiAnalysis,
}: Props) {
  // Fix: default to AI's analyzed department, NOT "revenue"
  const aiDept = aiAnalysis?.department ?? "";
  const [mediaUrls, setMediaUrls] = useState<string[]>(initialMediaUrls);
  const [status, setStatus] = useState<string>(initStatus);
  const [assignedDepartment, setAssignedDepartment] = useState<string>(
    currentDept || aiDept || ""
  );
  const [assignedTo, setAssignedTo] = useState<string>(
    aiAnalysis?.actionBrief?.assignTo ?? ""
  );
  const [internalNote, setInternalNote] = useState<string>("");
  const [citizenMessage, setCitizenMessage] = useState<string>(
    aiAnalysis?.actionBrief?.draftSms ?? ""
  );
  const [aiAccepted, setAiAccepted] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const ab = aiAnalysis?.actionBrief;
  const isEmergency =
    aiAnalysis?.safetyEscalationRequired ||
    aiAnalysis?.urgency === "Emergency" ||
    aiAnalysis?.urgency === "Critical";

  function acceptAIRecommendation() {
    if (ab) {
      setAssignedTo(ab.assignTo);
      setCitizenMessage(ab.draftSms);
      setInternalNote(`AI Brief: ${ab.exactAction}`);
    }
    if (aiDept) setAssignedDepartment(aiDept);
    setStatus("Assigned");
    setAiAccepted(true);
    setShowManualForm(true);
    setFeedback({
      text: "✅ AI recommendation accepted. Review the pre-filled fields below and save.",
      type: "success",
    });
  }

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
          citizenMessage: citizenMessage.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && (data.success || data.id)) {
        setStatus(newStatus);
        setFeedback({
          text: `✓ Stage updated to "${newStatus}". Reflected in public tracking and Action Dashboard.`,
          type: "success",
        });
        setTimeout(() => window.location.reload(), 1000);
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
          citizenMessage: citizenMessage.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && (data.success || data.id)) {
        setFeedback({ text: "✓ Action saved. Reflected in citizen tracking.", type: "success" });
        setInternalNote("");
        setTimeout(() => window.location.reload(), 1200);
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
    try { filename = decodeURIComponent(filename); } catch {}
    if (!window.confirm(`Permanently delete evidence file "${filename}"?`)) return;
    setIsDeleting(filename);
    try {
      const res = await fetch(`/api/evidence/${complaintId}/${encodeURIComponent(filename)}`, { method: "DELETE" });
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
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── AI PRE-ACTION INTELLIGENCE PANEL ─────────────────────────────────── */}
      {ab && (
        <div
          style={{
            background: isEmergency
              ? "linear-gradient(135deg, rgba(220,38,38,0.12), rgba(239,68,68,0.06))"
              : "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(56,189,248,0.05))",
            border: isEmergency ? "2px solid rgba(239,68,68,0.5)" : "1.5px solid rgba(251,191,36,0.35)",
            borderRadius: "14px",
            padding: "20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Shimmer top bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: isEmergency
                ? "linear-gradient(90deg, #ef4444, #f97316, #ef4444)"
                : "linear-gradient(90deg, #fbbf24, #38bdf8, #fbbf24)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s linear infinite",
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                flexShrink: 0,
                boxShadow: "0 0 12px rgba(251,191,36,0.4)",
              }}
            >
              🤖
            </div>
            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#fbbf24",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                PSIP Intelligence Engine · AI-Recommended Action
              </div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>
                30B model · Auto-analysed from citizen complaint
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                background: "rgba(4,9,26,0.5)",
                borderRadius: "10px",
                padding: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                Assign To
              </div>
              <div style={{ fontSize: "13px", color: "#f1f5f9", fontWeight: 700 }}>{ab.assignTo}</div>
            </div>

            <div
              style={{
                background: "rgba(4,9,26,0.5)",
                borderRadius: "10px",
                padding: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                Deadline
              </div>
              <div style={{ fontSize: "13px", color: "#fbbf24", fontWeight: 800 }}>{ab.deadline}</div>
            </div>

            <div
              style={{
                background: "rgba(4,9,26,0.5)",
                borderRadius: "10px",
                padding: "12px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
                AI Department
              </div>
              <div style={{ fontSize: "13px", color: "#38bdf8", fontWeight: 700 }}>
                {getDepartmentLabel(aiDept) || aiDept || "AI Analyzing..."}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "rgba(4,9,26,0.5)",
              borderRadius: "10px",
              padding: "12px",
              border: "1px solid rgba(255,255,255,0.06)",
              marginBottom: "14px",
            }}
          >
            <div style={{ fontSize: "10px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
              Exact Action Directive
            </div>
            <div style={{ fontSize: "13px", color: "#e2e8f0", lineHeight: 1.5 }}>{ab.exactAction}</div>
          </div>

          <div
            style={{
              background: "rgba(56,189,248,0.06)",
              borderRadius: "10px",
              padding: "10px 12px",
              border: "1px solid rgba(56,189,248,0.2)",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "10px", color: "#38bdf8", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px" }}>
              📱 Draft Citizen Message (auto-generated)
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic", lineHeight: 1.5 }}>{ab.draftSms}</div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={acceptAIRecommendation}
              disabled={aiAccepted}
              style={{
                padding: "10px 20px",
                borderRadius: "9px",
                fontWeight: 800,
                fontSize: "13px",
                cursor: aiAccepted ? "default" : "pointer",
                border: "none",
                background: aiAccepted
                  ? "rgba(16,185,129,0.3)"
                  : "linear-gradient(135deg, #d97706, #fbbf24)",
                color: aiAccepted ? "#34d399" : "#04091A",
                boxShadow: aiAccepted ? "none" : "0 4px 15px rgba(251,191,36,0.3)",
                transition: "all 0.2s",
              }}
            >
              {aiAccepted ? "✅ AI Recommendation Applied" : "✅ Accept AI Recommendation"}
            </button>

            <button
              type="button"
              onClick={() => setShowManualForm((v) => !v)}
              style={{
                padding: "10px 20px",
                borderRadius: "9px",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)",
                color: "#cbd5e1",
              }}
            >
              ✏️ {showManualForm ? "Hide Manual Form" : "Modify / Override"}
            </button>
          </div>
        </div>
      )}

      {/* ── FEEDBACK BANNER ───────────────────────────────────────────────────── */}
      {feedback && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: 800,
            background: feedback.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
            border: `1px solid ${feedback.type === "success" ? "#10b981" : "#ef4444"}`,
            color: feedback.type === "success" ? "#34d399" : "#f87171",
          }}
        >
          {feedback.text}
        </div>
      )}

      {/* ── STAGE ACTION QUICK BUTTONS ────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "14px",
          padding: "22px",
          border: "1px solid rgba(251,191,36,0.25)",
        }}
      >
        <h2
          style={{
            fontSize: "15px",
            color: "#fbbf24",
            margin: "0 0 6px",
            fontWeight: 900,
            letterSpacing: "-0.01em",
          }}
        >
          ⚡ Executive Stage Controls
        </h2>
        <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 16px" }}>
          One-click updates to case stage · Reflects immediately in Action Dashboard and public tracking
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px" }}>
          {[
            { label: "👁️ Mark Viewed", val: "Viewed", color: "#2563eb" },
            { label: "📞 More Info Needed", val: "More Information Requested", color: "#d97706" },
            { label: "📵 No Response", val: "Contacted (No Response)", color: "#ea580c" },
            { label: "🏢 Assign Dept", val: "Assigned", color: "#0284c7" },
            { label: "🚨 Escalate", val: "Escalated", color: "#dc2626" },
            { label: "⚙️ Field Action", val: "Action Reported", color: "#7c3aed" },
            { label: "✅ Mark Solved", val: "Solved", color: "#059669" },
            { label: "🔒 Close Case", val: "Closed", color: "#475569" },
          ].map(({ label, val, color }) => (
            <button
              key={val}
              type="button"
              disabled={isSubmitting}
              onClick={() => updateStageAction(val)}
              style={{
                backgroundColor: status === val ? color : `${color}26`,
                color: status === val ? "#ffffff" : color,
                border: `1px solid ${color}`,
                padding: "10px 8px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "12px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── EVIDENCE FILES ────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "rgba(15,23,42,0.8)",
          padding: "18px",
          borderRadius: "12px",
          border: "1px solid rgba(56,189,248,0.25)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ fontSize: "13px", color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.05em", margin: 0, fontWeight: 800 }}>
            🎥 Attached Evidence Files ({mediaUrls.length})
          </h3>
          <span style={{ fontSize: "11px", color: "#64748b" }}>Range streaming enabled</span>
        </div>

        {mediaUrls.length === 0 ? (
          <p style={{ color: "#64748b", fontStyle: "italic", margin: 0, fontSize: "13px" }}>
            No evidence files currently attached to this case.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {mediaUrls.map((url, i) => {
              const urlBase = url.split("?")[0];
              const isImage = /\.(jpeg|jpg|png|webp|gif)$/i.test(urlBase);
              const isVideo = /\.(mp4|webm|mov|avi|3gp|mkv)$/i.test(urlBase);
              const isAudio = /\.(mp3|wav|ogg|m4a)$/i.test(urlBase);
              let filename = urlBase.split("/").pop() || `File #${i + 1}`;
              try { filename = decodeURIComponent(filename); } catch {}

              return (
                <div key={i} style={{ backgroundColor: "#1e293b", borderRadius: "8px", padding: "14px", border: "1px solid #334155" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, color: "#f8fafc", fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0 }}>
                      📎 {filename}
                    </span>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <a href={url} target="_blank" rel="noreferrer" style={{ color: "#fbbf24", textDecoration: "none", fontSize: "12px", fontWeight: 700 }}>
                        Open ↗
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteEvidence(url)}
                        disabled={isDeleting === filename}
                        style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid #ef4444", borderRadius: "4px", padding: "4px 10px", fontSize: "11px", fontWeight: 800, cursor: "pointer" }}
                      >
                        {isDeleting === filename ? "Deleting..." : "🗑️ Delete"}
                      </button>
                    </div>
                  </div>
                  {isImage && <img src={url} alt={`Evidence #${i + 1}`} style={{ maxWidth: "100%", maxHeight: "360px", borderRadius: "6px", border: "1px solid #334155", display: "block" }} />}
                  {isVideo && (
                    <div style={{ backgroundColor: "#000", borderRadius: "6px", overflow: "hidden", border: "1px solid #334155" }}>
                      <video controls preload="metadata" style={{ width: "100%", maxHeight: "380px" }}>
                        <source src={url} />
                        Your browser does not support HTML5 video playback.
                      </video>
                    </div>
                  )}
                  {isAudio && <audio controls style={{ width: "100%" }}><source src={url} /></audio>}
                  {!isImage && !isVideo && !isAudio && (
                    <div style={{ padding: "8px", background: "#0f172a", borderRadius: "4px", fontSize: "12px", color: "#64748b" }}>
                      Document / Binary file. Click "Open" above to inspect.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── DETAILED ACTION FORM ─────────────────────────────────────────────── */}
      {(!ab || showManualForm) && (
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "14px",
            padding: "22px",
            border: "1px solid rgba(251,191,36,0.3)",
          }}
        >
          <h2 style={{ fontSize: "15px", color: "#fbbf24", margin: "0 0 16px", fontWeight: 900 }}>
            📋 Detailed Action Form
          </h2>

          <form style={{ display: "flex", flexDirection: "column", gap: "14px" }} onSubmit={handleDetailedUpdate}>

            {/* Status */}
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px", fontWeight: 700, textTransform: "uppercase" }}>Case Stage Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc", borderRadius: "8px", fontSize: "13px" }}
              >
                {["New","AI Processed","Viewed","More Information Requested","Contacted (No Response)","Under Review","Assigned","Escalated","Action Reported","Solved","Resolved","Closed"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px", fontWeight: 700, textTransform: "uppercase" }}>
                Target Department
                {aiDept && <span style={{ marginLeft: "8px", fontSize: "10px", color: "#38bdf8", fontWeight: 700 }}>AI suggested: {getDepartmentLabel(aiDept)}</span>}
              </label>
              <select
                value={assignedDepartment}
                onChange={(e) => setAssignedDepartment(e.target.value)}
                style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc", borderRadius: "8px", fontSize: "13px" }}
              >
                <option value="">— Select Department —</option>
                {CANONICAL_DEPARTMENTS.map((d) => (
                  <option key={d.key} value={d.key}>{d.label}</option>
                ))}
              </select>
            </div>

            {/* Assign to officer */}
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px", fontWeight: 700, textTransform: "uppercase" }}>
                Assign To Officer / Role
                {ab?.assignTo && <span style={{ marginLeft: "8px", fontSize: "10px", color: "#fbbf24" }}>AI: {ab.assignTo}</span>}
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder={ab?.assignTo ?? "e.g. Tahsildar, Srikalahasti Mandal"}
                style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc", borderRadius: "8px", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            {/* Internal note */}
            <div>
              <label style={{ display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "6px", fontWeight: 700, textTransform: "uppercase" }}>Internal Action Notes (Staff Only · Not shown to citizen)</label>
              <textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                rows={3}
                placeholder="Describe action taken, field visit notes, phone conversation summary..."
                style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc", borderRadius: "8px", resize: "vertical", fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            {/* ── CITIZEN MESSAGE — the key feature ────────────────────────── */}
            <div
              style={{
                background: "rgba(56,189,248,0.05)",
                border: "1.5px solid rgba(56,189,248,0.3)",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px" }}>💬</span>
                <div>
                  <div style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Message to Citizen
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                    This message will be shown on the citizen's public tracking page. Write clearly — it may be read in Telugu areas.
                  </div>
                </div>
              </div>
              <textarea
                value={citizenMessage}
                onChange={(e) => setCitizenMessage(e.target.value)}
                rows={3}
                maxLength={300}
                placeholder={ab?.draftSms ?? "e.g. Your complaint has been reviewed. The R&B department will conduct a site inspection within 48 hours."}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#0f172a",
                  border: "1px solid rgba(56,189,248,0.25)",
                  color: "#f8fafc",
                  borderRadius: "8px",
                  resize: "vertical",
                  fontSize: "13px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                <span style={{ fontSize: "10px", color: "#64748b" }}>Visible to citizen on /track page</span>
                <span style={{ fontSize: "10px", color: citizenMessage.length > 250 ? "#f97316" : "#64748b" }}>
                  {citizenMessage.length}/300
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "14px",
                background: isSubmitting
                  ? "rgba(217,119,6,0.5)"
                  : "linear-gradient(135deg, #d97706, #fbbf24)",
                color: "#04091A",
                border: "none",
                borderRadius: "10px",
                fontWeight: 900,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: "15px",
                boxShadow: "0 4px 15px rgba(251,191,36,0.25)",
                transition: "all 0.2s",
              }}
            >
              {isSubmitting ? "⏳ Saving..." : "💾 Save Case Updates"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
