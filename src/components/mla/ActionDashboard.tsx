"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    // Extended intelligence layers
    spamScore?: number;
    spamReason?: string;
    isDuplicate?: boolean;
    sentimentTone?: string;
    distressFlag?: boolean;
    rootCauseTags?: { domain: string; category: string; subcategory: string };
    actionBrief?: { assignTo: string; exactAction: string; deadline: string; draftSms: string };
  };
}

interface ActionDashboardProps {
  user: any;
  complaints: ComplaintRecord[];
  buildId?: string;
}

type SortKey = "date_desc" | "date_asc" | "urgency" | "department";

const URGENCY_ORDER: Record<string, number> = {
  Critical: 5,
  Emergency: 4,
  High: 3,
  Priority: 2,
  Routine: 1,
};

const PAGE_SIZE = 20;

// ── PSIP Intelligence Engine Command Banner ──────────────────────────────────
function PSIPCommandBanner({
  totalCount,
  liveCount,
  emergencyCount,
  solvedCount,
  spamFlaggedCount,
  activeQueueCount,
  username,
}: {
  totalCount: number;
  liveCount: number;
  emergencyCount: number;
  solvedCount: number;
  spamFlaggedCount: number;
  activeQueueCount: number;
  username: string;
}) {
  const [lineIdx, setLineIdx] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  const statusLines = React.useMemo(() => [
    `PSIP Intelligence Engine — Online and operational. ${liveCount} live citizen reports loaded.`,
    emergencyCount > 0
      ? `⚠ ALERT: ${emergencyCount} case${emergencyCount > 1 ? "s" : ""} require immediate executive attention.`
      : `All incoming cases within normal urgency thresholds. No emergency escalations pending.`,
    `${activeQueueCount} cases in active queue. ${solvedCount} resolved to date.`,
    spamFlaggedCount > 0
      ? `${spamFlaggedCount} case${spamFlaggedCount > 1 ? "s" : ""} flagged with elevated spam probability — review before escalating.`
      : `Spam analysis complete. No suspicious submissions detected in current dataset.`,
    `I am PSIP-AI — Purpose-built for Srikalahasti Praja Seva. Every citizen's voice is analyzed with precision.`,
    `Welcome back, ${username}. Srikalahasti No. 168 — ${totalCount} intelligence records available for review.`,
    `AI department routing active. All new complaints are auto-assigned using 30B model analysis.`,
    `Citizen communication channel operational. Executive messages are delivered to public tracking pages in real-time.`,
  ], [totalCount, liveCount, emergencyCount, solvedCount, spamFlaggedCount, activeQueueCount, username]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setLineIdx((prev) => (prev + 1) % statusLines.length);
        setVisible(true);
      }, 400);
    }, 4500);
    return () => clearInterval(interval);
  }, [statusLines.length]);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(13,33,55,0.95), rgba(4,9,26,0.9))",
        border: "1px solid rgba(212,160,23,0.25)",
        borderRadius: "18px",
        padding: "1.5rem 1.75rem",
        marginBottom: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated shimmer top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: emergencyCount > 0
            ? "linear-gradient(90deg, #ef4444, #f97316, #fbbf24, #f97316, #ef4444)"
            : "linear-gradient(90deg, #fbbf24, #38bdf8, #a78bfa, #38bdf8, #fbbf24)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2.5s linear infinite",
        }}
      />

      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        {/* AI Avatar */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0D2137, #162f4a)",
            border: "2px solid rgba(212,160,23,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            flexShrink: 0,
            boxShadow: "0 0 20px rgba(212,160,23,0.2)",
          }}
        >
          🤖
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Identity line */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", fontWeight: 900, color: "#fbbf24", letterSpacing: "0.02em" }}>
              PSIP Intelligence Engine
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 8px rgba(16,185,129,0.8)",
                  animation: "pulseDot 2s ease infinite",
                }}
              />
              <span style={{ fontSize: "10px", color: "#34d399", fontWeight: 700 }}>ONLINE</span>
            </div>
            <span style={{ fontSize: "10px", color: "#475569" }}>·</span>
            <span style={{ fontSize: "10px", color: "#475569", fontWeight: 600 }}>
              30B Parameter Model · Srikalahasti Constituency No. 168
            </span>
          </div>

          {/* Typewriter status line */}
          <div
            style={{
              fontSize: "0.9rem",
              lineHeight: 1.5,
              minHeight: "1.4em",
              transition: "opacity 0.35s ease",
              opacity: visible ? 1 : 0,
              fontWeight: emergencyCount > 0 && lineIdx === 1 ? 700 : 500,
              color: emergencyCount > 0 && lineIdx === 1 ? "#fbbf24" : "#e2e8f0",
            }}
          >
            {statusLines[lineIdx]}
          </div>

          {/* Mission statement */}
          <div style={{ fontSize: "10px", color: "#334155", marginTop: "8px", fontStyle: "italic" }}>
            "Every complaint is a data point. Every data point is a citizen. Every citizen deserves a resolution."
          </div>
        </div>
      </div>

      {/* Stat ribbon */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
          gap: "10px",
          marginTop: "16px",
          paddingTop: "16px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {[
          { label: "Total Records", value: totalCount, color: "#94a3b8" },
          { label: "Live Citizens", value: liveCount, color: "#60a5fa" },
          { label: "Active Queue", value: activeQueueCount, color: "#fbbf24" },
          { label: "Emergency", value: emergencyCount, color: emergencyCount > 0 ? "#ef4444" : "#64748b" },
          { label: "Resolved", value: solvedCount, color: "#10b981" },
          { label: "Spam Flagged", value: spamFlaggedCount, color: spamFlaggedCount > 0 ? "#f97316" : "#64748b" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1.3rem",
                fontWeight: 900,
                color,
                lineHeight: 1,
                fontFamily: "monospace",
                letterSpacing: "-0.02em",
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: "9px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "3px" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* CSS animations (scoped via style tag) */}
      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(16,185,129,0.8); }
          50% { opacity: 0.5; box-shadow: 0 0 4px rgba(16,185,129,0.3); }
        }
      `}</style>
    </div>
  );
}

export function ActionDashboard({ user, complaints, buildId = "v1e601de" }: ActionDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "emergency" | "solved">("active");
  const [selectedMandal, setSelectedMandal] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("date_desc");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1200);
  }, [router]);

  // Stats
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
  const spamFlaggedCount = complaints.filter((c) => (c.aiAnalysis?.spamScore ?? 0) >= 50).length;

  // Filter
  const filteredComplaints = complaints
    .filter((c) => {
      if (activeTab === "solved") {
        if (c.status !== "Solved" && c.status !== "Resolved") return false;
      } else if (activeTab === "emergency") {
        const isEm =
          c.aiAnalysis?.urgency === "Emergency" ||
          c.aiAnalysis?.urgency === "Critical" ||
          c.aiAnalysis?.safetyEscalationRequired;
        if (!isEm) return false;
      } else {
        if (c.status === "Solved" || c.status === "Resolved") return false;
      }

      if (selectedMandal !== "ALL") {
        const mandalStr = (c.mandal || "").toLowerCase();
        if (!mandalStr.includes(selectedMandal.toLowerCase())) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = c.id.toLowerCase().includes(q);
        const matchDesc = c.description.toLowerCase().includes(q);
        const matchTitle = (c.aiAnalysis?.title || "").toLowerCase().includes(q);
        const matchMandal = (c.mandal || "").toLowerCase().includes(q);
        const matchDept = (
          c.assignedDepartment || c.department || c.aiAnalysis?.department || ""
        ).toLowerCase().includes(q);
        if (!matchId && !matchDesc && !matchTitle && !matchMandal && !matchDept) return false;
      }

      return true;
    })
    // Sort
    .sort((a, b) => {
      if (sortKey === "urgency") {
        return (
          (URGENCY_ORDER[b.aiAnalysis?.urgency ?? "Routine"] ?? 1) -
          (URGENCY_ORDER[a.aiAnalysis?.urgency ?? "Routine"] ?? 1)
        );
      }
      if (sortKey === "date_asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortKey === "department") {
        const dA = a.assignedDepartment || a.department || "";
        const dB = b.assignedDepartment || b.department || "";
        return dA.localeCompare(dB);
      }
      // date_desc (default)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const visibleComplaints = filteredComplaints.slice(0, visibleCount);
  const hasMore = visibleCount < filteredComplaints.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#04091A",
        color: "#f8fafc",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <RoleNavHeader user={user} buildId={buildId} />

      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(1rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1.5rem) 4rem",
        }}
      >
        {/* ── PSIP INTELLIGENCE ENGINE — COMMAND INTERFACE ──────────────────── */}
        <PSIPCommandBanner
          totalCount={totalCount}
          liveCount={liveCount}
          emergencyCount={emergencyCount}
          solvedCount={solvedCount}
          spamFlaggedCount={spamFlaggedCount}
          activeQueueCount={activeQueueCount}
          username={user?.username ?? "Commander"}
        />

        {/* Title Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#fbbf24",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.4rem",
              }}
            >
              ⚡ Constituency Triage &amp; Resolution Hub
            </div>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.1rem)",
                fontWeight: 900,
                color: "#ffffff",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              Action Dashboard
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", margin: "0.4rem 0 0" }}>
              Logged in as{" "}
              <strong style={{ color: "#38bdf8" }}>{user.username}</strong> ({user.role}) ·
              Srikalahasti No. 168
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                padding: "0.45rem 1rem",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: 800,
                cursor: isRefreshing ? "not-allowed" : "pointer",
                border: "1px solid rgba(56,189,248,0.4)",
                backgroundColor: isRefreshing ? "rgba(56,189,248,0.05)" : "rgba(56,189,248,0.1)",
                color: "#38bdf8",
                transition: "all 0.2s",
              }}
            >
              {isRefreshing ? "⏳ Refreshing..." : "🔄 Refresh"}
            </button>
            <span
              style={{
                fontSize: "0.75rem",
                color: "#34d399",
                background: "rgba(52,211,153,0.1)",
                border: "1px solid rgba(52,211,153,0.3)",
                padding: "0.4rem 0.85rem",
                borderRadius: "9999px",
                fontWeight: 800,
              }}
            >
              🟢 Live
            </span>
          </div>
        </div>

        {/* Metric Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {[
            {
              tab: "active" as const,
              icon: "📋",
              label: "Active Queue",
              value: activeQueueCount,
              color: "#38bdf8",
              borderColor: "#38bdf8",
            },
            {
              tab: "emergency" as const,
              icon: "🚨",
              label: "Emergency Cases",
              value: emergencyCount,
              color: "#f87171",
              borderColor: "#ef4444",
            },
            {
              tab: "solved" as const,
              icon: "✅",
              label: "Solved Cases",
              value: solvedCount,
              color: "#34d399",
              borderColor: "#10b981",
            },
          ].map((card) => (
            <div
              key={card.tab}
              onClick={() => { setActiveTab(card.tab); setVisibleCount(PAGE_SIZE); }}
              style={{
                backgroundColor:
                  activeTab === card.tab ? `rgba(${card.color === "#38bdf8" ? "56,189,248" : card.color === "#f87171" ? "239,68,68" : "16,185,129"},0.12)` : "rgba(13,33,55,0.7)",
                border: `1.5px solid ${activeTab === card.tab ? card.borderColor : "rgba(255,255,255,0.08)"}`,
                borderRadius: "14px",
                padding: "1.25rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: card.color,
                  textTransform: "uppercase",
                }}
              >
                {card.icon} {card.label}
              </div>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: card.color,
                  marginTop: "0.25rem",
                }}
              >
                {card.value}
              </div>
            </div>
          ))}

          <div
            style={{
              backgroundColor: "rgba(13,33,55,0.7)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "14px",
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "#94a3b8",
                textTransform: "uppercase",
              }}
            >
              📦 Total · 🚫 Spam Flags
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: 900,
                color: "#fbbf24",
                marginTop: "0.25rem",
              }}
            >
              {totalCount}
              {spamFlaggedCount > 0 && (
                <span
                  style={{
                    fontSize: "1rem",
                    color: "#fb923c",
                    marginLeft: "0.5rem",
                    fontWeight: 700,
                  }}
                >
                  · {spamFlaggedCount} ⚠️
                </span>
              )}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.25rem" }}>
              {liveCount} live citizens · {spamFlaggedCount} flagged
            </div>
          </div>
        </div>

        {/* Control Bar: Tabs + Sort + Mandal + Search + Refresh */}
        <div
          style={{
            backgroundColor: "rgba(13,33,55,0.6)",
            padding: "1rem 1.25rem",
            borderRadius: "14px",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: "1.5rem",
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginBottom: "0.75rem",
            }}
          >
            {(
              [
                { key: "active", label: `📋 Active (${activeQueueCount})`, activeColor: "#38bdf8" },
                { key: "emergency", label: `🚨 Emergency (${emergencyCount})`, activeColor: "#ef4444" },
                { key: "solved", label: `✅ Solved (${solvedCount})`, activeColor: "#10b981" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => { setActiveTab(tab.key); setVisibleCount(PAGE_SIZE); }}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  border: "none",
                  backgroundColor:
                    activeTab === tab.key ? tab.activeColor : "rgba(255,255,255,0.05)",
                  color: activeTab === tab.key ? (tab.key === "active" ? "#04091A" : "#ffffff") : "#cbd5e1",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters Row */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Sort */}
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              style={{
                padding: "0.45rem 0.75rem",
                backgroundColor: "#0f172a",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#f8fafc",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: 700,
                outline: "none",
              }}
            >
              <option value="date_desc">🕐 Newest First</option>
              <option value="date_asc">🕐 Oldest First</option>
              <option value="urgency">🚨 Urgency (High → Low)</option>
              <option value="department">🏢 Department A–Z</option>
            </select>

            {/* Mandal */}
            <select
              value={selectedMandal}
              onChange={(e) => setSelectedMandal(e.target.value)}
              style={{
                padding: "0.45rem 0.75rem",
                backgroundColor: "#0f172a",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#f8fafc",
                borderRadius: "8px",
                fontSize: "0.8rem",
                fontWeight: 700,
                outline: "none",
              }}
            >
              <option value="ALL">📍 All Mandals</option>
              <option value="Srikalahasti">Srikalahasti</option>
              <option value="Renigunta">Renigunta</option>
              <option value="Yerpedu">Yerpedu</option>
              <option value="Thottambedu">Thottambedu</option>
            </select>

            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, keyword, village..."
              style={{
                padding: "0.45rem 0.85rem",
                backgroundColor: "#0f172a",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#f8fafc",
                borderRadius: "8px",
                fontSize: "0.8rem",
                flexGrow: 1,
                minWidth: "160px",
                maxWidth: "300px",
                outline: "none",
              }}
            />

            {/* Showing count */}
            <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: "auto" }}>
              Showing {Math.min(visibleCount, filteredComplaints.length)} of{" "}
              {filteredComplaints.length}
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        {filteredComplaints.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "rgba(13,33,55,0.4)",
              borderRadius: "16px",
              border: "1px dashed rgba(255,255,255,0.15)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
              {activeTab === "solved" ? "🎉" : activeTab === "emergency" ? "🛡️" : "📂"}
            </div>
            <h3
              style={{
                color: "#f8fafc",
                fontSize: "1.25rem",
                fontWeight: 800,
                margin: "0 0 0.5rem",
              }}
            >
              {activeTab === "solved"
                ? "No Solved Cases Yet"
                : activeTab === "emergency"
                ? "No Emergency Cases Flagged"
                : "No Active Complaints Found"}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.88rem", margin: 0 }}>
              {searchQuery || selectedMandal !== "ALL"
                ? "No complaints match your filter. Try clearing search or mandal filter."
                : activeTab === "solved"
                ? "Cases marked Solved or Resolved will appear here."
                : "Live citizen submissions will appear here as they are filed."}
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))",
                gap: "1.25rem",
              }}
            >
              {visibleComplaints.map((c) => {
                const ai = c.aiAnalysis;
                const isEmergency =
                  ai?.urgency === "Emergency" ||
                  ai?.urgency === "Critical" ||
                  ai?.safetyEscalationRequired;
                const isSpam = (ai?.spamScore ?? 0) >= 50;
                const isDistress = ai?.distressFlag;
                const isSolved = c.status === "Solved" || c.status === "Resolved";
                const title =
                  ai?.title ||
                  (c.description ? c.description.slice(0, 70) + "..." : "Grievance Report");
                const summary = ai?.summary || c.description;
                const deptLabel = getDepartmentLabel(
                  c.assignedDepartment || c.department || ai?.department
                );
                const mediaUrls = c.mediaUrls || [];
                // First media for thumbnail — strip query string for type detection
                const firstMedia = mediaUrls[0] ?? null;
                const mediaBase = firstMedia ? firstMedia.split("?")[0] : "";
                const firstIsImage = /\.(jpeg|jpg|png|webp|gif)$/i.test(mediaBase);
                const firstIsVideo = /\.(mp4|webm|mov|avi|3gp|mkv)$/i.test(mediaBase);
                const firstIsAudio = /\.(mp3|wav|ogg|m4a)$/i.test(mediaBase);

                return (
                  <div
                    key={c.id}
                    style={{
                      backgroundColor: "rgba(13,33,55,0.85)",
                      border: `1.5px solid ${
                        isEmergency
                          ? "#ef4444"
                          : isSpam
                          ? "#f97316"
                          : isSolved
                          ? "#10b981"
                          : "rgba(255,255,255,0.1)"
                      }`,
                      borderRadius: "16px",
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.9rem",
                      boxShadow: isEmergency
                        ? "0 4px 20px rgba(239,68,68,0.15)"
                        : "0 4px 15px rgba(0,0,0,0.3)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Emergency glow strip */}
                    {isEmergency && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "3px",
                          background: "linear-gradient(90deg, #ef4444, #f97316, #ef4444)",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 2s linear infinite",
                        }}
                      />
                    )}

                    {/* Card Header */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                          marginBottom: "0.6rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.82rem",
                              fontWeight: 900,
                              color: "#38bdf8",
                              fontFamily: "monospace",
                            }}
                          >
                            {c.id}
                          </span>
                          {c.isSample && (
                            <span
                              style={{
                                fontSize: "0.63rem",
                                padding: "1px 5px",
                                borderRadius: "4px",
                                background: "rgba(168,85,247,0.2)",
                                color: "#c084fc",
                                fontWeight: 700,
                              }}
                            >
                              SAMPLE
                            </span>
                          )}
                          {isSpam && (
                            <span
                              style={{
                                fontSize: "0.63rem",
                                padding: "1px 5px",
                                borderRadius: "4px",
                                background: "rgba(249,115,22,0.2)",
                                color: "#fb923c",
                                fontWeight: 700,
                                border: "1px solid rgba(249,115,22,0.4)",
                              }}
                              title={ai?.spamReason || "Flagged as possible spam"}
                            >
                              ⚠️ SPAM?
                            </span>
                          )}
                          {isDistress && !isEmergency && (
                            <span
                              style={{
                                fontSize: "0.63rem",
                                padding: "1px 5px",
                                borderRadius: "4px",
                                background: "rgba(239,68,68,0.15)",
                                color: "#f87171",
                                fontWeight: 700,
                                border: "1px solid rgba(239,68,68,0.3)",
                              }}
                            >
                              😰 Distress
                            </span>
                          )}
                        </div>

                        {/* Status badge */}
                        <span
                          style={{
                            fontSize: "0.7rem",
                            padding: "3px 9px",
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

                      {/* Title */}
                      <h3
                        style={{
                          fontSize: "1rem",
                          fontWeight: 900,
                          color: "#ffffff",
                          margin: "0 0 0.5rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {title}
                      </h3>

                      {/* Location */}
                      <div
                        style={{
                          fontSize: "0.78rem",
                          color: "#94a3b8",
                          marginBottom: "0.6rem",
                          display: "flex",
                          gap: "0.6rem",
                          flexWrap: "wrap",
                        }}
                      >
                        <span>
                          📍 <strong style={{ color: "#f8fafc" }}>{c.mandal || "N/A"}</strong>
                        </span>
                        {c.village && (
                          <span>
                            · <strong style={{ color: "#f8fafc" }}>{c.village}</strong>
                          </span>
                        )}
                      </div>

                      {/* AI Summary */}
                      <div
                        style={{
                          backgroundColor: "rgba(4,9,26,0.7)",
                          padding: "0.75rem",
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.06)",
                          fontSize: "0.8rem",
                          color: "#cbd5e1",
                          lineHeight: 1.55,
                          marginBottom: "0.6rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            color: "#fbbf24",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginBottom: "4px",
                          }}
                        >
                          🧠 AI Summary
                        </div>
                        {summary.length > 160 ? summary.slice(0, 160) + "…" : summary}
                      </div>

                      {/* Action Brief */}
                      {ai?.actionBrief && (
                        <div
                          style={{
                            backgroundColor: "rgba(251,191,36,0.05)",
                            padding: "0.65rem 0.75rem",
                            borderRadius: "8px",
                            border: "1px solid rgba(251,191,36,0.15)",
                            fontSize: "0.75rem",
                            color: "#cbd5e1",
                            marginBottom: "0.6rem",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              color: "#fbbf24",
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                              marginBottom: "3px",
                            }}
                          >
                            ⚡ Action Brief · Deadline: {ai.actionBrief.deadline}
                          </div>
                          <span style={{ color: "#e2e8f0" }}>
                            {ai.actionBrief.assignTo}
                          </span>{" "}
                          — {ai.actionBrief.exactAction.slice(0, 100)}
                          {ai.actionBrief.exactAction.length > 100 ? "…" : ""}
                        </div>
                      )}

                      {/* Tags Row */}
                      <div
                        style={{
                          display: "flex",
                          gap: "0.4rem",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.7rem",
                            padding: "2px 7px",
                            borderRadius: "6px",
                            backgroundColor: "rgba(56,189,248,0.1)",
                            color: "#38bdf8",
                            border: "1px solid rgba(56,189,248,0.25)",
                            fontWeight: 700,
                          }}
                        >
                          🏢 {deptLabel}
                        </span>

                        <span
                          style={{
                            fontSize: "0.7rem",
                            padding: "2px 7px",
                            borderRadius: "6px",
                            backgroundColor: isEmergency
                              ? "rgba(239,68,68,0.15)"
                              : "rgba(251,191,36,0.1)",
                            color: isEmergency ? "#f87171" : "#fbbf24",
                            border: isEmergency ? "1px solid #ef4444" : "1px solid #fbbf24",
                            fontWeight: 700,
                          }}
                        >
                          ⚡ {ai?.urgency || "Routine"}
                        </span>

                        {ai?.rootCauseTags?.domain && (
                          <span
                            style={{
                              fontSize: "0.7rem",
                              padding: "2px 7px",
                              borderRadius: "6px",
                              backgroundColor: "rgba(167,139,250,0.1)",
                              color: "#a78bfa",
                              fontWeight: 700,
                            }}
                          >
                            🏷 {ai.rootCauseTags.domain}
                          </span>
                        )}

                        {mediaUrls.length > 0 && (
                          <span
                            style={{
                              fontSize: "0.7rem",
                              padding: "2px 7px",
                              borderRadius: "6px",
                              backgroundColor: "rgba(168,85,247,0.15)",
                              color: "#c084fc",
                              fontWeight: 700,
                            }}
                          >
                            📎 {mediaUrls.length} Evidence
                          </span>
                        )}

                        {ai?.sentimentTone && ai.sentimentTone !== "informational" && (
                          <span
                            style={{
                              fontSize: "0.7rem",
                              padding: "2px 7px",
                              borderRadius: "6px",
                              backgroundColor:
                                ai.sentimentTone === "angry" || ai.sentimentTone === "distressed"
                                  ? "rgba(239,68,68,0.1)"
                                  : "rgba(148,163,184,0.1)",
                              color:
                                ai.sentimentTone === "angry" || ai.sentimentTone === "distressed"
                                  ? "#f87171"
                                  : "#94a3b8",
                              fontWeight: 700,
                            }}
                          >
                            💬 {ai.sentimentTone}
                          </span>
                        )}
                      </div>

                      {/* First Evidence Thumbnail */}
                      {firstMedia && (
                        <div style={{ marginTop: "0.65rem" }}>
                          {firstIsImage && (
                            <img
                              src={firstMedia}
                              alt="Evidence preview"
                              style={{
                                width: "100%",
                                maxHeight: "160px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                border: "1px solid #334155",
                              }}
                            />
                          )}
                          {firstIsVideo && (
                            <video
                              src={firstMedia}
                              controls
                              preload="metadata"
                              style={{
                                width: "100%",
                                maxHeight: "180px",
                                borderRadius: "8px",
                                border: "1px solid #334155",
                                backgroundColor: "#000",
                              }}
                            />
                          )}
                          {firstIsAudio && (
                            <audio
                              src={firstMedia}
                              controls
                              style={{ width: "100%", marginTop: "4px" }}
                            />
                          )}
                          {!firstIsImage && !firstIsVideo && !firstIsAudio && firstMedia && (
                            <div
                              style={{
                                padding: "6px 10px",
                                background: "rgba(15,23,42,0.6)",
                                borderRadius: "6px",
                                fontSize: "0.72rem",
                                color: "#64748b",
                              }}
                            >
                              📄 Document attached
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.06)",
                        paddingTop: "0.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>

                      <Link
                        href={`/mla/complaint/${encodeURIComponent(c.id)}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.3rem",
                          padding: "0.5rem 1rem",
                          borderRadius: "8px",
                          background: "linear-gradient(135deg, #d97706, #fbbf24)",
                          color: "#04091A",
                          fontWeight: 900,
                          fontSize: "0.8rem",
                          textDecoration: "none",
                          boxShadow: "0 2px 10px rgba(251,191,36,0.3)",
                        }}
                      >
                        Take Action →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {hasMore && (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  style={{
                    padding: "0.75rem 2rem",
                    borderRadius: "10px",
                    backgroundColor: "rgba(56,189,248,0.1)",
                    border: "1px solid rgba(56,189,248,0.35)",
                    color: "#38bdf8",
                    fontWeight: 800,
                    fontSize: "0.88rem",
                    cursor: "pointer",
                  }}
                >
                  Load More ({filteredComplaints.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* AI Assistant Chatbot */}
      <MLAChatbot />
    </div>
  );
}
