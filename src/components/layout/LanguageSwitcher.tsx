"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        background: "var(--bg-surface)",
        border: "1.5px solid var(--accent-gold)",
        borderRadius: "9999px",
        padding: "3px 6px 3px 8px",
        fontSize: "0.78rem",
        boxShadow: "0 2px 10px rgba(180,83,9,0.18)",
      }}
      aria-label="Language switcher"
    >
      <Globe size={14} style={{ color: "var(--accent-gold)" }} aria-hidden="true" />

      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-label="Switch to English"
        style={{
          border: language === "en" ? "1.5px solid var(--accent-gold)" : "1.5px solid transparent",
          background: language === "en" ? "linear-gradient(135deg, #B45309 0%, #D97706 100%)" : "transparent",
          color: language === "en" ? "#FFFFFF" : "var(--text-muted)",
          padding: "4px 10px",
          borderRadius: "9999px",
          cursor: "pointer",
          fontWeight: 800,
          boxShadow: language === "en" ? "0 2px 8px rgba(180,83,9,0.4)" : "none",
          transform: language === "en" ? "scale(1.04)" : "scale(1)",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        English
      </button>

      <button
        type="button"
        onClick={() => setLanguage("te")}
        aria-label="Switch to Telugu"
        style={{
          border: language === "te" ? "1.5px solid var(--accent-gold)" : "1.5px solid transparent",
          background: language === "te" ? "linear-gradient(135deg, #B45309 0%, #D97706 100%)" : "transparent",
          color: language === "te" ? "#FFFFFF" : "var(--text-muted)",
          padding: "4px 10px",
          borderRadius: "9999px",
          cursor: "pointer",
          fontWeight: 800,
          boxShadow: language === "te" ? "0 2px 8px rgba(180,83,9,0.4)" : "none",
          transform: language === "te" ? "scale(1.04)" : "scale(1)",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        తెలుగు
      </button>
    </div>
  );
}
