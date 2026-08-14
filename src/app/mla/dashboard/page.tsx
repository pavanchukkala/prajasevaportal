import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ActionDashboard } from "@/components/mla/ActionDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Action Dashboard — Srikalahasti Executive Command Centre",
  description: "Executive Action Dashboard for reviewing citizen grievances, assigning field operations, and resolving constituency issues.",
};

export default async function ActionDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/staff/login?redirect=/mla/dashboard");
  }

  let complaints: any[] = [];
  try {
    complaints = await db.complaints.list();
  } catch (err) {
    console.error("[Action Dashboard DB Error]:", err);
  }

  return <ActionDashboard user={session} complaints={complaints} buildId="v1e601de" />;
}
