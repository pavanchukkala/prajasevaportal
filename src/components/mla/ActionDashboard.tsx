"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RoleNavHeader from "@/components/layout/RoleNavHeader";
import MLAChatbot from "@/components/mla/MLAChatbot";
import { getDepartmentLabel } from "@/lib/departments";

interface ComplaintRecord {
  id: string;
  trackingToken: string;
  description: string;
  mandal: string;
  village?: string;
  department?: string;
  assignedDepartment?: string;
  assignedTo?: string;
  status: string;
  mobileNumber?: string;
  mobileNumberMasked?: string;
  mediaUrls?: string[];
  createdAt: string;
  updatedAt?: string;
  isSample?: boolean;
  internalNotes?: string[];
  auditLog?: Array<{ timestamp: string; actor: string; action: string; details?: string }>;
  aiAnalysis?: {
    title?: string;
    summary?: string;
    category?: string;
    subcategory?: string;
    department?: string;
    urgency?: "Routine" | "Priority" | "High" | "Emergency" | "Critical";
    safetyCategory?: string;
    safetyEscalationRequired?: boolean;
    credibilityBand?: string;
    confidenceScore?: number;
    recommendedAction?: string;
    analysisMode?: string;
  };
}

interface ActionDashboardProps {
  user: any;
  complaints: ComplaintRecord[];
  buildId?: string;
}

export function ActionDashboard({ user, complaints, buildId = "v1e601de" }: ActionDashboardProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"active" | "emergency" | "solved">("active");
  const [selectedMandal, setSelectedMandal] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Calculate stats
  const totalCount = complaints.length;
  const liveCount = complaints.filter((c) => !c.isSample).length;
  const emergencyCount = complaints.filter(
    (c) =>
      c.aiAnalysis?.urgency === "Emergency" ||
      c.aiAnalysis?.urgency === "Critical" ||
      c.aiAnalysis?.safetyEscalationRequired
  ).length;
  const solvedCount = complaints.filter((c) => c.status === "Solved" || c.status === "Resolved").length;
  const activeQueueCount = totalCount - solvedCount;

  // Filter complaints according to tab, mandal, search query
  const filteredComplaints = complaints.filter((c) => {
    // 1. Tab Filter
    if (activeTab === "solved") {
      if (c.status !== "Solved" && c.status !== "Resolved") return false;
    } else if (activeTab === "emergency") {
      const isEm =
        c.aiAnalysis?.urgency === "Emergency" ||
        c.aiAnalysis?.urgency === "Critical" ||
        c.aiAnalysis?.safetyEscalationRequired;
      if (!isEm) return false;
    } else {
      // "active" tab: show non-solved cases
      if (c.status === "Solved" || c.status === "Resolved") return false;
    }

    // 2. Mandal Filter
    if (selectedMandal !== "ALL") {
      const mandalStr = (c.mandal || "").toLowerCase();
      if (!mandalStr.includes(selectedMandal.toLowerCase())) return false;
    }

    // 3. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchTitle = (c.aiAnalysis?.title || "").toLowerCase().includes(q);
      const matchMandal = (c.mandal || "").toLowerCase().includes(q);
      const matchDept = (c.assignedDepartment || c.department || c.aiAnalysis?.department || "").toLowerCase().includes(q);
      if (!matchId && !matchDesc && !matchTitle && !matchMandal && !matchDept) return false;
    }

    return true;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#04091A", color: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Header */}
      <RoleNavHeader user={user} buildId={buildId} />

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {/* Title & Subtitle */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.4rem" }}>
              ⚡ Constituency Executive Triage & Resolution Hub
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#ffffff", margin: 0, letterSpacing: "-0.02em" }}>
              Action Dashboard
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: "0.4rem 0 0" }}>
              Logged in as <strong style={{ color: "#38bdf8" }}>{user.username}</strong> ({user.role}) · Srikalahasti Assembly Constituency No. 168
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.78rem", color: "#34d399", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", padding: "0.4rem 0.85rem", borderRadius: "9999px", fontWeight: 800 }}>
              🟢 Live Stream Engine
            </span>
          </div>
        </div>

        {/* Executive Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
          <div
            onClick={() => setActiveTab("active")}
            style={{
              backgroundColor: activeTab === "active" ? "rgba(56,189,248,0.12)" : "rgba(13,33,55,0.7)",
              border: `1.5px solid ${activeTab === "active" ? "#38bdf8" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "14px",
              padding: "1.25rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>📋 Active Action Queue</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#38bdf8", marginTop: "0.25rem" }}>{activeQueueCount}</div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>Needs staff action / in progress</div>
          </div>

          <div
            onClick={() => setActiveTab("emergency")}
            style={{
              backgroundColor: activeTab === "emergency" ? "rgba(239,68,68,0.15)" : "rgba(13,33,55,0.7)",
              border: `1.5px solid ${activeTab === "emergency" ? "#ef4444" : "rgba(239,68,68,0.3)"}`,
              borderRadius: "14px",
              padding: "1.25rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#f87171", textTransform: "uppercase" }}>🚨 Emergency Escalations</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#f87171", marginTop: "0.25rem" }}>{emergencyCount}</div>
            <div style={{ fontSize: "0.75rem", color: "#fca5a5", marginTop: "0.25rem" }}>Critical safety & threat cases</div>
          </div>

          <div
            onClick={() => setActiveTab("solved")}
            style={{
              backgroundColor: activeTab === "solved" ? "rgba(16,185,129,0.15)" : "rgba(13,33,55,0.7)",
              border: `1.5px solid ${activeTab === "solved" ? "#10b981" : "rgba(16,185,129,0.3)"}`,
              borderRadius: "14px",
              padding: "1.25rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#34d399", textTransform: "uppercase" }}>✅ Solved Cases List</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#34d399", marginTop: "0.25rem" }}>{solvedCount}</div>
            <div style={{ fontSize: "0.75rem", color: "#6ee7b7", marginTop: "0.25rem" }}>Verified & completed cases</div>
          </div>

          <div style={{ backgroundColor: "rgba(13,33,55,0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "1.25rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase" }}>📦 Total Complaints</div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "#fbbf24", marginTop: "0.25rem" }}>{totalCount}</div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.25rem" }}>Live citizen submissions ({liveCount})</div>
          </div>
        </div>

        {/* Tab & Mandal Filter Control Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", backgroundColor: "rgba(13,33,55,0.6)", padding: "1rem 1.25rem", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "2rem" }}>
          {/* Tab Navigation */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveTab("active")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                backgroundColor: activeTab === "active" ? "#38bdf8" : "rgba(255,255,255,0.05)",
                color: activeTab === "active" ? "#04091A" : "#cbd5e1",
              }}
            >
              📋 Active Action Queue ({activeQueueCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("emergency")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                backgroundColor: activeTab === "emergency" ? "#ef4444" : "rgba(255,255,255,0.05)",
                color: activeTab === "emergency" ? "#ffffff" : "#cbd5e1",
              }}
            >
              🚨 Emergency Safety ({emergencyCount})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("solved")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 800,
                cursor: "pointer",
                border: "none",
                backgroundColor: activeTab === "solved" ? "#10b981" : "rgba(255,255,255,0.05)",
                color: activeTab === "solved" ? "#04091A" : "#cbd5e1",
              }}
            >
              ✅ Solved Cases List ({solvedCount})
            </button>
          </div>

          {/* Mandal & Search Filters */}
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", flex: 1, justifyContent: "flex-end", minWidth: "280px" }}>
            {/* Mandal Selector */}
            <select
              value={selectedMandal}
              onChange={(e) => setSelectedMandal(e.target.value)}
              style={{
                padding: "0.5rem 0.85rem",
                backgroundColor: "#0f172a",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#f8fafc",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: 700,
                outline: "none",
              }}
            >
              <option value="ALL">📍 All Mandals (4 Mandals)</option>
              <option value="Srikalahasti">Srikalahasti Mandal</option>
              <option value="Renigunta">Renigunta Mandal</option>
              <option value="Yerpedu">Yerpedu Mandal</option>
              <option value="Thottambedu">Thottambedu Mandal</option>
            </select>

            {/* Search Bar */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, keyword, or village..."
              style={{
                padding: "0.5rem 0.85rem",
                backgroundColor: "#0f172a",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#f8fafc",
                borderRadius: "8px",
                fontSize: "0.82rem",
                minWidth: "200px",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Complaint Case Cards Grid */}
        {filteredComplaints.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: "rgba(13,33,55,0.4)", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.15)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
              {activeTab === "solved" ? "🎉" : activeTab === "emergency" ? "🛡️" : "📂"}
            </div>
            <h3 style={{ color: "#f8fafc", fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.5rem" }}>
              {activeTab === "solved"
                ? "No Solved Cases Yet"
                : activeTab === "emergency"
                ? "No Emergency Cases Flagged"
                : "No Active Complaints Found"}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", margin: 0 }}>
              {searchQuery || selectedMandal !== "ALL"
                ? "No complaints match your active filter parameters. Try clearing the search or mandal filter."
                : activeTab === "solved"
                ? "Cases marked as Solved or Resolved by staff will automatically appear here."
                : "Live citizen submissions will automatically appear here as soon as they are filed."}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem" }}>
            {filteredComplaints.map((c) => {
              const ai = c.aiAnalysis;
              const isEmergency =
                ai?.urgency === "Emergency" || ai?.urgency === "Critical" || ai?.safetyEscalationRequired;
              const title =
                ai?.title || (c.description ? c.description.slice(0, 70) + "..." : "Grievance Report");
              const summary = ai?.summary || c.description;
              const deptLabel = getDepartmentLabel(c.assignedDepartment || c.department || ai?.department);
              const isSolved = c.status === "Solved" || c.status === "Resolved";

              return (
                <div
                  key={c.id}
                  style={{
                    backgroundColor: "rgba(13,33,55,0.8)",
                    border: `1.5px solid ${isEmergency ? "#ef4444" : isSolved ? "#10b981" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "16px",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "1.25rem",
                    boxShadow: isEmergency ? "0 4px 20px rgba(239,68,68,0.15)" : "0 4px 15px rgba(0,0,0,0.3)",
                    position: "relative",
                  }}
                >
                  {/* Card Header: Case ID, Stage Badge, Date */}
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: 900, color: "#38bdf8", fontFamily: "monospace" }}>
                          {c.id}
                        </span>
                        {c.isSample && (
                          <span style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: "4px", background: "rgba(168,85,247,0.2)", color: "#c084fc", fontWeight: 700 }}>
                            SAMPLE
                          </span>
                        )}
                      </div>

                      {/* Status Stage Badge */}
                      <span
                        style={{
                          fontSize: "0.72rem",
                          padding: "3px 10px",
                          borderRadius: "9999px",
                          fontWeight: 800,
                          backgroundColor:
                            c.status === "Solved" || c.status === "Resolved"
                              ? "rgba(16,185,129,0.2)"
                              : c.status === "Viewed"
                              ? "rgba(56,189,248,0.2)"
                              : c.status === "More Information Requested"
                              ? "rgba(251,191,36,0.2)"
                              : c.status === "Contacted (No Response)"
                              ? "rgba(249,115,22,0.2)"
                              : c.status === "Escalated"
                              ? "rgba(239,68,68,0.2)"
                              : "rgba(255,255,255,0.1)",
                          color:
                            c.status === "Solved" || c.status === "Resolved"
                              ? "#34d399"
                              : c.status === "Viewed"
                              ? "#38bdf8"
                              : c.status === "More Information Requested"
                              ? "#fbbf24"
                              : c.status === "Contacted (No Response)"
                              ? "#fb923c"
                              : c.status === "Escalated"
                              ? "#f87171"
                              : "#cbd5e1",
                          border: `1px solid ${
                            c.status === "Solved" || c.status === "Resolved"
                              ? "#10b981"
                              : c.status === "Viewed"
                              ? "#38bdf8"
                              : c.status === "More Information Requested"
                              ? "#fbbf24"
                              : c.status === "Contacted (No Response)"
                              ? "#f97316"
                              : c.status === "Escalated"
                              ? "#ef4444"
                              : "rgba(255,255,255,0.2)"
                          }`,
                        }}
                      >
                        {c.status}
                      </span>
                    </div>

                    {/* RELEVANT TOP TITLE */}
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#ffffff", margin: "0 0 0.6rem", lineHeight: 1.4 }}>
                      {title}
                    </h3>

                    {/* Location & Department */}
                    <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.75rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      <span>📍 Mandal: <strong style={{ color: "#f8fafc" }}>{c.mandal || "Not Specified"}</strong></span>
                      {c.village && <span>Village: <strong style={{ color: "#f8fafc" }}>{c.village}</strong></span>}
                    </div>

                    {/* AI Deep Summary & Insights */}
                    <div style={{ backgroundColor: "rgba(4,9,26,0.6)", padding: "0.85rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", fontSize: "0.82rem", color: "#cbd5e1", lineHeight: 1.5, marginBottom: "0.85rem" }}>
                      <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                        🧠 AI Summary & Insights
                      </div>
                      {summary.length > 180 ? summary.slice(0, 180) + "..." : summary}
                    </div>

                    {/* Department & Urgency Tags */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "6px", backgroundColor: "rgba(56,189,248,0.1)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.25)", fontWeight: 700 }}>
                        🏢 {deptLabel}
                      </span>

                      <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "6px", backgroundColor: isEmergency ? "rgba(239,68,68,0.15)" : "rgba(251,191,36,0.12)", color: isEmergency ? "#f87171" : "#fbbf24", border: isEmergency ? "1px solid #ef4444" : "1px solid #fbbf24", fontWeight: 700 }}>
                        ⚡ {ai?.urgency || "Routine"}
                      </span>

                      {(c.mediaUrls || []).length > 0 && (
                        <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "6px", backgroundColor: "rgba(168,85,247,0.15)", color: "#c084fc", fontWeight: 700 }}>
                          📎 {(c.mediaUrls || []).length} Evidence File(s)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Take Action CTA Link */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                      Submitted: {new Date(c.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </div>

                    <Link
                      href={`/mla/complaint/${encodeURIComponent(c.id)}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.55rem 1.1rem",
                        borderRadius: "8px",
                        background: "linear-gradient(135deg, #d97706, #fbbf24)",
                        color: "#04091A",
                        fontWeight: 900,
                        fontSize: "0.82rem",
                        textDecoration: "none",
                        boxShadow: "0 2px 10px rgba(251,191,36,0.3)",
                      }}
                    >
                      <span>Take Action</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Real-Time Knowledge Assistant Chatbot */}
      <MLAChatbot />
    </div>
  );
}
