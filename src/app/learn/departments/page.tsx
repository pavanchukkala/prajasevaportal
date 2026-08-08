import Link from "next/link";
import { departmentsConfig } from "@/config/departments";

export const metadata = {
  title: "Department Directory | Srikalahasti Praja Seva",
};

export default function DepartmentsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <nav style={{ background: "rgba(6,15,26,0.95)", borderBottom: "1px solid rgba(212,160,23,0.15)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, padding: "1rem 1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link href="/learn" style={{ color: "#D4A017", textDecoration: "none", fontSize: "0.85rem" }}>← Learn</Link>
        <span style={{ color: "#475569", fontSize: "0.85rem" }}>/ Department Directory</span>
      </nav>

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>Which Department Handles What?</h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem" }}>Before submitting a complaint, identify the right department. A correctly routed complaint reaches the right authority faster.</p>
        </div>
      </section>

      <section style={{ padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {departmentsConfig.map(dept => (
            <div key={dept.id} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.1)", borderRadius: "16px", padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <h3 style={{ fontWeight: 800, color: "#ffffff", fontSize: "1.15rem" }}>{dept.name}</h3>
                  <div style={{ color: "#D4A017", fontSize: "0.9rem" }}>{dept.nameTe}</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontSize: "0.65rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontWeight: 700 }}>Common Issues</div>
                  <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                    {dept.issues.slice(0, 4).map(issue => (
                      <li key={issue} style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: "0.25rem" }}>{issue}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontWeight: 700 }}>First Contact</div>
                  <p style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: 1.6 }}>{dept.firstContact}</p>
                </div>
                <div>
                  <div style={{ fontSize: "0.65rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontWeight: 700 }}>Escalation Route</div>
                  <p style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: 1.6 }}>{dept.escalationRoute}</p>
                </div>
              </div>
              <div style={{ background: "rgba(6,15,26,0.5)", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.75rem", color: "#64748b" }}>
                <strong style={{ color: "#94a3b8" }}>Documents usually needed: </strong>
                {dept.commonDocuments.join(", ")}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/submit" style={{ background: "#D4A017", color: "#060f1a", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>Submit a Complaint →</Link>
        </div>
      </section>
    </main>
  );
}
