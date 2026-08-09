"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { leadershipConfig } from "@/config/leadership";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const rep = leadershipConfig.currentRepresentative;
  const { language, t } = useLanguage();

  const isTe = language === "te";

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
            {[
              isTe ? "AI-సహకారం" : "AI-assisted",
              isTe ? "మానవ సమీక్ష" : "Human-reviewed",
              isTe ? "ప్రజాసేవ కేంద్రం" : "Public-service focused"
            ].map(tag => (
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
              { label: isTe ? "3.13 లక్షల పౌరులు" : "3.13 Lakh Citizens", sub: isTe ? "2011 జనాభా ఆధారంగా" : "Census 2011 Baseline" },
              { label: isTe ? "4 అసెంబ్లీ మండలాలు" : "4 Assembly Mandals", sub: "Srikalahasti, Renigunta, Yerpedu, Thottambedu" },
              { label: isTe ? "25+ ప్రభుత్వ విభాగాలు" : "25+ Departments", sub: isTe ? "పర్యవేక్షించబడేవి" : "Monitored" },
              { label: isTe ? "AI విశ్లేషణ వ్యవస్థ" : "AI-Assisted Analysis", sub: isTe ? "మానవ సమీక్ష ద్వారా" : "Human-reviewed" },
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
            <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
              {isTe ? "కార్యాచరణ ప్రక్రియ" : "Workflow"}
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
              {t("home.howItWorksTitle", "From Citizen Voice to Responsible Action")}
            </h2>
            <p style={{ color: "#64748b", marginTop: "1rem", fontSize: "1.1rem" }}>
              {t("home.howItWorksSub", "A transparent, predictable process for every submission.")}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.5rem", position: "relative" }}>
            <div style={{ position: "absolute", top: "48px", left: "10%", right: "10%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)", zIndex: 0 }} />

            {[
              { n: 1, icon: "💬", title: t("home.step1", "Citizen Submits"), desc: t("home.step1Desc", "Secure text, audio, or image submission. Identity optional.") },
              { n: 2, icon: "🔒", title: t("home.step2", "Secure Storage"), desc: t("home.step2Desc", "Unique ID generated. Evidence encrypted. Tracking code issued.") },
              { n: 3, icon: "🧠", title: t("home.step3", "AI Processing"), desc: t("home.step3Desc", "Classification, credibility indicators, department routing.") },
              { n: 4, icon: "👁", title: t("home.step4", "Human Review"), desc: t("home.step4Desc", "Authorized reviewer validates AI assessment.") },
              { n: 5, icon: "✅", title: t("home.step5", "Authority Notified"), desc: t("home.step5Desc", "Department receives brief. MLA office monitors SLA.") },
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
                <strong style={{ color: "#ffffff" }}>{isTe ? "AI విశ్లేషణకు మాత్రమే సహాయపడుతుంది." : "AI assists analysis."}</strong> {t("common.disclaimer")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP SECTION ── */}
      <section style={{ padding: "6rem 1.5rem", backgroundColor: "#060f1a", borderTop: "1px solid rgba(212,160,23,0.08)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              {t("home.leadershipBadge", "Technology in Service of Public Responsibility")}
            </div>
            <h2 style={{ fontSize: "2.8rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1.5rem", lineHeight: 1.1 }}>
              {isTe ? "బొజ్జల సుధీర్ రెడ్డి" : rep.name}
            </h2>
            <p style={{ color: "#64748b", fontSize: "1rem", marginBottom: "1rem" }}>
              {isTe ? "శాసనసభ్యులు (MLA)" : rep.title} · {isTe ? "తెలుగుదేశం పార్టీ" : rep.party}
            </p>
            <blockquote style={{ borderLeft: "2px solid #D4A017", paddingLeft: "1.5rem", color: "#94a3b8", fontSize: "1.1rem", fontStyle: "italic", lineHeight: 1.7, margin: "2rem 0" }}>
              "{t("home.leadershipQuote")}"
            </blockquote>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ padding: "0.5rem 1rem", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "8px", fontSize: "0.8rem", color: "#94a3b8" }}>
                {t("home.constituencyBadge", "Constituency No. 168")}
              </div>
              <div style={{ padding: "0.5rem 1rem", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "8px", fontSize: "0.8rem", color: "#94a3b8" }}>
                {t("home.electedBadge", "Elected 2024")}
              </div>
              <div style={{ padding: "0.5rem 1rem", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "8px", fontSize: "0.8rem", color: "#94a3b8" }}>
                {t("home.partyBadge", "TDP")}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: "320px" }}>
              <div style={{ position: "absolute", inset: 0, background: "#D4A017", borderRadius: "16px", transform: "translate(8px, 8px)", opacity: 0.1, filter: "blur(20px)" }} />
              <div style={{ position: "absolute", inset: 0, border: "1px solid rgba(212,160,23,0.3)", borderRadius: "16px", transform: "translate(-6px, -6px)" }} />
              <div style={{ position: "relative", width: "320px", height: "420px", background: "#0D2137", borderRadius: "16px", border: "1px solid rgba(212,160,23,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                <div style={{ fontSize: "4rem" }}>👤</div>
                <div style={{ textAlign: "center", padding: "0 1.5rem" }}>
                  <div style={{ color: "#D4A017", fontWeight: 700, fontSize: "0.85rem" }}>
                    {isTe ? "బొజ్జల సుధీర్ రెడ్డి" : rep.name}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                    {isTe ? "శ్రీకాళహస్తి ఎమ్మెల్యే" : "MLA Srikalahasti"}
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: "-20px", right: "-20px", background: "#0D2137", border: "1px solid rgba(212,160,23,0.4)", borderRadius: "12px", padding: "1rem", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                  <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                    {isTe ? "మొత్తం ఓట్లు" : "Total Votes"}
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#D4A017" }}>1,21,565</div>
                  <div style={{ height: "1px", background: "rgba(212,160,23,0.3)", margin: "8px 0" }} />
                  <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                    {isTe ? "మెజారిటీ" : "Winning Margin"}
                  </div>
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
            <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "2rem" }}>
              {t("home.memoriamBadge", "In Memoriam")}
            </div>
            <div style={{ width: "160px", height: "160px", borderRadius: "50%", border: "3px solid rgba(212,160,23,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", background: "#0D2137", fontSize: "3rem", boxShadow: "0 0 40px rgba(212,160,23,0.15)" }}>
              👤
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>
              {isTe ? "లేట్ శ్రీ బొజ్జల గోపాలకృష్ణారెడ్డి" : rep.father.name}
            </h2>
            <div style={{ color: "#D4A017", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "2rem" }}>1949 — 2022</div>
            <p style={{ fontSize: "1.1rem", color: "#94a3b8", lineHeight: 1.8, fontStyle: "italic", marginBottom: "3rem" }}>
              "{isTe ? "ప్రజాసేవే పరమావధిగా శ్రీకాళహస్తి నియోజకవర్గ అభివృద్ధికై నిరంతరం శ్రమించిన ప్రజా నాయకుడు." : rep.father.legacyText}"
            </p>
            <div style={{ color: "#475569", fontSize: "1rem" }}>
              {t("home.legacyQuote", "A legacy remembered. A constituency reimagined.")}
            </div>
          </div>
        </section>
      )}

      {/* ── SECURITY SECTION ── */}
      <section style={{ padding: "5rem 1.5rem", backgroundColor: "#0a1e35" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
              {isTe ? "భద్రత & గోప్యత" : "Security & Privacy"}
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff" }}>
              {t("home.securityTitle", "Designed to Protect Citizens")}
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
            {[
              t("home.securityItem1"),
              t("home.securityItem2"),
              t("home.securityItem3"),
              t("home.securityItem4"),
            ].map((text, idx) => (
              <div key={idx} style={{ padding: "1.5rem", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "12px", background: "rgba(13,33,55,0.4)", display: "flex", gap: "1rem" }}>
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
              <div style={{ fontWeight: 800, color: "#D4A017", fontSize: "1.1rem", marginBottom: "0.75rem" }}>
                {t("nav.title", "Srikalahasti Praja Seva")}
              </div>
              <p style={{ fontSize: "0.8rem", color: "#475569", lineHeight: 1.7, maxWidth: "360px" }}>
                {t("common.proposedNotice")}
              </p>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#94a3b8", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
                {isTe ? "విభాగాలు" : "Public"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  [t("nav.reportIssue", "Submit"), "/submit"],
                  [t("nav.track", "Track"), "/track"],
                  [t("nav.constituency", "Constituency"), "/constituency"],
                  [t("nav.learn", "Learn"), "/learn"],
                  [t("nav.about", "About"), "/about"],
                  [t("nav.developer", "Developer"), "/developer"]
                ].map(([label, href]) => (
                  <Link key={href} href={href} style={{ color: "#64748b", textDecoration: "none", fontSize: "0.85rem" }}>{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: "#94a3b8", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>
                {isTe ? "చట్టపరమైనవి" : "Legal"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  [isTe ? "గోప్యత" : "Privacy", "/privacy"],
                  [isTe ? "భద్రత" : "Security", "/security"],
                  [isTe ? "సంప్రదింపులు" : "Contact", "/contact"]
                ].map(([label, href]) => (
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
