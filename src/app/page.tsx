import Link from "next/link";
import { leadershipConfig } from "@/config/leadership";

export const metadata = {
  title: "Home | Srikalahasti Praja Seva Intelligence Platform",
  description: "AI-assisted citizen grievance and constituency intelligence platform for Srikalahasti Assembly Constituency No. 168.",
};

export default function HomePage() {
  const rep = leadershipConfig.currentRepresentative;

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#060f1a", color: "#f0f4f8" }}>

      {/* ── NAVBAR ── */}
      <nav style={{ backgroundColor: "rgba(6,15,26,0.95)", borderBottom: "1px solid rgba(212,160,23,0.15)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "64px" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#D4A017", letterSpacing: "-0.02em" }}>Praja Seva</div>
            <div style={{ fontSize: "0.65rem", color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase" }}>Srikalahasti · No. 168</div>
          </div>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center", fontSize: "0.875rem" }}>
            <Link href="/constituency" style={{ color: "#94a3b8", textDecoration: "none" }}>Constituency</Link>
            <Link href="/learn" style={{ color: "#94a3b8", textDecoration: "none" }}>Learn</Link>
            <Link href="/track" style={{ color: "#94a3b8", textDecoration: "none" }}>Track</Link>
            <Link href="/about" style={{ color: "#94a3b8", textDecoration: "none" }}>About</Link>
            <Link href="/submit" style={{ backgroundColor: "#D4A017", color: "#060f1a", fontWeight: 700, padding: "0.5rem 1.25rem", borderRadius: "9999px", textDecoration: "none", fontSize: "0.8rem" }}>
              Report Issue
            </Link>
            <Link href="/staff/login" style={{ border: "1px solid rgba(212,160,23,0.3)", color: "#D4A017", padding: "0.4rem 1rem", borderRadius: "9999px", textDecoration: "none", fontSize: "0.75rem" }}>
              Staff Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ── TRICOLOR BAR ── */}
      <div style={{ height: "3px", background: "linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%)" }} />

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", background: "linear-gradient(135deg, #060f1a 0%, #0D2137 50%, #081424 100%)" }}>

        {/* Background ambient glows */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,23,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(30,136,229,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "8rem 1.5rem 6rem" }}>

          {/* Platform badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", borderRadius: "9999px", border: "1px solid rgba(212,160,23,0.25)", background: "rgba(212,160,23,0.08)", marginBottom: "2rem" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4A017", boxShadow: "0 0 8px #D4A017" }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#D4A017", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Proposed Civic Technology · Not an Official Government Portal
            </span>
          </div>

          {/* Main headline */}
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 1.06, letterSpacing: "-0.03em", marginBottom: "1.5rem", maxWidth: "900px" }}>
            <span style={{ color: "#ffffff", display: "block" }}>Every Voice Matters.</span>
            <span style={{ background: "linear-gradient(90deg, #D4A017, #F3E5AB, #D4A017)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "block" }}>
              Every Issue Has a Path to Action.
            </span>
          </h1>

          <p style={{ fontSize: "1.2rem", color: "#94a3b8", maxWidth: "640px", lineHeight: 1.7, marginBottom: "2.5rem", fontWeight: 400 }}>
            A secure, AI-assisted platform for citizens of Srikalahasti to report public-service issues — and for constituency staff to identify patterns, prioritize cases and coordinate responsible action.
          </p>

          {/* AI-assisted tagline */}
          <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {["AI-assisted", "Human-reviewed", "Public-service focused"].map(tag => (
              <span key={tag} style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600, letterSpacing: "0.05em" }}>
                ✦ {tag}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/submit" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "linear-gradient(135deg, #D4A017, #F3E5AB)",
              color: "#060f1a", fontWeight: 700, fontSize: "1rem",
              padding: "1rem 2rem", borderRadius: "9999px", textDecoration: "none",
              boxShadow: "0 0 30px rgba(212,160,23,0.35)"
            }}>
              Submit a Grievance →
            </Link>
            <Link href="/constituency" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              border: "1px solid rgba(212,160,23,0.4)", color: "#D4A017",
              fontWeight: 600, fontSize: "0.95rem",
              padding: "1rem 2rem", borderRadius: "9999px", textDecoration: "none"
            }}>
              Learn About the Constituency
            </Link>
            <Link href="/track" style={{
              color: "#64748b", fontWeight: 500, fontSize: "0.9rem",
              padding: "1rem 1.5rem", textDecoration: "none"
            }}>
              Track Complaint →
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ position: "absolute", bottom: 0, width: "100%", borderTop: "1px solid rgba(212,160,23,0.12)", background: "rgba(6,15,26,0.9)", backdropFilter: "blur(20px)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.25rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {[
              { label: "3.13 Lakh Citizens", sub: "Census 2011 Baseline" },
              { label: "4 Assembly Mandals", sub: "Srikalahasti, Renigunta, Yerpedu, Thottambedu" },
              { label: "25+ Departments", sub: "Monitored" },
              { label: "AI-Assisted Analysis", sub: "Human-reviewed" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontWeight: 700, color: "#D4A017", fontSize: "0.9rem" }}>{s.label}</div>
                <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "2px" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "6rem 1.5rem", backgroundColor: "#0a1e35" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>The Workflow</div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>From Citizen Voice to Responsible Action</h2>
            <p style={{ color: "#64748b", marginTop: "1rem", fontSize: "1.1rem" }}>A transparent, predictable process for every submission.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.5rem", position: "relative" }}>
            {/* Connector line */}
            <div style={{ position: "absolute", top: "48px", left: "10%", right: "10%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)", zIndex: 0 }} />

            {[
              { n: 1, icon: "💬", title: "Citizen Submits", desc: "Secure text, audio, or image submission. Identity optional." },
              { n: 2, icon: "🔒", title: "Secure Storage", desc: "Unique ID generated. Evidence encrypted. Tracking code issued." },
              { n: 3, icon: "🧠", title: "AI Processing", desc: "Classification, credibility indicators, department routing." },
              { n: 4, icon: "👁", title: "Human Review", desc: "Authorized reviewer validates AI assessment." },
              { n: 5, icon: "✅", title: "Authority Notified", desc: "Department receives brief. MLA office monitors SLA." },
            ].map(step => (
              <div key={step.n} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{ width: "96px", height: "96px", borderRadius: "50%", border: "2px solid rgba(212,160,23,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", background: "#081424", fontSize: "2rem", position: "relative" }}>
                  {step.icon}
                  <div style={{ position: "absolute", top: "-4px", right: "-4px", width: "28px", height: "28px", borderRadius: "50%", background: "#0D2137", border: "1px solid rgba(212,160,23,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "#D4A017" }}>
                    {step.n}
                  </div>
                </div>
                <h3 style={{ fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem", fontSize: "0.9rem" }}>{step.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", padding: "1rem 2rem", borderRadius: "9999px", border: "1px solid rgba(212,160,23,0.2)", background: "rgba(212,160,23,0.05)" }}>
              <span>🧠</span>
              <span style={{ fontSize: "0.9rem", color: "#94a3b8" }}>
                <strong style={{ color: "#ffffff" }}>AI assists analysis.</strong> Humans and competent authorities make decisions.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP SECTION ── */}
      <section style={{ padding: "6rem 1.5rem", backgroundColor: "#060f1a", borderTop: "1px solid rgba(212,160,23,0.08)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Technology in Service of Public Responsibility</div>
            <h2 style={{ fontSize: "2.8rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1.5rem", lineHeight: 1.1 }}>
              {rep.name}
            </h2>
            <p style={{ color: "#64748b", fontSize: "1rem", marginBottom: "1rem" }}>{rep.title} · {rep.party}</p>
            <blockquote style={{ borderLeft: "2px solid #D4A017", paddingLeft: "1.5rem", color: "#94a3b8", fontSize: "1.1rem", fontStyle: "italic", lineHeight: 1.7, margin: "2rem 0" }}>
              "Our commitment is to bring transparent, accountable, and accessible governance to every citizen of Srikalahasti."
            </blockquote>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ padding: "0.5rem 1rem", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "8px", fontSize: "0.8rem", color: "#94a3b8" }}>
                Constituency No. 168
              </div>
              <div style={{ padding: "0.5rem 1rem", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "8px", fontSize: "0.8rem", color: "#94a3b8" }}>
                Elected 2024
              </div>
              <div style={{ padding: "0.5rem 1rem", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "8px", fontSize: "0.8rem", color: "#94a3b8" }}>
                TDP
              </div>
            </div>
          </div>

          {/* Portrait placeholder */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: "320px" }}>
              <div style={{ position: "absolute", inset: 0, background: "#D4A017", borderRadius: "16px", transform: "translate(8px, 8px)", opacity: 0.1, filter: "blur(20px)" }} />
              <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(212,160,23,0.3)", borderRadius: "16px", transform: "translate(-6px, -6px)" }} />
              <div style={{ position: "relative", width: "320px", height: "420px", background: "#0D2137", borderRadius: "16px", border: "1px solid rgba(212,160,23,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                <div style={{ fontSize: "4rem" }}>👤</div>
                <div style={{ textAlign: "center", padding: "0 1.5rem" }}>
                  <div style={{ color: "#D4A017", fontWeight: 700, fontSize: "0.85rem" }}>{rep.name}</div>
                  <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "0.25rem" }}>Portrait — Add to /public/images/</div>
                </div>
                {/* Election badge */}
                <div style={{ position: "absolute", bottom: "-20px", right: "-20px", background: "#0D2137", border: "1px solid rgba(212,160,23,0.4)", borderRadius: "12px", padding: "1rem", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                  <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Total Votes</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#D4A017" }}>1,21,565</div>
                  <div style={{ height: "1px", background: "rgba(212,160,23,0.3)", margin: "8px 0" }} />
                  <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Winning Margin</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#ffffff" }}>43,304</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEGACY SECTION ── */}
      {rep.father && (
        <section style={{ padding: "6rem 1.5rem", background: "linear-gradient(to bottom, #081424, #060f1a)", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "2rem" }}>In Memoriam</div>
            <div style={{ width: "160px", height: "160px", borderRadius: "50%", border: "3px solid rgba(212,160,23,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", background: "#0D2137", fontSize: "3rem", boxShadow: "0 0 40px rgba(212,160,23,0.15)" }}>
              👤
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>{rep.father.name}</h2>
            <div style={{ color: "#D4A017", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "2rem" }}>1949 — 2022</div>
            <p style={{ fontSize: "1.1rem", color: "#94a3b8", lineHeight: 1.8, fontStyle: "italic", marginBottom: "3rem" }}>
              "{rep.father.legacyText}"
            </p>
            <div style={{ color: "#475569", fontSize: "1rem" }}>A legacy remembered. A constituency reimagined.</div>
          </div>
        </section>
      )}

      {/* ── SECURITY SECTION ── */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#0a1e35" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>Security & Privacy</div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff" }}>Designed to Protect Citizens</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
            {[
              "Your complaint is visible only to authorized personnel assigned to review or act on it.",
              "Access is protected by authentication, role permissions and audit logging.",
              "Political branding does not control complaint priority, access or routing.",
              "Uploaded evidence is not publicly displayed.",
            ].map(text => (
              <div key={text} style={{ padding: "1.5rem", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "12px", background: "rgba(13,33,55,0.4)", display: "flex", gap: "1rem" }}>
                <span style={{ color: "#22c55e", flexShrink: 0 }}>✓</span>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: "#040c16", borderTop: "1px solid rgba(212,160,23,0.1)", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "3rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ fontWeight: 800, color: "#D4A017", fontSize: "1.1rem", marginBottom: "0.75rem" }}>Srikalahasti Praja Seva</div>
              <p style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.7, maxWidth: "360px" }}>
                This platform is a proposed civic-technology concept and is not an official government website unless formally authorized. AI-generated outputs are preliminary assessments only. They do not establish the truth of an allegation, determine guilt, replace investigation, or replace judicial/legal processes.
              </p>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#94a3b8", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>Public</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[["Submit", "/submit"], ["Track", "/track"], ["Constituency", "/constituency"], ["Learn", "/learn"], ["About", "/about"], ["Developer", "/developer"]].map(([label, href]) => (
                  <Link key={href} href={href} style={{ color: "#64748b", textDecoration: "none", fontSize: "0.85rem" }}>{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#94a3b8", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>Legal</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[["Privacy", "/privacy"], ["Security", "/security"], ["Contact", "/contact"]].map(([label, href]) => (
                  <Link key={href} href={href} style={{ color: "#64748b", textDecoration: "none", fontSize: "0.85rem" }}>{label}</Link>
                ))}
              </div>
            </div>
          </div>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "1.5rem 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#475569" }}>
              Built for Srikalahasti Assembly Constituency (No. 168), Tirupati District, Andhra Pradesh.
            </div>
            <div style={{ fontSize: "0.75rem", color: "#475569" }}>
              Not an official government website · AI assessments are preliminary only
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
