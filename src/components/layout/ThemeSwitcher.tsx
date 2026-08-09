"use client";

import React from "react";
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
        title="Light Theme"
        aria-label="Switch to light mode"
        style={{
          border: "none",
          background: theme === "light" ? "var(--accent-teal)" : "transparent",
          color: theme === "light" ? "#FFFFFF" : "var(--text-muted)",
          padding: "4px 10px",
          borderRadius: "9999px",
          cursor: "pointer",
          fontWeight: 700,
          transition: "all 0.2s ease",
        }}
      >
        ☀️ Light
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
          padding: "4px 10px",
          borderRadius: "9999px",
          cursor: "pointer",
          fontWeight: 700,
          transition: "all 0.2s ease",
        }}
      >
        🌙 Dark
      </button>
      <button
        type="button"
        onClick={() => setTheme("system")}
        title="System Theme"
        aria-label="Switch to system default mode"
        style={{
          border: "none",
          background: theme === "system" ? "var(--accent-teal)" : "transparent",
          color: theme === "system" ? "#FFFFFF" : "var(--text-muted)",
          padding: "4px 10px",
          borderRadius: "9999px",
          cursor: "pointer",
          fontWeight: 700,
          transition: "all 0.2s ease",
        }}
      >
        💻 Auto
      </button>
    </div>
  );
}
