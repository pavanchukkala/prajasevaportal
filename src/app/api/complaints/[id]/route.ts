import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || !id.startsWith("SKT-")) {
    return NextResponse.json({ error: "Invalid complaint ID" }, { status: 400 });
  }

  const complaint = await db.complaints.getById(id);

  if (!complaint) {
    return NextResponse.json(
      { error: "Complaint not found. If you submitted recently, please wait a few moments." },
      { status: 404 }
    );
  }

  // Never expose full AI analysis or evidence URLs to unauthenticated public
  return NextResponse.json({
    id: complaint.id,
    status: complaint.status,
    createdAt: complaint.createdAt,
    mandal: complaint.mandal,
    message: "Your complaint has been received and is being processed.",
  });
}
