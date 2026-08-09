"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ASSET_MANIFEST } from "@/config/assets";
import { useLanguage } from "@/context/LanguageContext";
import {
  MessageSquare,
  Lock,
  Brain,
  Eye,
  CheckCircle,
  ShieldAlert,
  BarChart3,
  Building2,
  UserCheck,
  Zap,
  ArrowRight,
} from "lucide-react";

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
    { n: 1, icon: <MessageSquare size={24} />, title: isTe ? "1. పౌరుల సమర్పణ" : "1. Citizen Submission", desc: isTe ? "టెక్స్ట్, ఆడియో లేదా ఫోటో ద్వారా సురక్షిత సమర్పణ. గోప్యత ఐచ్ఛికం." : "Secure text, audio, image or PDF submission. Anonymous option available." },
    { n: 2, icon: <Lock size={24} />, title: isTe ? "2. సురక్షిత నిల్వ" : "2. Secure Private Storage", desc: isTe ? "ప్రత్యేక ఫిర్యాదు ID (SKT-2026-XXXXX) మరియు ప్రైవేట్ ట్రాకింగ్ టోకెన్ జారీ." : "Unique Complaint ID (SKT-2026-XXXXX) & private tracking token generated." },
    { n: 3, icon: <Brain size={24} />, title: isTe ? "3. AI విశ్లేషణ" : "3. Safety-First AI Analysis", desc: isTe ? "రక్షణ ప్రాధాన్యత ప్రాథమికంగా విశ్లేషించబడుతుంది. అత్యవసర ప్రక్రియ ప్రారంభమవుతుంది." : "Safety classification evaluated FIRST. Critical cases flagged immediately." },
    { n: 4, icon: <Eye size={24} />, title: isTe ? "4. మానవ సమీక్ష" : "4. Authorized Human Review", desc: isTe ? "అధికారిక సమీక్షకులు AI ఫలితాన్ని తనిఖీ చేసి తగిన శాఖకు కేటాయిస్తారు." : "Authorized reviewers validate assessment and assign to department officer." },
    { n: 5, icon: <CheckCircle size={24} />, title: isTe ? "5. పరిష్కారం & ట్రాకింగ్" : "5. Action & Citizen Tracking", desc: isTe ? "పౌరులు తమ ట్రాకింగ్ టోకెన్ ద్వారా తాజా స్థితిని నిరంతరం చూడవచ్చు." : "Department resolves issue; citizen tracks real-time timeline via token." },
  ];

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)", color: "var(--text-main)", transition: "background-color 0.25s ease, color 0.25s ease" }}>
      {/* Shared Global Header Navigation */}
      <Navbar />

      {/* ── 1. HOMEPAGE HERO SECTION ── */}
      <section style={{
        position: "relative",
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "var(--bg-main)",
        borderBottom: "1px solid var(--border-main)",
        transition: "background-color 0.25s ease",
      }}>
        {/* Extended Praja Seva Emblem Logo Watermark Background */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "3%",
            transform: "translateY(-50%)",
            width: "clamp(340px, 42vw, 580px)",
            height: "clamp(340px, 42vw, 580px)",
            opacity: 0.10,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/assets/symbols/civic-emblem.svg"
            alt="Praja Seva Official Emblem Watermark"
            width={580}
            height={580}
            priority
            style={{
              objectFit: "contain",
              filter: "drop-shadow(0 0 25px rgba(13,148,136,0.18))",
            }}
          />
        </div>

        {/* Extended Ambient Teal & Gold Glow Auras */}
        <div style={{ position: "absolute", top: "15%", left: "5%", width: "550px", height: "550px", borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />
        <div style={{ position: "absolute", bottom: "10%", right: "8%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(180,83,9,0.1) 0%, transparent 70%)", pointerEvents: "none", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "1280px", margin: "0 auto", padding: "4.5rem 1.5rem 5.5rem", width: "100%", boxSizing: "border-box" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", padding: "0.4rem 1.1rem", borderRadius: "9999px", background: "rgba(13,148,136,0.12)", border: "1px solid var(--accent-teal)", marginBottom: "1.75rem" }}>
            <Zap size={14} style={{ color: "var(--accent-teal)" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--accent-teal)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              {isTe ? "శ్రీకాళహస్తి ప్రజా సేవా ఇంటెలిజెన్స్ ప్లాట్‌ఫారమ్" : "Srikalahasti Assembly Constituency (No. 168)"}
            </span>
          </div>

          {/* Large Hero Headline */}
          <h1 style={{ fontSize: "clamp(2.5rem, 5.8vw, 4.5rem)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1.5rem", maxWidth: "940px" }}>
            <span style={{ color: "var(--text-main)", display: "block" }}>
              {t("home.heroLine1", "Every Voice Matters.")}
            </span>
            <span style={{ color: "var(--accent-gold)", display: "block" }}>
              {t("home.heroLine2", "Every Issue Has a Path to Action.")}
            </span>
          </h1>

          <p style={{ fontSize: "1.15rem", color: "var(--text-muted)", maxWidth: "680px", lineHeight: 1.7, marginBottom: "2.5rem", fontWeight: 400 }}>
            {t("home.heroDesc", "A secure, AI-assisted platform for citizens of Srikalahasti to report public-service issues — and for constituency staff to identify patterns, prioritize cases and coordinate responsible action.")}
          </p>

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
            <Link href="/submit" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "var(--accent-teal)",
              color: "#FFFFFF", fontWeight: 800, fontSize: "1rem",
              padding: "1.1rem 2.25rem", borderRadius: "9999px", textDecoration: "none",
              boxShadow: "0 4px 20px rgba(13,148,136,0.3)", transition: "transform 0.2s ease"
            }}>
              <span>{t("home.submitGrievance", "Submit a Grievance")} →</span>
            </Link>

            <Link href="/constituency" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              border: "1.5px solid var(--accent-gold)", color: "var(--accent-gold)",
              backgroundColor: "var(--bg-surface)", fontWeight: 700, fontSize: "0.95rem",
              padding: "1.1rem 2.25rem", borderRadius: "9999px", textDecoration: "none"
            }}>
              <span>{t("home.learnConstituency", "Learn About the Constituency")}</span>
            </Link>

            <Link href="/track" style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              color: "var(--text-main)", fontWeight: 700, fontSize: "0.95rem",
              padding: "1.1rem 1.5rem", borderRadius: "9999px", textDecoration: "none"
            }}>
              <span>{isTe ? "ఫిర్యాదు ట్రాక్ చేయండి →" : "Track Complaint →"}</span>
            </Link>
          </div>
        </div>

        {/* Live Animated Statistics Bar */}
        <div style={{ position: "relative", zIndex: 10, borderTop: "1px solid var(--border-main)", background: "var(--bg-surface)", backdropFilter: "blur(20px)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {[
              { val: "3.13 Lakh", label: isTe ? "పౌరుల జనాభా (2011)" : "Citizens (2011 Census)", sub: isTe ? "శ్రీకాళహస్తి నియోజకవర్గం" : "Srikalahasti Constituency" },
              { val: "4 Mandals", label: isTe ? "అసెంబ్లీ మండలాలు" : "Assembly Mandals", sub: "Srikalahasti, Renigunta, Yerpedu, Thottambedu" },
              { val: "25+ Depts", label: isTe ? "పర్యవేక్షించబడే శాఖలు" : "Monitored Departments", sub: isTe ? "ప్రజా సేవా విభాగాలు" : "Public Services & Civic Bodies" },
              { val: "Privacy Aware", label: isTe ? "గోప్యతా విశ్లేషణ" : "Privacy-Aware Triage", sub: isTe ? "అత్యవసర రక్షణ వ్యవస్థ" : "Safety-First Priority Engine" },
            ].map((stat, idx) => (
              <div key={idx} style={{ borderLeft: "3px solid var(--accent-teal)", paddingLeft: "1rem" }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--accent-gold)" }}>{stat.val}</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)", marginTop: "2px" }}>{stat.label}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. LEADERSHIP & LEGACY GALLERY ── */}
      <section style={{
        padding: "5.5rem 1.5rem",
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-main)",
        transition: "background-color 0.25s ease",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--accent-gold)", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {isTe ? "నాయకత్వ వర్గం & పరిపాలన దార్శనికత" : "Leadership & Governance Representation"}
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.02em" }}>
              {isTe ? "ప్రజా నాయకత్వం మరియు డిజిటల్ పరిపాలన" : "Constituency Leadership & Legacy"}
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.75rem", fontSize: "1.05rem", maxWidth: "700px", margin: "0.75rem auto 0" }}>
              {isTe ? "శ్రీకాళహస్తి నియోజకవర్గ అభివృద్ధికి ప్రజా నాయకత్వం." : "Authorized photography and configured representation for Srikalahasti Assembly Constituency."}
            </p>
          </div>

          {/* Unified Leadership Gallery (6 Cards with Equal Size & Visual Importance) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.75rem" }}>
            {[mla, father, lokesh, cm, ntr, pm].map((item) => (
              <div key={item.id} style={{
                background: "var(--bg-elevated)",
                color: "var(--text-main)",
                border: "1.5px solid var(--border-main)",
                borderRadius: "20px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
              }}
              className="leadership-card"
              >
                <div style={{ position: "relative", width: "100%", height: "250px", borderRadius: "14px", overflow: "hidden", marginBottom: "1.25rem", border: "1.5px solid var(--border-main)" }}>
                  <Image src={item.imagePath} alt={item.name} fill style={{ objectFit: "cover", objectPosition: "center top" }} />
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--accent-gold)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>
                  {item.role}
                </div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--text-main)", margin: 0, lineHeight: 1.3 }}>{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE WORKFLOW SECTION ── */}
      <section style={{ padding: "5.5rem 1.5rem", backgroundColor: "var(--bg-main)", borderBottom: "1px solid var(--border-main)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--accent-teal)", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {isTe ? "కార్యాచరణ ప్రక్రియ" : "Interactive Complaint Workflow"}
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--text-main)" }}>
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
                    border: `1.5px solid ${active ? "var(--accent-teal)" : "var(--border-main)"}`,
                    backgroundColor: active ? "rgba(13,148,136,0.12)" : "var(--bg-surface)",
                    color: active ? "var(--accent-teal)" : "var(--text-muted)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ marginBottom: "0.5rem", color: active ? "var(--accent-teal)" : "var(--text-muted)" }}>{step.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem", color: active ? "var(--text-main)" : "var(--text-muted)" }}>{step.title}</div>
                </button>
              );
            })}
          </div>

          {/* Active Step Details Panel */}
          {(() => {
            const activeStepObj = workflowSteps.find((s) => s.n === activeWorkflowStep)!;
            return (
              <div style={{ background: "var(--bg-elevated)", border: "1.5px solid var(--accent-teal)", borderRadius: "20px", padding: "2.5rem", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
                <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "rgba(13,148,136,0.15)", border: "2px solid var(--accent-teal)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-teal)", flexShrink: 0 }}>
                  {activeStepObj.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.5rem" }}>{activeStepObj.title}</h3>
                  <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>{activeStepObj.desc}</p>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── 4. AI INTELLIGENCE SECTION ── */}
      <section style={{ padding: "5.5rem 1.5rem", backgroundColor: "var(--bg-surface)", borderBottom: "1px solid var(--border-main)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--accent-teal)", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {isTe ? "AI ఇంటెలిజెన్స్ వ్యవస్థ" : "Safety-First AI Analysis Engine"}
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--text-main)" }}>
              {isTe ? "పౌర పిర్యాదుల ప్రాధాన్యత విశ్లేషణ" : "AI Assessment & Priority Pipeline"}
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.75rem", fontSize: "1.05rem", maxWidth: "700px", margin: "0.75rem auto 0" }}>
              AI classifies categories, checks completeness, and evaluates safety risks before human review.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.75rem" }}>
            {[
              { title: "Safety Escalation Layer", icon: <ShieldAlert size={28} />, color: "#EF4444", text: "Emergency cases (violence, threat to life, child abuse) receive immediate top priority." },
              { title: "Credibility Assessment", icon: <BarChart3 size={28} />, color: "var(--accent-teal)", text: "Multi-dimensional metric evaluation of evidence completeness and location detail." },
              { title: "Department Routing", icon: <Building2 size={28} />, color: "var(--accent-gold)", text: "Automated suggestion of the responsible department across 25+ government sectors." },
              { title: "Human Review Pipeline", icon: <UserCheck size={28} />, color: "#10B981", text: "AI assessment is preliminary. All actions are reviewed and assigned by staff." }
            ].map((card, idx) => (
              <div key={idx} style={{
                background: "var(--bg-elevated)",
                border: "1.5px solid var(--border-main)",
                borderRadius: "20px",
                padding: "2rem",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
              }}>
                <div style={{ color: card.color, marginBottom: "1rem" }}>{card.icon}</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.5rem" }}>{card.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. CONSTITUENCY ANALYTICS OVERVIEW ── */}
      <section style={{ padding: "5.5rem 1.5rem", backgroundColor: "var(--bg-main)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--accent-gold)", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
              {isTe ? "మండలాల వివరాలు" : "Constituency Analytics & Mandals"}
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--text-main)" }}>
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
                    background: isSelected ? "rgba(13,148,136,0.12)" : "var(--bg-surface)",
                    border: `1.5px solid ${isSelected ? "var(--accent-teal)" : "var(--border-main)"}`,
                    borderRadius: "20px",
                    padding: "1.75rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>{mandalName}</h3>
                    <span style={{ padding: "0.25rem 0.65rem", borderRadius: "9999px", background: "rgba(13,148,136,0.15)", border: "1px solid var(--accent-teal)", color: "var(--accent-teal)", fontSize: "0.72rem", fontWeight: 800 }}>
                      {info.status}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                    {isTe ? info.nameTe : mandalName} · Population: <strong style={{ color: "var(--accent-gold)" }}>{info.pop}</strong>
                  </div>

                  <div style={{ fontSize: "0.8rem", color: "var(--text-main)", marginBottom: "1rem" }}>{info.wards}</div>

                  <div style={{ borderTop: "1px solid var(--border-main)", paddingTop: "0.75rem", fontSize: "0.75rem", color: "var(--accent-gold)", fontWeight: 700 }}>
                    Priority focus: {info.priority}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shared Global Footer */}
      <Footer />
    </main>
  );
}
