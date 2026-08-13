"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ActionDashboardSignOut({ label = "Sign Out" }: { label?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST", cache: "no-store" }).catch(() => null);
    router.replace("/staff/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      style={{
        padding: "10px 12px",
        borderRadius: 10,
        textDecoration: "none",
        fontWeight: 800,
        color: "#fff",
        background: "#dc2626",
        border: "none",
        cursor: pending ? "wait" : "pointer",
        textAlign: "left",
      }}
    >
      {pending ? "Signing out... / నిష్క్రమిస్తోంది..." : label}
    </button>
  );
}
