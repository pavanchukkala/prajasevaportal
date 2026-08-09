"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function SecurityPage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🔒</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            {t("securityPage.title")}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7 }}>
            {t("securityPage.subtitle")}
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {[
            {
              title: isTe ? "రోల్-బేస్డ్ యాక్సెస్" : "Role-Based Access",
              desc: isTe ? "అధికారిక సిబ్బంది మాత్రమే లాగిన్ ద్వారా వివరాలు పరిశీలించగలరు." : "Reviewers, staff, and officers access complaint data strictly according to their assigned roles."
            },
            {
              title: isTe ? "ఆడిట్ ట్రాక్" : "Audit Trail",
              desc: isTe ? "ప్రతి స్థితి మార్పు, వివరాల చేరిక సమయంతో సహా రికార్డు చేయబడుతుంది." : "Every status change, assignment, and internal note is logged with a timestamp and actor."
            },
            {
              title: isTe ? "మొబైల్ నంబర్ పరిరక్షణ" : "Masked Mobile Numbers",
              desc: isTe ? "సిబ్బంది స్క్రీన్‌లలో మొబైల్ సంఖ్యలు +91 ******4321 విధంగా మాస్క్ చేయబడతాయి." : "Staff screens display masked numbers (+91 ******4321) to protect citizen identities."
            },
            {
              title: isTe ? "AI సురక్షిత పరిమితులు" : "AI Safety Guardrails",
              desc: isTe ? "AI అంచనాలు ప్రాథమికమైనవి మాత్రమే. ఇవి చట్టపరమైన తీర్పులు కావు." : "AI outputs provide preliminary indicators only and cannot declare guilt or replace investigations."
            }
          ].map(card => (
            <div key={card.title} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "2rem" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#D4A017", marginBottom: "0.75rem" }}>{card.title}</h3>
              <p style={{ color: "#94a3b8", lineHeight: 1.6, fontSize: "0.9rem" }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
