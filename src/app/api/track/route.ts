import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Tracking token is required." }, { status: 400 });
  }

  const complaint = await db.complaints.getByTrackingToken(token);

  if (!complaint) {
    return NextResponse.json({ error: "No complaint found with this tracking token." }, { status: 404 });
  }

  // Return only public, non-sensitive fields
  return NextResponse.json({
    id: complaint.id,
    status: complaint.status,
    mandal: complaint.mandal,
    village: complaint.village,
    department: complaint.department ?? complaint.aiAnalysis?.department ?? "To Be Determined",
    createdAt: complaint.createdAt,
    updatedAt: complaint.updatedAt,
    isSample: complaint.isSample,
    aiSummary: complaint.aiAnalysis
      ? {
          title: complaint.aiAnalysis.title,
          category: complaint.aiAnalysis.category,
          urgency: complaint.aiAnalysis.urgency,
          credibilityBand: complaint.aiAnalysis.credibilityBand,
          analysisMode: complaint.aiAnalysis.analysisMode,
          legalDisclaimer: complaint.aiAnalysis.legalDisclaimer,
        }
      : null,
    statusHistory: (complaint.auditLog ?? [])
      .filter(
        (e) =>
          e.action.startsWith("Status changed") || e.action.startsWith("Complaint received")
      )
      .map((e) => ({ timestamp: e.timestamp, action: e.action })),
    message:
      complaint.status === "Resolved"
        ? "This complaint has been resolved."
        : complaint.status === "Under Review"
        ? "Your complaint is under active review by authorized staff."
        : complaint.status === "Assigned"
        ? "Your complaint has been assigned to the relevant department."
        : complaint.status === "Escalated"
        ? "Your complaint has been escalated for priority review."
        : complaint.status === "More Information Requested"
        ? "Reviewers have requested more information. You may submit a new complaint with additional details."
        : "Your complaint has been received and is in the processing queue.",
  });
}
