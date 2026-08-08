import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyzeComplaint } from "@/lib/ai/analyzer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, mandal, village, department, hasImages, hasAudio } = body;

    if (!description || !mandal) {
      return NextResponse.json(
        { error: "description and mandal are required" },
        { status: 400 }
      );
    }

    // AI analysis
    const aiResult = await analyzeComplaint({
      description,
      mandal,
      village,
      department,
      hasImages: hasImages ?? false,
      hasAudio: hasAudio ?? false,
    });

    // Store in db
    const complaint = await db.complaints.insert({
      description,
      mandal,
      village,
      department,
      mediaUrls: [],
      aiAnalysis: aiResult,
      dataSource: "citizen_submission",
      isSample: false,
    });

    return NextResponse.json(
      {
        success: true,
        id: complaint.id,
        aiAnalysis: aiResult,
        trackingToken: complaint.id,
        message: "Complaint submitted. AI-generated preliminary assessment attached. Human review will follow.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Complaint submission error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
