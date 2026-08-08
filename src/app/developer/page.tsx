import Link from "next/link";

export const metadata = {
  title: "Developer | Srikalahasti Praja Seva Intelligence Platform",
  description: "The civic-technology architect behind the Srikalahasti Praja Seva Intelligence Platform.",
};

export default function DeveloperPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <nav style={{ background: "rgba(6,15,26,0.95)", borderBottom: "1px solid rgba(212,160,23,0.15)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ color: "#D4A017", textDecoration: "none", fontWeight: 700 }}>← Praja Seva</Link>
        <Link href="/about" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>About the Platform</Link>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 60%, #081424 100%)", padding: "6rem 1.5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", right: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,23,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "2rem" }}>The Architect</div>
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "3rem", alignItems: "center" }}>
            <div style={{ width: "200px", height: "200px", borderRadius: "50%", border: "3px solid rgba(212,160,23,0.4)", background: "#0D2137", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem", boxShadow: "0 0 40px rgba(212,160,23,0.15)" }}>👨💻</div>
            <div>
              <h1 style={{ fontSize: "2.8rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>Pavan Chukkala</h1>
              <div style={{ color: "#D4A017", fontSize: "1.1rem", fontWeight: 600, marginBottom: "1.5rem" }}>Civic Technology Architect · AI Engineer · Full-Stack Developer</div>
              <p style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: 1.7, maxWidth: "600px" }}>Designed and engineered as a civic-technology initiative to connect citizen evidence, responsible AI and constituency-level public service coordination.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VISION SECTION */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2 style={{ fontWeight: 800, color: "#ffffff", fontSize: "2rem", marginBottom: "2rem" }}>Why This Platform Was Built</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
            {[
              { icon: "🗣️", title: "Citizen Voice", text: "Public-service failures often go unreported because citizens don't know where to report or fear their complaints will be ignored. A structured digital channel changes this." },
              { icon: "🧠", title: "Responsible AI", text: "AI should augment human judgment, not replace it. Every design decision in this platform reflects that principle — AI classifies and prioritizes, humans decide." },
              { icon: "🔒", title: "Security First", text: "Anonymous submissions, role-based access, encrypted evidence, audit logging and clear AI disclaimers are architectural decisions, not afterthoughts." },
              { icon: "🌐", title: "Bilingual by Design", text: "Telugu is the primary language of Srikalahasti citizens. An English-only platform would exclude the people it is meant to serve." },
            ].map(c => (
              <div key={c.title} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.1)", borderRadius: "16px", padding: "1.75rem" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>{c.icon}</div>
                <h3 style={{ fontWeight: 700, color: "#D4A017", marginBottom: "0.75rem" }}>{c.title}</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>{c.text}</p>
              </div>
            ))}
          </div>

          {/* TECHNICAL PHILOSOPHY */}
          <div style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.15)", borderRadius: "16px", padding: "2.5rem", marginBottom: "2rem" }}>
            <h3 style={{ fontWeight: 800, color: "#ffffff", fontSize: "1.5rem", marginBottom: "1.5rem" }}>Technical Philosophy</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              {[
                ["Framework", "Next.js 16 · App Router · TypeScript · Tailwind CSS v4"],
                ["AI Architecture", "LLM-based complaint structuring with mandatory safety disclaimers"],
                ["Security", "Middleware-based route protection · RBAC · Cookie sessions · Audit logging"],
                ["i18n", "Native English/Telugu bilingual support with dictionary-based translation"],
                ["Database Layer", "Interface-first mock layer ready for Supabase/PostgreSQL replacement"],
                ["Configuration", "100% config-driven political branding — election-ready without code changes"],
              ].map(([k, v]) => (
                <div key={k} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "0.75rem" }}>
                  <div style={{ fontSize: "0.65rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", fontWeight: 700 }}>{k}</div>
                  <div style={{ color: "#94a3b8", fontSize: "0.85rem" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SKILLS */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ fontWeight: 700, color: "#ffffff", marginBottom: "1rem" }}>Core Skills</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["TypeScript", "React / Next.js", "AI / LLM Integration", "System Design", "Security Architecture", "Civic Technology", "Bilingual UX", "API Design", "Tailwind CSS", "Node.js"].map(s => (
                <span key={s} style={{ padding: "0.4rem 0.875rem", background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "9999px", fontSize: "0.8rem", color: "#D4A017", fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </div>

          {/* ROADMAP */}
          <div style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.1)", borderRadius: "16px", padding: "2rem" }}>
            <h3 style={{ fontWeight: 800, color: "#ffffff", marginBottom: "1.25rem" }}>Roadmap</h3>
            {[
              { phase: "Phase 1 (Current)", items: ["Public homepage", "Bilingual complaint submission", "AI preliminary assessment (mock)", "Protected MLA dashboard", "RBAC middleware", "Complaint tracking"] },
              { phase: "Phase 2 (With Support)", items: ["Real database (Supabase)", "Actual LLM API integration", "Email/SMS status updates", "Department officer portals", "Evidence file storage (S3)", "MFA authentication"] },
              { phase: "Phase 3 (Scale)", items: ["Mobile app (Android first)", "Offline-capable PWA", "Analytics dashboard", "Department performance tracking", "Multi-constituency support"] },
            ].map(r => (
              <div key={r.phase} style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontWeight: 700, color: "#D4A017", marginBottom: "0.5rem", fontSize: "0.85rem" }}>{r.phase}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {r.items.map(item => (
                    <span key={item} style={{ padding: "0.3rem 0.7rem", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", fontSize: "0.78rem", color: "#94a3b8" }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <div style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#64748b", fontStyle: "italic" }}>"Built for Srikalahasti. Designed for every constituency."</div>
            <Link href="/submit" style={{ background: "#D4A017", color: "#060f1a", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>Try the Platform</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
