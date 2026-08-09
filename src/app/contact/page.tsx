"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            {t("contact.title")}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7 }}>
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "20px", padding: "2.5rem", marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#D4A017", marginBottom: "1rem" }}>
              {isTe ? "ముఖ్యమైన గమనిక" : "Public Assistance Note"}
            </h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
              {isTe
                ? "ఫిర్యాదు నమోదు చేయడానికి దయచేసి 'ఫిర్యాదు చేయండి' పేజీని ఉపయోగించండి. ఈ వేదిక పౌరులకు సురక్షితమైన సేవలను అందిస్తుంది."
                : "To submit a public grievance or track an existing complaint, please use the official portal forms."}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/submit" style={{ background: "linear-gradient(135deg, #D4A017, #F3E5AB)", color: "#060f1a", fontWeight: 700, padding: "0.75rem 1.5rem", borderRadius: "9999px", textDecoration: "none", fontSize: "0.85rem" }}>
                {t("home.submitGrievance")}
              </Link>
              <Link href="/track" style={{ border: "1px solid rgba(212,160,23,0.3)", color: "#D4A017", fontWeight: 600, padding: "0.75rem 1.5rem", borderRadius: "9999px", textDecoration: "none", fontSize: "0.85rem" }}>
                {t("home.trackComplaint")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
