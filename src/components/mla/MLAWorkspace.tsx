import Link from "next/link";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import ThemeSwitcher from "@/components/layout/ThemeSwitcher";
import RoleNavHeader from "@/components/layout/RoleNavHeader";
import { MLASession } from "@/lib/mla";
import ActionDashboardSignOut from "./ActionDashboardSignOut";

const navItems = [
  { label: "Overview / అవలోకనం", href: "/mla/dashboard" },
  { label: "Live Cases / ప్రత్యక్ష కేసులు", href: "/mla/cases" },
  { label: "Priority & Safety / ప్రాధాన్యత", href: "/mla/priority" },
  { label: "Mandal Intelligence / మండల సమాచారం", href: "/mla/mandals" },
  { label: "Department Performance / శాఖ పనితీరు", href: "/mla/departments" },
  { label: "Action Taken / తీసుకున్న చర్యలు", href: "/mla/actions" },
  { label: "Reports / నివేదికలు", href: "/mla/reports" },
  { label: "Profile / ప్రొఫైల్", href: "/mla/profile" },
];

export function MLAWorkspace({
  user,
  current,
  buildId,
  commitSha,
  refreshedAt,
  children,
}: {
  user: MLASession;
  current: string;
  buildId: string;
  commitSha: string;
  refreshedAt: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-main)", color: "var(--text-main)" }}>
      <RoleNavHeader user={user} buildId={buildId} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 280px) 1fr", gap: 0 }}>
        <aside style={{ padding: 16, borderRight: "1px solid var(--border-main)", background: "var(--bg-elevated)", minHeight: "calc(100vh - 68px)" }}>
          <strong style={{ color: "var(--accent-gold)", display: "block" }}>Action Dashboard</strong>
          <span style={{ color: "var(--text-muted)", fontSize: 12 }}>చర్యల డ్యాష్‌బోర్డ్</span>
          <nav style={{ display: "grid", gap: 8, marginTop: 16 }}>
            {navItems.map((item) => {
              const active = current === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    textDecoration: "none",
                    fontWeight: 800,
                    color: active ? "#0f172a" : "var(--text-main)",
                    background: active ? "var(--accent-gold)" : "transparent",
                    border: "1px solid var(--border-main)",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            {user.role === "administrator" && (
              <Link href="/admin/settings" style={{ padding: "10px 12px", borderRadius: 10, textDecoration: "none", fontWeight: 800, color: "var(--text-muted)", border: "1px dashed var(--border-main)" }}>
                Administrative access / పరిపాలన ప్రవేశం
              </Link>
            )}
            <ActionDashboardSignOut label="Sign Out / నిష్క్రమించండి" />
          </nav>
        </aside>
        <main style={{ padding: 24, maxWidth: 1280, width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <div>
              <Link href="/mla/dashboard">Action Dashboard</Link> / <strong>{current}</strong>
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                User / వినియోగదారు: {user.username} · Role / పాత్ర: {user.role} · Route / మార్గం: {current}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          </div>
          <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 16 }}>
            Build ID: {buildId} · Commit SHA: {commitSha} · Last updated / చివరి నవీకరణ: {new Date(refreshedAt).toLocaleString("en-IN")} · <a href={current}>Retry / మళ్లీ ప్రయత్నించండి</a>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ border: "1px solid var(--border-main)", background: "var(--bg-elevated)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      {children}
    </section>
  );
}

export function Empty({ label = "No records matched this view. / ఈ వీక్షణకు సరిపడే రికార్డులు లేవు." }) {
  return <div style={{ padding: 18, border: "1px dashed var(--border-main)", borderRadius: 12, color: "var(--text-muted)" }}>{label}</div>;
}

export function ErrorBox({ message }: { message: string }) {
  return <div style={{ padding: 18, border: "1px solid #ef4444", borderRadius: 12, color: "#ef4444" }}>Error state / లోపం: {message}</div>;
}
