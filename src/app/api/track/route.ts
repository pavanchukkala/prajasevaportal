import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDepartmentLabel } from "@/lib/departments";

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

  const deptLabel = getDepartmentLabel(
    complaint.assignedDepartment || complaint.department || complaint.aiAnalysis?.department
  );

  // Return public, non-sensitive fields
  return NextResponse.json({
    id: complaint.id,
    status: complaint.status,
    mandal: complaint.mandal,
    village: complaint.village,
    department: deptLabel,
    assignedDepartment: complaint.assignedDepartment,
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
    // Return full action history for public citizen tracking timeline
    statusHistory: (complaint.auditLog ?? []).map((e) => ({
      timestamp: e.timestamp,
      action: e.action,
      actor: e.actor === "system" ? "System" : "Authorized Official",
    })),
    message:
      complaint.status === "Resolved" || complaint.status === "Solved"
        ? "This complaint has been verified and resolved by field officers."
        : complaint.status === "Under Review" || complaint.status === "Viewed"
        ? "Your complaint has been viewed and is under active review."
        : complaint.status === "Assigned"
        ? `Your complaint has been assigned to ${deptLabel} for field inspection.`
        : complaint.status === "Action Reported"
        ? `Work order issued by ${deptLabel}. Resolution in progress.`
        : complaint.status === "Escalated"
        ? "Your complaint has been escalated for priority executive intervention."
        : complaint.status === "More Information Requested"
        ? "Reviewers have requested additional details. You may submit an updated report."
        : "Your complaint has been received and is queued for reviewer triage.",
  });
}
