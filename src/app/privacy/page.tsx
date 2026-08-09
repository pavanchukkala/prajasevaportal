"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            {isTe ? "గోప్యతా విధి విధానాలు" : "Privacy & Data Protection"}
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            {t("privacyPage.title")}
          </h1>
          <p style={{ color: "#94a3b8" }}>{t("privacyPage.subtitle")}</p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
          {[
            {
              title: isTe ? "1. సంప్రదింపు గోప్యత" : "1. Confidential Contact Handling",
              desc: isTe ? "మీ మొబైల్ సంఖ్య కేవలం ఫిర్యాదు ID మరియు స్థితి నవీకరణలను పంపడానికి మాత్రమే ఉపయోగించబడుతుంది. ఇది బహిరంగంగా ఎప్పుడూ చూపబడదు." : "Mobile numbers are collected strictly for notification purposes. Raw mobile numbers are never exposed in public API responses."
            },
            {
              title: isTe ? "2. అనామక సమర్పణలు" : "2. Anonymous Reporting Option",
              desc: isTe ? "పౌరులు ఎలాంటి సంప్రదింపు వివరాలు ఇవ్వకుండా ఫిర్యాదులు సమర్పించవచ్చు. అనామక సమర్పణలలో మొబైల్ సంఖ్య నిల్వ చేయబడదు." : "Citizens may choose to submit complaints anonymously without providing phone numbers or email addresses."
            },
            {
              title: isTe ? "3. ఆధారాల పరిరక్షణ" : "3. Evidence Privacy",
              desc: isTe ? "అప్‌లోడ్ చేసిన ఫొటోలు మరియు పత్రాలు అధికారిక సిబ్బందికి మాత్రమే లభిస్తాయి. ఇవి బహిరంగంగా ప్రదర్శించబడవు." : "Uploaded photos, audio recordings, and documents are accessible strictly to authorized review staff."
            }
          ].map(section => (
            <div key={section.title} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "2rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#D4A017", marginBottom: "0.75rem" }}>{section.title}</h2>
              <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem" }}>{section.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
