import Link from "next/link";

export const metadata = {
  title: "Mandals | Srikalahasti Praja Seva",
};

export default function MandalsPage() {
  const mandals = [
    {
      name: "Srikalahasti",
      nameTe: "శ్రీకాళహస్తి",
      type: "Urban / Rural",
      population: "1,20,382",
      villages: 45,
      wards: 17,
      highlight: "Municipality town and temple city. Home of the ancient Srikalahasteeswara Temple (one of the Pancha Bhuta Stalas). The cultural and administrative hub of the constituency.",
      keyDepts: ["Revenue", "Municipal Administration", "Police", "Health"],
    },
    {
      name: "Renigunta",
      nameTe: "రేణిగుంట",
      type: "Urban / Rural",
      population: "85,630",
      villages: 32,
      wards: 0,
      highlight: "Strategic transport and industrial corridor. Home of Tirupati International Airport (Renigunta Airport). Growing urban and peri-urban population with significant infrastructure demands.",
      keyDepts: ["Transport", "Electricity", "Roads & Buildings", "Revenue"],
    },
    {
      name: "Yerpedu",
      nameTe: "ఏర్పేడు",
      type: "Rural",
      population: "54,231",
      villages: 38,
      wards: 0,
      highlight: "Predominantly agricultural mandal with active welfare activity. Key mandal for MGNREGS employment, PM Kisan implementation, and Village Secretariat service delivery.",
      keyDepts: ["Panchayat Raj", "Agriculture", "Civil Supplies", "Social Welfare"],
    },
    {
      name: "Thottambedu",
      nameTe: "తొట్టంబేడు",
      type: "Rural",
      population: "52,630",
      villages: 41,
      wards: 0,
      highlight: "Rural mandal with active land registration and revenue services. High volume of land mutation and pattadar passbook activity. Agricultural economy.",
      keyDepts: ["Revenue", "Registration & Stamps", "Agriculture", "Panchayat Raj"],
    },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <nav style={{ background: "rgba(6,15,26,0.95)", borderBottom: "1px solid rgba(212,160,23,0.15)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, padding: "1rem 1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link href="/constituency" style={{ color: "#D4A017", textDecoration: "none", fontSize: "0.85rem" }}>← Constituency</Link>
        <span style={{ color: "#475569", fontSize: "0.85rem" }}>/ Mandals</span>
      </nav>

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>Four Assembly Mandals</h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7 }}>Srikalahasti Assembly Constituency (No. 168) comprises four mandals in Tirupati District, Andhra Pradesh.</p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
          {mandals.map((m, i) => (
            <div key={m.name} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "20px", padding: "2rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", width: "48px", height: "48px", borderRadius: "50%", background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#D4A017", fontSize: "1.1rem" }}>{i + 1}</div>
              <div style={{ marginBottom: "1.25rem" }}>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>{m.name}</h2>
                <div style={{ color: "#D4A017", fontSize: "1rem", marginBottom: "0.5rem" }}>{m.nameTe}</div>
                <span style={{ padding: "0.25rem 0.75rem", background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 700, color: "#D4A017" }}>{m.type}</span>
              </div>

              <p style={{ color: "#94a3b8", lineHeight: 1.7, marginBottom: "1.5rem" }}>{m.highlight}</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ background: "rgba(6,15,26,0.6)", borderRadius: "10px", padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#D4A017" }}>{m.population}</div>
                  <div style={{ fontSize: "0.7rem", color: "#475569", marginTop: "4px" }}>Population (2011)</div>
                </div>
                <div style={{ background: "rgba(6,15,26,0.6)", borderRadius: "10px", padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#D4A017" }}>{m.villages}</div>
                  <div style={{ fontSize: "0.7rem", color: "#475569", marginTop: "4px" }}>Villages</div>
                </div>
                <div style={{ background: "rgba(6,15,26,0.6)", borderRadius: "10px", padding: "1rem", textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#D4A017" }}>{m.wards > 0 ? m.wards : "—"}</div>
                  <div style={{ fontSize: "0.7rem", color: "#475569", marginTop: "4px" }}>{m.wards > 0 ? "Municipal Wards" : "Rural Mandal"}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.65rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontWeight: 700 }}>Key Departments</div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {m.keyDepts.map(d => (
                    <span key={d} style={{ padding: "0.3rem 0.75rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "0.78rem", color: "#94a3b8" }}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <p style={{ fontSize: "0.8rem", color: "#475569", marginBottom: "1.5rem" }}>Population figures from Census 2011. Used as planning baseline only.</p>
          <Link href="/submit" style={{ background: "#D4A017", color: "#060f1a", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>Submit a Complaint →</Link>
        </div>
      </section>
    </main>
  );
}
