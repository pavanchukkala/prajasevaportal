"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { developerConfig } from "@/config/developer";

import { useLanguage } from "@/context/LanguageContext";

// Pages where the popup should NOT appear
const HIDDEN_PATHS = ["/staff/login", "/mla/", "/reviewer/", "/admin/", "/department/"];

export default function DeveloperPopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldHide = HIDDEN_PATHS.some((p) => pathname.startsWith(p));

  const closeModal = useCallback(() => setIsOpen(false), []);

  // Escape key support
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handle);
    // Focus close button when opened
    setTimeout(() => closeRef.current?.focus(), 50);
    return () => document.removeEventListener("keydown", handle);
  }, [isOpen, closeModal]);

  if (!mounted || shouldHide) return null;

  const labels = {
    en: {
      btn: "👨‍💻 Meet the Developer",
      heading: "Meet the Developer",
      role: developerConfig.title,
      bio: developerConfig.shortBio,
      platformLabel: "Platform",
      platform: developerConfig.platformContext,
      locationLabel: "Location",
      valuesLabel: "Platform Values",
      factsLabel: "What was built",
      linksLabel: "Links",
      configNote:
        "This profile reflects only approved configuration. No biographical details have been invented or assumed.",
      close: "Close",
    },
    te: {
      btn: "👨‍💻 డెవలపర్‌ను కలవండి",
      heading: "డెవలపర్‌ను కలవండి",
      role: developerConfig.title,
      bio: developerConfig.shortBio,
      platformLabel: "ప్లాట్‌ఫామ్",
      platform: developerConfig.platformContext,
      locationLabel: "స్థానం",
      valuesLabel: "ప్లాట్‌ఫామ్ విలువలు",
      factsLabel: "నిర్మించింది",
      linksLabel: "లింకులు",
      configNote:
        "ఈ ప్రొఫైల్ అనుమతించిన కాన్ఫిగరేషన్ మాత్రమే ప్రతిబింబిస్తుంది.",
      close: "మూసివేయి",
    },
  };

  const t = labels[language];

  return (
    <>
      {/* Floating pill button */}
      <button
        aria-label={t.btn}
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 100,
          background: "rgba(13,33,55,0.95)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(212,160,23,0.35)",
          borderRadius: "9999px",
          padding: "0.55rem 1.1rem",
          color: "#D4A017",
          fontWeight: 700,
          fontSize: "0.78rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          boxShadow: "0 0 18px rgba(212,160,23,0.15), 0 4px 12px rgba(0,0,0,0.4)",
          transition: "box-shadow 0.25s, transform 0.2s",
          fontFamily: "'Inter','Noto Sans Telugu',sans-serif",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 0 30px rgba(212,160,23,0.35), 0 4px 20px rgba(0,0,0,0.5)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 0 18px rgba(212,160,23,0.15), 0 4px 12px rgba(0,0,0,0.4)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {t.btn}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.heading}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "rgba(4,9,26,0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          {/* Modal */}
          <div
            style={{
              background: "rgba(9,18,40,0.98)",
              border: "1px solid rgba(212,160,23,0.25)",
              borderRadius: "20px",
              padding: "2rem",
              maxWidth: "480px",
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(212,160,23,0.08)",
              position: "relative",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            {/* Close */}
            <button
              ref={closeRef}
              onClick={closeModal}
              aria-label={t.close}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                color: "#94a3b8",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>

            {/* Language toggle */}
            <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.5rem" }}>
              {(["en", "te"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  style={{
                    padding: "0.25rem 0.65rem",
                    borderRadius: "9999px",
                    border: "1px solid",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    background: language === l ? "#D4A017" : "transparent",
                    borderColor: language === l ? "#D4A017" : "rgba(212,160,23,0.3)",
                    color: language === l ? "#04091A" : "#D4A017",
                  }}
                >
                  {l === "en" ? "EN" : "తెలుగు"}
                </button>
              ))}
            </div>

            {/* Avatar / Initials */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(212,160,23,0.2), rgba(30,136,229,0.2))",
                border: "2px solid rgba(212,160,23,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem", fontWeight: 900, color: "#D4A017",
                flexShrink: 0,
              }}>
                {developerConfig.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div style={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem" }}>{developerConfig.name}</div>
                <div style={{ color: "#D4A017", fontSize: "0.8rem", fontWeight: 600 }}>{t.role}</div>
                {developerConfig.location && (
                  <div style={{ color: "#475569", fontSize: "0.75rem", marginTop: "2px" }}>📍 {developerConfig.location}</div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div style={{ background: "rgba(212,160,23,0.04)", border: "1px solid rgba(212,160,23,0.1)", borderRadius: "12px", padding: "1rem", marginBottom: "1.25rem" }}>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>{t.bio}</p>
            </div>

            {/* Platform */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.62rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "0.3rem" }}>{t.platformLabel}</div>
              <div style={{ fontSize: "0.82rem", color: "#94a3b8" }}>{t.platform}</div>
            </div>

            {/* Values */}
            {developerConfig.values.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.62rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "0.5rem" }}>{t.valuesLabel}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {developerConfig.values.map((v, i) => (
                    <span key={i} style={{ padding: "0.2rem 0.65rem", background: "rgba(30,136,229,0.08)", border: "1px solid rgba(30,136,229,0.15)", borderRadius: "9999px", fontSize: "0.7rem", color: "#60a5fa" }}>{v}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {developerConfig.links.github && (
                <a href={developerConfig.links.github} target="_blank" rel="noopener noreferrer" style={{ padding: "0.4rem 1rem", background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "9999px", color: "#D4A017", fontSize: "0.78rem", fontWeight: 700, textDecoration: "none" }}>
                  ⬡ GitHub
                </a>
              )}
              {developerConfig.links.linkedin && (
                <a href={developerConfig.links.linkedin} target="_blank" rel="noopener noreferrer" style={{ padding: "0.4rem 1rem", background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: "9999px", color: "#60a5fa", fontSize: "0.78rem", fontWeight: 700, textDecoration: "none" }}>
                  LinkedIn
                </a>
              )}
              {developerConfig.email && (
                <a href={`mailto:${developerConfig.email}`} style={{ padding: "0.4rem 1rem", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "9999px", color: "#22c55e", fontSize: "0.78rem", fontWeight: 700, textDecoration: "none" }}>
                  Email
                </a>
              )}
            </div>

            {/* Config note */}
            <div style={{ fontSize: "0.7rem", color: "#334155", lineHeight: 1.6 }}>
              ℹ {t.configNote}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
