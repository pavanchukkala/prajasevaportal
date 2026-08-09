"use client";

import React, { useEffect, useState } from "react";

export default function IndianFlagRibbon() {
  const [fillPercent, setFillPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScrollable > 0) {
        // Slow, full-page scroll progress (0% at page top -> 100% when user reaches end of page)
        const progress = Math.min(Math.max(window.scrollY / totalScrollable, 0), 1);
        setFillPercent(progress * 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      role="region"
      aria-label="Indian National Tricolour Ribbon with Scroll Fill Animation"
      style={{
        width: "100%",
        height: "18px",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--border-main)",
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      {/* ── LEFT SECTION (INITIAL: SAFFRON #FF9933 | FILLED: GREEN #138808 ON SCROLL TO BOTTOM) ── */}
      <div style={{ flex: 1, backgroundColor: "#FF9933", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: `${fillPercent}%`,
            backgroundColor: "#138808",
            transition: "width 0.15s ease-out",
          }}
        />
      </div>

      {/* ── CENTER SECTION (WHITE #FFFFFF WITH 24-SPOKE NAVY ASHOKA CHAKRA) ── */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          aria-hidden="true"
          style={{
            transform: `rotate(${fillPercent * 3.6}deg)`,
            transition: "transform 0.15s ease-out",
            filter: fillPercent > 50 ? "drop-shadow(0 0 4px #000080)" : "none",
          }}
        >
          <circle cx="12" cy="12" r="10" fill="none" stroke="#000080" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2" fill="#000080" />
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x2 = 12 + 9 * Math.cos(rad);
            const y2 = 12 + 9 * Math.sin(rad);
            return (
              <line
                key={i}
                x1="12"
                y1="12"
                x2={x2}
                y2={y2}
                stroke="#000080"
                strokeWidth="0.75"
              />
            );
          })}
        </svg>
      </div>

      {/* ── RIGHT SECTION (INITIAL: GREEN #138808 | FILLED: SAFFRON #FF9933 ON SCROLL TO BOTTOM) ── */}
      <div style={{ flex: 1, backgroundColor: "#138808", position: "relative", overflow: "hidden" }}>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: `${fillPercent}%`,
            backgroundColor: "#FF9933",
            transition: "width 0.15s ease-out",
          }}
        />
      </div>

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .ribbon-scroll-fill { transition: none !important; }
        }
      `}</style>
    </div>
  );
}
