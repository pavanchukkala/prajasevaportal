import Link from "next/link";
import { geographyConfig } from "@/config/geography";

export const metadata = {
  title: "Constituency | Srikalahasti Praja Seva Intelligence Platform",
  description: "Overview of Srikalahasti Assembly Constituency No. 168 — mandals, population, and public service structure.",
};

const MANDAL_DATA = [
  { name: "Srikalahasti", nameTe: "శ్రీకాళహస్తి", pop: "1,20,382", villages: 45, type: "Urban/Rural", desc: "Municipal town and temple town. Home of the Srikalahasteeswara Temple. Urban hub of the constituency." },
  { name: "Renigunta", nameTe: "రేణిగుంట", pop: "85,630", villages: 32, type: "Urban/Rural", desc: "Strategic transport and industrial hub. Location of Renigunta Airport (Tirupati International Airport)." },
  { name: "Yerpedu", nameTe: "ఏర్పేడు", pop: "54,231", villages: 38, type: "Rural", desc: "Predominantly agricultural mandal. Significant welfare and rural development activity." },
  { name: "Thottambedu", nameTe: "తొట్టంబేడు", pop: "52,630", villages: 41, type: "Rural", desc: "Rural mandal with active land registration and revenue services." },
];

export default function ConstituencyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <nav style={{ background: "rgba(6,15,26,0.95)", borderBottom: "1px solid rgba(212,160,23,0.15)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ color: "#D4A017", textDecoration: "none", fontWeight: 700 }}>← Praja Seva</Link>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link href="/constituency/mandals" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>Mandals</Link>
          <Link href="/constituency/services" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>Services</Link>
        </div>
      </nav>

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Constituency Intelligence</div>
          <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>Srikalahasti Assembly Constituency</h1>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Assembly Constituency No. 168 · Tirupati District · Andhra Pradesh</p>
        </div>
      </section>

      {/* KEY STATS */}
      <section style={{ padding: "3rem 1.5rem", background: "#0a1e35" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
          {[
            { label: "Total Population", value: "3,12,873", sub: "Census 2011 Baseline" },
            { label: "Municipal Wards", value: "17", sub: "Srikalahasti Town" },
            { label: "Assembly No.", value: "168", sub: "Andhra Pradesh" },
            { label: "Assembly Mandals", value: "4", sub: "In the constituency" },
          ].map(s => (
            <div key={s.label} style={{ background: "rgba(13,33,55,0.6)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "1.5rem", textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#D4A017", marginBottom: "0.5rem" }}>{s.value}</div>
              <div style={{ fontWeight: 700, color: "#ffffff", marginBottom: "0.25rem", fontSize: "0.9rem" }}>{s.label}</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MANDALS */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{ fontWeight: 800, color: "#ffffff", fontSize: "1.75rem", marginBottom: "2rem", textAlign: "center" }}>Four Assembly Mandals</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {MANDAL_DATA.map(m => (
              <div key={m.name} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "1.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ fontWeight: 800, color: "#ffffff", fontSize: "1.25rem" }}>{m.name}</h3>
                    <div style={{ color: "#D4A017", fontSize: "0.9rem", marginTop: "2px" }}>{m.nameTe}</div>
                  </div>
                  <span style={{ padding: "0.25rem 0.75rem", background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "9999px", fontSize: "0.7rem", fontWeight: 700, color: "#D4A017" }}>{m.type}</span>
                </div>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1rem" }}>{m.desc}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div style={{ background: "rgba(6,15,26,0.6)", borderRadius: "8px", padding: "0.75rem" }}>
                    <div style={{ fontSize: "0.65rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Population (2011)</div>
                    <div style={{ fontWeight: 700, color: "#ffffff" }}>{m.pop}</div>
                  </div>
                  <div style={{ background: "rgba(6,15,26,0.6)", borderRadius: "8px", padding: "0.75rem" }}>
                    <div style={{ fontSize: "0.65rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Villages</div>
                    <div style={{ fontWeight: 700, color: "#ffffff" }}>{m.villages}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPORTANT NOTE */}
      <section style={{ padding: "2rem 1.5rem 4rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", background: "rgba(30,136,229,0.06)", border: "1px solid rgba(30,136,229,0.2)", borderRadius: "16px", padding: "2rem" }}>
          <h3 style={{ fontWeight: 700, color: "#60a5fa", marginBottom: "1rem" }}>ℹ️ Revenue Division vs. Assembly Constituency</h3>
          <p style={{ color: "#94a3b8", lineHeight: 1.7 }}>The Srikalahasti Revenue Division encompasses 11 mandals. The Srikalahasti Assembly Constituency (No. 168) consists of 4 mandals. This platform focuses on the 4 mandals within the Assembly constituency boundaries: Srikalahasti, Renigunta, Yerpedu and Thottambedu.</p>
          <p style={{ color: "#64748b", lineHeight: 1.7, marginTop: "1rem", fontSize: "0.85rem" }}>Population data is based on 2011 Census figures and is used as a baseline planning estimate only.</p>
        </div>
      </section>

      <div style={{ padding: "2rem", textAlign: "center", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/constituency/services" style={{ background: "#D4A017", color: "#060f1a", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>Department Directory →</Link>
        <Link href="/learn" style={{ border: "1px solid rgba(212,160,23,0.3)", color: "#D4A017", fontWeight: 600, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>Citizen Education Centre</Link>
      </div>
    </main>
  );
}
