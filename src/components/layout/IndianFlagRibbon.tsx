"use client";

import React, { useEffect, useState } from "react";

export default function IndianFlagRibbon() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      role="region"
      aria-label="Indian Tricolour Ribbon"
      style={{
        width: "100%",
        height: "12px",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#060F1E",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        zIndex: 100,
      }}
    >
      {/* Scroll fill background animation */}
      <div
        className="ribbon-scroll-fill"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)`,
          opacity: 0.85 + scrollProgress * 0.15,
          width: "100%",
        }}
      />

      {/* Saffron Section */}
      <div style={{ flex: 1, backgroundColor: "#FF9933", position: "relative", zIndex: 1 }} />

      {/* White Section with Centered Ashoka Chakra */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="10"
          height="10"
          aria-hidden="true"
          style={{
            filter: scrollProgress >= 0.95 ? "drop-shadow(0 0 4px #000080)" : "none",
            transition: "filter 0.3s ease",
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

      {/* India Green Section */}
      <div style={{ flex: 1, backgroundColor: "#138808", position: "relative", zIndex: 1 }} />
    </div>
  );
}
