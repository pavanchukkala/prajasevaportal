"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, Menu, X } from "lucide-react";
import IndianFlagRibbon from "./IndianFlagRibbon";
import CivicLogo from "./CivicLogo";
import ThemeSwitcher from "./ThemeSwitcher";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

export default function GlobalHeader() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const isTe = language === "te";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: isTe ? "హోమ్" : "Home" },
    { href: "/submit", label: isTe ? "ఫిర్యాదు నమోదు" : "Submit Grievance" },
    { href: "/track", label: isTe ? "ట్రాకింగ్" : "Track Complaint" },
    { href: "/constituency", label: isTe ? "నియోజకవర్గం" : "Constituency" },
    { href: "/learn", label: isTe ? "అవగాహన" : "Learn" },
    { href: "/developer", label: isTe ? "డెవలపర్" : "Meet Developer" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-main)",
        backdropFilter: "blur(12px)",
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
      <IndianFlagRibbon />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0.75rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <CivicLogo size="md" />

        {/* Desktop Navigation */}
        <nav
          aria-label="Main Navigation"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
          }}
          className="hidden-mobile"
        >
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: "0.5rem 0.85rem",
                    borderRadius: "8px",
                    fontSize: "0.88rem",
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? "var(--accent-teal)" : "var(--text-main)",
                    backgroundColor: isActive ? "rgba(13,148,136,0.12)" : "transparent",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingLeft: "0.75rem", borderLeft: "1px solid var(--border-main)" }}>
            <LanguageSwitcher />
            <ThemeSwitcher />
            <Link
              href="/staff/login"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "9999px",
                fontSize: "0.82rem",
                fontWeight: 800,
                color: "#FFFFFF",
                backgroundColor: "var(--accent-gold)",
                textDecoration: "none",
                boxShadow: "0 2px 10px rgba(180,83,9,0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <Lock size={14} />
              <span>{isTe ? "సిబ్బంది లాగిన్" : "Staff Login"}</span>
            </Link>
          </div>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileMenuOpen}
          style={{
            display: "none",
            background: "none",
            border: "1px solid var(--border-main)",
            borderRadius: "8px",
            padding: "0.5rem",
            color: "var(--text-main)",
            cursor: "pointer",
          }}
          className="show-mobile"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: "var(--bg-surface)",
            borderBottom: "1px solid var(--border-main)",
            padding: "1.25rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: "1rem",
                fontWeight: pathname === link.href ? 800 : 600,
                color: pathname === link.href ? "var(--accent-teal)" : "var(--text-main)",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid var(--border-main)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{isTe ? "భాష:" : "Language:"}</span>
              <LanguageSwitcher />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{isTe ? "థీమ్:" : "Theme:"}</span>
              <ThemeSwitcher />
            </div>
            <Link
              href="/staff/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: "0.65rem",
                borderRadius: "8px",
                textAlign: "center",
                fontWeight: 800,
                color: "#FFFFFF",
                backgroundColor: "var(--accent-gold)",
                textDecoration: "none",
                marginTop: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
              }}
            >
              <Lock size={14} />
              <span>{isTe ? "సిబ్బంది లాగిన్" : "Staff Login"}</span>
            </Link>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </header>
  );
}
