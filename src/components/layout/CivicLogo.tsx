"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface CivicLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function CivicLogo({ size = "md", showText = true }: CivicLogoProps) {
  const { language } = useLanguage();
  const isTe = language === "te";

  const dimensions = size === "sm" ? 32 : size === "lg" ? 48 : 40;

  return (
    <Link
      href="/"
      aria-label="Srikalahasti Praja Seva Platform Home"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.75rem",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          position: "relative",
          width: `${dimensions}px`,
          height: `${dimensions}px`,
          flexShrink: 0,
        }}
      >
        <Image
          src="/assets/symbols/civic-emblem.svg"
          alt="Praja Seva Platform Official Logo"
          width={dimensions}
          height={dimensions}
          priority
          style={{ objectFit: "contain" }}
        />
      </div>

      {showText && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: size === "sm" ? "1rem" : "1.2rem",
              fontWeight: 900,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "var(--text-main)",
            }}
          >
            {isTe ? "ప్రజా సేవ" : "Praja Seva"}
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            {isTe ? "శ్రీకాళహస్తి నియోజకవర్గం 168" : "Srikalahasti No. 168"}
          </span>
        </div>
      )}
    </Link>
  );
}
