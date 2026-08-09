import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const dbHealth = await db.getHealth();

    return NextResponse.json(
      {
        status: "ok",
        service: "Srikalahasti Praja Seva Intelligence Platform",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        database_provider: dbHealth.provider,
        database_connectivity: dbHealth.connected ? "connected" : "disconnected",
        ai_provider: "rule_based_analyzer",
        checks: {
          api: "healthy",
          database: dbHealth.connected ? `active (${dbHealth.provider})` : "error",
          ai_analyzer: "active (rule_based_analyzer)",
          totalRecords: dbHealth.totalRecords,
          liveRecords: dbHealth.liveRecords,
          sampleRecords: dbHealth.sampleRecords,
          latencyMs: dbHealth.latencyMs,
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "degraded",
        error: error instanceof Error ? error.message : "Unknown error",
        database_provider: "sqlite_file",
        database_connectivity: "error",
        ai_provider: "rule_based_analyzer",
      },
      { status: 500 }
    );
  }
}
