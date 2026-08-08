import { NextRequest, NextResponse } from "next/server";
import { SAMPLE_COMPLAINTS } from "@/lib/db";

export async function GET(_req: NextRequest) {
  const total = SAMPLE_COMPLAINTS.length;
  const highPriority = SAMPLE_COMPLAINTS.filter(
    c => c.aiAnalysis?.urgency === "High" || c.aiAnalysis?.urgency === "Emergency"
  ).length;
  const underReview = SAMPLE_COMPLAINTS.filter(c => c.status === "Under Review").length;
  const resolved = SAMPLE_COMPLAINTS.filter(
    c => c.status === "Resolved" || c.status === "Closed"
  ).length;

  const deptCounts: Record<string, number> = {};
  SAMPLE_COMPLAINTS.forEach(c => {
    const dept = c.aiAnalysis?.department ?? c.department ?? "Unknown";
    deptCounts[dept] = (deptCounts[dept] ?? 0) + 1;
  });

  return NextResponse.json({
    isSampleData: true,
    dataNote: "All records are sample presentation data. No live citizen data.",
    overview: {
      total,
      highPriority,
      underReview,
      resolved,
      pending: total - resolved,
    },
    departmentBreakdown: deptCounts,
    mandals: ["Srikalahasti", "Renigunta", "Yerpedu", "Thottambedu"],
    generatedAt: new Date().toISOString(),
  });
}
