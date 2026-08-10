"use client";
import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

type Lang = "en" | "te";

const T = {
  en: {
    back: "← Home",
    badge: "Track Your Complaint",
    title: "Complaint Status Tracker",
    subtitle: "Enter your Complaint ID or Tracking Token to see the current status.",
    idLabel: "Complaint ID or Tracking Token",
    idPlaceholder: "SKT-2026-XXXXX  or  TKN-XXXXX-XXXXXX",
    hint: "Your Complaint ID starts with SKT- and was shown on the submission receipt.",
    searchBtn: "Check Status",
    searching: "Searching...",
    notFound: "No complaint found with this ID or token. Please check and try again.",
    statusLabel: "Current Status",
    mandalLabel: "Mandal",
    deptLabel: "Department",
    submittedLabel: "Submitted",
    updatedLabel: "Last Updated",
    historyLabel: "Status History",
    aiLabel: "AI Preliminary Assessment",
    analysisMode: { local_fallback: "Local analysis mode", llm: "AI analysis" },
    sampleBadge: "SAMPLE PRESENTATION RECORD",
    sampleNote: "This is a sample record used to demonstrate the platform. It does not represent a real citizen complaint.",
    disclaimer: "AI-generated preliminary assessment for human review only.",
    newComplaint: "Submit a New Complaint",
    privacyNote: "Only safe status information is shown here. Mobile numbers, reviewer identities and internal notes are never displayed.",
  },
  te: {
    back: "← హోమ్",
    badge: "మీ ఫిర్యాదును ట్రాక్ చేయండి",
    title: "ఫిర్యాదు స్థితి ట్రాకర్",
    subtitle: "ప్రస్తుత స్థితిని చూడటానికి మీ ఫిర్యాదు ID లేదా ట్రాకింగ్ టోకెన్ నమోదు చేయండి.",
    idLabel: "ఫిర్యాదు ID లేదా ట్రాకింగ్ టోకెన్",
    idPlaceholder: "SKT-2026-XXXXX  లేదా  TKN-XXXXX-XXXXXX",
    hint: "మీ ఫిర్యాదు ID SKT- తో మొదలవుతుంది.",
    searchBtn: "స్థితి తనిఖీ చేయండి",
    searching: "శోధిస్తున్నది...",
    notFound: "ఈ ID లేదా టోకెన్‌తో ఫిర్యాదు కనుగొనబడలేదు.",
    statusLabel: "ప్రస్తుత స్థితి",
    mandalLabel: "మండలం",
    deptLabel: "విభాగం",
    submittedLabel: "సమర్పించిన తేది",
    updatedLabel: "చివరిగా నవీకరించబడింది",
    historyLabel: "స్థితి చరిత్ర",
    aiLabel: "AI ప్రాథమిక అంచనా",
    analysisMode: { local_fallback: "స్థానిక విశ్లేషణ మోడ్", llm: "AI విశ్లేషణ" },
    sampleBadge: "నమూనా ప్రదర్శన రికార్డ్",
    sampleNote: "ఇది ప్లాట్‌ఫామ్‌ను ప్రదర్శించడానికి ఉపయోగించిన నమూనా రికార్డ్.",
    disclaimer: "AI-రూపొందించిన ప్రాథమిక అంచనా — మానవ సమీక్ష మాత్రమే.",
    newComplaint: "కొత్త ఫిర్యాదు సమర్పించండి",
    privacyNote: "సురక్షిత స్థితి సమాచారం మాత్రమే ఇక్కడ చూపబడింది. మొబైల్ నంబర్లు లేదా అంతర్గత వ్యాఖ్యలు ప్రదర్శించబడవు.",
  },
} as const;

interface TrackResult {
  id: string;
  status: string;
  mandal: string;
  village?: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  isSample: boolean;
  aiSummary: {
    title: string;
    category: string;
    urgency: string;
    credibilityBand: string;
    analysisMode: string;
    legalDisclaimer: string;
  } | null;
  statusHistory: { timestamp: string; action: string }[];
  message: string;
}

const STATUS_COLORS: Record<string, string> = {
  "New": "#D4A017",
  "AI Processed": "#60a5fa",
  "Viewed": "#3b82f6",
  "Contacted (No Response)": "#f97316",
  "Under Review": "#a78bfa",
  "More Information Requested": "#f97316",
  "Assigned": "#22c55e",
  "Escalated": "#ef4444",
  "Action Reported": "#10b981",
  "Solved": "#10b981",
  "Resolved": "#22c55e",
  "Reopened": "#f97316",
  "Closed": "#64748b",
};

import Navbar from "@/components/layout/Navbar";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";

export default function TrackPage() {
  const { language: lang, setLanguage: setLang } = useLanguage();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState("");

  function switchLang(l: Lang) {
    setLang(l);
  }

  const t = T[lang];

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      let res: Response;
      if (q.startsWith("TKN-")) {
        // Tracking token
        res = await fetch(`/api/track?token=${encodeURIComponent(q)}`);
      } else {
        // Complaint ID
        res = await fetch(`/api/complaints/${encodeURIComponent(q)}`);
      }

      const data = await res.json();
      if (res.ok) {
        setResult(data as TrackResult);
      } else {
        setError(data.error ?? t.notFound);
      }
    } catch {
      setError(lang === "en" ? "Network error. Please try again." : "నెట్‌వర్క్ లోపం.");
    } finally {
      setLoading(false);
    }
  }

  const statusColor = result ? (STATUS_COLORS[result.status] ?? "#94a3b8") : "#94a3b8";

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)", color: "var(--text-main)", transition: "background-color 0.25s ease, color 0.25s ease" }}>
      {/* Nav */}
      <Navbar />
      <Breadcrumb />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "640px", margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 1rem", borderRadius: "9999px", background: "rgba(13,148,136,0.12)", border: "1px solid var(--accent-teal)", marginBottom: "1.25rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--accent-teal)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{t.badge}</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.025em", marginBottom: "0.5rem" }}>{t.title}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{t.subtitle}</p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} style={{ background: "var(--bg-surface)", border: "1.5px solid var(--border-main)", borderRadius: "20px", padding: "2rem", marginBottom: "1.5rem", boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}>
          <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{t.idLabel}</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.idPlaceholder}
            style={{ width: "100%", background: "rgba(4,9,26,0.7)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "12px", padding: "0.875rem 1rem", color: "#f0f4f8", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", fontFamily: "monospace", letterSpacing: "0.03em", marginBottom: "0.5rem" }}
          />
          <div style={{ fontSize: "0.75rem", color: "#475569", marginBottom: "1.25rem", lineHeight: 1.5 }}>💡 {t.hint}</div>
          <button type="submit" disabled={loading || !query.trim()} style={{ background: "linear-gradient(135deg, #D4A017, #F3E5AB)", color: "#04091A", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "9999px", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading || !query.trim() ? 0.7 : 1 }}>
            {loading ? t.searching : t.searchBtn}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "1rem 1.25rem", color: "#f87171", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            ⚠ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Sample warning */}
            {result.isSample && (
              <div style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: "12px", padding: "1rem 1.25rem" }}>
                <div style={{ fontWeight: 700, color: "#fbbf24", marginBottom: "0.25rem", fontSize: "0.8rem" }}>⚠ {t.sampleBadge}</div>
                <div style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{t.sampleNote}</div>
              </div>
            )}

            {/* 5-Step Visual Progress Stepper */}
            <div style={{ background: "rgba(13,33,55,0.7)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "16px", padding: "1.25rem" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
                📍 Grievance Progress Pipeline
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", textAlign: "center" }}>
                {[
                  { step: "1", title: "Submitted", active: true },
                  { step: "2", title: "Viewed", active: ["Viewed", "Contacted (No Response)", "Under Review", "Assigned", "Escalated", "Action Reported", "Solved", "Resolved", "Closed"].includes(result.status) },
                  { step: "3", title: "Contacted", active: ["Contacted (No Response)", "Under Review", "Assigned", "Escalated", "Action Reported", "Solved", "Resolved", "Closed"].includes(result.status) },
                  { step: "4", title: "Assigned", active: ["Assigned", "Escalated", "Action Reported", "Solved", "Resolved", "Closed"].includes(result.status) },
                  { step: "5", title: "Solved", active: ["Solved", "Resolved", "Closed"].includes(result.status) },
                ].map((s) => (
                  <div key={s.step} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: s.active ? "#10b981" : "#1e293b",
                        color: s.active ? "#000000" : "#64748b",
                        border: s.active ? "2px solid #34d399" : "1px solid #334155",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: "0.75rem",
                        marginBottom: "4px",
                      }}
                    >
                      {s.active ? "✓" : s.step}
                    </div>
                    <span style={{ fontSize: "0.68rem", fontWeight: s.active ? 800 : 500, color: s.active ? "#34d399" : "#64748b" }}>
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status card */}
            <div style={{ background: "rgba(13,33,55,0.6)", border: `1px solid rgba(212,160,23,0.15)`, borderRadius: "20px", padding: "1.75rem", backdropFilter: "blur(24px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <div style={{ fontSize: "0.62rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, marginBottom: "4px" }}>Complaint ID</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#D4A017", fontFamily: "monospace" }}>{result.id}</div>
                </div>
                <div style={{ padding: "0.4rem 1rem", borderRadius: "9999px", background: `${statusColor}15`, border: `1px solid ${statusColor}40`, color: statusColor, fontWeight: 700, fontSize: "0.8rem" }}>
                  {result.status}
                </div>
              </div>

              {/* Status message */}
              <div style={{ background: "rgba(4,9,26,0.5)", borderRadius: "10px", padding: "0.875rem", marginBottom: "1.25rem", fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.6 }}>
                {result.message}
              </div>

              {/* Meta */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {[
                  [t.mandalLabel, result.mandal],
                  [t.deptLabel, result.department],
                  [t.submittedLabel, new Date(result.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })],
                  [t.updatedLabel, new Date(result.updatedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })],
                ].map(([k, v]) => (
                  <div key={k as string} style={{ background: "rgba(255,255,255,0.02)", borderRadius: "8px", padding: "0.75rem" }}>
                    <div style={{ fontSize: "0.6rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "2px" }}>{k}</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#ffffff" }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            {result.aiSummary && (
              <div style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(96,165,250,0.12)", borderRadius: "16px", padding: "1.5rem" }}>
                <div style={{ fontSize: "0.65rem", color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "0.75rem" }}>
                  🧠 {t.aiLabel}
                  {result.aiSummary.analysisMode === "local_fallback" && (
                    <span style={{ color: "#eab308", marginLeft: "0.5rem" }}>(Local analysis mode)</span>
                  )}
                </div>
                <h3 style={{ fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem", fontSize: "0.95rem", lineHeight: 1.4 }}>{result.aiSummary.title}</h3>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  {[result.aiSummary.category, result.aiSummary.urgency].map((v) => (
                    <span key={v} style={{ padding: "0.2rem 0.65rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "9999px", fontSize: "0.72rem", color: "#94a3b8" }}>{v}</span>
                  ))}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#334155", lineHeight: 1.6 }}>⚠ {t.disclaimer}</div>
              </div>
            )}

            {/* Status history */}
            {result.statusHistory.length > 0 && (
              <div style={{ background: "rgba(13,33,55,0.4)", border: "1px solid rgba(212,160,23,0.1)", borderRadius: "16px", padding: "1.5rem" }}>
                <div style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, marginBottom: "1rem" }}>{t.historyLabel}</div>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "8px", top: "12px", bottom: "12px", width: "1px", background: "rgba(212,160,23,0.15)" }} />
                  {result.statusHistory.map((h, i) => (
                    <div key={i} style={{ display: "flex", gap: "1rem", paddingLeft: "1.75rem", position: "relative", marginBottom: "0.875rem" }}>
                      <div style={{ position: "absolute", left: "4px", top: "4px", width: "9px", height: "9px", borderRadius: "50%", background: i === 0 ? "#D4A017" : "rgba(212,160,23,0.3)", border: "1px solid rgba(212,160,23,0.4)" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "0.78rem", color: "#94a3b8", lineHeight: 1.5 }}>{h.action}</div>
                        <div style={{ fontSize: "0.68rem", color: "#475569", marginTop: "2px" }}>{new Date(h.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy note */}
            <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.1)", borderRadius: "10px", padding: "0.875rem 1rem", fontSize: "0.75rem", color: "#334155", lineHeight: 1.6 }}>
              🔒 {t.privacyNote}
            </div>

            <Link href="/submit" style={{ display: "inline-block", border: "1.5px solid var(--accent-gold)", color: "var(--accent-gold)", fontWeight: 600, padding: "0.75rem 1.75rem", borderRadius: "9999px", textDecoration: "none", textAlign: "center", fontSize: "0.9rem" }}>
              {t.newComplaint}
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
