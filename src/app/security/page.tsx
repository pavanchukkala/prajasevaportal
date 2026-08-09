"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";

export default function SecurityPage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", background: "#022C22", color: "#F0FDF4", fontFamily: "system-ui, sans-serif" }}>
      <Navbar />
      <Breadcrumb />

      <section style={{ background: "linear-gradient(135deg, #022C22 0%, #064E3B 100%)", padding: "4.5rem 1.5rem", borderBottom: "1px solid rgba(16,185,129,0.3)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "3.2rem", marginBottom: "1rem" }}>🛡️</div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 900, color: "#F0FDF4", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            {t("securityPage.title")}
          </h1>
          <p style={{ color: "#A7F3D0", fontSize: "1.05rem", lineHeight: 1.7 }}>
            {t("securityPage.subtitle")}
          </p>
        </div>
      </section>

      <section style={{ padding: "4.5rem 1.5rem", backgroundColor: "#064E3B" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2.5rem" }}>

          {/* 1. Implemented in Current Deployment */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <span style={{ color: "#34D399", fontSize: "1.3rem" }}>✓</span>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 900, color: "#34D399" }}>
                {isTe ? "ప్రస్తుత డిప్లాయ్‌మెంట్‌లో అమలవుతున్న భద్రత" : "Implemented in Current Deployment"}
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {[
                {
                  title: isTe ? "రోల్-బేస్డ్ యాక్సెస్ నియంత్రణ" : "Role-Based Access Control (RBAC)",
                  desc: isTe ? "అధికారిక లాగిన్ సెషన్ల ద్వారా మాత్రమే కేసుల డేటా అందుబాటులో ఉంటుంది." : "Protected routes (`/mla/*`, `/reviewer/*`) enforce authentication cookie validation."
                },
                {
                  title: isTe ? "మాస్క్ చేసిన మొబైల్ సంఖ్యలు" : "Masked Mobile Numbers",
                  desc: isTe ? "సిబ్బంది స్క్రీన్‌లలో మొబైల్ సంఖ్యలు +91 ******4321 రూపంలో మాత్రమే కనిపిస్తాయి." : "Citizen contact numbers are masked (`+91 ******4321`) on all staff views and API responses."
                },
                {
                  title: isTe ? "అనామక సమర్పణ ఎంపిక" : "Anonymous Submission Option",
                  desc: isTe ? "పౌరులు ఎలాంటి సంప్రదింపు వివరాలు ఇవ్వకుండా ఫిర్యాదును నమోదు చేయవచ్చు." : "Citizens may choose to submit issues without disclosing mobile number or email."
                },
                {
                  title: isTe ? "రక్షిత స్థితి ట్రాకింగ్" : "Restricted Public Status Projection",
                  desc: isTe ? "పబ్లిక్ ట్రాకింగ్ పేజీలో అంతర్గత వ్యాఖ్యలు లేదా మొబైల్ నంబర్లు చూపబడవు." : "Public tracking (`/track`) strips internal notes, raw contact info, and reviewer identity."
                }
              ].map(card => (
                <div key={card.title} style={{ background: "rgba(2,44,34,0.85)", border: "1.5px solid #10B981", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#34D399", marginBottom: "0.5rem" }}>{card.title}</h3>
                  <p style={{ color: "#E2E8F0", lineHeight: 1.6, fontSize: "0.9rem" }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Foundation Only */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <span style={{ color: "#FBBF24", fontSize: "1.3rem" }}>⚡</span>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 900, color: "#FBBF24" }}>
                {isTe ? "ప్రాథమిక మూలాధారాలు (ప్రోటోటైప్ మోడ్)" : "Foundation Only (Prototype Mode)"}
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {[
                {
                  title: isTe ? "ఇన్-మెమరీ డేటా స్టోర్" : "In-Memory Prototype Store",
                  desc: isTe ? "ప్రస్తుత ఉచిత డిప్లాయ్‌మెంట్‌లో డేటా తాత్కాలిక మెమరీలో సేవ్ చేయబడుతుంది." : "Server state is currently maintained in memory. Persistent Supabase/PostgreSQL is architected but not connected."
                },
                {
                  title: isTe ? "స్థానిక విశ్లేషణ AI మోడ్" : "Local Fallback AI Categorization",
                  desc: isTe ? "సమర్పణలను వర్గీకరించడానికి స్థానిక కీవర్డ్ రూల్స్ విశ్లేషణ ఉపయోగించబడుతుంది." : "Rule-based structural analyzer runs locally to categorize complaints and assign urgency metrics."
                }
              ].map(card => (
                <div key={card.title} style={{ background: "rgba(2,44,34,0.85)", border: "1.5px solid #F59E0B", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FBBF24", marginBottom: "0.5rem" }}>{card.title}</h3>
                  <p style={{ color: "#E2E8F0", lineHeight: 1.6, fontSize: "0.9rem" }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Required Before Public Launch */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.25rem" }}>
              <span style={{ color: "#F87171", fontSize: "1.3rem" }}>🔒</span>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 900, color: "#F87171" }}>
                {isTe ? "అధికారిక ప్రారంభానికి ముందు అవసరమైనవి" : "Required Before Public Launch"}
              </h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {[
                {
                  title: isTe ? "క్లౌడ్ ఫైల్ ఎన్‌క్రిప్షన్" : "End-to-End Evidence Encryption",
                  desc: isTe ? "అప్‌లోడ్ చేసిన ఫైళ్లను క్లౌడ్ స్టోరేజ్‌లో ఎన్‌క్రిప్ట్ చేయడం." : "Production S3 / Cloud Storage integration with KMS encryption at rest for uploaded media."
                },
                {
                  title: isTe ? "ప్రొడక్షన్ డేటాబేస్ RLS" : "Production Database RLS",
                  desc: isTe ? "డేటాబేస్ పర్మిషన్లతో కఠినమైన యాక్సెస్." : "PostgreSQL with Row-Level Security policies and encrypted audit logs."
                },
                {
                  title: isTe ? "అధికారిక SMS గేట్‌వే" : "Production SMS / WhatsApp Gateway",
                  desc: isTe ? "ఫోన్ నంబర్లకు SMS నోటిఫికేషన్లను పంపడం." : "Live connection to Twilio / MSG91 for OTP verification and automated status updates."
                },
                {
                  title: isTe ? "థర్డ్-పార్టీ సెక్యూరిటీ ఆడిట్" : "Third-Party Security Audit",
                  desc: isTe ? "అధికారిక భద్రతా ఆడిట్ మరియు సర్టిఫికేషన్." : "Formal penetration testing and compliance audit prior to official government deployment."
                }
              ].map(card => (
                <div key={card.title} style={{ background: "rgba(2,44,34,0.85)", border: "1.5px solid #EF4444", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F87171", marginBottom: "0.5rem" }}>{card.title}</h3>
                  <p style={{ color: "#E2E8F0", lineHeight: 1.6, fontSize: "0.9rem" }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
      <Footer />
    </main>
  );
}
