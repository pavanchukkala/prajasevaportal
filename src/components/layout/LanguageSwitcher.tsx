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
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-main)",
        borderRadius: "9999px",
        padding: "3px 6px 3px 8px",
        fontSize: "0.78rem",
      }}
      aria-label="Language switcher"
    >
      <Globe size={14} style={{ color: "var(--accent-teal)" }} aria-hidden="true" />

      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-label="Switch to English"
        style={{
          border: "none",
          background: language === "en" ? "var(--accent-teal)" : "transparent",
          color: language === "en" ? "#FFFFFF" : "var(--text-muted)",
          padding: "4px 10px",
          borderRadius: "9999px",
          cursor: "pointer",
          fontWeight: 700,
          transition: "all 0.2s ease",
        }}
      >
        English
      </button>

      <button
        type="button"
        onClick={() => setLanguage("te")}
        aria-label="Switch to Telugu"
        style={{
          border: "none",
          background: language === "te" ? "var(--accent-teal)" : "transparent",
          color: language === "te" ? "#FFFFFF" : "var(--text-muted)",
          padding: "4px 10px",
          borderRadius: "9999px",
          cursor: "pointer",
          fontWeight: 700,
          transition: "all 0.2s ease",
        }}
      >
        తెలుగు
      </button>
    </div>
  );
}
