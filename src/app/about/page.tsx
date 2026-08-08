import Link from "next/link";

export const metadata = {
  title: "About | Srikalahasti Praja Seva Intelligence Platform",
  description: "Learn about the vision and purpose of the Srikalahasti Praja Seva Intelligence Platform.",
};

export default function AboutPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <nav style={{ background: "rgba(6,15,26,0.95)", borderBottom: "1px solid rgba(212,160,23,0.15)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ color: "#D4A017", textDecoration: "none", fontWeight: 700 }}>← Praja Seva</Link>
        <Link href="/submit" style={{ background: "#D4A017", color: "#060f1a", fontWeight: 700, padding: "0.5rem 1.25rem", borderRadius: "9999px", textDecoration: "none", fontSize: "0.85rem" }}>Submit Grievance</Link>
      </nav>

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>About the Platform</div>
          <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1.5rem", lineHeight: 1.1 }}>A Civic-Technology Initiative for Srikalahasti</h1>
          <p style={{ fontSize: "1.15rem", color: "#94a3b8", lineHeight: 1.8 }}>This platform was designed and built as a proposed civic-technology initiative to connect citizen evidence, responsible AI analysis, and constituency-level public service coordination.</p>
        </div>
      </section>

      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "4rem" }}>
            {[
              { icon: "🏛️", title: "Product Vision", text: "An AI-assisted citizen grievance and constituency intelligence platform for Srikalahasti Assembly Constituency (No. 168), Tirupati District, Andhra Pradesh." },
              { icon: "🧠", title: "AI Role", text: "The AI layer structures, classifies and prioritizes. It does not judge. All AI outputs are preliminary assessments that require qualified human review before any action is taken." },
              { icon: "🔒", title: "Privacy First", text: "Citizens may submit anonymously. Evidence is not publicly displayed. Access is controlled by authentication, role permissions and audit logging." },
              { icon: "⚖️", title: "AI Safety", text: "AI outputs must never declare guilt, accuse individuals, replace police investigation, or replace courts. Language is deliberately careful: credibility indicators, not truth determinations." },
            ].map(c => (
              <div key={c.title} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "2rem" }}>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{c.icon}</div>
                <h3 style={{ fontWeight: 700, color: "#D4A017", marginBottom: "0.75rem" }}>{c.title}</h3>
                <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.9rem" }}>{c.text}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.15)", borderRadius: "16px", padding: "2.5rem" }}>
            <h2 style={{ fontWeight: 800, color: "#ffffff", fontSize: "1.5rem", marginBottom: "1.5rem" }}>Important Disclaimers</h2>
            {[
              "This platform is a proposed civic-technology concept and is not an official government website unless formally authorized.",
              "AI-generated outputs are preliminary assessments only. They do not establish the truth of an allegation, determine guilt, replace investigation, or replace judicial or legal processes.",
              "Political photographs, party names, logos and symbols are used here for demonstration purposes only.",
              "Citizen data and uploaded evidence must be handled according to applicable privacy, cyber-security and data-protection requirements.",
              "The Ashoka emblem and official government symbols are not used in a manner that implies official government authorization or ownership.",
            ].map((d, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", padding: "0.75rem 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <span style={{ color: "#D4A017", flexShrink: 0, marginTop: "2px" }}>•</span>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>{d}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "3rem", textAlign: "center", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/submit" style={{ background: "#D4A017", color: "#060f1a", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>Submit a Grievance</Link>
            <Link href="/developer" style={{ border: "1px solid rgba(212,160,23,0.3)", color: "#D4A017", fontWeight: 600, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>Meet the Developer</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
