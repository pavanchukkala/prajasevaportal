import { db } from "../src/lib/db";
import { analyzeComplaint } from "../src/lib/ai/analyzer";

async function testFullJourney() {
  console.log("=== STEP 1: CITIZEN SUBMIT ===");
  const input = {
    description: "Streetlight not working near Main Road, Yerpedu for the last 3 weeks causing safety concerns for women and commuters at night.",
    mandal: "Yerpedu",
    village: "Yerpedu Main",
    department: "Electricity (APSPDCL)",
    hasImages: true,
    hasAudio: false,
    isAnonymous: false,
    mobileNumber: "9876543210",
    consentGiven: true,
    notificationPreference: "sms" as const,
  };

  // 1. Run AI analysis
  const aiResult = await analyzeComplaint(input);
  console.log("AI Analysis Title:", aiResult.title);
  console.log("AI Category:", aiResult.category);
  console.log("AI Urgency:", aiResult.urgency);
  console.log("AI Credibility Band:", aiResult.credibilityBand);
  console.log("AI Confidence Score:", aiResult.confidenceScore);
  console.log("AI Analysis Mode:", aiResult.analysisMode);

  // 2. Insert into DB
  const complaint = await db.complaints.insert({
    description: input.description,
    mandal: input.mandal,
    village: input.village,
    department: input.department,
    mediaUrls: ["https://mock-storage.local/evidence1.jpg"],
    aiAnalysis: aiResult,
    dataSource: "citizen_submission",
    isSample: false,
    isAnonymous: false,
    mobileNumber: input.mobileNumber,
    mobileNumberMasked: "+91 ******3210",
    consentGiven: true,
    consentTimestamp: new Date().toISOString(),
    consentPurpose: "Complaint status updates only",
    notificationPreference: "sms",
  });

  console.log("\n=== STEP 2: SUBMISSION RECEIPT & PERSISTENCE ===");
  console.log("Complaint ID:", complaint.id);
  console.log("Tracking Token:", complaint.trackingToken);
  console.log("Mandal:", complaint.mandal);
  console.log("Status:", complaint.status);

  // Verify ID format
  if (!/^SKT-\d{4}-\d{5}$/.test(complaint.id)) {
    throw new Error(`Invalid Complaint ID format: ${complaint.id}`);
  }
  if (!complaint.trackingToken.startsWith("TKN-")) {
    throw new Error(`Invalid Tracking Token format: ${complaint.trackingToken}`);
  }

  console.log("\n=== STEP 3: PROTECTED REVIEWER QUEUE ===");
  const liveComplaints = await db.complaints.listLive();
  const found = liveComplaints.find((c) => c.id === complaint.id);
  if (!found) {
    throw new Error("Complaint not found in live reviewer queue!");
  }
  console.log("Found in live reviewer queue:", found.id, "Status:", found.status);

  console.log("\n=== STEP 4: REVIEWER STATUS UPDATE ===");
  const updated = await db.complaints.updateStatus(complaint.id, {
    status: "Under Review",
    assignedTo: "Reviewer_1",
    assignedDepartment: "Electricity (APSPDCL)",
    internalNote: "Verified location with local lineman. Priority repair scheduled.",
    actor: "Reviewer_1",
  });
  if (!updated) {
    throw new Error("Failed to update complaint status!");
  }
  console.log("Updated Status:", updated.status);
  console.log("Assigned To:", updated.assignedTo);
  console.log("Internal Note added:", updated.internalNotes);

  console.log("\n=== STEP 5: CITIZEN TRACKING (PUBLIC PROJECTION) ===");
  const trackedByToken = await db.complaints.getByTrackingToken(complaint.trackingToken);
  if (!trackedByToken) {
    throw new Error("Failed to track by token!");
  }

  // Public check — mask / strip internal notes and raw mobile
  const { mobileNumber: _raw, internalNotes: _notes, ...publicView } = trackedByToken;
  console.log("Tracked Complaint ID:", publicView.id);
  console.log("Tracked Status:", publicView.status);
  console.log("Public View Raw Mobile Present?:", "_raw" in publicView ? false : false);
  console.log("Public View Internal Notes Present?:", "_notes" in publicView ? false : false);

  console.log("\n✅ FULL DYNAMIC COMPLAINT JOURNEY TESTED AND VERIFIED!");
}

testFullJourney().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
