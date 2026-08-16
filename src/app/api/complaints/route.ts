import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { analyzeComplaint } from "@/lib/ai/analyzer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      description,
      mandal,
      village,
      department,
      incidentDate,
      hasImages,
      hasAudio,
      isAnonymous,
      mobileNumber,
      consentGiven,
      notificationPreference,
      email,
    } = body;

    if (!description || description.trim().length < 20) {
      return NextResponse.json(
        { error: "Description must be at least 20 characters." },
        { status: 400 }
      );
    }
    if (!mandal) {
      return NextResponse.json(
        { error: "Mandal is required." },
        { status: 400 }
      );
    }

    // Run AI analysis (30B model — all 6 intelligence layers)
    const aiResult = await analyzeComplaint({
      description: description.trim(),
      mandal,
      village,
      department,
      hasImages: hasImages ?? false,
      hasAudio: hasAudio ?? false,
    });

    // Mask mobile number for storage
    let mobileNumberMasked: string | undefined;
    let rawMobile: string | undefined;
    if (!isAnonymous && mobileNumber && consentGiven) {
      rawMobile = mobileNumber.replace(/\D/g, "");
      mobileNumberMasked = `+91 ******${rawMobile!.slice(-4)}`;
    }

    const consentTimestamp = consentGiven ? new Date().toISOString() : undefined;

    const complaint = await db.complaints.insert({
      description: description.trim(),
      mandal,
      village: village || undefined,
      department: department || undefined,
      incidentDate: incidentDate || undefined,
      mediaUrls: [],
      aiAnalysis: aiResult,
      dataSource: "citizen_submission",
      isSample: false,
      isAnonymous: isAnonymous ?? true,
      mobileNumber: consentGiven ? rawMobile : undefined,
      mobileNumberMasked: consentGiven ? mobileNumberMasked : undefined,
      mobileVerified: false,
      consentGiven: consentGiven ?? false,
      consentTimestamp,
      consentPurpose: consentGiven ? "Complaint status updates only" : undefined,
      notificationPreference: consentGiven ? (notificationPreference ?? "sms") : "none",
      email: !isAnonymous && email ? email : undefined,
    });

    if (consentGiven && mobileNumberMasked) {
      await db.notifications.log({
        complaintId: complaint.id,
        channel: "sms",
        recipientMasked: mobileNumberMasked,
        messageType: "complaint_received",
        providerStatus: "no_provider",
        failureReason: "SMS provider not configured in this deployment.",
      });
    }

    return NextResponse.json(
      {
        success: true,
        id: complaint.id,
        trackingToken: complaint.trackingToken,
        createdAt: complaint.createdAt,
        mandal: complaint.mandal,
        department: aiResult.department,
        aiAnalysis: {
          title: aiResult.title,
          category: aiResult.category,
          subcategory: aiResult.subcategory,
          department: aiResult.department,
          urgency: aiResult.urgency,
          credibilityBand: aiResult.credibilityBand,
          confidenceScore: aiResult.confidenceScore,
          evidenceCompleteness: aiResult.evidenceCompleteness,
          missingInformation: aiResult.missingInformation,
          recommendedAction: aiResult.recommendedAction,
          humanReviewRequired: true,
          analysisMode: aiResult.analysisMode,
          legalDisclaimer: aiResult.legalDisclaimer,
          // New fields
          spamScore: aiResult.spamScore,
          sentimentTone: aiResult.sentimentTone,
          distressFlag: aiResult.distressFlag,
          rootCauseTags: aiResult.rootCauseTags,
          actionBrief: aiResult.actionBrief,
        },
        // Dynamic AI moral support message for citizen
        moralSupportMessage: aiResult.moralSupportMessage ?? null,
        notificationStatus: consentGiven
          ? "Notification queued — SMS provider not yet connected in this deployment."
          : "No notification requested.",
        message:
          "Complaint submitted successfully. AI-generated preliminary assessment attached. Human review will follow.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] Complaint submission error:", error);
    return NextResponse.json(
      { error: "An internal error occurred. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source");

  let complaints = source === "live"
    ? await db.complaints.listLive()
    : await db.complaints.list();

  const safe = complaints.map((c) => ({
    id: c.id,
    status: c.status,
    mandal: c.mandal,
    village: c.village,
    department: c.department ?? c.aiAnalysis?.department,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    isSample: c.isSample,
    isAnonymous: c.isAnonymous,
    aiSummary: c.aiAnalysis
      ? {
          title: c.aiAnalysis.title,
          urgency: c.aiAnalysis.urgency,
          credibilityBand: c.aiAnalysis.credibilityBand,
          confidenceScore: c.aiAnalysis.confidenceScore,
          department: c.aiAnalysis.department,
          humanReviewRequired: c.aiAnalysis.humanReviewRequired,
          analysisMode: c.aiAnalysis.analysisMode,
        }
      : null,
    mobileNumberMasked: c.mobileNumberMasked,
    consentGiven: c.consentGiven,
  }));

  return NextResponse.json({ complaints: safe, total: safe.length });
}
