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
        background: "var(--bg-surface)",
        border: "1.5px solid var(--accent-gold)",
        borderRadius: "9999px",
        padding: "3px",
        fontSize: "0.78rem",
        boxShadow: "0 2px 10px rgba(180,83,9,0.18)",
      }}
      aria-label="Theme switcher"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        title="Light Theme (Default)"
        aria-label="Switch to light mode"
        style={{
          border: theme === "light" ? "1.5px solid var(--accent-gold)" : "1.5px solid transparent",
          background: theme === "light" ? "linear-gradient(135deg, #0D9488 0%, #059669 100%)" : "transparent",
          color: theme === "light" ? "#FFFFFF" : "var(--text-muted)",
          padding: "4px 10px",
          borderRadius: "9999px",
          cursor: "pointer",
          fontWeight: 800,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          boxShadow: theme === "light" ? "0 2px 8px rgba(13,148,136,0.35)" : "none",
          transform: theme === "light" ? "scale(1.04)" : "scale(1)",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
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
          border: theme === "dark" ? "1.5px solid var(--accent-gold)" : "1.5px solid transparent",
          background: theme === "dark" ? "linear-gradient(135deg, #0D9488 0%, #059669 100%)" : "transparent",
          color: theme === "dark" ? "#FFFFFF" : "var(--text-muted)",
          padding: "4px 10px",
          borderRadius: "9999px",
          cursor: "pointer",
          fontWeight: 800,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          boxShadow: theme === "dark" ? "0 2px 8px rgba(13,148,136,0.35)" : "none",
          transform: theme === "dark" ? "scale(1.04)" : "scale(1)",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
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
          border: theme === "special" ? "1.5px solid var(--accent-gold)" : "1.5px solid transparent",
          background: theme === "special" ? "linear-gradient(135deg, #B45309 0%, #D97706 100%)" : "transparent",
          color: theme === "special" ? "#FFFFFF" : "var(--text-muted)",
          padding: "4px 10px",
          borderRadius: "9999px",
          cursor: "pointer",
          fontWeight: 800,
          display: "inline-flex",
          alignItems: "center",
          gap: "0.3rem",
          boxShadow: theme === "special" ? "0 2px 8px rgba(180,83,9,0.4)" : "none",
          transform: theme === "special" ? "scale(1.04)" : "scale(1)",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <Sparkles size={13} />
        <span>Special</span>
      </button>
    </div>
  );
}
