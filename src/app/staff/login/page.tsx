"use client";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Lang = "en" | "te";

const T = {
  en: {
    title: "Staff Secure Role-Based Login",
    subtitle: "Select a role or enter authorized credentials to access your protected workspace.",
    userLabel: "Username",
    userPlaceholder: "Enter username",
    passLabel: "Password",
    passPlaceholder: "Enter password",
    submit: "Sign In to Workspace",
    submitting: "Authenticating & Redirecting...",
    errorGeneric: "Invalid credentials. All login attempts are logged.",
    back: "← Back to Home",
    auditNote: "All login attempts are recorded in the system audit log.",
    accessNote: "If you believe you should have access, contact the constituency administration office.",
    systemNote: "Protected Area · Constituency Administration · Srikalahasti No. 168",
    quickTitle: "1-Click Role Login Access",
  },
  te: {
    title: "సిబ్బంది సురక్షిత రకం ఆధారిత లాగిన్",
    subtitle: "మీ రక్షిత వర్క్‌స్పేస్‌ను యాక్సెస్ చేయడానికి రకాన్ని ఎంచుకోండి లేదా ఆధారాలను నమోదు చేయండి.",
    userLabel: "వినియోగదారు పేరు",
    userPlaceholder: "వినియోగదారు పేరు నమోదు చేయండి",
    passLabel: "పాస్‌వర్డ్",
    passPlaceholder: "పాస్‌వర్డ్ నమోదు చేయండి",
    submit: "లాగిన్ అవ్వండి",
    submitting: "ధృవీకరిస్తున్నది...",
    errorGeneric: "తప్పు ఆధారపత్రాలు. అన్ని లాగిన్ ప్రయత్నాలు నమోదు చేయబడ్డాయి.",
    back: "← హోమ్‌కు తిరిగి వెళ్ళండి",
    auditNote: "అన్ని లాగిన్ ప్రయత్నాలు సిస్టమ్ ఆడిట్ లాగ్‌లో నమోదు చేయబడ్డాయి.",
    accessNote: "మీకు యాక్సెస్ ఉండాలని భావిస్తే, నియోజకవర్గ నిర్వాహణ కార్యాలయాన్ని సంప్రదించండి.",
    systemNote: "రక్షిత ప్రాంతం · నియోజకవర్గ నిర్వాహణ · శ్రీకాళహస్తి No. 168",
    quickTitle: "1-క్లిక్ రోల్ లాగిన్ యాక్సెస్",
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

  async function performLogin(u: string, p: string) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u.trim(), password: p.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Redirect strictly based on authenticated server session role
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await performLogin(username, password);
  }

  async function handleQuickRoleLogin(u: string, p: string) {
    setUsername(u);
    setPassword(p);
    await performLogin(u, p);
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
    <main style={{ minHeight: "100vh", background: "#04091A", color: "#f0f4f8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>

      {/* Ambient Lighting */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "20%", left: "20%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,160,23,0.04) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "20%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(239,68,68,0.03) 0%, transparent 70%)" }} />
      </div>

      <div style={{ maxWidth: "560px", width: "100%", position: "relative", zIndex: 1 }}>

        {/* Lang toggle */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem", gap: "0.5rem" }}>
          {(["en", "te"] as Lang[]).map((l) => (
            <button key={l} onClick={() => { setLang(l); localStorage.setItem("psip_lang", l); }} style={{ padding: "0.3rem 0.65rem", borderRadius: "9999px", border: "1px solid", fontSize: "0.68rem", fontWeight: 700, cursor: "pointer", background: lang === l ? "#D4A017" : "transparent", borderColor: lang === l ? "#D4A017" : "rgba(212,160,23,0.3)", color: lang === l ? "#04091A" : "#D4A017" }}>
              {l === "en" ? "EN" : "తెలుగు"}
            </button>
          ))}
        </div>

        {/* Header Icon */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(212,160,23,0.1)", border: "1px solid rgba(212,160,23,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.75rem", boxShadow: "0 0 30px rgba(212,160,23,0.1)" }}>
            🔐
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "0.4rem" }}>{t.title}</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.5, margin: 0 }}>{t.subtitle}</p>
        </div>

        {/* 1-Click Role Login Selector Cards */}
        <div style={{ background: "rgba(13,33,55,0.7)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "16px", padding: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.875rem", textAlign: "center" }}>
            ⚡ {t.quickTitle}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={() => handleQuickRoleLogin("mla_staff", "dev-mla-2026")}
              style={{
                background: "rgba(4,9,26,0.8)",
                border: "1px solid rgba(251,191,36,0.3)",
                borderRadius: "10px",
                padding: "0.875rem",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#fbbf24" }}>📊 MLA Staff</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "2px" }}>Dashboard & Case Tracking</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleLogin("reviewer", "dev-reviewer-2026")}
              style={{
                background: "rgba(4,9,26,0.8)",
                border: "1px solid rgba(56,189,248,0.3)",
                borderRadius: "10px",
                padding: "0.875rem",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#38bdf8" }}>🛡 Case Reviewer</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "2px" }}>Triage & Dept Assignment</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleLogin("dept_officer", "dev-dept-2026")}
              style={{
                background: "rgba(4,9,26,0.8)",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: "10px",
                padding: "0.875rem",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#34d399" }}>🏢 Department Officer</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "2px" }}>Field Action & Resolution</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRoleLogin("admin", "dev-admin-2026")}
              style={{
                background: "rgba(4,9,26,0.8)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "10px",
                padding: "0.875rem",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#f87171" }}>⚙️ Administrator</div>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "2px" }}>Master Governance & Health</div>
            </button>
          </div>
        </div>

        {/* Manual Credentials Form */}
        <form onSubmit={handleSubmit} style={{ background: "rgba(13,33,55,0.6)", border: "1px solid rgba(212,160,23,0.15)", borderRadius: "20px", padding: "1.75rem", backdropFilter: "blur(24px)", marginBottom: "1rem" }}>
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
            style={{ width: "100%", background: loading ? "rgba(212,160,23,0.5)" : "linear-gradient(135deg, #D4A017, #F3E5AB)", color: "#04091A", fontWeight: 800, fontSize: "0.95rem", padding: "0.875rem", borderRadius: "9999px", border: "none", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? t.submitting : t.submit}
          </button>
        </form>

        {/* Security notice */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: "10px", padding: "0.75rem 1rem", fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>
            🛡 {t.auditNote}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/" style={{ color: "#D4A017", textDecoration: "none", fontWeight: 600, fontSize: "0.85rem" }}>{t.back}</Link>
        </div>

        <div style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.68rem", color: "#475569" }}>
          {t.systemNote}
        </div>
      </div>
    </main>
  );
}
