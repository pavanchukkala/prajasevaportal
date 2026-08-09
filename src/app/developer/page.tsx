"use client";

import Link from "next/link";
import { Code2, Mail, MapPin, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { developerConfig } from "@/config/developer";
import { useLanguage } from "@/context/LanguageContext";

export default function DeveloperPage() {
  const dev = developerConfig;
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)", color: "var(--text-main)", transition: "background-color 0.25s ease, color 0.25s ease" }}>
      <Navbar />
      <Breadcrumb />

      <div style={{ maxWidth: "840px", margin: "0 auto", padding: "3.5rem 1.5rem 6.5rem" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "rgba(13,148,136,0.15)", border: "2px solid var(--accent-teal)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2.2rem", fontWeight: 900, color: "var(--accent-teal)", boxShadow: "0 4px 20px rgba(13,148,136,0.2)" }}>
            {dev.name.split(" ").map(n => n[0]).join("")}
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
            {isTe ? "పవన్ చుక్కల" : dev.name}
          </h1>
          <div style={{ color: "var(--accent-teal)", fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            {isTe ? "పౌర-సాంకేతిక సాఫ్ట్‌వేర్ ఇంజనీర్" : dev.title}
          </div>
          {dev.location && (
            <div style={{ color: "var(--text-muted)", fontSize: "0.95rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
              <MapPin size={16} style={{ color: "var(--accent-gold)" }} />
              <span>{dev.location}</span>
            </div>
          )}
        </div>

        {/* Platform context badge */}
        <div style={{ background: "var(--bg-surface)", border: "1.5px solid var(--border-main)", borderRadius: "16px", padding: "1.25rem 1.75rem", marginBottom: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.72rem", color: "var(--accent-gold)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 800, marginBottom: "0.35rem" }}>
            {t("developerPopup.platformLabel", "Platform Context")}
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
            {isTe ? "శ్రీకాళహస్తి అసెంబ్లీ నియోజకవర్గం కోసం ప్రతిపాదించిన పౌర-సాంకేతిక వేదిక." : dev.platformContext}
          </div>
        </div>

        {/* Story */}
        <div style={{ background: "var(--bg-elevated)", border: "1.5px solid var(--border-main)", borderRadius: "20px", padding: "2.25rem", marginBottom: "1.75rem", boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontWeight: 900, color: "var(--text-main)", marginBottom: "1.25rem", fontSize: "1.2rem" }}>
            {isTe ? "ఈ ప్రయత్నం గురించి" : "About This Initiative"}
          </h2>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.8, marginBottom: "1.25rem", fontSize: "0.98rem" }}>
            {isTe ? "శ్రీకాళహస్తి పౌరులు తమ సమస్యలను నివేదించడానికి మరియు ప్రజా పారదర్శకతను పెంచడానికి ఈ ప్లాట్‌ఫారమ్ అభివృద్ధి చేయబడింది." : dev.longStory}
          </p>
          <div style={{ background: "var(--bg-surface)", borderRadius: "12px", padding: "1.1rem", border: "1px solid var(--border-main)" }}>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800, marginBottom: "0.5rem" }}>
              {isTe ? "గమనిక" : "Disclaimer"}
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", lineHeight: 1.6, margin: 0 }}>
              {t("common.proposedNotice")}
            </p>
          </div>
        </div>

        {/* Values */}
        {dev.values.length > 0 && (
          <div style={{ background: "var(--bg-elevated)", border: "1.5px solid var(--border-main)", borderRadius: "20px", padding: "2rem", marginBottom: "1.75rem" }}>
            <h2 style={{ fontWeight: 900, color: "var(--text-main)", marginBottom: "1.25rem", fontSize: "1.1rem" }}>
              {t("developerPopup.valuesLabel", "Platform Values")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {dev.values.map((v, i) => (
                <div key={i} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                  <Sparkles size={18} style={{ color: "var(--accent-teal)", flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                    {isTe ? (i === 0 ? "పౌర గోప్యత ప్రథమ ప్రాధాన్యం" : i === 1 ? "పారదర్శక AI అంచనాలు" : i === 2 ? "రక్షిత ప్రజా సేవా నిర్వహణ" : v) : v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", marginBottom: "2.25rem" }}>
          {dev.links.github && (
            <a href={dev.links.github} target="_blank" rel="noopener noreferrer" style={{ padding: "0.7rem 1.5rem", background: "rgba(13,148,136,0.15)", border: "1.5px solid var(--accent-teal)", borderRadius: "9999px", color: "var(--accent-teal)", fontWeight: 800, textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Code2 size={16} />
              <span>GitHub Repository</span>
            </a>
          )}
          {dev.email && (
            <a href={`mailto:${dev.email}`} style={{ padding: "0.7rem 1.5rem", background: "rgba(180,83,9,0.15)", border: "1.5px solid var(--accent-gold)", borderRadius: "9999px", color: "var(--accent-gold)", fontWeight: 800, textDecoration: "none", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <Mail size={16} />
              <span>Contact Developer</span>
            </a>
          )}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/submit" style={{ display: "inline-block", background: "var(--accent-teal)", color: "#FFFFFF", fontWeight: 800, padding: "0.9rem 2.25rem", borderRadius: "9999px", textDecoration: "none", boxShadow: "0 4px 20px rgba(13,148,136,0.3)" }}>
            {t("home.submitGrievance")}
          </Link>
          <Link href="/" style={{ display: "inline-block", border: "1.5px solid var(--accent-gold)", color: "var(--accent-gold)", backgroundColor: "var(--bg-elevated)", fontWeight: 700, padding: "0.9rem 2.25rem", borderRadius: "9999px", textDecoration: "none" }}>
            {t("nav.backHome")}
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
