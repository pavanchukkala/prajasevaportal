"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function HowToComplainPage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            {t("learn.howToTitle")}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7 }}>
            {t("learn.howToDesc")}
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {[
            {
              num: "1",
              title: isTe ? "తేదీ మరియు స్థలాన్ని స్పష్టంగా పేర్కొనండి" : "Include Exact Date & Location",
              desc: isTe ? "సంఘటన ఎప్పుడు మరియు ఎక్కడ జరిగిందో (మండలం, గ్రామం/వార్డు) స్పష్టంగా రాయండి." : "State precisely when and where the incident occurred, including Mandal, village, or ward name."
            },
            {
              num: "2",
              title: isTe ? "వాస్తవాలను మాత్రమే వివరించండి" : "Stick to Verifiable Facts",
              desc: isTe ? "ఊహాగానాలు కాకుండా నిజంగా జరిగిన విషయాలను మాత్రమే పొందుపరచండి." : "Focus on factual occurrences, specific actions, and measurable impacts rather than vague complaints."
            },
            {
              num: "3",
              title: isTe ? "ఉపయోగకరమైన ఆధారాలను జోడించండి" : "Attach Supporting Evidence",
              desc: isTe ? "ఫోటోలు లేదా సంబంధిత లేఖలు అప్‌లోడ్ చేయడం ద్వారా పరిష్కారం వేగవంతమవుతుంది." : "Attach relevant photographs or document receipts whenever available to support the review process."
            }
          ].map(step => (
            <div key={step.num} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "2rem", display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#D4A017", color: "#060f1a", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {step.num}
              </div>
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>{step.title}</h2>
                <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem" }}>{step.desc}</p>
              </div>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href="/submit" style={{ display: "inline-block", background: "linear-gradient(135deg, #D4A017, #F3E5AB)", color: "#060f1a", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>
              {t("home.submitGrievance")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
