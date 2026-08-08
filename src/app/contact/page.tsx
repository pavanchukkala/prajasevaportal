import Link from "next/link";

export const metadata = {
  title: "Contact | Srikalahasti Praja Seva Intelligence Platform",
};

export default function ContactPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <nav style={{ background: "rgba(6,15,26,0.95)", borderBottom: "1px solid rgba(212,160,23,0.15)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ color: "#D4A017", textDecoration: "none", fontWeight: 700 }}>← Praja Seva</Link>
      </nav>

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>Contact & Assistance</h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7 }}>For platform assistance, feedback, or partnership enquiries.</p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div>
            <h2 style={{ fontWeight: 800, color: "#ffffff", marginBottom: "1.5rem" }}>Platform Information</h2>
            <div style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "2rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🏛️</div>
              <h3 style={{ fontWeight: 700, color: "#D4A017", marginBottom: "0.5rem" }}>Srikalahasti Praja Seva</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                Srikalahasti Assembly Constituency (No. 168)<br />
                Tirupati District, Andhra Pradesh
              </p>
              <p style={{ color: "#64748b", fontSize: "0.8rem", lineHeight: 1.6 }}>
                This is a proposed civic-technology platform and is not an official government contact channel. For official government complaints, please contact the relevant department directly or visit your Village Secretariat.
              </p>
            </div>

            <div style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "2rem", marginTop: "1.5rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>👨‍💻</div>
              <h3 style={{ fontWeight: 700, color: "#D4A017", marginBottom: "0.5rem" }}>Developer</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.7 }}>Pavan Chukkala<br />Civic Technology Architect</p>
              <Link href="/developer" style={{ display: "inline-block", marginTop: "1rem", color: "#D4A017", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700 }}>View Developer Profile →</Link>
            </div>
          </div>

          <div>
            <h2 style={{ fontWeight: 800, color: "#ffffff", marginBottom: "1.5rem" }}>For Citizens</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { icon: "📝", title: "Submit a Complaint", desc: "Use the secure submission form to report any public-service issue.", href: "/submit", cta: "Submit Now →" },
                { icon: "🔍", title: "Track Your Complaint", desc: "Check the status of a complaint you already submitted using your Complaint ID.", href: "/track", cta: "Track Now →" },
                { icon: "📚", title: "Citizen Education Centre", desc: "Learn how to submit effective complaints and understand your rights.", href: "/learn", cta: "Learn More →" },
                { icon: "🏛️", title: "Department Directory", desc: "Find out which government office handles your type of issue.", href: "/learn/departments", cta: "View Directory →" },
              ].map(c => (
                <div key={c.href} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.1)", borderRadius: "12px", padding: "1.25rem" }}>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "1.25rem" }}>{c.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: "#ffffff", marginBottom: "0.3rem", fontSize: "0.95rem" }}>{c.title}</div>
                      <p style={{ color: "#64748b", fontSize: "0.82rem", lineHeight: 1.5, marginBottom: "0.75rem" }}>{c.desc}</p>
                      <Link href={c.href} style={{ color: "#D4A017", fontWeight: 700, textDecoration: "none", fontSize: "0.82rem" }}>{c.cta}</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
