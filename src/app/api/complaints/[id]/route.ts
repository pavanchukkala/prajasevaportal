import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const complaint = await db.complaints.getById(id);

  if (!complaint) {
    return NextResponse.json({ error: "Complaint not found." }, { status: 404 });
  }

  // Public tracking endpoint — return ONLY safe, non-sensitive fields
  return NextResponse.json({
    id: complaint.id,
    status: complaint.status,
    mandal: complaint.mandal,
    village: complaint.village,
    department: complaint.department ?? complaint.aiAnalysis?.department ?? "To Be Determined",
    createdAt: complaint.createdAt,
    updatedAt: complaint.updatedAt,
    isSample: complaint.isSample,
    // AI summary — stripped of internal fields
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
    statusHistory: (complaint.auditLog ?? []).map((e) => ({ timestamp: e.timestamp, action: e.action })),
    message:
      complaint.status === "Solved" || complaint.status === "Resolved"
        ? "This complaint has been officially solved and resolved by MLA Bojjala Venkata Sudhir Reddy's Executive Office."
        : complaint.status === "Viewed"
        ? "Your complaint has been viewed and verified by MLA Executive Staff."
        : complaint.status === "Contacted (No Response)"
        ? "MLA Executive Staff attempted to contact you via mobile/WhatsApp regarding your complaint."
        : complaint.status === "Under Review"
        ? "Your complaint is under active review by authorized staff."
        : complaint.status === "Assigned"
        ? "Your complaint has been assigned to the relevant department."
        : complaint.status === "Escalated"
        ? "Your complaint has been escalated for priority review."
        : complaint.status === "More Information Requested"
        ? "Reviewers have requested more information."
        : "Your complaint has been received and is in the processing queue.",
    // Never expose: mobileNumber (raw), internalNotes, assignedTo, full auditLog with reviewer notes
  });
}
