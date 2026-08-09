import { db } from "../src/lib/db";
import { analyzeComplaint } from "../src/lib/ai/analyzer";
import { ASSET_MANIFEST } from "../src/config/assets";

async function runTests() {
  console.log("=== RUNNING WORKFLOW & ASSET VALIDATION ===");

  // 1. Verify imagery paths & emblem guardrails
  console.log("\n1. Verifying Image Assets & Civic Emblem Guardrail:");
  let emblemViolations = 0;
  for (const [key, asset] of Object.entries(ASSET_MANIFEST)) {
    console.log(` - Asset [${key}]: ${asset.name} => ${asset.imagePath}`);
    if (["mla", "father", "cm", "lokesh", "pm", "ntr"].includes(key)) {
      if (asset.imagePath.includes("civic-emblem")) {
        console.error(`❌ VIOLATION: Portrait [${key}] uses civic emblem!`);
        emblemViolations++;
      }
    }
  }
  if (emblemViolations === 0) {
    console.log("✅ PASS: Zero portrait paths point to the civic emblem.");
  }

  // 2. Submit Real Complaint & Test Database Insertion + AI Analysis
  console.log("\n2. Testing Real Complaint Submission & Safety AI:");
  const testDesc = "Severe drinking water contamination in Srikalahasti ward 12. Water smells foul and sewage pipeline leak reported near primary school.";
  
  const aiResult = await analyzeComplaint({
    description: testDesc,
    mandal: "Srikalahasti",
    village: "Ward 12",
    department: "Municipal Administration",
    hasImages: true,
    hasAudio: false,
  });

  console.log(" - AI Analysis Result:");
  console.log(`   Title: ${aiResult.title}`);
  console.log(`   Category: ${aiResult.category}`);
  console.log(`   Department: ${aiResult.department}`);
  console.log(`   Urgency: ${aiResult.urgency}`);
  console.log(`   Credibility Band: ${aiResult.credibilityBand}`);

  const rawMobile = "9876543210";
  const mobileNumberMasked = "+91 ******3210";

  const inserted = await db.complaints.insert({
    description: testDesc,
    mandal: "Srikalahasti",
    village: "Ward 12",
    department: "Municipal Administration",
    incidentDate: "2026-08-09",
    mediaUrls: [],
    aiAnalysis: aiResult,
    dataSource: "citizen_submission",
    isSample: false,
    isAnonymous: false,
    mobileNumber: rawMobile,
    mobileNumberMasked,
    mobileVerified: false,
    consentGiven: true,
    consentTimestamp: new Date().toISOString(),
    consentPurpose: "Complaint status updates only",
    notificationPreference: "sms",
  });

  console.log(`\n3. Inserted Complaint Contract Verification:`);
  console.log(` - ID: ${inserted.id}`);
  console.log(` - Tracking Token: ${inserted.trackingToken}`);
  console.log(` - Consent Stored: ${inserted.consentGiven}`);
  console.log(` - Mobile Masked: ${inserted.mobileNumberMasked}`);

  // 4. Test Tracking Lookup
  console.log("\n4. Testing Tracking Token Lookup:");
  const fetchedByToken = await db.complaints.getByTrackingToken(inserted.trackingToken);
  console.log(` - Fetched ID by Token: ${fetchedByToken?.id}`);
  console.log(` - Fetched Mandal: ${fetchedByToken?.mandal}`);
  console.log(` - Fetched AI Title: ${fetchedByToken?.aiAnalysis?.title}`);

  // 5. Test Protected Staff Queue List
  console.log("\n5. Testing Protected Staff Queue Fetch:");
  const allLive = await db.complaints.listLive();
  const foundInQueue = allLive.find(c => c.id === inserted.id);
  console.log(` - Found in Staff Queue: ${!!foundInQueue}`);

  if (inserted.id.startsWith("SKT-") && inserted.trackingToken.startsWith("TKN-") && inserted.consentGiven && foundInQueue) {
    console.log("\n✅ ALL WORKFLOW & CONTRACT ASSERTIONS PASSED SUCCESSFULLY!");
  } else {
    console.error("\n❌ WORKFLOW FAILURE DETECTED!");
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
