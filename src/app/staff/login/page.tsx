"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Lang = "en" | "te";

const T = {
  en: {
    title: "Staff Secure Login",
    subtitle: "Access is restricted to authorized constituency staff.",
    userLabel: "Username",
    userPlaceholder: "Enter username",
    passLabel: "Password",
    passPlaceholder: "Enter password",
    submit: "Sign In",
    submitting: "Signing in...",
    errorGeneric: "Invalid credentials. All login attempts are logged.",
    back: "← Back to Home",
    auditNote: "All login attempts are recorded in the system audit log.",
    accessNote: "If you believe you should have access, contact the constituency administration office.",
    systemNote: "Protected Area · Constituency Administration · Srikalahasti No. 168",
    quickTitle: "Demo Quick-Fill Logins",
  },
  te: {
    title: "సిబ్బంది సురక్షిత లాగిన్",
    subtitle: "అధికృత నియోజకవర్గ సిబ్బందికి మాత్రమే యాక్సెస్ అందుబాటులో ఉంది.",
    userLabel: "వినియోగదారు పేరు",
    userPlaceholder: "వినియోగదారు పేరు నమోదు చేయండి",
    passLabel: "పాస్‌వర్డ్",
    passPlaceholder: "పాస్‌వర్డ్ నమోదు చేయండి",
    submit: "లాగిన్ అవ్వండి",
    submitting: "లాగిన్ అవుతున్నది...",
    errorGeneric: "తప్పు ఆధారపత్రాలు. అన్ని లాగిన్ ప్రయత్నాలు నమోదు చేయబడ్డాయి.",
    back: "← హోమ్‌కు తిరిగి వెళ్ళండి",
    auditNote: "అన్ని లాగిన్ ప్రయత్నాలు సిస్టమ్ ఆడిట్ లాగ్‌లో నమోదు చేయబడ్డాయి.",
    accessNote: "మీకు యాక్సెస్ ఉండాలని భావిస్తే, నియోజకవర్గ నిర్వాహణ కార్యాలయాన్ని సంప్రదించండి.",
    systemNote: "రక్షిత ప్రాంతం · నియోజకవర్గ నిర్వాహణ · శ్రీకాళహస్తి No. 168",
    quickTitle: "డెమో తరివిత లాగిన్లు",
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

  function fillCreds(u: string, p: string) {
    setUsername(u);
    setPassword(p);
    setError("");
  }

  const inp: React.CSSProperties = {
    width: "100%",
    background: "rgba(4,9,26,0.8)",
    border: "1px solid rgba(212,160,23,0.2)",
    borderRadius: "12px",
    padding: "0.875rem 1rem",
    color: "#f0f4f8",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <main style={{ minHeight: "100vh", background: "#04091A", color: "#f0f4f8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>

      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", left: "20%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,23,0.04) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "20%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.03) 0%, transparent 70%)" }} />
      </div>

      <div style={{ maxWidth: "440px", width: "100%", position: "relative", zIndex: 1 }}>

        {/* Lang toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem", gap: "0.5rem" }}>
          {(["en", "te"] as Lang[]).map((l) => (
            <button key={l} onClick={() => { setLang(l); localStorage.setItem("psip_lang", l); }} style={{ padding: "0.3rem 0.65rem", borderRadius: "9999px", border: "1px solid", fontSize: "0.68rem", fontWeight: 700, cursor: "pointer", background: lang === l ? "#D4A017" : "transparent", borderColor: lang === l ? "#D4A017" : "rgba(212,160,23,0.3)", color: lang === l ? "#04091A" : "#D4A017" }}>
              {l === "en" ? "EN" : "తెలుగు"}
            </button>
          ))}
        </div>

        {/* Lock icon */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", fontSize: "1.75rem", boxShadow: "0 0 30px rgba(239,68,68,0.08)" }}>
            🔐
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>{t.title}</h1>
          <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.5 }}>{t.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ background: "rgba(13,33,55,0.6)", border: "1px solid rgba(212,160,23,0.15)", borderRadius: "20px", padding: "2rem", backdropFilter: "blur(24px)", marginBottom: "1rem" }}>
          {error && (
            <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", padding: "0.875rem", marginBottom: "1.25rem", color: "#f87171", fontSize: "0.82rem", lineHeight: 1.5 }}>
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
            style={{ width: "100%", background: loading ? "rgba(212,160,23,0.5)" : "linear-gradient(135deg, #D4A017, #F3E5AB)", color: "#04091A", fontWeight: 700, fontSize: "1rem", padding: "0.875rem", borderRadius: "9999px", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? t.submitting : t.submit}
          </button>
        </form>

        {/* Demo Quick-Fill Buttons */}
        <div style={{ background: "rgba(212,160,23,0.04)", border: "1px solid rgba(212,160,23,0.15)", borderRadius: "16px", padding: "1.25rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
            💡 {t.quickTitle}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {[
              { label: "MLA Staff", u: "mla_staff", p: "dev-mla-2026" },
              { label: "Reviewer", u: "reviewer", p: "dev-reviewer-2026" },
              { label: "Dept Officer", u: "dept_officer", p: "dev-dept-2026" },
              { label: "Administrator", u: "admin", p: "dev-admin-2026" },
            ].map((btn) => (
              <button
                key={btn.u}
                type="button"
                onClick={() => fillCreds(btn.u, btn.p)}
                style={{
                  padding: "0.5rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid rgba(212,160,23,0.25)",
                  background: "rgba(13,33,55,0.8)",
                  color: "#f0f4f8",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div style={{ color: "#D4A017", fontWeight: 700 }}>{btn.label}</div>
                <div style={{ fontSize: "0.65rem", color: "#64748b", marginTop: "2px" }}>{btn.u}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Security notices */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: "10px", padding: "0.75rem 1rem", fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>
            🛡 {t.auditNote}
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "0.75rem 1rem", fontSize: "0.75rem", color: "#475569", lineHeight: 1.5 }}>
            ℹ {t.accessNote}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/" style={{ color: "#D4A017", textDecoration: "none", fontWeight: 600, fontSize: "0.85rem" }}>{t.back}</Link>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.68rem", color: "#1e293b" }}>
          {t.systemNote}
        </div>
      </div>
    </main>
  );
}
