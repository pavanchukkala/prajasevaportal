import { validateFile, DEFAULT_PILOT_LIMITS } from '../src/lib/storage/validator';
import { storage } from '../src/lib/storage';
import { notifier } from '../src/lib/notifications';
import { db } from '../src/lib/db';

async function testProductionConnectors() {
  console.log("==================================================");
  console.log("   PSIP PRODUCTION CONNECTORS & VALIDATION TEST   ");
  console.log("==================================================");

  // 1. Test Evidence File Validation
  console.log("\n1. Testing Pilot Evidence Validation Rules...");
  const dummyImg = Buffer.from("fake-jpeg-image-binary-content-data");
  const dummyExe = Buffer.from("fake-exe-binary-content");

  // Rejects executable file
  const exeVal = validateFile(dummyExe, "malicious.exe", "application/x-msdownload", 0, 0, DEFAULT_PILOT_LIMITS);
  console.log("   Executable validation result (should be invalid):", exeVal);
  if (exeVal.valid) {
    throw new Error("Validation failed to reject executable .exe file!");
  }

  // Accepts valid JPEG image
  const imgVal = validateFile(dummyImg, "photo.jpg", "image/jpeg", 0, 0, DEFAULT_PILOT_LIMITS);
  console.log("   JPEG image validation result (should be valid):", imgVal);
  if (!imgVal.valid || !imgVal.sha256Hash) {
    throw new Error("Validation failed to accept valid JPEG image!");
  }

  // 2. Test Storage Upload
  console.log("\n2. Testing Real Storage Upload via Active Storage Provider...");
  console.log("   Active Storage Provider:", storage.providerName);

  const complaintId = "SKT-2026-TEST01";
  const evidenceMeta = await storage.uploadEvidence(dummyImg, {
    complaintId,
    originalName: "site_photo.jpg",
    mimeType: "image/jpeg",
  });

  console.log("   Evidence Metadata Returned:", JSON.stringify(evidenceMeta, null, 2));

  if (evidenceMeta.privatePath.includes("mock-storage.local")) {
    throw new Error("Storage provider returned forbidden mock-storage.local URL!");
  }

  const authUrl = await storage.getAuthorizedDownloadUrl(evidenceMeta);
  console.log("   Generated Authorized Reviewer Download URL:", authUrl);

  if (!authUrl.startsWith("/api/evidence/")) {
    throw new Error("Invalid authorized reviewer download URL format!");
  }

  // 3. Test Notification Provider
  console.log("\n3. Testing Notification Provider...");
  console.log("   Active Notification Provider:", notifier.providerName);

  const notifResult = await notifier.sendNotification({
    complaintId,
    recipientMobile: "9876543210",
    recipientMasked: "+91 ******3210",
    messageType: "status_changed",
    messageText: `Update on Complaint ${complaintId}: Status changed to "Under Review".`,
    consentGiven: true,
  });

  console.log("   Notification Result:", JSON.stringify(notifResult, null, 2));

  if (notifResult.provider === "none" && notifResult.status !== "Demo log only") {
    throw new Error("Log provider falsely claimed SMS delivery!");
  }

  // 4. Test DB Integration
  console.log("\n4. Testing DB Integration & Health Status...");
  const dbHealth = await db.getHealth();
  console.log("   Database Provider Health:", JSON.stringify(dbHealth, null, 2));

  console.log("\n==================================================");
  console.log("   ✓ ALL PRODUCTION CONNECTOR TESTS PASSED!");
  console.log("==================================================");
}

testProductionConnectors().catch((e) => {
  console.error("Test error:", e);
  process.exit(1);
});
