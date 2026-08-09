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
    <main style={{ minHeight: "100vh", backgroundColor: "#060F1E", color: "#f0f4f8", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Shared Global Navigation */}
      <Navbar />

      {/* ── 1. HOMEPAGE HERO (MIDNIGHT NAVY, INDIGO, ELECTRIC TEAL & WARM GOLD) ── */}
      <section style={{
        position: "relative",
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#060F1E",
        backgroundImage: "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(30,27,75,0.7), rgba(6,15,30,0.95))"
      }}>
        {/* Layered Gopuram Image Background Overlay */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.2, zIndex: 0, pointerEvents: "none" }}>
          <Image
            src={ASSET_MANIFEST.templeHero.imagePath}
            alt="Srikalahasteeswara Temple Gopuram Skyline"
            fill
            priority
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        </div>

        {/* Electric Teal & Gold Ambient Aura */}
        <div style={{ position: "absolute", top: "10%", left: "5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "4.5rem 1.5rem 6.5rem", width: "100%", boxSizing: "border-box" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.4rem 1.1rem", borderRadius: "9999px", background: "rgba(13,148,136,0.12)", border: "1px solid rgba(20,184,166,0.35)", marginBottom: "1.75rem" }}>
            <span style={{ fontSize: "0.85rem" }}>⚡</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#14B8A6", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              {isTe ? "శ్రీకాళహస్తి ప్రజా సేవా ఇంటెలిజెన్స్ ప్లాట్‌ఫారమ్" : "Srikalahasti Assembly Constituency (No. 168)"}
            </span>
          </div>

          {/* Large Hero Headline */}
          <h1 style={{ fontSize: "clamp(2.5rem, 5.8vw, 4.8rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1.5rem", maxWidth: "940px" }}>
            <span style={{ color: "#F8FAFC", display: "block" }}>
              {t("home.heroLine1", "Every Voice Matters.")}
            </span>
            <span style={{ background: "linear-gradient(90deg, #14B8A6 0%, #F59E0B 60%, #FBBF24 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "block" }}>
              {t("home.heroLine2", "Every Issue Has a Path to Action.")}
            </span>
          </h1>

          <p style={{ fontSize: "1.15rem", color: "#94A3B8", maxWidth: "680px", lineHeight: 1.7, marginBottom: "2.5rem", fontWeight: 400 }}>
            {t("home.heroDesc", "A secure, AI-assisted platform for citizens of Srikalahasti to report public-service issues — and for constituency staff to identify patterns, prioritize cases and coordinate responsible action.")}
          </p>

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/submit" style={{
              display: "inline-flex", alignItems: "center", gap: "0.6rem",
              background: "linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)",
              color: "#FFFFFF", fontWeight: 800, fontSize: "1rem",
              padding: "1.1rem 2.25rem", borderRadius: "9999px", textDecoration: "none",
              boxShadow: "0 0 35px rgba(13,148,136,0.45)", transition: "transform 0.2s ease"
            }}>
              {t("home.submitGrievance", "Submit a Grievance →")}
            </Link>

            <Link href="/constituency" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              border: "1px solid rgba(245,158,11,0.45)", color: "#F59E0B",
              backgroundColor: "rgba(30,27,75,0.4)", fontWeight: 700, fontSize: "0.95rem",
              padding: "1.1rem 2.25rem", borderRadius: "9999px", textDecoration: "none"
            }}>
              {t("home.learnConstituency", "Explore Constituency")}
            </Link>

            <Link href="/track" style={{
              color: "#CBD5E1", fontWeight: 600, fontSize: "0.95rem",
              padding: "1.1rem 1.5rem", textDecoration: "none"
            }}>
              {t("home.trackComplaint", "Track Complaint →")}
            </Link>
          </div>
        </div>

        {/* Live Animated Statistics Bar */}
        <div style={{ position: "relative", zIndex: 10, borderTop: "1px solid rgba(20,184,166,0.25)", background: "rgba(6,15,30,0.92)", backdropFilter: "blur(20px)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {[
              { val: "3.13 Lakh", label: isTe ? "పౌరుల జనాభా (2011)" : "Citizens (2011 Census)", sub: isTe ? "శ్రీకాళహస్తి నియోజకవర్గం" : "Srikalahasti Constituency" },
              { val: "4 Mandals", label: isTe ? "అసెంబ్లీ మండలాలు" : "Assembly Mandals", sub: "Srikalahasti, Renigunta, Yerpedu, Thottambedu" },
              { val: "25+ Depts", label: isTe ? "పర్యవేక్షించబడే శాఖలు" : "Monitored Departments", sub: isTe ? "ప్రజా సేవా విభాగాలు" : "Public Services & Civic Bodies" },
              { val: "100% Safe", label: isTe ? "గోప్యతా విశ్లేషణ" : "Confidential AI Safety", sub: isTe ? "అత్యవసర రక్షణ వ్యవస్థ" : "Safety-First Priority Engine" },
            ].map((stat, idx) => (
              <div key={idx} style={{ borderLeft: "3px solid #14B8A6", paddingLeft: "1rem" }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#F59E0B" }}>{stat.val}</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#F8FAFC", marginTop: "2px" }}>{stat.label}</div>
                <div style={{ fontSize: "0.7rem", color: "#94A3B8", marginTop: "2px" }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. LEADERSHIP & LEGACY SECTION (MAROON, PARCHMENT, OLD GOLD & DEEP BROWN) ── */}
      <section style={{
        padding: "6.5rem 1.5rem",
        backgroundColor: "#2D080C",
        backgroundImage: "linear-gradient(180deg, #3B0764 0%, #2D080C 50%, #1C0A00 100%)",
        borderTop: "1px solid rgba(217,119,6,0.3)",
        borderBottom: "1px solid rgba(217,119,6,0.3)"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#F59E0B", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {isTe ? "నాయకత్వ వర్గం & పరిపాలన దార్శనికత" : "Leadership & Governance Representation"}
            </div>
            <h2 style={{ fontSize: "2.6rem", fontWeight: 900, color: "#FDFBF7", letterSpacing: "-0.02em" }}>
              {isTe ? "ప్రజా నాయకత్వం మరియు డిజిటల్ పరిపాలన" : "Constituency Leadership & Legacy"}
            </h2>
            <p style={{ color: "#E2E8F0", marginTop: "0.75rem", fontSize: "1.05rem", maxWidth: "700px", margin: "0.75rem auto 0" }}>
              {isTe ? "శ్రీకాళహస్తి నియోజకవర్గ అభివృద్ధికి ప్రజా నాయకత్వం." : "Authorized photography and configured representation for Srikalahasti Assembly Constituency."}
            </p>
          </div>

          {/* Primary Representative Card (MLA - Sri Bojjala Sudhir Reddy) */}
          <div style={{
            background: "#FDFBF7",
            color: "#1C0A00",
            borderRadius: "24px",
            padding: "2.75rem",
            marginBottom: "3.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2.75rem",
            alignItems: "center",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            border: "2px solid #B45309"
          }}>
            <div style={{ position: "relative", width: "100%", height: "350px", borderRadius: "20px", overflow: "hidden", border: "3px solid #B45309", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}>
              <Image
                src={mla.imagePath}
                alt={mla.name}
                fill
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </div>

            <div>
              <div style={{ display: "inline-flex", gap: "0.6rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                <span style={{ padding: "0.35rem 0.9rem", borderRadius: "9999px", background: "rgba(180,83,9,0.12)", border: "1px solid #B45309", color: "#B45309", fontWeight: 800, fontSize: "0.78rem" }}>
                  Elected 2024 (1,21,565 Votes)
                </span>
                <span style={{ padding: "0.35rem 0.9rem", borderRadius: "9999px", background: "rgba(15,118,110,0.12)", border: "1px solid #0F766E", color: "#0F766E", fontWeight: 800, fontSize: "0.78rem" }}>
                  Margin: 43,304 Votes
                </span>
              </div>

              <h3 style={{ fontSize: "2.3rem", fontWeight: 900, color: "#1C0A00", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>{mla.name}</h3>
              <div style={{ color: "#B45309", fontWeight: 800, fontSize: "1.05rem", marginBottom: "1.25rem" }}>{mla.role}</div>

              <blockquote style={{ borderLeft: "4px solid #B45309", paddingLeft: "1.25rem", color: "#451A03", fontSize: "1rem", fontStyle: "italic", lineHeight: 1.7, margin: "0 0 1.5rem" }}>
                "{isTe ? "ప్రతి సమస్యకు ఒక పరిష్కారం ఉంటుంది. ప్రతి పౌరుడి స్వరానికి స్పందించడమే మా మొదటి బాధ్యత." : "Every citizen has a story. Every public problem leaves a pattern. Every pattern can guide responsible action for Srikalahasti."}"
              </blockquote>

              <div style={{ fontSize: "0.75rem", color: "#78350F", borderTop: "1px solid rgba(180,83,9,0.2)", paddingTop: "0.75rem" }}>
                Attribution: {mla.attribution} · License: {mla.permissionStatus}
              </div>
            </div>
          </div>

          {/* State & National Leadership Composition Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1.5rem" }}>
            {[cm, lokesh, pm, ntr, father].map((item) => (
              <div key={item.id} style={{
                background: "rgba(253,251,247,0.95)",
                color: "#1C0A00",
                border: "1px solid #B45309",
                borderRadius: "20px",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
              }}>
                <div>
                  <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "14px", overflow: "hidden", marginBottom: "1rem", border: "2px solid #B45309" }}>
                    <Image src={item.imagePath} alt={item.name} fill style={{ objectFit: "cover", objectPosition: "center top" }} />
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#B45309", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>
                    {item.role}
                  </div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#1C0A00", marginBottom: "0.5rem" }}>{item.name}</h4>
                </div>
                <div style={{ fontSize: "0.65rem", color: "#78350F", borderTop: "1px solid rgba(180,83,9,0.2)", paddingTop: "0.6rem", marginTop: "0.8rem" }}>
                  {item.permissionStatus}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE WORKFLOW SECTION ── */}
      <section style={{ padding: "6rem 1.5rem", backgroundColor: "#0B1329", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#38BDF8", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {isTe ? "కార్యాచరణ ప్రక్రియ" : "Interactive Complaint Workflow"}
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#F8FAFC" }}>
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
                    border: `1px solid ${active ? "#0EA5E9" : "rgba(255,255,255,0.1)"}`,
                    backgroundColor: active ? "rgba(14,165,233,0.15)" : "rgba(15,23,42,0.6)",
                    color: active ? "#38BDF8" : "#94A3B8",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>{step.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: active ? "#FFFFFF" : "#CBD5E1" }}>{step.title}</div>
                </button>
              );
            })}
          </div>

          {/* Active Step Details Panel */}
          {(() => {
            const activeStepObj = workflowSteps.find((s) => s.n === activeWorkflowStep)!;
            return (
              <div style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(14,165,233,0.35)", borderRadius: "20px", padding: "2.5rem", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(14,165,233,0.2)", border: "2px solid #0EA5E9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", flexShrink: 0 }}>
                  {activeStepObj.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>{activeStepObj.title}</h3>
                  <p style={{ fontSize: "1.05rem", color: "#CBD5E1", lineHeight: 1.7, margin: 0 }}>{activeStepObj.desc}</p>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── 4. AI INTELLIGENCE SECTION (CHARCOAL, CYAN, VIOLET, MINT & AMBER) ── */}
      <section style={{ padding: "6.5rem 1.5rem", backgroundColor: "#0F172A", borderTop: "1px solid rgba(6,182,212,0.25)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#06B6D4", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {isTe ? "AI ఇంటెలిజెన్స్ వ్యవస్థ" : "Safety-First AI Analysis Engine"}
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#F8FAFC" }}>
              {isTe ? "పౌర పిర్యాదుల ప్రాధాన్యత విశ్లేషణ" : "AI Assessment & Priority Pipeline"}
            </h2>
            <p style={{ color: "#94A3B8", marginTop: "0.75rem", fontSize: "1.05rem", maxWidth: "700px", margin: "0.75rem auto 0" }}>
              AI classifies categories, checks completeness, and evaluates safety risks before human review.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.75rem" }}>
            {[
              { title: "Safety Escalation Layer", icon: "🛡️", color: "#EF4444", text: "Emergency cases (violence, threat to life, child abuse) receive immediate top priority." },
              { title: "Credibility Assessment", icon: "📊", color: "#06B6D4", text: "Multi-dimensional metric evaluation of evidence completeness and location detail." },
              { title: "Department Routing", icon: "🏢", color: "#8B5CF6", text: "Automated suggestion of the responsible department across 25+ government sectors." },
              { title: "Human Review Pipeline", icon: "👁️", color: "#10B981", text: "AI assessment is preliminary. All actions are reviewed and assigned by staff." }
            ].map((card, idx) => (
              <div key={idx} style={{
                background: "rgba(30,41,59,0.7)",
                border: `1px solid ${card.color}40`,
                borderRadius: "20px",
                padding: "2rem",
                boxShadow: `0 10px 30px ${card.color}15`
              }}>
                <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>{card.icon}</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: card.color, marginBottom: "0.5rem" }}>{card.title}</h3>
                <p style={{ color: "#CBD5E1", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CONSTITUENCY ANALYTICS OVERVIEW (SLATE, AZURE, TURQUOISE, CORAL & LIME) ── */}
      <section style={{ padding: "6.5rem 1.5rem", backgroundColor: "#1E293B", borderTop: "1px solid rgba(2,132,199,0.3)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "#0284C7", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {isTe ? "మండలాల వివరాలు" : "Constituency Analytics & Mandals"}
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#F8FAFC" }}>
              {isTe ? "4 అసెంబ్లీ మండలాల సమాచారం" : "Assembly Mandals Data Overview"}
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
                    background: isSelected ? "rgba(2,132,199,0.18)" : "rgba(15,23,42,0.6)",
                    border: `2px solid ${isSelected ? "#06B6D4" : "rgba(2,132,199,0.25)"}`,
                    borderRadius: "20px",
                    padding: "1.75rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#F8FAFC", margin: 0 }}>{mandalName}</h3>
                    <span style={{ padding: "0.25rem 0.65rem", borderRadius: "9999px", background: "rgba(132,204,22,0.18)", border: "1px solid #84CC16", color: "#84CC16", fontSize: "0.72rem", fontWeight: 800 }}>
                      {info.status}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.85rem", color: "#94A3B8", marginBottom: "0.5rem" }}>
                    {isTe ? info.nameTe : mandalName} · Population: <strong style={{ color: "#06B6D4" }}>{info.pop}</strong>
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "#CBD5E1", marginBottom: "1rem" }}>{info.wards}</div>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "0.75rem", fontSize: "0.75rem", color: "#F43F5E", fontWeight: 700 }}>
                    Priority focus: {info.priority}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: "#040C16", borderTop: "1px solid rgba(13,148,136,0.3)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <Image src="/assets/symbols/civic-emblem.svg" alt="Praja Seva Official Civic Emblem" width={32} height={32} />
              <span style={{ fontWeight: 900, color: "#14B8A6", fontSize: "1.2rem" }}>Praja Seva</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.7 }}>
              Srikalahasti Assembly Constituency (No. 168), Tirupati District, Andhra Pradesh.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 800, color: "#F8FAFC", fontSize: "0.9rem", marginBottom: "1rem" }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <Link href="/submit" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.85rem" }}>Submit Grievance</Link>
              <Link href="/track" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.85rem" }}>Track Complaint</Link>
              <Link href="/constituency" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.85rem" }}>Constituency Info</Link>
              <Link href="/learn" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.85rem" }}>Knowledge Base</Link>
              <Link href="/developer" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.85rem" }}>Meet Developer</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontWeight: 800, color: "#F8FAFC", fontSize: "0.9rem", marginBottom: "1rem" }}>Legal & Security</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <Link href="/privacy" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.85rem" }}>Privacy Policy</Link>
              <Link href="/security" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.85rem" }}>Security Standards</Link>
              <Link href="/contact" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.85rem" }}>Contact Office</Link>
              <Link href="/staff/login" style={{ color: "#F87171", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700 }}>🔒 Protected Staff Login</Link>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "1280px", margin: "2rem auto 0", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", fontSize: "0.75rem", color: "#64748B" }}>
          Proposed Civic Technology Platform · Not an Official Government Portal · Srikalahasti Assembly Constituency (No. 168)
        </div>
      </footer>
    </main>
  );
}
