"use client";

import React from "react";
import Link from "next/link";
import CivicLogo from "./CivicLogo";
import NationalEmblemIndia from "./NationalEmblemIndia";
import { useLanguage } from "@/context/LanguageContext";

export default function GlobalFooter() {
  const { language } = useLanguage();
  const isTe = language === "te";

  return (
    <footer
      style={{
        backgroundColor: "var(--bg-surface)",
        borderTop: "1px solid var(--border-main)",
        padding: "4rem 1.5rem 2.5rem",
        color: "var(--text-main)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.25rem" }}>
              <CivicLogo size="lg" />
              <NationalEmblemIndia size={42} showMotto={true} showBadge={true} theme="gold" />
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.88rem",
                lineHeight: 1.6,
                marginBottom: "1rem",
              }}
            >
              {isTe
                ? "శ్రీకాళహస్తి అసెంబ్లీ నియోజకవర్గం (సంఖ్య 168), తిరుపతి జిల్లా, ఆంధ్రప్రదేశ్."
                : "Civic-technology and public grievance intelligence platform for Srikalahasti Assembly Constituency No. 168, Tirupati District, Andhra Pradesh."}
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "var(--text-main)",
                marginBottom: "1.25rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {isTe ? "ముఖ్య లింకులు" : "Platform Links"}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.9rem" }}>
              <li><Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>{isTe ? "హోమ్" : "Home"}</Link></li>
              <li><Link href="/submit" style={{ color: "var(--text-muted)", textDecoration: "none" }}>{isTe ? "ఫిర్యాదు నమోదు" : "Submit Grievance"}</Link></li>
              <li><Link href="/track" style={{ color: "var(--text-muted)", textDecoration: "none" }}>{isTe ? "ఫిర్యాదు ట్రాకింగ్" : "Track Complaint"}</Link></li>
              <li><Link href="/constituency" style={{ color: "var(--text-muted)", textDecoration: "none" }}>{isTe ? "నియోజకవర్గం" : "Constituency Data"}</Link></li>
              <li><Link href="/learn" style={{ color: "var(--text-muted)", textDecoration: "none" }}>{isTe ? "అవగాహన కేంద్రం" : "Citizen Learning Hub"}</Link></li>
              <li><Link href="/developer" style={{ color: "var(--text-muted)", textDecoration: "none" }}>{isTe ? "డెవలపర్ పేజీ" : "Meet Developer"}</Link></li>
            </ul>
          </div>

          {/* Security & Principles */}
          <div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "var(--text-main)",
                marginBottom: "1.25rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {isTe ? "భద్రత & సూత్రాలు" : "Security & Governance"}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.9rem" }}>
              <li><Link href="/security" style={{ color: "var(--text-muted)", textDecoration: "none" }}>{isTe ? "భద్రతా ప్రమాణాలు" : "Security Roadmap"}</Link></li>
              <li><Link href="/privacy" style={{ color: "var(--text-muted)", textDecoration: "none" }}>{isTe ? "గోప్యతా విధానం" : "Privacy Policy"}</Link></li>
              <li><Link href="/staff/login" style={{ color: "var(--accent-gold)", textDecoration: "none", fontWeight: 700 }}>{isTe ? "రక్షిత సిబ్బంది పోర్టల్" : "Protected Staff Portal"}</Link></li>
            </ul>
            <div style={{ marginTop: "1.25rem", fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              ✓ Privacy-aware reporting<br />
              ✓ Safety-first triage<br />
              ✓ Restricted reviewer access
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-main)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.82rem",
            color: "var(--text-muted)",
          }}
        >
          <div>
            © 2026 Srikalahasti Praja Seva Intelligence Platform (No. 168). All rights reserved.
          </div>
          <div>
            AI assessments are preliminary guidance only and subject to human review by competent authorities.
          </div>
        </div>
      </div>
    </footer>
  );
}
