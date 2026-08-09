"use client";

import React, { useState } from "react";
import MeetDeveloperModal from "./MeetDeveloperModal";
import { useLanguage } from "@/context/LanguageContext";

export default function MeetDeveloperButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const isTe = language === "te";

  return (
    <>
      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 9000,
          pointerEvents: "auto",
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Meet the Developer"
          style={{
            background: "linear-gradient(135deg, var(--accent-teal), #06B6D4)",
            color: "#FFFFFF",
            border: "1.5px solid rgba(255,255,255,0.3)",
            borderRadius: "9999px",
            padding: "0.65rem 1.25rem",
            fontWeight: 800,
            fontSize: "0.85rem",
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(13,148,136,0.4)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          <span style={{ fontSize: "1rem" }}>👨‍💻</span>
          <span>{isTe ? "డెవలపర్‌ను కలవండి" : "Meet Developer"}</span>
        </button>
      </div>

      <MeetDeveloperModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
