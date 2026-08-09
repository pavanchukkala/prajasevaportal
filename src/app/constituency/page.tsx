"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";

const MANDAL_DATA = [
  { name: "Srikalahasti", nameTe: "శ్రీకాళహస్తి", pop: "1,20,382", villages: 45, type: "Urban/Rural", descEn: "Municipal town and temple town. Home of the Srikalahasteeswara Temple. Urban hub of the constituency.", descTe: "మున్సిపల్ పట్టణం మరియు పుణ్యక్షేత్రం. శ్రీకాళహస్తీశ్వర ఆలయ క్షేత్రం. నియోజకవర్గ పట్టణ కేంద్రం." },
  { name: "Renigunta", nameTe: "రేణిగుంట", pop: "85,630", villages: 32, type: "Urban/Rural", descEn: "Strategic transport and industrial hub. Location of Renigunta Airport (Tirupati International Airport).", descTe: "కీలక రవాణా మరియు పారిశ్రామిక కేంద్రం. రేణిగుంట విమానాశ్రయం (తిరుపతి ఇంటర్నేషనల్ విమానాశ్రయం) ఉన్న ప్రదేశం." },
  { name: "Yerpedu", nameTe: "ఏర్పేడు", pop: "54,231", villages: 38, type: "Rural", descEn: "Predominantly agricultural mandal. Significant welfare and rural development activity.", descTe: "వ్యవసాయ ఆధారిత మండలం. సంక్షేమం మరియు గ్రామీణాభివృద్ధి కార్యక్రమాలు విస్తృతంగా జరిగే ప్రాంతం." },
  { name: "Thottambedu", nameTe: "తొట్టంబేడు", pop: "52,630", villages: 41, type: "Rural", descEn: "Rural mandal with active land registration and revenue services.", descTe: "రెవెన్యూ మరియు భూ రిజిస్ట్రేషన్ సేవలలో చురుగ్గా ఉన్న గ్రామీణ మండలం." },
];

export default function ConstituencyPage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            {isTe ? "అసెంబ్లీ నియోజకవర్గం" : "Assembly Constituency"}
          </div>
          <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1.25rem" }}>
            {t("constituency.title")}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem", lineHeight: 1.7 }}>
            {t("constituency.subtitle")}
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff" }}>
              {t("constituency.mandalsTitle")}
            </h2>
            <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
              {t("constituency.mandalsDesc")}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "4rem" }}>
            {MANDAL_DATA.map(m => (
              <div key={m.name} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem" }}>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#D4A017" }}>
                    {isTe ? m.nameTe : m.name}
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>{m.type}</span>
                </div>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  {isTe ? m.descTe : m.descEn}
                </p>
                <div style={{ display: "flex", gap: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem", fontSize: "0.8rem" }}>
                  <div>
                    <span style={{ color: "#64748b" }}>{isTe ? "జనాభా: " : "Population: "}</span>
                    <strong style={{ color: "#ffffff" }}>{m.pop}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>{isTe ? "గ్రామాలు: " : "Villages: "}</span>
                    <strong style={{ color: "#ffffff" }}>{m.villages}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href="/constituency/mandals" style={{ background: "linear-gradient(135deg, #D4A017, #F3E5AB)", color: "#060f1a", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>
              {isTe ? "మండలాల వివరాలు చూడండి →" : "View Mandal Details →"}
            </Link>
            <Link href="/constituency/services" style={{ border: "1px solid rgba(212,160,23,0.3)", color: "#D4A017", fontWeight: 600, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>
              {isTe ? "సేవల జాబితా →" : "Services Directory →"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
