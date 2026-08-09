"use client";

import React from "react";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-main)",
        borderRadius: "9999px",
        padding: "2px",
        fontSize: "0.78rem",
      }}
      aria-label="Theme switcher"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        title="Light Theme (Default)"
        aria-label="Switch to light mode"
        style={{
          border: "none",
          background: theme === "light" ? "var(--accent-teal)" : "transparent",
          color: theme === "light" ? "#FFFFFF" : "var(--text-muted)",
          padding: "4px 9px",
          borderRadius: "9999px",
          cursor: "pointer",
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          transition: "all 0.2s ease",
        }}
      >
        <Sun size={13} />
        <span>Light</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        title="Dark Theme"
        aria-label="Switch to dark mode"
        style={{
          border: "none",
          background: theme === "dark" ? "var(--accent-teal)" : "transparent",
          color: theme === "dark" ? "#FFFFFF" : "var(--text-muted)",
          padding: "4px 9px",
          borderRadius: "9999px",
          cursor: "pointer",
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          transition: "all 0.2s ease",
        }}
      >
        <Moon size={13} />
        <span>Dark</span>
      </button>

      <button
        type="button"
        onClick={() => setTheme("special")}
        title="Special Cinematic Theme"
        aria-label="Switch to special theme mode"
        style={{
          border: "none",
          background: theme === "special" ? "var(--accent-gold)" : "transparent",
          color: theme === "special" ? "#FFFFFF" : "var(--text-muted)",
          padding: "4px 9px",
          borderRadius: "9999px",
          cursor: "pointer",
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          transition: "all 0.2s ease",
        }}
      >
        <Sparkles size={13} />
        <span>Special</span>
      </button>
    </div>
  );
}
