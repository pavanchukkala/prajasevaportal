"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import { ASSET_MANIFEST } from "@/config/assets";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(1);
  const [selectedMandal, setSelectedMandal] = useState("Srikalahasti");

  const mla = ASSET_MANIFEST.mla;
  const father = ASSET_MANIFEST.father;
  const cm = ASSET_MANIFEST.cm;
  const lokesh = ASSET_MANIFEST.lokesh;
  const pm = ASSET_MANIFEST.pm;
  const ntr = ASSET_MANIFEST.ntr;

  const mandalData: Record<string, { nameTe: string; pop: string; wards: string; priority: string; status: string }> = {
    Srikalahasti: { nameTe: "శ్రీకాళహస్తి", pop: "1,14,354", wards: "17 Wards / Municipal Council", priority: "High Priority — Municipal Pipeline Upgrade", status: "Active Oversight" },
    Renigunta: { nameTe: "రేణిగుంట", pop: "75,230", wards: "Industrial Hub / Airport Corridor", priority: "Road Infrastructure & Drainage", status: "Active Oversight" },
    Yerpedu: { nameTe: "ఏర్పేడు", pop: "62,410", wards: "IIT / IISER Knowledge Hub", priority: "Welfare Pension Disbursement", status: "Monitored" },
    Thottambedu: { nameTe: "తొట్టంబేడు", pop: "60,879", wards: "Rural Agriculture / Irrigation", priority: "Canal Water Maintenance", status: "Monitored" },
  };

  const workflowSteps = [
    { n: 1, icon: "💬", title: isTe ? "1. పౌరుల సమర్పణ" : "1. Citizen Submission", desc: isTe ? "టెక్స్ట్, ఆడియో లేదా ఫోటో ద్వారా సురక్షిత సమర్పణ. గోప్యత ఐచ్ఛికం." : "Secure text, audio, image or PDF submission. Anonymous option available." },
    { n: 2, icon: "🔒", title: isTe ? "2. సురక్షిత నిల్వ" : "2. Secure Private Storage", desc: isTe ? "ప్రత్యేక ఫిర్యాదు ID (SKT-2026-XXXXX) మరియు ప్రైవేట్ ట్రాకింగ్ టోకెన్ జారీ." : "Unique Complaint ID (SKT-2026-XXXXX) & private tracking token generated." },
    { n: 3, icon: "🧠", title: isTe ? "3. AI విశ్లేషణ" : "3. Safety-First AI Analysis", desc: isTe ? "రక్షణ ప్రాధాన్యత ప్రాథమికంగా విశ్లేషించబడుతుంది. అత్యవసర ప్రక్రియ ప్రారంభమవుతుంది." : "Safety classification evaluated FIRST. Critical cases flagged immediately." },
    { n: 4, icon: "👁", title: isTe ? "4. మానవ సమీక్ష" : "4. Authorized Human Review", desc: isTe ? "అధికారిక సమీక్షకులు AI ఫలితాన్ని తనిఖీ చేసి తగిన శాఖకు కేటాయిస్తారు." : "Authorized reviewers validate assessment and assign to department officer." },
    { n: 5, icon: "✅", title: isTe ? "5. పరిష్కారం & ట్రాకింగ్" : "5. Action & Citizen Tracking", desc: isTe ? "పౌరులు తమ ట్రాకింగ్ టోకెన్ ద్వారా తాజా స్థితిని నిరంతరం చూడవచ్చు." : "Department resolves issue; citizen tracks real-time timeline via token." },
  ];

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#060f1a", color: "#f0f4f8", fontFamily: "system-ui, sans-serif" }}>
      {/* Shared Navigation */}
      <Navbar />

      {/* ── 1. CINEMATIC HERO SECTION ── */}
      <section style={{ position: "relative", minHeight: "88vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
        {/* Hero Background Temple Image Overlay */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.25, zIndex: 0 }}>
          <Image
            src={ASSET_MANIFEST.templeHero.imagePath}
            alt="Srikalahasteeswara Temple Gopuram Skyline"
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Ambient Dark Gradient & Tricolour Aura */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(6,15,26,0.7) 0%, #060f1a 90%)", zIndex: 1 }} />
        <div style={{ position: "absolute", top: "15%", left: "5%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,153,51,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: "15%", right: "5%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(19,136,8,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "4rem 1.5rem 6rem", width: "100%", boxSizing: "border-box" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.4rem 1rem", borderRadius: "9999px", background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.3)", marginBottom: "1.75rem" }}>
            <span style={{ color: "#FF9933" }}>🇮🇳</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              {isTe ? "శ్రీకాళహస్తి ప్రజా సేవా ఇంటెలిజెన్స్ ప్లాట్‌ఫారమ్" : "Srikalahasti Assembly Constituency (No. 168)"}
            </span>
          </div>

          {/* Hero Headline */}
          <h1 style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1.5rem", maxWidth: "920px" }}>
            <span style={{ color: "#ffffff", display: "block" }}>
              {t("home.heroLine1", "Every Voice Matters.")}
            </span>
            <span style={{ background: "linear-gradient(90deg, #D4A017, #F59E0B, #10B981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "block" }}>
              {t("home.heroLine2", "Every Issue Has a Path to Action.")}
            </span>
          </h1>

          <p style={{ fontSize: "1.15rem", color: "#94a3b8", maxWidth: "680px", lineHeight: 1.7, marginBottom: "2.5rem", fontWeight: 400 }}>
            {t("home.heroDesc", "A secure, AI-assisted platform for citizens of Srikalahasti to report public-service issues — and for constituency staff to identify patterns, prioritize cases and coordinate responsible action.")}
          </p>

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/submit" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "linear-gradient(135deg, #D4A017, #F59E0B)",
              color: "#060f1a", fontWeight: 800, fontSize: "1rem",
              padding: "1.1rem 2.25rem", borderRadius: "9999px", textDecoration: "none",
              boxShadow: "0 0 35px rgba(212,160,23,0.4)", transition: "transform 0.2s"
            }}>
              {t("home.submitGrievance", "Submit a Grievance →")}
            </Link>

            <Link href="/constituency" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              border: "1px solid rgba(212,160,23,0.4)", color: "#D4A017",
              backgroundColor: "rgba(13,33,55,0.6)", fontWeight: 700, fontSize: "0.95rem",
              padding: "1.1rem 2.25rem", borderRadius: "9999px", textDecoration: "none"
            }}>
              {t("home.learnConstituency", "Explore Constituency")}
            </Link>

            <Link href="/track" style={{
              color: "#94a3b8", fontWeight: 600, fontSize: "0.95rem",
              padding: "1.1rem 1.5rem", textDecoration: "none"
            }}>
              {t("home.trackComplaint", "Track Complaint →")}
            </Link>
          </div>
        </div>

        {/* Animated Statistics Bar */}
        <div style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(212,160,23,0.2)", background: "rgba(13,33,55,0.95)", backdropFilter: "blur(20px)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {[
              { val: "3.13 Lakh", label: isTe ? "పౌరుల జనాభా (2011)" : "Citizens (2011 Census)", sub: isTe ? "శ్రీకాళహస్తి నియోజకవర్గం" : "Srikalahasti Constituency" },
              { val: "4 Mandals", label: isTe ? "అసెంబ్లీ మండలాలు" : "Assembly Mandals", sub: "Srikalahasti, Renigunta, Yerpedu, Thottambedu" },
              { val: "25+ Depts", label: isTe ? "పర్యవేక్షించబడే శాఖలు" : "Monitored Departments", sub: isTe ? "ప్రజా సేవా విభాగాలు" : "Public Services & Civic Bodies" },
              { val: "100% Safe", label: isTe ? "గోప్యతా విశ్లేషణ" : "Confidential AI Safety", sub: isTe ? "అత్యవసర రక్షణ వ్యవస్థ" : "Safety-First Priority Engine" },
            ].map((stat, idx) => (
              <div key={idx} style={{ borderLeft: "3px solid #D4A017", paddingLeft: "1rem" }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#fbbf24" }}>{stat.val}</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff", marginTop: "2px" }}>{stat.label}</div>
                <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "2px" }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. DYNAMIC LEADERSHIP COMPOSITION SECTION ── */}
      <section style={{ padding: "6rem 1.5rem", backgroundColor: "#081424", borderTop: "1px solid rgba(212,160,23,0.1)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#D4A017", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {isTe ? "నాయకత్వ వర్గం & ప్రజా ప్రతినిధులు" : "Leadership & Governance Framework"}
            </div>
            <h2 style={{ fontSize: "2.6rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em" }}>
              {isTe ? "ప్రజా నాయకత్వం మరియు డిజిటల్ పరిపాలన" : "Public Leadership & State Technology Vision"}
            </h2>
            <p style={{ color: "#94a3b8", marginTop: "0.75rem", fontSize: "1.05rem", maxWidth: "700px", margin: "0.75rem auto 0" }}>
              {isTe ? "శ్రీకాళహస్తి నియోజకవర్గ అభివృద్ధికి డిజిటల్ వ్యవస్థలు." : "Configured leadership representation for constituency administration and state governance."}
            </p>
          </div>

          {/* Primary Representative Hero Card */}
          <div style={{ background: "rgba(13,33,55,0.7)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: "24px", padding: "2.5rem", marginBottom: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2.5rem", alignItems: "center" }}>
            <div style={{ position: "relative", width: "100%", height: "320px", borderRadius: "20px", overflow: "hidden", border: "2px solid rgba(212,160,23,0.4)" }}>
              <Image
                src={mla.imagePath}
                alt={mla.name}
                fill
                style={{ objectFit: "cover" }}
              />
            </div>

            <div>
              <div style={{ display: "inline-flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <span style={{ padding: "0.3rem 0.8rem", borderRadius: "9999px", background: "rgba(212,160,23,0.15)", border: "1px solid rgba(212,160,23,0.4)", color: "#fbbf24", fontWeight: 700, fontSize: "0.75rem" }}>
                  Elected 2024 (1,21,565 Votes)
                </span>
                <span style={{ padding: "0.3rem 0.8rem", borderRadius: "9999px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#10b981", fontWeight: 700, fontSize: "0.75rem" }}>
                  Margin: 43,304 Votes
                </span>
              </div>

              <h3 style={{ fontSize: "2.2rem", fontWeight: 900, color: "#ffffff", marginBottom: "0.5rem" }}>{mla.name}</h3>
              <div style={{ color: "#D4A017", fontWeight: 700, fontSize: "1rem", marginBottom: "1.25rem" }}>{mla.role}</div>

              <blockquote style={{ borderLeft: "3px solid #D4A017", paddingLeft: "1.25rem", color: "#94a3b8", fontSize: "0.95rem", fontStyle: "italic", lineHeight: 1.7, margin: "0 0 1.5rem" }}>
                "{isTe ? "ప్రతి సమస్యకు ఒక పరిష్కారం ఉంటుంది. ప్రతి పౌరుడి స్వరానికి స్పందించడమే మా మొదటి బాధ్యత." : "Every citizen has a story. Every public problem leaves a pattern. Every pattern can guide responsible action for Srikalahasti."}"
              </blockquote>

              <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                Attribution: {mla.attribution} · License: {mla.permissionStatus}
              </div>
            </div>
          </div>

          {/* Grid of State & National Leadership */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {[cm, lokesh, pm, ntr, father].map((item) => (
              <div key={item.id} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.18)", borderRadius: "18px", padding: "1.25rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ position: "relative", width: "100%", height: "180px", borderRadius: "12px", overflow: "hidden", marginBottom: "1rem", border: "1px solid rgba(212,160,23,0.2)" }}>
                    <Image src={item.imagePath} alt={item.name} fill style={{ objectFit: "cover" }} />
                  </div>
                  <div style={{ fontSize: "0.65rem", color: "#D4A017", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>
                    {item.role}
                  </div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>{item.name}</h4>
                </div>
                <div style={{ fontSize: "0.65rem", color: "#64748b", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.6rem", marginTop: "0.8rem" }}>
                  {item.permissionStatus}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE WORKFLOW SECTION ── */}
      <section style={{ padding: "6rem 1.5rem", backgroundColor: "#060f1a", borderTop: "1px solid rgba(212,160,23,0.1)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#D4A017", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {isTe ? "కార్యాచరణ ప్రక్రియ" : "Interactive Complaint Workflow"}
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff" }}>
              {t("home.howItWorksTitle", "From Citizen Voice to Responsible Action")}
            </h2>
          </div>

          {/* Interactive Step Switcher */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
            {workflowSteps.map((step) => {
              const active = activeWorkflowStep === step.n;
              return (
                <button
                  key={step.n}
                  onClick={() => setActiveWorkflowStep(step.n)}
                  style={{
                    padding: "1.25rem",
                    borderRadius: "16px",
                    border: `1px solid ${active ? "#D4A017" : "rgba(212,160,23,0.15)"}`,
                    backgroundColor: active ? "rgba(212,160,23,0.15)" : "rgba(13,33,55,0.4)",
                    color: active ? "#fbbf24" : "#94a3b8",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{step.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: active ? "#ffffff" : "#cbd5e1" }}>{step.title}</div>
                </button>
              );
            })}
          </div>

          {/* Active Step Details Panel */}
          {(() => {
            const activeStepObj = workflowSteps.find((s) => s.n === activeWorkflowStep)!;
            return (
              <div style={{ background: "rgba(13,33,55,0.8)", border: "1px solid rgba(212,160,23,0.3)", borderRadius: "20px", padding: "2.5rem", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(212,160,23,0.2)", border: "2px solid #D4A017", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", flexShrink: 0 }}>
                  {activeStepObj.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>{activeStepObj.title}</h3>
                  <p style={{ fontSize: "1.05rem", color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>{activeStepObj.desc}</p>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── 4. ANIMATED CONSTITUENCY MAP & MANDAL OVERVIEW ── */}
      <section style={{ padding: "6rem 1.5rem", backgroundColor: "#081424", borderTop: "1px solid rgba(212,160,23,0.1)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#D4A017", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {isTe ? "మండలాల వివరాలు" : "Constituency Mandal Overview"}
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff" }}>
              {isTe ? "4 అసెంబ్లీ మండలాల సమాచారం" : "Assembly Mandals Intelligence"}
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {Object.entries(mandalData).map(([mandalName, info]) => {
              const isSelected = selectedMandal === mandalName;
              return (
                <div
                  key={mandalName}
                  onClick={() => setSelectedMandal(mandalName)}
                  style={{
                    background: isSelected ? "rgba(212,160,23,0.12)" : "rgba(13,33,55,0.5)",
                    border: `1px solid ${isSelected ? "#D4A017" : "rgba(212,160,23,0.2)"}`,
                    borderRadius: "20px",
                    padding: "1.75rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>{mandalName}</h3>
                    <span style={{ padding: "0.25rem 0.6rem", borderRadius: "9999px", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)", color: "#10b981", fontSize: "0.7rem", fontWeight: 700 }}>
                      {info.status}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "0.5rem" }}>
                    {isTe ? info.nameTe : mandalName} · Population: <strong style={{ color: "#D4A017" }}>{info.pop}</strong>
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "#cbd5e1", marginBottom: "1rem" }}>{info.wards}</div>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "0.75rem", fontSize: "0.75rem", color: "#fbbf24" }}>
                    Priority focus: {info.priority}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: "#040c16", borderTop: "1px solid rgba(212,160,23,0.2)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <Image src="/assets/symbols/civic-emblem.svg" alt="Praja Seva Official Civic Emblem" width={32} height={32} />
              <span style={{ fontWeight: 900, color: "#D4A017", fontSize: "1.2rem" }}>Praja Seva</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.7 }}>
              Srikalahasti Assembly Constituency (No. 168), Tirupati District, Andhra Pradesh.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 800, color: "#ffffff", fontSize: "0.9rem", marginBottom: "1rem" }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <Link href="/submit" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>Submit Grievance</Link>
              <Link href="/track" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>Track Complaint</Link>
              <Link href="/constituency" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>Constituency Info</Link>
              <Link href="/learn" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>Knowledge Base</Link>
              <Link href="/developer" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>Meet Developer</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 800, color: "#ffffff", fontSize: "0.9rem", marginBottom: "1rem" }}>Legal & Security</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <Link href="/privacy" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>Privacy Policy</Link>
              <Link href="/security" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>Security Standards</Link>
              <Link href="/contact" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "0.85rem" }}>Contact Office</Link>
              <Link href="/staff/login" style={{ color: "#fca5a5", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700 }}>🔒 Protected Staff Login</Link>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1280px", margin: "2rem auto 0", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", fontSize: "0.75rem", color: "#64748b" }}>
          Proposed Civic Technology Platform · Not an Official Government Portal · Srikalahasti Assembly Constituency (No. 168)
        </div>
      </footer>
    </main>
  );
}
