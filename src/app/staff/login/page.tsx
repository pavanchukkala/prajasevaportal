"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Lang = "en" | "te";

const T = {
  en: {
    title: "Authorized Constituency Staff Portal",
    subtitle: "Secure access for Assembly Constituency No. 168 authorized personnel only.",
    userLabel: "Username",
    userPlaceholder: "Enter authorized username",
    passLabel: "Password",
    passPlaceholder: "Enter security password",
    submit: "Sign In to Protected Workspace",
    submitting: "Authenticating Session...",
    errorGeneric: "Invalid credentials. All login attempts are recorded in the audit log.",
    back: "← Back to Public Portal",
    auditNote: "Restricted environment. Unapproved login attempts are logged with IP & timestamp.",
    accessNote: "Access is strictly restricted to authorized constituency officers and staff.",
    systemNote: "Protected System · Assembly Constituency No. 168 · Srikalahasti",
  },
  te: {
    title: "అధికారిక నియోజకవర్గ సిబ్బంది పోర్టల్",
    subtitle: "అసెంబ్లీ నియోజకవర్గం నెం. 168 అధికారిక సిబ్బందికి మాత్రమే సురక్షిత ప్రవేశం.",
    userLabel: "వినియోగదారు పేరు",
    userPlaceholder: "వినియోగదారు పేరు నమోదు చేయండి",
    passLabel: "పాస్‌వర్డ్",
    passPlaceholder: "పాస్‌వర్డ్ నమోదు చేయండి",
    submit: "లాగిన్ అవ్వండి",
    submitting: "ధృవీకరిస్తున్నది...",
    errorGeneric: "తప్పు ఆధారపత్రాలు. అన్ని లాగిన్ ప్రయత్నాలు నమోదు చేయబడ్డాయి.",
    back: "← ప్రజా సేవ పోర్టల్‌కు తిరిగి వెళ్ళండి",
    auditNote: "రక్షిత ప్రాంతం. అనుమతి లేని లాగిన్ ప్రయత్నాలు లాగ్ చేయబడతాయి.",
    accessNote: "ప్రవేశం అధికారిక సిబ్బందికి మాత్రమే పరిమితం చేయబడింది.",
    systemNote: "రక్షిత ప్రాంతం · నియోజకవర్గ నిర్వాహణ · శ్రీకాళహస్తి No. 168",
  },
} as const;

export default function StaffLoginPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("psip_lang") as Lang | null;
    if (saved === "en" || saved === "te") setLang(saved);
  }, []);

  const t = T[lang];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push(data.redirect || "/mla/dashboard");
      } else {
        setError(data.error ?? t.errorGeneric);
        setPassword("");
      }
    } catch {
      setError(lang === "en" ? "Network error. Please try again." : "నెట్‌వర్క్ లోపం.");
    } finally {
      setLoading(false);
    }
  }

  const inp: React.CSSProperties = {
    width: "100%",
    background: "rgba(4,9,26,0.8)",
    border: "1px solid rgba(212,160,23,0.25)",
    borderRadius: "12px",
    padding: "0.875rem 1rem",
    color: "#f0f4f8",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#04091A", color: "#f0f4f8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      {/* Ambient Lighting */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", left: "20%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,23,0.04) 0%, transparent 70%)" }} />
      </div>

      <div style={{ maxWidth: "460px", width: "100%", position: "relative", zIndex: 1 }}>
        {/* Lang toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem", gap: "0.5rem" }}>
          {(["en", "te"] as Lang[]).map((l) => (
            <button key={l} onClick={() => { setLang(l); localStorage.setItem("psip_lang", l); }} style={{ padding: "0.3rem 0.65rem", borderRadius: "9999px", border: "1px solid", fontSize: "0.68rem", fontWeight: 700, cursor: "pointer", background: lang === l ? "#D4A017" : "transparent", borderColor: lang === l ? "#D4A017" : "rgba(212,160,23,0.3)", color: lang === l ? "#04091A" : "#D4A017" }}>
              {l === "en" ? "EN" : "తెలుగు"}
            </button>
          ))}
        </div>

        {/* Header Icon */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.75rem", boxShadow: "0 0 30px rgba(212,160,23,0.1)" }}>
            🔒
          </div>
          <h1 style={{ fontSize: "1.65rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "0.4rem" }}>{t.title}</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>{t.subtitle}</p>
        </div>

        {/* Manual Secure Credentials Form */}
        <form onSubmit={handleSubmit} style={{ background: "rgba(13,33,55,0.7)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "20px", padding: "2rem", backdropFilter: "blur(24px)", marginBottom: "1.5rem" }}>
          {error && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "0.875rem", marginBottom: "1.25rem", color: "#f87171", fontSize: "0.82rem", lineHeight: 1.5 }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{t.userLabel}</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.userPlaceholder}
              required
              autoComplete="username"
              style={inp}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.07em" }}>{t.passLabel}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passPlaceholder}
              required
              autoComplete="current-password"
              style={inp}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: loading ? "rgba(212,160,23,0.5)" : "linear-gradient(135deg, #D4A017, #F3E5AB)", color: "#04091A", fontWeight: 800, fontSize: "0.95rem", padding: "0.875rem", borderRadius: "9999px", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? t.submitting : t.submit}
          </button>
        </form>

        {/* Security notice */}
        <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)", borderRadius: "12px", padding: "0.875rem 1rem", fontSize: "0.75rem", color: "#94a3b8", lineHeight: 1.5, marginBottom: "1.5rem", textAlign: "center" }}>
          🛡 {t.auditNote}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/" style={{ color: "#D4A017", textDecoration: "none", fontWeight: 600, fontSize: "0.85rem" }}>{t.back}</Link>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.68rem", color: "#475569" }}>
          {t.systemNote}
        </div>
      </div>
    </main>
  );
}
