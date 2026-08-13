"use client";
import React from "react";
import Link from "next/link";

export type NavItem =
  | "overview"
  | "live-complaints"
  | "priority-safety"
  | "constituency"
  | "department-performance"
  | "action-taken"
  | "reports"
  | "profile-settings";

interface MLASidebarNavProps {
  currentNav: string;
  counts: {
    totalLive: number;
    highPriority: number;
    underReview: number;
    assigned: number;
    resolved: number;
  };
}

export default function MLASidebarNav({ currentNav, counts }: MLASidebarNavProps) {
  const items: Array<{ id: NavItem; label: string; icon: string; badge?: number; badgeColor?: string }> = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "live-complaints", label: "Live Complaints", icon: "🟢", badge: counts.totalLive, badgeColor: "#34d399" },
    { id: "priority-safety", label: "Priority & Safety", icon: "🚨", badge: counts.highPriority, badgeColor: "#ef4444" },
    { id: "constituency", label: "Constituency", icon: "🏛️" },
    { id: "department-performance", label: "Dept Performance", icon: "🏢" },
    { id: "action-taken", label: "Action Taken", icon: "📋", badge: counts.assigned, badgeColor: "#38bdf8" },
    { id: "reports", label: "Reports", icon: "📈" },
    { id: "profile-settings", label: "Profile / Settings", icon: "⚙️" },
  ];

  return (
    <aside style={{ backgroundColor: "#1e293b", borderRight: "1px solid #334155", padding: "16px", minWidth: "240px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ paddingBottom: "16px", marginBottom: "16px", borderBottom: "1px solid #334155" }}>
          <div style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Srikalahasti No. 168
          </div>
          <h2 style={{ fontSize: "16px", color: "#ffffff", margin: "4px 0 0", fontWeight: 900 }}>
            MLA Staff Workspace
          </h2>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {items.map((item) => {
            const active = currentNav === item.id || (!currentNav && item.id === "overview");
            return (
              <Link
                key={item.id}
                href={`/mla/dashboard?nav=${item.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  backgroundColor: active ? "#fbbf24" : "transparent",
                  color: active ? "#0f172a" : "#cbd5e1",
                  fontWeight: active ? 800 : 600,
                  fontSize: "13.5px",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    style={{
                      backgroundColor: active ? "#0f172a" : item.badgeColor || "#38bdf8",
                      color: active ? "#fbbf24" : "#0f172a",
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "2px 7px",
                      borderRadius: "10px",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      
      <div style={{ borderTop: "1px solid #334155", paddingTop: "16px", marginTop: "24px" }}>
        <a
          href="/api/auth/logout"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 14px",
            borderRadius: "8px",
            textDecoration: "none",
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            color: "#f87171",
            fontWeight: 800,
            fontSize: "13.5px",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </a>
      </div>
    </aside>
  );
}
