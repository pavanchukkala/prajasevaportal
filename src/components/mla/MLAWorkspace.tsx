import Link from "next/link";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";
import RoleNavHeader from "@/components/layout/RoleNavHeader";
import { MLASession } from "@/lib/mla";

export function MLAWorkspace({ user, current, buildId, commitSha, refreshedAt, children }: { user: MLASession; current: string; buildId: string; commitSha: string; refreshedAt: string; children: React.ReactNode }) {
  const nav = [
    ["Overview", "/mla/dashboard"], ["Live Cases", "/mla/cases"], ["Priority & Safety", "/mla/priority"], ["Mandal Intelligence", "/mla/mandals"], ["Department Performance", "/mla/departments"], ["Action Taken", "/mla/actions"], ["Reports", "/mla/reports"], ["Profile", "/mla/profile"],
  ];
  return <div style={{ minHeight: "100vh", background: "var(--bg-main)", color: "var(--text-main)" }}>
    <RoleNavHeader user={user} buildId={buildId} />
    <div style={{ display: "grid", gridTemplateColumns: "minmax(210px,260px) 1fr", gap: 0 }}>
      <aside style={{ padding: 16, borderRight: "1px solid var(--border-main)", background: "var(--bg-elevated)", minHeight: "calc(100vh - 68px)" }}>
        <strong style={{ color: "var(--accent-gold)" }}>Action Dashboard</strong>
        <nav style={{ display: "grid", gap: 8, marginTop: 16 }}>
          {nav.map(([label, href]) => <Link key={href} href={href} style={{ padding: "10px 12px", borderRadius: 10, textDecoration: "none", fontWeight: 800, color: current === href ? "#0f172a" : "var(--text-main)", background: current === href ? "var(--accent-gold)" : "transparent", border: "1px solid var(--border-main)" }}>{label}</Link>)}
          {user.role === "administrator" && <Link href="/admin/settings" style={{ padding: "10px 12px", borderRadius: 10, textDecoration: "none", fontWeight: 800, color: "var(--text-muted)", border: "1px dashed var(--border-main)" }}>Administrative access</Link>}
          <a href="/api/auth/logout" style={{ padding: "10px 12px", borderRadius: 10, textDecoration: "none", fontWeight: 800, color: "#fff", background: "#dc2626" }}>Sign Out</a>
        </nav>
      </aside>
      <main style={{ padding: 24, maxWidth: 1280, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
          <div><Link href="/mla/dashboard">Action Dashboard</Link> / <strong>{current}</strong><div style={{ color: "var(--text-muted)", fontSize: 13 }}>User: {user.username} · Role: {user.role} · Route: {current}</div></div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><LanguageSwitcher /><ThemeSwitcher /></div>
        </div>
        <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 16 }}>Build ID: {buildId} · Commit SHA: {commitSha} · Last updated: {new Date(refreshedAt).toLocaleString("en-IN")} · <a href={current}>Retry</a></div>
        {children}
      </main>
    </div>
  </div>;
}

export function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section style={{ border: "1px solid var(--border-main)", background: "var(--bg-elevated)", borderRadius: 14, padding: 16, marginBottom: 16 }}><h2 style={{ marginTop: 0 }}>{title}</h2>{children}</section>; }
export function Empty({ label = "No records matched this view." }) { return <div style={{ padding: 18, border: "1px dashed var(--border-main)", borderRadius: 12, color: "var(--text-muted)" }}>{label} Use Retry or adjust filters.</div>; }
export function ErrorBox({ message }: { message: string }) { return <div style={{ padding: 18, border: "1px solid #ef4444", borderRadius: 12, color: "#ef4444" }}>Error state: {message} <a href="">Retry</a></div>; }
