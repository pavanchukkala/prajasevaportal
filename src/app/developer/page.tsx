"use client";
import Link from "next/link";
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
    <main style={{ minHeight: "100vh", background: "#030712", color: "#F8FAFC", fontFamily: "system-ui, sans-serif" }}>
      {/* Ambient Electric Violet & Cyan Glow Orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "15%", left: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "10%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)" }} />
      </div>

      {/* Nav */}
      <Navbar />
      <Breadcrumb />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "840px", margin: "0 auto", padding: "3.5rem 1.5rem 6.5rem" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ width: "105px", height: "105px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.3))", border: "2px solid #A855F7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2.5rem", fontWeight: 900, color: "#A855F7", boxShadow: "0 0 35px rgba(168,85,247,0.35)" }}>
            {dev.name.split(" ").map(n => n[0]).join("")}
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: "#F8FAFC", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>
            {isTe ? "పవన్ చుక్కల" : dev.name}
          </h1>
          <div style={{ color: "#06B6D4", fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
            {isTe ? "పౌర-సాంకేతిక సాఫ్ట్‌వేర్ ఇంజనీర్" : dev.title}
          </div>
          {dev.location && (
            <div style={{ color: "#94A3B8", fontSize: "0.95rem" }}>📍 {dev.location}</div>
          )}
        </div>

        {/* Platform context badge */}
        <div style={{ background: "rgba(124,58,237,0.1)", border: "1.5px solid rgba(168,85,247,0.35)", borderRadius: "16px", padding: "1.25rem 1.75rem", marginBottom: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.72rem", color: "#A855F7", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 800, marginBottom: "0.35rem" }}>
            {t("developerPopup.platformLabel", "Platform Context")}
          </div>
          <div style={{ color: "#CBD5E1", fontSize: "0.95rem", lineHeight: 1.6 }}>
            {isTe ? "శ్రీకాళహస్తి అసెంబ్లీ నియోజకవర్గం కోసం ప్రతిపాదించిన పౌర-సాంకేతిక వేదిక." : dev.platformContext}
          </div>
        </div>

        {/* Story */}
        <div style={{ background: "rgba(17,24,39,0.8)", border: "1.5px solid rgba(124,58,237,0.3)", borderRadius: "20px", padding: "2.25rem", marginBottom: "1.75rem", backdropFilter: "blur(20px)", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
          <h2 style={{ fontWeight: 900, color: "#F8FAFC", marginBottom: "1.25rem", fontSize: "1.2rem" }}>
            {isTe ? "ఈ ప్రయత్నం గురించి" : "About This Initiative"}
          </h2>
          <p style={{ color: "#CBD5E1", lineHeight: 1.8, marginBottom: "1.25rem", fontSize: "0.98rem" }}>
            {isTe ? "శ్రీకాళహస్తి పౌరులు తమ సమస్యలను నివేదించడానికి మరియు ప్రజా పారదర్శకతను పెంచడానికి ఈ ప్లాట్‌ఫారమ్ అభివృద్ధి చేయబడింది." : dev.longStory}
          </p>
          <div style={{ background: "rgba(3,7,18,0.7)", borderRadius: "12px", padding: "1.1rem", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 800, marginBottom: "0.5rem" }}>
              {isTe ? "గమనిక" : "Disclaimer"}
            </div>
            <p style={{ color: "#64748B", fontSize: "0.82rem", lineHeight: 1.6, margin: 0 }}>
              {t("common.proposedNotice")}
            </p>
          </div>
        </div>

        {/* Values */}
        {dev.values.length > 0 && (
          <div style={{ background: "rgba(17,24,39,0.65)", border: "1.5px solid rgba(6,182,212,0.3)", borderRadius: "20px", padding: "2rem", marginBottom: "1.75rem" }}>
            <h2 style={{ fontWeight: 900, color: "#F8FAFC", marginBottom: "1.25rem", fontSize: "1.1rem" }}>
              {t("developerPopup.valuesLabel", "Platform Values")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {dev.values.map((v, i) => (
                <div key={i} style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
                  <span style={{ color: "#06B6D4", flexShrink: 0, marginTop: "2px" }}>⬡</span>
                  <span style={{ color: "#CBD5E1", fontSize: "0.95rem", lineHeight: 1.6 }}>
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
            <a href={dev.links.github} target="_blank" rel="noopener noreferrer" style={{ padding: "0.7rem 1.5rem", background: "rgba(124,58,237,0.18)", border: "1.5px solid #A855F7", borderRadius: "9999px", color: "#A855F7", fontWeight: 800, textDecoration: "none", fontSize: "0.9rem" }}>
              ⬡ GitHub Repository
            </a>
          )}
          {dev.email && (
            <a href={`mailto:${dev.email}`} style={{ padding: "0.7rem 1.5rem", background: "rgba(6,182,212,0.15)", border: "1.5px solid #06B6D4", borderRadius: "9999px", color: "#06B6D4", fontWeight: 800, textDecoration: "none", fontSize: "0.9rem" }}>
              ✉ Contact Developer
            </a>
          )}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/submit" style={{ display: "inline-block", background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)", color: "#FFFFFF", fontWeight: 800, padding: "0.9rem 2.25rem", borderRadius: "9999px", textDecoration: "none", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>
            {t("home.submitGrievance")}
          </Link>
          <Link href="/" style={{ display: "inline-block", border: "1.5px solid #06B6D4", color: "#06B6D4", backgroundColor: "rgba(17,24,39,0.5)", fontWeight: 700, padding: "0.9rem 2.25rem", borderRadius: "9999px", textDecoration: "none" }}>
            {t("nav.backHome")}
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
