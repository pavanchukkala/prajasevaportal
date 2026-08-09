"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function MandalsPage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  const mandals = [
    {
      name: "Srikalahasti",
      nameTe: "శ్రీకాళహస్తి",
      type: isTe ? "పట్టణ / గ్రామీణ" : "Urban / Rural",
      population: "1,20,382",
      villages: 45,
      wards: 17,
      highlight: isTe ? "మున్సిపాలిటీ పట్టణం మరియు పుణ్యక్షేత్రం. ప్రసిద్ధ శ్రీకాళహస్తీశ్వర ఆలయ క్షేత్రం. నియోజకవర్గ పరిపాలనా కేంద్రం." : "Municipality town and temple city. Home of the ancient Srikalahasteeswara Temple (one of the Pancha Bhuta Stalas). The cultural and administrative hub of the constituency.",
      keyDepts: isTe ? ["రేవెన్యూ", "మున్సిపల్ పరిపాలన", "పోలీస్", "ఆరోగ్యం"] : ["Revenue", "Municipal Administration", "Police", "Health"],
    },
    {
      name: "Renigunta",
      nameTe: "రేణిగుంట",
      type: isTe ? "పట్టణ / గ్రామీణ" : "Urban / Rural",
      population: "85,630",
      villages: 32,
      wards: 0,
      highlight: isTe ? "కీలక రవాణా మరియు పారిశ్రామిక ప్రాంతం. రేణిగుంట విమానాశ్రయం (తిరుపతి అంతర్జాతీయ విమానాశ్రయం) ఉన్న స్థలం." : "Strategic transport and industrial corridor. Home of Tirupati International Airport (Renigunta Airport). Growing urban and peri-urban population with significant infrastructure demands.",
      keyDepts: isTe ? ["రవాణా", "విద్యుత్", "రోడ్లు & భవనాలు", "రెవెన్యూ"] : ["Transport", "Electricity", "Roads & Buildings", "Revenue"],
    },
    {
      name: "Yerpedu",
      nameTe: "ఏర్పేడు",
      type: isTe ? "గ్రామీణ" : "Rural",
      population: "54,231",
      villages: 38,
      wards: 0,
      highlight: isTe ? "ప్రధానంగా వ్యవసాయ ఆధారిత మండలం. ఉపాధి హామీ, పీఎం కిసాన్ మరియు గ్రామ సచివాలయ సేవలలో కీలకం." : "Predominantly agricultural mandal with active welfare activity. Key mandal for MGNREGS employment, PM Kisan implementation, and Village Secretariat service delivery.",
      keyDepts: isTe ? ["పంచాయతీ రాజ్", "వ్యవసాయం", "పౌర సరఫరాలు", "సామాజిక సంక్షేమం"] : ["Panchayat Raj", "Agriculture", "Civil Supplies", "Social Welfare"],
    },
    {
      name: "Thottambedu",
      nameTe: "తొట్టంబేడు",
      type: isTe ? "గ్రామీణ" : "Rural",
      population: "52,630",
      villages: 41,
      wards: 0,
      highlight: isTe ? "భూ రిజిస్ట్రేషన్ మరియు రెవెన్యూ సేవలలో చురుగ్గా ఉన్న గ్రామీణ మండలం. వ్యవసాయ ఆర్థిక వ్యవస్థ." : "Rural mandal with active land registration and revenue services. High volume of land mutation and pattadar passbook activity. Agricultural economy.",
      keyDepts: isTe ? ["రెవెన్యూ", "రిజిస్ట్రేషన్ & స్టాంపులు", "వ్యవసాయం", "పంచాయతీ రాజ్"] : ["Revenue", "Registration & Stamps", "Agriculture", "Panchayat Raj"],
    },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            {t("constituency.mandalsTitle")}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7 }}>
            {isTe ? "శ్రీకాళహస్తి అసెంబ్లీ నియోజకవర్గం (సంఖ్య 168) తిరుపతి జిల్లాలోని నాలుగు మండలాలతో కూడి ఉంది." : "Srikalahasti Assembly Constituency (No. 168) comprises four mandals in Tirupati District, Andhra Pradesh."}
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
          {mandals.map((m, i) => (
            <div key={m.name} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "20px", padding: "2rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", width: "48px", height: "48px", borderRadius: "50%", background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#D4A017", fontSize: "1.1rem" }}>{i + 1}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "0.75rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff" }}>
                  {isTe ? m.nameTe : m.name}
                </h2>
                <span style={{ fontSize: "0.75rem", color: "#D4A017", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "9999px", background: "rgba(212,160,23,0.1)" }}>{m.type}</span>
              </div>
              <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: "1.5rem", maxWidth: "800px" }}>{m.highlight}</p>
              <div style={{ display: "flex", gap: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.25rem" }}>
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>{isTe ? "జనాభా" : "Population"}</div>
                  <div style={{ fontWeight: 800, color: "#D4A017", fontSize: "1.1rem" }}>{m.population}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>{isTe ? "గ్రామాలు" : "Villages"}</div>
                  <div style={{ fontWeight: 800, color: "#ffffff", fontSize: "1.1rem" }}>{m.villages}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
