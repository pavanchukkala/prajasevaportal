"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";

type Lang = "en" | "te";

const t = {
  en: {
    back: "← Home",
    title: "Track Your Complaint",
    subtitle: "Enter your Complaint ID to check the current status.",
    idLabel: "Complaint ID",
    idPlaceholder: "e.g. SKT-2026-12345",
    btn: "Check Status",
    checking: "Checking...",
    notFound: "No complaint found with this ID. If you submitted recently, please wait a few moments and try again.",
    note: "Your Complaint ID was shown on the screen after submission. It begins with SKT-.",
  },
  te: {
    back: "← హోమ్",
    title: "మీ ఫిర్యాదును ట్రాక్ చేయండి",
    subtitle: "ప్రస్తుత స్థితిని తనిఖీ చేయడానికి మీ ఫిర్యాదు ID నమోదు చేయండి.",
    idLabel: "ఫిర్యాదు ID",
    idPlaceholder: "ఉదా. SKT-2026-12345",
    btn: "స్థితి తనిఖీ చేయండి",
    checking: "తనిఖీ చేయబడుతోంది...",
    notFound: "ఈ ID తో ఫిర్యాదు కనుగొనబడలేదు. దయచేసి తనిఖీ చేసి మళ్ళీ ప్రయత్నించండి.",
    note: "మీ ఫిర్యాదు ID సమర్పించిన తర్వాత స్క్రీన్పై చూపబడింది. ఇది SKT- తో మొదలవుతుంది.",
  },
};

const STATUS_LABELS: Record<string, string> = {
  "New": "Received — Awaiting AI Processing",
  "AI Processed": "AI Preliminary Assessment Complete",
  "Under Review": "Under Human Review",
  "Forwarded": "Forwarded to Department",
  "Resolved": "Resolved",
  "Closed": "Closed",
};

export default function TrackPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id: string; status: string; createdAt: string; mandal: string; message: string } | null>(null);
  const [notFound, setNotFound] = useState(false);
  const tx = t[lang];

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setNotFound(false);
    try {
      const res = await fetch(`/api/complaints/${id.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8", display: "flex", flexDirection: "column" }}>
      <nav style={{ background: "rgba(6,15,26,0.95)", borderBottom: "1px solid rgba(212,160,23,0.15)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ color: "#D4A017", textDecoration: "none", fontSize: "0.85rem" }}>{tx.back}</Link>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["en", "te"] as Lang[]).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: "0.3rem 0.75rem", borderRadius: "9999px", border: "1px solid", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", background: lang === l ? "#D4A017" : "transparent", borderColor: lang === l ? "#D4A017" : "rgba(212,160,23,0.3)", color: lang === l ? "#060f1a" : "#D4A017" }}>{l === "en" ? "EN" : "తెలుగు"}</button>
          ))}
        </div>
      </nav>

      <section style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: "520px", width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔍</div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>{tx.title}</h1>
            <p style={{ color: "#64748b" }}>{tx.subtitle}</p>
          </div>

          <form onSubmit={handleSearch} style={{ background: "rgba(13,33,55,0.6)", border: "1px solid rgba(212,160,23,0.15)", borderRadius: "20px", padding: "2rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{tx.idLabel}</label>
            <input
              type="text"
              value={id}
              onChange={e => setId(e.target.value)}
              placeholder={tx.idPlaceholder}
              required
              style={{ width: "100%", background: "rgba(6,15,26,0.8)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "10px", padding: "0.875rem 1rem", color: "#f0f4f8", fontSize: "1.1rem", fontFamily: "monospace", letterSpacing: "0.05em", outline: "none", boxSizing: "border-box", marginBottom: "1rem" }}
            />
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "1rem", background: "linear-gradient(135deg, #D4A017, #F3E5AB)", color: "#060f1a", fontWeight: 700, fontSize: "1rem", borderRadius: "10px", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? tx.checking : tx.btn}
            </button>
          </form>

          {notFound && (
            <div style={{ marginTop: "1.5rem", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "1.25rem", color: "#f87171", fontSize: "0.9rem", lineHeight: 1.6 }}>
              {tx.notFound}
            </div>
          )}

          {result && (
            <div style={{ marginTop: "1.5rem", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "16px", padding: "1.5rem" }}>
              <div style={{ fontWeight: 700, color: "#22c55e", marginBottom: "1rem", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Complaint Found</div>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {[
                  ["ID", result.id],
                  ["Status", STATUS_LABELS[result.status] ?? result.status],
                  ["Location", result.mandal],
                  ["Submitted", result.createdAt?.split("T")[0]],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>{k}</span>
                    <span style={{ color: "#ffffff", fontWeight: 700, fontSize: "0.85rem" }}>{v}</span>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: "1rem", color: "#94a3b8", fontSize: "0.8rem", lineHeight: 1.6 }}>{result.message}</p>
            </div>
          )}

          <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.8rem", color: "#475569", lineHeight: 1.6 }}>ℹ️ {tx.note}</p>
        </div>
      </section>
    </main>
  );
}
