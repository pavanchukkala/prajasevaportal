import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function sanitizeAction(action: string): string {
  if (!action) return "";
  return action.split("?")[0];
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const complaint = await db.complaints.getById(id);

  if (!complaint) {
    return NextResponse.json({ error: "Complaint not found." }, { status: 404 });
  }

  const statusMessage =
    complaint.status === "Solved" || complaint.status === "Resolved"
      ? "✅ This complaint has been verified and resolved by the executives of Praja Seva. Thank you for your patience."
      : complaint.status === "Viewed"
      ? "👁️ Your complaint has been viewed and acknowledged by the executive staff."
      : complaint.status === "Contacted (No Response)"
      ? "📞 Executive staff attempted to contact you via mobile/WhatsApp regarding your complaint."
      : complaint.status === "Under Review"
      ? "🔍 Your complaint is under active review by authorized staff."
      : complaint.status === "Assigned"
      ? "🏢 Your complaint has been assigned to the relevant department and is being acted upon."
      : complaint.status === "Escalated"
      ? "🚨 Your complaint has been escalated for priority review. The executive team is monitoring this case."
      : complaint.status === "More Information Requested"
      ? "📋 Reviewers have requested additional information. Please submit a follow-up if you have more details."
      : complaint.status === "Action Reported"
      ? "⚙️ Field action has been reported on your complaint. Please check back for resolution confirmation."
      : "⏳ Your complaint has been received and is in the processing queue. Our team will review it shortly.";

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
          sentimentTone: complaint.aiAnalysis.sentimentTone,
          rootCauseTags: complaint.aiAnalysis.rootCauseTags,
        }
      : null,
    // Dynamic moral support message from AI (shown on track page)
    moralSupportMessage: complaint.aiAnalysis?.moralSupportMessage ?? null,
    // Messages from MLA office to citizen (public, non-sensitive)
    citizenMessages: (complaint.citizenMessages ?? []).map((m) => ({
      timestamp: m.timestamp,
      message: m.message,
      // Never expose author identity publicly — just show "MLA Office"
      author: "Srikalahasti MLA Office",
    })),
    statusHistory: (complaint.auditLog ?? []).map((e) => ({
      timestamp: e.timestamp,
      action: sanitizeAction(e.action),
    })),
    message: statusMessage,
  });
}
