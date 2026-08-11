import React from "react";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

export default function LoadingCase() {
  return (
    <div style={{ minHeight: "100vh", background: "#04091A", color: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <GlobalHeader />
      <main style={{ flex: 1, maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "3rem 1rem", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "12px 24px", borderRadius: "12px", background: "rgba(13,33,55,0.7)", border: "1px solid rgba(56,189,248,0.2)" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>⏳</div>
          <div style={{ fontSize: "1rem", fontWeight: 800, color: "#38bdf8" }}>Loading Case Intelligence...</div>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: "4px 0 0" }}>Retrieving live grievance details from database.</p>
        </div>
      </main>
      <GlobalFooter />
    </div>
  );
}
