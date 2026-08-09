import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(_req: NextRequest) {
  const allComplaints = await db.complaints.list();
  const stats = await db.complaints.getStats();

  const deptCounts: Record<string, number> = {};
  allComplaints.forEach((c) => {
    const dept = c.aiAnalysis?.department ?? c.department ?? "Unknown";
    deptCounts[dept] = (deptCounts[dept] ?? 0) + 1;
  });

  return NextResponse.json({
    databaseProvider: db.getProviderName(),
    overview: {
      total: stats.total,
      liveSubmissions: stats.live,
      sampleRecords: stats.sample,
      highPriority: stats.highPriority,
      underReview: stats.underReview,
      resolved: stats.resolved,
      pending: stats.total - stats.resolved,
    },
    departmentBreakdown: deptCounts,
    mandals: ["Srikalahasti", "Renigunta", "Yerpedu", "Thottambedu"],
    generatedAt: new Date().toISOString(),
  });
}
