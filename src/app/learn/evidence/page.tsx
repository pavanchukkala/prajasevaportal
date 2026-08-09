"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function EvidencePage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📸</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            {t("learn.evidenceTitle")}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7 }}>
            {t("learn.evidenceDesc")}
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
          {[
            {
              title: isTe ? "ఉపయోగకరమైన ఆధారాలు" : "Useful Evidence",
              items: isTe
                ? ["స్పష్టమైన ఫోటోలు (స్థలం మరియు సమస్య స్పష్టంగా కనిపించేలా)", "రాతపూర్వక రసీదులు లేదా దరఖాస్తు కాపీలు", "అధికారిక సమాధానాలు లేదా నోటీసులు"]
                : ["Clear photographs showing the exact issue and location", "Written application receipts or acknowledgment slips", "Official notices or correspondence copies"]
            },
            {
              title: isTe ? "అప్‌లోడ్ చేయకూడనివి" : "What NOT to Upload",
              items: isTe
                ? ["ఆధార్ కార్డు లేదా బ్యాంక్ పాస్‌బుక్ కాపీలు", "ఫిర్యాదుతో సంబంధం లేని వ్యక్తిగత పత్రాలు", "ఇతరుల వ్యక్తిగత ఫోటోలు"]
                : ["Aadhaar cards, PAN cards, or bank passbook copies", "Sensitive personal documents unrelated to the public complaint", "Private photos of unrelated individuals"]
            }
          ].map(sec => (
            <div key={sec.title} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "2rem" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#D4A017", marginBottom: "1rem" }}>{sec.title}</h2>
              <ul style={{ paddingLeft: "1.25rem", color: "#94a3b8", lineHeight: 1.8, fontSize: "0.95rem" }}>
                {sec.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
