import Navbar from "@/components/layout/Navbar";
import { developerConfig } from "@/config/developer";

export const metadata = {
  title: "Meet the Developer | Srikalahasti Praja Seva",
  description:
    "Learn about the civic-technology initiative behind the Srikalahasti Praja Seva Intelligence Platform.",
};

export default function DeveloperPage() {
  const dev = developerConfig;

  return (
    <main style={{ minHeight: "100vh", background: "#04091A", color: "#f0f4f8" }}>
      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "15%", left: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,23,0.04) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "15%", right: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 70%)" }} />
      </div>

      {/* Nav */}
      <Navbar />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>

        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          {/* Avatar */}
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(212,160,23,0.15), rgba(96,165,250,0.15))", border: "2px solid rgba(212,160,23,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2.5rem", fontWeight: 900, color: "#D4A017", boxShadow: "0 0 30px rgba(212,160,23,0.1)" }}>
            {dev.name.split(" ").map(n => n[0]).join("")}
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.025em", marginBottom: "0.5rem" }}>{dev.name}</h1>
          <div style={{ color: "#D4A017", fontWeight: 600, marginBottom: "0.5rem" }}>{dev.title}</div>
          {dev.location && (
            <div style={{ color: "#64748b", fontSize: "0.9rem" }}>📍 {dev.location}</div>
          )}
        </div>

        {/* Platform context badge */}
        <div style={{ background: "rgba(212,160,23,0.05)", border: "1px solid rgba(212,160,23,0.15)", borderRadius: "12px", padding: "1rem 1.5rem", marginBottom: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "0.65rem", color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "0.25rem" }}>Platform Context</div>
          <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{dev.platformContext}</div>
        </div>

        {/* Story */}
        <div style={{ background: "rgba(13,33,55,0.55)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "20px", padding: "2rem", marginBottom: "1.5rem", backdropFilter: "blur(16px)" }}>
          <h2 style={{ fontWeight: 800, color: "#ffffff", marginBottom: "1.25rem", fontSize: "1.1rem" }}>About This Initiative</h2>
          <p style={{ color: "#94a3b8", lineHeight: 1.8, marginBottom: "1rem", fontSize: "0.95rem" }}>{dev.longStory}</p>
          <div style={{ background: "rgba(4,9,26,0.5)", borderRadius: "12px", padding: "1rem", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ fontSize: "0.65rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "0.5rem" }}>Disclaimer</div>
            <p style={{ color: "#475569", fontSize: "0.8rem", lineHeight: 1.6, margin: 0 }}>
              This is a proposed civic-technology initiative. It is not an official government portal and has not been formally authorized by any elected representative or government body.
              All content referencing political leaders is presentational and does not imply endorsement.
            </p>
          </div>
        </div>

        {/* Values */}
        {dev.values.length > 0 && (
          <div style={{ background: "rgba(13,33,55,0.4)", border: "1px solid rgba(212,160,23,0.1)", borderRadius: "16px", padding: "1.75rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontWeight: 800, color: "#ffffff", marginBottom: "1.25rem", fontSize: "1rem" }}>Platform Values</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {dev.values.map((v, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{ color: "#D4A017", flexShrink: 0, marginTop: "2px" }}>◆</span>
                  <span style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.5 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What was built */}
        {dev.approvedFacts.length > 0 && (
          <div style={{ background: "rgba(13,33,55,0.4)", border: "1px solid rgba(96,165,250,0.1)", borderRadius: "16px", padding: "1.75rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontWeight: 800, color: "#ffffff", marginBottom: "1.25rem", fontSize: "1rem" }}>What Was Built</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {dev.approvedFacts.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <span style={{ color: "#22c55e", flexShrink: 0, marginTop: "3px", fontSize: "0.8rem" }}>✓</span>
                  <span style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1rem", fontSize: "0.72rem", color: "#334155", lineHeight: 1.6 }}>
              ℹ Only approved, verifiable facts are listed here. No biographical details, work history, awards or credentials have been invented or assumed.
            </div>
          </div>
        )}

        {/* Links */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}>
          {dev.links.github && (
            <a href={dev.links.github} target="_blank" rel="noopener noreferrer" style={{ padding: "0.6rem 1.25rem", background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "9999px", color: "#D4A017", fontWeight: 700, textDecoration: "none", fontSize: "0.88rem" }}>
              ⬡ GitHub
            </a>
          )}
          {dev.email && (
            <a href={`mailto:${dev.email}`} style={{ padding: "0.6rem 1.25rem", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "9999px", color: "#22c55e", fontWeight: 700, textDecoration: "none", fontSize: "0.88rem" }}>
              ✉ Email
            </a>
          )}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <Link href="/submit" style={{ display: "inline-block", background: "linear-gradient(135deg, #D4A017, #F3E5AB)", color: "#04091A", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none", marginRight: "1rem" }}>
            Try the Platform →
          </Link>
          <Link href="/" style={{ display: "inline-block", border: "1px solid rgba(212,160,23,0.25)", color: "#D4A017", fontWeight: 600, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>
            ← Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
