import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Security | Srikalahasti Praja Seva Intelligence Platform",
};

export default function SecurityPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🔒</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>Security Architecture</h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7 }}>How this platform is designed to protect citizens and their submissions.</p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

          {/* Security promises */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "3rem" }}>
            {[
              { icon: "✓", text: "Your complaint is visible only to authorized personnel assigned to review or act on it." },
              { icon: "✓", text: "Access is protected by authentication, role permissions and audit logging." },
              { icon: "✓", text: "Political branding does not control complaint priority, access or routing." },
              { icon: "✓", text: "Uploaded evidence is not publicly displayed or accessible without authorization." },
            ].map((p, i) => (
              <div key={i} style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "12px", padding: "1.25rem", display: "flex", gap: "0.75rem" }}>
                <span style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0 }}>{p.icon}</span>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>{p.text}</p>
              </div>
            ))}
          </div>

          {/* Implemented controls */}
          <div style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "2rem", marginBottom: "2rem" }}>
            <h2 style={{ fontWeight: 800, color: "#ffffff", marginBottom: "1.5rem" }}>Implemented Controls</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                ["HTTPS-only deployment", "Implemented"],
                ["Security HTTP headers", "Implemented (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)"],
                ["Middleware route protection", "Implemented"],
                ["Role-based access control", "Implemented (citizen, reviewer, mla_staff, department_officer, administrator)"],
                ["Session management", "Implemented (HTTP-only cookie, 8hr expiry)"],
                ["Audit logging (foundation)", "Implemented"],
                ["AI disclaimer on all outputs", "Implemented — mandatory"],
                ["Sample data labeling", "Implemented — SAMPLE PRESENTATION RECORD badge on all demo data"],
              ].map(([k, v]) => (
                <div key={k} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "0.75rem" }}>
                  <div style={{ fontSize: "0.65rem", color: "#22c55e", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", fontWeight: 700 }}>✓ {k}</div>
                  <div style={{ color: "#64748b", fontSize: "0.8rem" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Planned for production */}
          <div style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "2rem", marginBottom: "2rem" }}>
            <h2 style={{ fontWeight: 800, color: "#ffffff", marginBottom: "1.5rem" }}>Planned for Production Phase</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                "Bcrypt password hashing",
                "MFA-ready authentication",
                "Brute-force rate limiting",
                "CSRF protection",
                "SHA-256 evidence file hashing",
                "Private object storage (S3/Supabase)",
                "Signed temporary evidence URLs",
                "MIME-type file validation",
                "Malware scanning integration",
                "IP/device anomaly monitoring",
                "Full audit log database",
                "Data retention policy enforcement",
                "User consent management",
                "Data deletion workflow",
                "Privacy-safe error messages",
                "DPDPA 2023 compliance documentation",
              ].map(item => (
                <div key={item} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ color: "#eab308", fontSize: "0.9rem", flexShrink: 0 }}>○</span>
                  <span style={{ color: "#64748b", fontSize: "0.82rem" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "12px", padding: "1.5rem" }}>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.7 }}>
              <strong style={{ color: "#f87171" }}>Honest Representation:</strong> This platform is in a demonstration phase. Some security controls listed above are foundations only and require production infrastructure to be complete. We do not claim that the current system is production-hardened. This document accurately describes what is implemented versus what is planned.
            </p>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <Link href="/privacy" style={{ color: "#D4A017", textDecoration: "none", fontSize: "0.9rem" }}>Privacy Policy →</Link>
            <Link href="/contact" style={{ color: "#D4A017", textDecoration: "none", fontSize: "0.9rem" }}>Report a Security Issue →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
