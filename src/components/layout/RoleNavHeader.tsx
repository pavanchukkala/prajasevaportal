"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionUser } from "@/lib/auth";
import ActionDashboardSignOut from "@/components/mla/ActionDashboardSignOut";

interface RoleNavHeaderProps {
  user: SessionUser;
  buildId?: string;
}

export default function RoleNavHeader({ user, buildId = "v1e601de" }: RoleNavHeaderProps) {
  const pathname = usePathname();

  const navItems = getNavItemsForRole(user.role);

  return (
    <header
      style={{
        backgroundColor: "#0f172a",
        borderBottom: "1px solid #1e293b",
        padding: "0.75rem 1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#fbbf24", letterSpacing: "-0.02em" }}>
          🏛️ Srikalahasti Action Dashboard
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            padding: "2px 8px",
            borderRadius: "9999px",
            backgroundColor: "rgba(56,189,248,0.15)",
            color: "#38bdf8",
            border: "1px solid rgba(56,189,248,0.3)",
            fontWeight: 800,
          }}
        >
          BUILD {buildId}
        </span>
      </div>

      <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: "0.45rem 0.85rem",
                borderRadius: "6px",
                fontSize: "0.82rem",
                fontWeight: isActive ? 800 : 600,
                color: isActive ? "#0f172a" : "#cbd5e1",
                backgroundColor: isActive ? "#fbbf24" : "rgba(255,255,255,0.05)",
                border: isActive ? "1px solid #fbbf24" : "1px solid #334155",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.8rem", color: "#94a3b8" }}>
        <span>
          Logged in as <strong style={{ color: "#38bdf8" }}>{user.username}</strong> (<strong style={{ color: "#facc15" }}>{getRoleLabel(user.role)}</strong>)
        </span>
        <ActionDashboardSignOut label="🚪 Sign Out" />
      </div>
    </header>
  );
}

function getRoleLabel(role: SessionUser["role"]): string {
  switch (role) {
    case "administrator":
      return "System Administrator";
    case "mla_staff":
    default:
      return "Action Dashboard Staff";
  }
}

function getNavItemsForRole(role: SessionUser["role"]): { href: string; label: string }[] {
  switch (role) {
    case "mla_staff":
      return [{ href: "/mla/dashboard", label: "📊 Action Dashboard" }];
    case "administrator":
    default:
      return [
        { href: "/mla/dashboard", label: "📊 Action Dashboard" },
        { href: "/admin/settings", label: "⚙️ Administrative Access" },
      ];
  }
}
