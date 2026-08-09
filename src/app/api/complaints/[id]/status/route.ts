import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { notifier } from "@/lib/notifications";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Auth check
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, assignedTo, assignedDepartment, internalNote } = body;

  const validStatuses = [
    "New", "AI Processed", "Under Review", "More Information Requested",
    "Assigned", "Escalated", "Action Reported", "Resolved", "Reopened", "Closed"
  ];

  if (status && !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
  }

  const updated = await db.complaints.updateStatus(id, {
    status,
    assignedTo,
    assignedDepartment,
    internalNote,
    actor: session.username,
  });

  if (!updated) {
    return NextResponse.json({ error: "Complaint not found." }, { status: 404 });
  }

  // Trigger notification provider if citizen consented to notifications
  let notificationRecord = null;
  if (status && updated.consentGiven && updated.mobileNumber) {
    const messageType = status === "Resolved" ? "resolved" : "status_changed";
    const text = `Update on Complaint ${updated.id}: Status changed to "${status}". Track at /track.`;

    notificationRecord = await notifier.sendNotification({
      complaintId: updated.id,
      recipientMobile: updated.mobileNumber,
      recipientMasked: updated.mobileNumberMasked || "+91 ******4321",
      messageType,
      messageText: text,
      consentGiven: true,
    });

    await db.notifications.log({
      complaintId: updated.id,
      channel: "sms",
      recipientMasked: updated.mobileNumberMasked || "+91 ******4321",
      messageType,
      providerStatus: notificationRecord.status === "Sent" ? "sent" : "no_provider",
      failureReason: notificationRecord.failureReason,
    });
  }

  return NextResponse.json({
    success: true,
    id: updated.id,
    status: updated.status,
    updatedAt: updated.updatedAt,
    auditLog: updated.auditLog,
    notificationStatus: notificationRecord
      ? {
          provider: notificationRecord.provider,
          status: notificationRecord.status,
          responseId: notificationRecord.providerResponseId,
        }
      : { provider: notifier.providerName, status: "No consent or mobile number provided" },
    message: `Complaint status updated to "${updated.status}".`,
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const complaint = await db.complaints.getById(id);

  if (!complaint) {
    return NextResponse.json({ error: "Complaint not found." }, { status: 404 });
  }

  // Return full complaint to authorized reviewers — but NEVER return raw mobile number
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mobileNumber: _raw, ...safeComplaint } = complaint;

  return NextResponse.json(safeComplaint);
}
