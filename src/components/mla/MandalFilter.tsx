"use client";
import React from "react";

export default function MandalFilter({
  currentTab,
  currentMandal,
}: {
  currentTab: string;
  currentMandal: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "13px", color: "#94a3b8" }}>Mandal:</span>
      <select
        value={currentMandal}
        onChange={(e) => {
          const val = e.target.value;
          window.location.href = `/mla/dashboard?tab=${currentTab}&mandal=${val}`;
        }}
        style={{
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          color: "#f8fafc",
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "13px",
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="all">All Mandals</option>
        <option value="Srikalahasti">Srikalahasti</option>
        <option value="Yerpedu">Yerpedu</option>
        <option value="Thottambedu">Thottambedu</option>
        <option value="Renigunta">Renigunta</option>
      </select>
    </div>
  );
}
