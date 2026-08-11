"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import GlobalHeader from "@/components/layout/GlobalHeader";
import GlobalFooter from "@/components/layout/GlobalFooter";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Reviewer Case Detail Error]:", error);
  }, [error]);

  return (
    <div style={{ minHeight: "100vh", background: "#04091A", color: "#f8fafc", display: "flex", flexDirection: "column" }}>
      <GlobalHeader />
      <main style={{ flex: 1, maxWidth: "800px", width: "100%", margin: "0 auto", padding: "4rem 1.5rem", textAlign: "center" }}>
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: "16px", padding: "2.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠</div>
          <h1 style={{ color: "#ef4444", fontSize: "1.5rem", fontWeight: 900, margin: "0 0 0.5rem" }}>
            Case Retrieval Issue
          </h1>
          <p style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            A temporary system or database communication error occurred while processing this case record.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => reset()}
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                backgroundColor: "#ef4444",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.85rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              🔄 Retry Request
            </button>
            <Link
              href="/reviewer/cases"
              style={{
                padding: "0.6rem 1.25rem",
                borderRadius: "8px",
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#f8fafc",
                fontWeight: 700,
                fontSize: "0.85rem",
                textDecoration: "none",
              }}
            >
              ← Return to Reviewer Queue
            </Link>
          </div>
        </div>
      </main>
      <GlobalFooter />
    </div>
  );
}
