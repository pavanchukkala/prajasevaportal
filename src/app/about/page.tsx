"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            {isTe ? "ప్లాట్‌ఫారమ్ గురించి" : "About the Platform"}
          </div>
          <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1.5rem", lineHeight: 1.1 }}>
            {t("about.title")}
          </h1>
          <p style={{ fontSize: "1.15rem", color: "#94a3b8", lineHeight: 1.8 }}>
            {t("about.subtitle")}
          </p>
        </div>
      </section>

      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "4rem" }}>
            {[
              { icon: "🏛️", title: t("about.visionTitle"), text: t("about.visionDesc") },
              { icon: "🧠", title: t("about.aiRoleTitle"), text: t("about.aiRoleDesc") },
              { icon: "🔒", title: t("about.privacyTitle"), text: t("about.privacyDesc") },
              { icon: "⚖️", title: t("about.safetyTitle"), text: t("about.safetyDesc") },
            ].map(c => (
              <div key={c.title} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "2rem" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{c.icon}</div>
                <h3 style={{ fontWeight: 700, color: "#D4A017", marginBottom: "0.75rem" }}>{c.title}</h3>
                <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.9rem" }}>{c.text}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/submit" style={{ display: "inline-block", background: "linear-gradient(135deg, #D4A017, #F3E5AB)", color: "#060f1a", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>
              {t("home.submitGrievance")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
