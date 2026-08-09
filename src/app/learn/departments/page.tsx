"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { departmentsConfig } from "@/config/departments";
import { useLanguage } from "@/context/LanguageContext";

export default function DepartmentsPage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            {t("learn.deptsTitle")}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem" }}>
            {isTe ? "సమస్యను సమర్పించే ముందు సరైన విభాగాన్ని ఎంచుకోవడం ద్వారా వేగవంతమైన పరిష్కారం లభిస్తుంది." : "Before submitting a complaint, identify the right department. A correctly routed complaint reaches the right authority faster."}
          </p>
        </div>
      </section>

      <section style={{ padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {departmentsConfig.map(dept => (
            <div key={dept.id} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.75rem" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#D4A017" }}>
                  {isTe && dept.nameTe ? dept.nameTe : dept.name}
                </h2>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  {isTe ? "మొదటి సంప్రదింపు: " : "First Contact: "} {dept.firstContact}
                </span>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>
                  {isTe ? "పరిష్కరించే సమస్యలు" : "Key Issues Handled"}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {dept.issues.map((iss, i) => (
                    <span key={i} style={{ background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "9999px", padding: "0.25rem 0.75rem", fontSize: "0.78rem", color: "#f0f4f8" }}>
                      {iss}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: "0.78rem", color: "#64748b", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "0.75rem" }}>
                <strong style={{ color: "#94a3b8" }}>{isTe ? "పైస్థాయి అధికారుల మార్గం: " : "Escalation Route: "}</strong>
                {dept.escalationRoute}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
