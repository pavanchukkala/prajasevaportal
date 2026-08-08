import Link from "next/link";

export const metadata = {
  title: "Constituency Services | Srikalahasti Praja Seva",
};

export default function ConstituencyServicesPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <nav style={{ background: "rgba(6,15,26,0.95)", borderBottom: "1px solid rgba(212,160,23,0.15)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, padding: "1rem 1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link href="/constituency" style={{ color: "#D4A017", textDecoration: "none", fontSize: "0.85rem" }}>← Constituency</Link>
        <span style={{ color: "#475569", fontSize: "0.85rem" }}>/ Services</span>
      </nav>

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>Constituency Services</h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7 }}>Departments and public-service categories active in Srikalahasti constituency.</p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {[
              { icon: "🏛️", dept: "Revenue", issues: "Land records, certificates, pattadar passbook, crop survey" },
              { icon: "🚔", dept: "Police", issues: "Safety, FIR, cybercrime, harassment" },
              { icon: "🏙️", dept: "Municipal Administration", issues: "Roads, drainage, streetlights, garbage, water supply" },
              { icon: "🌿", dept: "Panchayat Raj", issues: "Rural roads, MGNREGS, village water, PMAY housing" },
              { icon: "📚", dept: "Education", issues: "Schools, teachers, mid-day meals, scholarships, textbooks" },
              { icon: "🏥", dept: "Health", issues: "PHC functioning, medicines, vaccination, sanitation" },
              { icon: "👨‍👩‍👧", dept: "Women & Child Welfare", issues: "Anganwadi, ICDS, maternity benefits, child safety" },
              { icon: "🤝", dept: "Social Welfare", issues: "SC/ST welfare, pensions, hostels, scholarships" },
              { icon: "🍛", dept: "Civil Supplies", issues: "Ration card, PDS grains, fair price shops" },
              { icon: "⚡", dept: "Electricity (APSPDCL)", issues: "Outages, billing, meters, new connections, transformers" },
              { icon: "💧", dept: "Water Resources", issues: "Irrigation, canals, water allocation" },
              { icon: "🛣️", dept: "Roads & Buildings", issues: "State highways, bridges, public buildings" },
              { icon: "🚌", dept: "APSRTC / Transport", issues: "Bus services, driving licenses, vehicle registration" },
              { icon: "👷", dept: "Labour", issues: "Labor rights, construction workers, ESIC, EPF" },
              { icon: "🌾", dept: "Agriculture", issues: "Seeds, fertilizers, crop insurance, PM Kisan" },
              { icon: "📋", dept: "Registration & Stamps", issues: "Land registration, mutation, encumbrance certificate" },
              { icon: "🔥", dept: "Fire Services", issues: "Fire hazard, building safety compliance" },
            ].map(s => (
              <div key={s.dept} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.1)", borderRadius: "12px", padding: "1.25rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
                <div style={{ fontWeight: 700, color: "#ffffff", marginBottom: "0.4rem", fontSize: "0.9rem" }}>{s.dept}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>{s.issues}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <Link href="/learn/departments" style={{ background: "#D4A017", color: "#060f1a", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none", marginRight: "1rem" }}>Full Department Guide →</Link>
            <Link href="/submit" style={{ border: "1px solid rgba(212,160,23,0.3)", color: "#D4A017", fontWeight: 600, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>Submit a Complaint</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
