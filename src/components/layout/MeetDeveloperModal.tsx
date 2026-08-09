"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { developerConfig } from "@/config/developer";
import { useLanguage } from "@/context/LanguageContext";

interface MeetDeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MeetDeveloperModal({ isOpen, onClose }: MeetDeveloperModalProps) {
  const dev = developerConfig;
  const { language, t } = useLanguage();
  const isTe = language === "te";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dev-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1.5px solid var(--accent-teal)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "520px",
          padding: "2rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          color: "var(--text-main)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: "1.5rem",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-teal), var(--accent-gold))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              fontSize: "1.8rem",
              fontWeight: 900,
              color: "#FFFFFF",
            }}
          >
            {dev.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <h2
            id="dev-modal-title"
            style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "0.25rem" }}
          >
            {isTe ? "పవన్ చుక్కల" : dev.name}
          </h2>
          <p style={{ color: "var(--accent-teal)", fontWeight: 700, fontSize: "0.9rem" }}>
            {isTe ? "పౌర-సాంకేతిక సాఫ్ట్‌వేర్ ఇంజనీర్" : dev.title}
          </p>
        </div>

        <div
          style={{
            background: "var(--bg-elevated)",
            borderRadius: "12px",
            padding: "1rem",
            marginBottom: "1.25rem",
            fontSize: "0.88rem",
            lineHeight: 1.6,
            color: "var(--text-muted)",
          }}
        >
          {isTe
            ? "శ్రీకాళహస్తి నియోజకవర్గ పౌరుల కోసం పారదర్శక సాంకేతిక పరిష్కారాన్ని అందించేందుకు ఈ వేదిక రూపొందించబడింది."
            : dev.platformContext}
        </div>

        <div
          style={{
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            lineHeight: 1.5,
            marginBottom: "1.5rem",
          }}
        >
          <strong>{isTe ? "వేదిక గమనిక: " : "Principle: "}</strong>
          {t("common.proposedNotice")}
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/developer"
            onClick={onClose}
            style={{
              background: "var(--accent-teal)",
              color: "#FFFFFF",
              fontWeight: 800,
              padding: "0.65rem 1.5rem",
              borderRadius: "9999px",
              textDecoration: "none",
              fontSize: "0.88rem",
            }}
          >
            {isTe ? "పూర్తి వివరాలు చూడండి →" : "Full Developer Profile →"}
          </Link>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid var(--border-main)",
              color: "var(--text-main)",
              fontWeight: 700,
              padding: "0.65rem 1.5rem",
              borderRadius: "9999px",
              cursor: "pointer",
              fontSize: "0.88rem",
            }}
          >
            {isTe ? "మూసివేయి" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
