"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { leadershipConfig } from "@/config/leadership";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const rep = leadershipConfig.currentRepresentative;
  const { language, t } = useLanguage();

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#060f1a", color: "#f0f4f8" }}>

      {/* ── NAVBAR ── */}
      <Navbar />

      {/* ── TRICOLOR BAR ── */}
      <div style={{ height: "3px", background: "linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%)" }} />

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden", background: "linear-gradient(135deg, #060f1a 0%, #0D2137 50%, #081424 100%)" }}>

        {/* Background ambient glows */}
        <div style={{ position: "absolute", top: "20%", left: "10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,23,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(30,136,229,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "6rem 1.5rem 8rem" }}>

          {/* Platform badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1rem", borderRadius: "9999px", border: "1px solid rgba(212,160,23,0.25)", background: "rgba(212,160,23,0.08)", marginBottom: "2rem" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#D4A017", boxShadow: "0 0 8px #D4A017" }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#D4A017", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {t("common.proposedNotice", "Proposed Civic Technology · Not an Official Government Portal")}
            </span>
          </div>

          {/* Main headline */}
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.8rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1.5rem", maxWidth: "900px" }}>
            <span style={{ color: "#ffffff", display: "block" }}>
              {t("home.heroLine1", "Every Voice Matters.")}
            </span>
            <span style={{ background: "linear-gradient(90deg, #D4A017, #F3E5AB, #D4A017)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "block" }}>
              {t("home.heroLine2", "Every Issue Has a Path to Action.")}
            </span>
          </h1>

          <p style={{ fontSize: "1.2rem", color: "#94a3b8", maxWidth: "640px", lineHeight: 1.7, marginBottom: "2.5rem", fontWeight: 400 }}>
            {t("home.heroDesc", "A secure, AI-assisted platform for citizens of Srikalahasti to report public-service issues — and for constituency staff to identify patterns, prioritize cases and coordinate responsible action.")}
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
              {t("home.submitGrievance", "Submit a Grievance →")}
            </Link>
            <Link href="/constituency" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              border: "1px solid rgba(212,160,23,0.4)", color: "#D4A017",
              fontWeight: 600, fontSize: "0.95rem",
              padding: "1rem 2rem", borderRadius: "9999px", textDecoration: "none"
            }}>
              {t("home.learnConstituency", "Learn About the Constituency")}
            </Link>
            <Link href="/track" style={{
              color: "#64748b", fontWeight: 500, fontSize: "0.9rem",
              padding: "1rem 1.5rem", textDecoration: "none"
            }}>
              {t("home.trackComplaint", "Track Complaint →")}
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ position: "absolute", bottom: 0, width: "100%", borderTop: "1px solid rgba(212,160,23,0.12)", background: "rgba(6,15,26,0.9)", backdropFilter: "blur(20px)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.25rem 1.5rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {[
              { label: language === "te" ? "3.13 లక్షల పౌరులు" : "3.13 Lakh Citizens", sub: language === "te" ? "2011 జనాభా ఆధారంగా" : "Census 2011 Baseline" },
              { label: language === "te" ? "4 అసెంబ్లీ మండలాలు" : "4 Assembly Mandals", sub: "Srikalahasti, Renigunta, Yerpedu, Thottambedu" },
              { label: language === "te" ? "25+ ప్రభుత్వ విభాగాలు" : "25+ Departments", sub: language === "te" ? "పర్యవేక్షించబడేవి" : "Monitored" },
              { label: language === "te" ? "AI విశ్లేషణ వ్యవస్థ" : "AI-Assisted Analysis", sub: language === "te" ? "మానవ సమీక్ష ద్వారా" : "Human-reviewed" },
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
            <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>Workflow</div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
              {t("home.howItWorksTitle", "From Citizen Voice to Responsible Action")}
            </h2>
            <p style={{ color: "#64748b", marginTop: "1rem", fontSize: "1.1rem" }}>
              {t("home.howItWorksSub", "A transparent, predictable process for every submission.")}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.5rem", position: "relative" }}>
            {/* Connector line */}
            <div style={{ position: "absolute", top: "48px", left: "10%", right: "10%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)", zIndex: 0 }} />

            {[
              { n: 1, icon: "💬", title: t("home.step1", "Citizen Submits"), desc: language === "te" ? "రాతపూర్వక, ఆడియో లేదా చిత్రం రూపంలో సురక్షిత సమర్పణ." : "Secure text, audio, or image submission. Identity optional." },
              { n: 2, icon: "🔒", title: t("home.step2", "Secure Storage"), desc: language === "te" ? "ప్రత్యేక ID సృష్టించబడుతుంది. ఆధారాలు సురక్షితంగా ఉంటాయి." : "Unique ID generated. Evidence encrypted. Tracking code issued." },
              { n: 3, icon: "🧠", title: t("home.step3", "AI Processing"), desc: language === "te" ? "వర్గీకరణ, ప్రాధాన్యత గుర్తింపు, విభాగాల కేటాయింపు." : "Classification, credibility indicators, department routing." },
              { n: 4, icon: "👁", title: t("home.step4", "Human Review"), desc: language === "te" ? "అధికారిక సమీక్షకుడు AI అంచనాను తనిఖీ చేస్తారు." : "Authorized reviewer validates AI assessment." },
              { n: 5, icon: "✅", title: t("home.step5", "Authority Notified"), desc: language === "te" ? "సంబంధిత శాఖకు సమాచారం పంపబడుతుంది." : "Department receives brief. MLA office monitors SLA." },
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
                <strong style={{ color: "#ffffff" }}>AI assists analysis.</strong> {t("common.disclaimer")}
              </span>
            </div>
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
                {t("common.proposedNotice")}
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
        </div>
      </footer>
    </main>
  );
}
