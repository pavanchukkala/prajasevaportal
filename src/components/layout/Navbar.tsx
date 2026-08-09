"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <nav style={{ backgroundColor: "rgba(6,15,26,0.95)", borderBottom: "1px solid rgba(212,160,23,0.15)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#D4A017", letterSpacing: "-0.02em" }}>
            {t("nav.title", "Praja Seva")}
          </div>
          <div style={{ fontSize: "0.65rem", color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {t("nav.subtitle", "Srikalahasti · No. 168")}
          </div>
        </Link>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", fontSize: "0.875rem" }}>
          <Link href="/constituency" style={{ color: "#94a3b8", textDecoration: "none" }}>{t("nav.constituency", "Constituency")}</Link>
          <Link href="/learn" style={{ color: "#94a3b8", textDecoration: "none" }}>{t("nav.learn", "Learn")}</Link>
          <Link href="/track" style={{ color: "#94a3b8", textDecoration: "none" }}>{t("nav.track", "Track")}</Link>
          <Link href="/about" style={{ color: "#94a3b8", textDecoration: "none" }}>{t("nav.about", "About")}</Link>

          {/* Global Language Toggle Switch */}
          <button
            onClick={toggleLanguage}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              backgroundColor: "rgba(212,160,23,0.1)",
              border: "1px solid rgba(212,160,23,0.3)",
              color: "#D4A017",
              fontWeight: 700,
              padding: "0.35rem 0.85rem",
              borderRadius: "9999px",
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            title={language === "en" ? "Switch to Telugu" : "Switch to English"}
          >
            <span>🌐</span>
            <span>{language === "en" ? "తెలుగు" : "English"}</span>
          </button>

          <Link href="/submit" style={{ backgroundColor: "#D4A017", color: "#060f1a", fontWeight: 700, padding: "0.5rem 1.25rem", borderRadius: "9999px", textDecoration: "none", fontSize: "0.8rem" }}>
            {t("nav.reportIssue", "Report Issue")}
          </Link>
          <Link href="/staff/login" style={{ border: "1px solid rgba(212,160,23,0.3)", color: "#D4A017", padding: "0.4rem 1rem", borderRadius: "9999px", textDecoration: "none", fontSize: "0.75rem" }}>
            {t("nav.staffLogin", "Staff Login")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
