"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";

type Lang = "en" | "te";

const t = {
  en: {
    back: "← Back",
    title: "Staff Secure Login",
    subtitle: "Authorized personnel only. Access is logged.",
    userLabel: "Username",
    passLabel: "Password",
    btn: "Sign In",
    logging: "Authenticating...",
    error: "Invalid credentials. Please try again.",
    notice: "This portal is restricted to authorized constituency staff. Unauthorized access attempts are logged.",
    demoHint: "Demo: username mla_admin / password PrajaSevaDemo2026",
  },
  te: {
    back: "← వెనుకకు",
    title: "సిబ్బంది సురక్షిత లాగిన్",
    subtitle: "అధికారిక సిబ్బందికి మాత్రమే. యాక్సెస్ లాగ్ చేయబడుతుంది.",
    userLabel: "వినియోగదారు పేరు",
    passLabel: "పాస్‌వర్డ్",
    btn: "సైన్ ఇన్",
    logging: "ప్రమాణీకరిస్తున్నది...",
    error: "చెల్లని ఆధారాలు. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    notice: "ఈ పోర్టల్ అధికారిక నియోజకవర్గ సిబ్బందికి మాత్రమే పరిమితం.",
    demoHint: "Demo: username mla_admin / password PrajaSevaDemo2026",
  },
};

export default function StaffLoginPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tx = t[lang];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = "/mla/dashboard";
      } else {
        setError(tx.error);
      }
    } catch {
      setError(tx.error);
    } finally {
      setLoading(false);
    }
  }

  const card: React.CSSProperties = {
    background: "rgba(13,33,55,0.8)",
    border: "1px solid rgba(212,160,23,0.2)",
    borderRadius: "20px",
    padding: "2.5rem",
    maxWidth: "440px",
    width: "100%",
    boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
    backdropFilter: "blur(20px)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(6,15,26,0.8)",
    border: "1px solid rgba(212,160,23,0.2)",
    borderRadius: "10px",
    padding: "0.875rem 1rem",
    color: "#f0f4f8",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "1.5rem", position: "relative" }}>

      {/* Background glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,23,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem" }}>
        <Link href="/" style={{ color: "#D4A017", textDecoration: "none", fontSize: "0.85rem" }}>{tx.back}</Link>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["en", "te"] as Lang[]).map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ padding: "0.3rem 0.75rem", borderRadius: "9999px", border: "1px solid", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", background: lang === l ? "#D4A017" : "transparent", borderColor: lang === l ? "#D4A017" : "rgba(212,160,23,0.3)", color: lang === l ? "#060f1a" : "#D4A017" }}>
              {l === "en" ? "EN" : "తెలుగు"}
            </button>
          ))}
        </div>
      </div>

      <div style={card}>
        {/* Lock icon */}
        <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1.5rem" }}>
          🔒
        </div>

        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>{tx.title}</h1>
        <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "2rem" }}>{tx.subtitle}</p>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1.5rem", color: "#f87171", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{tx.userLabel}</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={inputStyle} autoComplete="username" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{tx.passLabel}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} autoComplete="current-password" />
          </div>
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "1rem", background: loading ? "rgba(212,160,23,0.5)" : "linear-gradient(135deg, #D4A017, #F3E5AB)", color: "#060f1a", fontWeight: 700, fontSize: "1rem", borderRadius: "10px", border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: "0.5rem" }}>
            {loading ? tx.logging : tx.btn}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(30,136,229,0.05)", border: "1px solid rgba(30,136,229,0.15)", borderRadius: "8px", fontSize: "0.75rem", color: "#64748b", lineHeight: 1.6 }}>
          ℹ️ {tx.notice}
        </div>

        <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(212,160,23,0.05)", border: "1px solid rgba(212,160,23,0.15)", borderRadius: "8px", fontSize: "0.72rem", color: "#92580a", lineHeight: 1.6 }}>
          🔑 {tx.demoHint}
        </div>
      </div>
    </main>
  );
}
