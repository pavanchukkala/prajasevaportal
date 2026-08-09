"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";

const MANDAL_DATA = [
  { name: "Srikalahasti", nameTe: "శ్రీకాళహస్తి", pop: "1,20,382", villages: 45, type: "Urban/Rural", descEn: "Municipal town and temple town. Home of the Srikalahasteeswara Temple. Urban hub of the constituency.", descTe: "మున్సిపల్ పట్టణం మరియు పుణ్యక్షేత్రం. శ్రీకాళహస్తీశ్వర ఆలయ క్షేత్రం. నియోజకవర్గ పట్టణ కేంద్రం.", priority: "Water Infrastructure", status: "Active Oversight" },
  { name: "Renigunta", nameTe: "రేణిగుంట", pop: "85,630", villages: 32, type: "Urban/Rural", descEn: "Strategic transport and industrial hub. Location of Renigunta Airport (Tirupati International Airport).", descTe: "కీలక రవాణా మరియు పారిశ్రామిక కేంద్రం. రేణిగుంట విమానాశ్రయం (తిరుపతి ఇంటర్నేషనల్ విమానాశ్రయం) ఉన్న ప్రదేశం.", priority: "Drainage & Roads", status: "Active Oversight" },
  { name: "Yerpedu", nameTe: "ఏర్పేడు", pop: "54,231", villages: 38, type: "Rural", descEn: "Predominantly agricultural mandal. Significant welfare and rural development activity.", descTe: "వ్యవసాయ ఆధారిత మండలం. సంక్షేమం మరియు గ్రామీణాభివృద్ధి కార్యక్రమాలు విస్తృతంగా జరిగే ప్రాంతం.", priority: "Pension Disbursement", status: "Monitored" },
  { name: "Thottambedu", nameTe: "తొట్టంబేడు", pop: "52,630", villages: 41, type: "Rural", descEn: "Rural mandal with active land registration and revenue services.", descTe: "రెవెన్యూ మరియు భూ రిజిస్ట్రేషన్ సేవలలో చురుగ్గా ఉన్న గ్రామీణ మండలం.", priority: "Irrigation Canals", status: "Monitored" },
];

export default function ConstituencyPage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)", color: "var(--text-main)", transition: "background-color 0.25s ease, color 0.25s ease" }}>
      <Navbar />
      <Breadcrumb />

      {/* Hero Header */}
      <section style={{ backgroundColor: "var(--bg-surface)", padding: "5rem 1.5rem", borderBottom: "1px solid var(--border-main)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--accent-teal)", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
            {isTe ? "అసెంబ్లీ నియోజకవర్గం" : "Assembly Constituency Analytics"}
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.03em", marginBottom: "1.25rem" }}>
            {t("constituency.title")}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: 1.7 }}>
            {t("constituency.subtitle")}
          </p>
        </div>
      </section>

      {/* Analytics Mandals Grid */}
      <section style={{ padding: "4.5rem 1.5rem", backgroundColor: "var(--bg-main)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--text-main)" }}>
              {t("constituency.mandalsTitle")}
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "1rem" }}>
              {t("constituency.mandalsDesc")}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.75rem", marginBottom: "4rem" }}>
            {MANDAL_DATA.map(m => (
              <div key={m.name} style={{ background: "var(--bg-elevated)", border: "1.5px solid var(--border-main)", borderRadius: "20px", padding: "2rem", boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--accent-teal)", margin: 0 }}>
                    {isTe ? m.nameTe : m.name}
                  </h3>
                  <span style={{ fontSize: "0.72rem", padding: "0.25rem 0.65rem", borderRadius: "9999px", background: "rgba(13,148,136,0.15)", border: "1px solid var(--accent-teal)", color: "var(--accent-teal)", fontWeight: 800 }}>
                    {m.status}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  {isTe ? m.descTe : m.descEn}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-main)", paddingTop: "1rem", fontSize: "0.82rem", marginBottom: "0.75rem" }}>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>{isTe ? "జనాభా: " : "Population: "}</span>
                    <strong style={{ color: "var(--accent-teal)" }}>{m.pop}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>{isTe ? "గ్రామాలు: " : "Villages: "}</span>
                    <strong style={{ color: "var(--text-main)" }}>{m.villages}</strong>
                  </div>
                </div>

                <div style={{ fontSize: "0.78rem", color: "var(--accent-gold)", fontWeight: 700 }}>
                  Focus Priority: {m.priority}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/constituency/mandals" style={{ background: "var(--accent-teal)", color: "#FFFFFF", fontWeight: 800, padding: "0.9rem 2.25rem", borderRadius: "9999px", textDecoration: "none", boxShadow: "0 4px 20px rgba(13,148,136,0.3)" }}>
              {isTe ? "మండలాల వివరాలు చూడండి →" : "View Mandal Details →"}
            </Link>
            <Link href="/constituency/services" style={{ border: "1.5px solid var(--accent-gold)", color: "var(--accent-gold)", backgroundColor: "var(--bg-elevated)", fontWeight: 700, padding: "0.9rem 2.25rem", borderRadius: "9999px", textDecoration: "none" }}>
              {isTe ? "సేవల జాబితా →" : "Services Directory →"}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
