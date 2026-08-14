"use client";

import React from "react";

interface NationalEmblemProps {
  size?: number;
  showMotto?: boolean;
  showBadge?: boolean;
  theme?: "gold" | "bronze" | "silver" | "tricolor";
}

export default function NationalEmblemIndia({
  size = 40,
  showMotto = true,
  showBadge = true,
  theme = "gold",
}: NationalEmblemProps) {
  const primaryColor = theme === "bronze" ? "#D4A017" : theme === "silver" ? "#E2E8F0" : "#F59E0B";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.6rem",
        padding: showBadge ? "0.35rem 0.75rem" : "0",
        borderRadius: "12px",
        background: showBadge ? "rgba(245, 158, 11, 0.08)" : "transparent",
        border: showBadge ? "1px solid rgba(245, 158, 11, 0.25)" : "none",
        boxShadow: showBadge ? "0 2px 12px rgba(245, 158, 11, 0.08)" : "none",
      }}
      title="State Emblem of India • Lion Capital of Ashoka with Satyameva Jayate (సత్యమేవ జయతే)"
    >
      {/* Lion Capital SVG vector graphic */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
        aria-label="National Emblem of India - Lion Capital of Ashoka"
      >
        <defs>
          <linearGradient id="emblemGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF5C0" />
            <stop offset="45%" stopColor="#F59E0B" />
            <stop offset="80%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
          <linearGradient id="emblemRibbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#138808" />
          </linearGradient>
        </defs>

        {/* Outer Radiant Ring */}
        <circle cx="50" cy="50" r="46" fill="none" stroke="url(#emblemGoldGrad)" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />

        {/* Lion Heads Top Profile (Central + Left & Right Lions) */}
        {/* Central Lion */}
        <path d="M 44 26 C 42 16 58 16 56 26 Z" fill="url(#emblemGoldGrad)" />
        <circle cx="50" cy="22" r="6" fill="url(#emblemGoldGrad)" />
        <path d="M 46 22 L 50 17 L 54 22 L 50 25 Z" fill="#FFF" opacity="0.4" />
        <path d="M 43 28 C 40 34 60 34 57 28 Z" fill="url(#emblemGoldGrad)" />

        {/* Left Lion */}
        <circle cx="34" cy="26" r="5" fill="url(#emblemGoldGrad)" />
        <path d="M 30 30 C 26 36 40 38 38 32 Z" fill="url(#emblemGoldGrad)" />

        {/* Right Lion */}
        <circle cx="66" cy="26" r="5" fill="url(#emblemGoldGrad)" />
        <path d="M 70 30 C 74 36 60 38 62 32 Z" fill="url(#emblemGoldGrad)" />

        {/* Shared Mane & Torso Base */}
        <path d="M 30 34 Q 50 24 70 34 Q 66 48 50 50 Q 34 48 30 34 Z" fill="url(#emblemGoldGrad)" stroke="#B45309" strokeWidth="0.8" />
        <path d="M 36 38 Q 50 44 64 38 Q 50 48 36 38 Z" fill="#FFF" opacity="0.3" />

        {/* Abacus Base Bar */}
        <rect x="22" y="52" width="56" height="12" rx="2" fill="url(#emblemGoldGrad)" stroke="#78350F" strokeWidth="1" />

        {/* Ashoka Chakra Wheel on Abacus */}
        <circle cx="50" cy="58" r="5" fill="#000080" stroke="url(#emblemGoldGrad)" strokeWidth="0.8" />
        <circle cx="50" cy="58" r="1" fill="#FFF" />
        {/* 24 Spokes */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="58"
            x2={50 + 4.5 * Math.cos((i * Math.PI) / 6)}
            y2={58 + 4.5 * Math.sin((i * Math.PI) / 6)}
            stroke="#FFF"
            strokeWidth="0.5"
          />
        ))}

        {/* Abacus Galloping Horse (Left) & Bull (Right) Figures */}
        <path d="M 28 58 Q 32 54 34 58 T 30 62 Z" fill="#78350F" opacity="0.8" />
        <path d="M 72 58 Q 68 54 66 58 T 70 62 Z" fill="#78350F" opacity="0.8" />

        {/* Inverted Lotus Pedestal Base */}
        <path d="M 26 64 L 74 64 L 68 76 L 32 76 Z" fill="url(#emblemGoldGrad)" stroke="#78350F" strokeWidth="0.8" />
        <path d="M 34 66 L 50 74 L 66 66 Z" fill="#FFF" opacity="0.2" />

        {/* Plinth Base Support */}
        <rect x="28" y="77" width="44" height="4" rx="1" fill="url(#emblemGoldGrad)" />

        {/* Tricolor Ribbon Motif at Foot */}
        <rect x="30" y="83" width="40" height="3" rx="1.5" fill="url(#emblemRibbonGrad)" />

        {/* Motto: SATYAMEVA JAYATE */}
        <text
          x="50"
          y="98"
          textAnchor="middle"
          fill="url(#emblemGoldGrad)"
          fontSize="7.5"
          fontWeight="900"
          fontFamily="'Inter', 'Noto Sans Devanagari', sans-serif"
          letterSpacing="0.4"
        >
          सत्यमेव जयते
        </text>
      </svg>

      {/* Motto text badge */}
      {showMotto && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "0.76rem", fontWeight: 900, color: primaryColor, letterSpacing: "0.02em" }}>
              సత్యమేవ జయతే
            </span>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 600 }}>•</span>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.02em" }}>
              సత్యమేవ జయతే
            </span>
          </div>
          <span style={{ fontSize: "0.64rem", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            State Emblem of India • Satyameva Jayate
          </span>
        </div>
      )}
    </div>
  );
}
