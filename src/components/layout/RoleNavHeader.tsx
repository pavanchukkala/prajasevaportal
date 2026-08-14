"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionUser } from "@/lib/auth";

interface RoleNavHeaderProps {
  user: SessionUser;
  buildId?: string;
}

export default function RoleNavHeader({ user, buildId = "v1e601de" }: RoleNavHeaderProps) {
  const pathname = usePathname();

  // Role-specific navigation links strict scoping
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
          🏛️ Srikalahasti Executive Portal
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

      {/* Role-Specific Navigation Links */}
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

      {/* User Session Info & Sign Out */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.8rem", color: "#94a3b8" }}>
        <span>
          Logged in as <strong style={{ color: "#38bdf8" }}>{user.username}</strong> (<strong style={{ color: "#facc15" }}>{getRoleLabel(user.role)}</strong>)
        </span>
        <a
          href="/api/auth/logout"
          style={{
            padding: "0.35rem 0.75rem",
            borderRadius: "6px",
            backgroundColor: "#ef4444",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "0.78rem",
            textDecoration: "none",
          }}
        >
          🚪 Sign Out
        </a>
      </div>
    </header>
  );
}

function getRoleLabel(role: SessionUser["role"]): string {
  switch (role) {
    case "administrator":
      return "System Administrator";
    case "reviewer":
      return "Case Reviewer";
    case "department_officer":
      return "Department Officer";
    case "mla_staff":
    default:
      return "MLA Executive Staff";
  }
}

function getNavItemsForRole(role: SessionUser["role"]): { href: string; label: string }[] {
  switch (role) {
    case "department_officer":
      return [{ href: "/department/workspace", label: "🏢 Department Workspace" }];
    case "reviewer":
      return [{ href: "/reviewer/cases", label: "🛡 Reviewer Triage Queue" }];
    case "mla_staff":
      return [{ href: "/mla/dashboard", label: "⚡ Action Dashboard" }];
    case "administrator":
    default:
      return [
        { href: "/mla/dashboard", label: "⚡ Action Dashboard" },
        { href: "/reviewer/cases", label: "🛡 Reviewer Queue" },
        { href: "/department/workspace", label: "🏢 Dept Workspace" },
        { href: "/admin/settings", label: "⚙️ System Admin" },
      ];
  }
}
