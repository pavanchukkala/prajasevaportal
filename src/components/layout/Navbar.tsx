"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("nav.home", "Home") },
    { href: "/submit", label: t("nav.submit", "Submit Grievance") },
    { href: "/track", label: t("nav.track", "Track Complaint") },
    { href: "/constituency", label: t("nav.constituency", "Constituency") },
    { href: "/learn", label: t("nav.learn", "Learn") },
    { href: "/developer", label: t("nav.developer", "Meet Developer") },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav style={theme.navbar}>
        {/* Subtle Tricolour Accent Line at Top */}
        <div style={theme.tricolourTopBar}>
          <div style={{ flex: 1, backgroundColor: "#FF9933" }} />
          <div style={{ flex: 1, backgroundColor: "#FFFFFF" }} />
          <div style={{ flex: 1, backgroundColor: "#138808" }} />
        </div>

        <div style={theme.container}>
          {/* Brand Logo & Platform Title */}
          <Link href="/" style={theme.brandContainer}>
            <Image
              src="/assets/symbols/civic-emblem.svg"
              alt="Praja Seva Official Civic Emblem"
              width={38}
              height={38}
              priority
              style={{ objectFit: "contain" }}
            />
            <div>
              <div style={theme.brandTitle}>{t("nav.title", "Praja Seva")}</div>
              <div style={theme.brandSubtitle}>{t("nav.subtitle", "Srikalahasti Assembly Constituency (No. 168)")}</div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden-mobile" style={theme.desktopLinks}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  ...theme.link,
                  ...(isActive(link.href) ? theme.activeLink : {}),
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action Controls: Language Toggle & Staff Login */}
          <div className="hidden-mobile" style={theme.actionContainer}>
            {/* Global Language Switch */}
            <button
              onClick={toggleLanguage}
              style={theme.langSwitchBtn}
              title={language === "en" ? "Switch to Telugu (తెలుగు)" : "Switch to English"}
            >
              <span style={{ fontSize: "0.9rem" }}>🌐</span>
              <span>{language === "en" ? "తెలుగు" : "English"}</span>
            </button>

            {/* Protected Staff Login */}
            <Link href="/staff/login" style={theme.staffLoginBtn}>
              <span style={{ fontSize: "0.85rem" }}>🔒</span>
              <span>{t("nav.staffLogin", "Staff Login")}</span>
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            className="show-mobile-only"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            style={theme.hamburgerBtn}
            aria-label="Toggle Navigation Drawer"
          >
            {mobileDrawerOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div style={theme.drawerOverlay} onClick={() => setMobileDrawerOpen(false)}>
          <div style={theme.drawerContainer} onClick={(e) => e.stopPropagation()}>
            <div style={theme.drawerHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Image
                  src="/assets/symbols/civic-emblem.svg"
                  alt="Civic Emblem"
                  width={32}
                  height={32}
                />
                <span style={{ fontWeight: 800, color: "#D4A017", fontSize: "1rem" }}>
                  Praja Seva
                </span>
              </div>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div style={theme.drawerLinks}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileDrawerOpen(false)}
                  style={{
                    ...theme.drawerLink,
                    ...(isActive(link.href) ? theme.activeDrawerLink : {}),
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div style={theme.drawerFooter}>
              <button
                onClick={() => {
                  toggleLanguage();
                }}
                style={theme.drawerLangBtn}
              >
                🌐 {language === "en" ? "తెలుగుకి మారండి (Telugu)" : "Switch to English"}
              </button>

              <Link
                href="/staff/login"
                onClick={() => setMobileDrawerOpen(false)}
                style={theme.drawerStaffBtn}
              >
                🔒 {t("nav.staffLogin", "Protected Staff Login")}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Inline CSS Styles */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .hidden-mobile {
            display: none !important;
          }
          .show-mobile-only {
            display: flex !important;
          }
        }
        @media (min-width: 901px) {
          .show-mobile-only {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

const theme = {
  navbar: {
    backgroundColor: "rgba(13, 33, 55, 0.95)",
    borderBottom: "1px solid rgba(212, 160, 23, 0.2)",
    backdropFilter: "blur(16px)",
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
  },
  tricolourTopBar: {
    display: "flex",
    height: "3px",
    width: "100%",
  },
  container: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 1.25rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "68px",
  },
  brandContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
  },
  brandTitle: {
    fontWeight: 800,
    fontSize: "1.15rem",
    color: "#D4A017",
    letterSpacing: "-0.02em",
    lineHeight: "1.2",
  },
  brandSubtitle: {
    fontSize: "0.65rem",
    color: "#94a3b8",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
  desktopLinks: {
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
  },
  link: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: 500,
    padding: "0.4rem 0.6rem",
    borderRadius: "6px",
    transition: "all 0.2s ease",
  },
  activeLink: {
    color: "#fbbf24",
    backgroundColor: "rgba(212, 160, 23, 0.12)",
    borderBottom: "2px solid #fbbf24",
    fontWeight: 700,
  },
  actionContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  langSwitchBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    backgroundColor: "rgba(212, 160, 23, 0.1)",
    border: "1px solid rgba(212, 160, 23, 0.35)",
    color: "#D4A017",
    fontWeight: 700,
    padding: "0.4rem 0.85rem",
    borderRadius: "9999px",
    fontSize: "0.8rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  staffLoginBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#fca5a5",
    padding: "0.4rem 0.9rem",
    borderRadius: "9999px",
    textDecoration: "none",
    fontSize: "0.8rem",
    fontWeight: 600,
    transition: "all 0.2s ease",
  },
  hamburgerBtn: {
    background: "none",
    border: "1px solid rgba(212, 160, 23, 0.3)",
    color: "#D4A017",
    fontSize: "1.3rem",
    borderRadius: "6px",
    padding: "0.3rem 0.6rem",
    cursor: "pointer",
  },
  drawerOverlay: {
    position: "fixed" as const,
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(8px)",
    zIndex: 200,
    display: "flex",
    justifyContent: "flex-end",
  },
  drawerContainer: {
    width: "280px",
    backgroundColor: "#0d2137",
    height: "100%",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    borderLeft: "1px solid rgba(212, 160, 23, 0.3)",
    boxShadow: "-4px 0 25px rgba(0,0,0,0.6)",
  },
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "1rem",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  drawerLinks: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.8rem",
    margin: "1.5rem 0",
  },
  drawerLink: {
    color: "#cbd5e1",
    textDecoration: "none",
    fontSize: "1rem",
    padding: "0.6rem 0.8rem",
    borderRadius: "6px",
    fontWeight: 500,
  },
  activeDrawerLink: {
    color: "#fbbf24",
    backgroundColor: "rgba(212, 160, 23, 0.15)",
    fontWeight: 700,
  },
  drawerFooter: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.8rem",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    paddingTop: "1rem",
  },
  drawerLangBtn: {
    width: "100%",
    padding: "0.6rem",
    backgroundColor: "rgba(212, 160, 23, 0.15)",
    border: "1px solid rgba(212, 160, 23, 0.4)",
    color: "#D4A017",
    fontWeight: 700,
    borderRadius: "8px",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  drawerStaffBtn: {
    width: "100%",
    padding: "0.6rem",
    textAlign: "center" as const,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    color: "#fca5a5",
    fontWeight: 700,
    borderRadius: "8px",
    fontSize: "0.85rem",
    textDecoration: "none",
  },
};
