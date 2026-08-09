import { db, toPublicSummary, toStaffView } from '../src/lib/db';

async function testDatabase() {
  console.log("==================================================");
  console.log("   PSIP DATABASE ADAPTER & PERSISTENCE UNIT TEST ");
  console.log("==================================================");

  // 1. Provider & Health
  console.log("\n1. Provider Name:", db.getProviderName());
  const health = await db.getHealth();
  console.log("   Health:", JSON.stringify(health, null, 2));

  // 2. Insert new complaint
  console.log("\n2. Inserting citizen complaint...");
  const complaint = await db.complaints.insert({
    description: "Water supply pipeline leak reported near Renigunta Main Road causing severe flooding.",
    mandal: "Renigunta",
    village: "Renigunta Main",
    department: "Municipal Administration",
    incidentDate: "2026-08-09",
    mediaUrls: [],
    dataSource: "citizen_submission",
    isSample: false,
    isAnonymous: false,
    mobileNumber: "9876543210",
    mobileNumberMasked: "+91 ******3210",
    consentGiven: true,
    consentTimestamp: new Date().toISOString(),
    consentPurpose: "Complaint status updates only",
    notificationPreference: "sms",
  });

  console.log("   ✓ Generated ID:", complaint.id);
  console.log("   ✓ Generated Tracking Token:", complaint.trackingToken);
  console.log("   ✓ Status:", complaint.status);
  console.log("   ✓ Created At:", complaint.createdAt);

  if (!complaint.id.startsWith("SKT-2026-")) {
    throw new Error(`Invalid Complaint ID format: ${complaint.id}`);
  }
  if (!complaint.trackingToken.startsWith("TKN-")) {
    throw new Error(`Invalid Tracking Token format: ${complaint.trackingToken}`);
  }

  // 3. Verify Public vs Staff Projection
  console.log("\n3. Testing Projections...");
  const pubSummary = toPublicSummary(complaint);
  console.log("   Public Projection (no mobile):", JSON.stringify(pubSummary, null, 2));
  if ("mobileNumber" in pubSummary || "mobileNumberMasked" in pubSummary) {
    throw new Error("Public summary leaked mobile info!");
  }

  const staffView = toStaffView(complaint);
  console.log("   Staff Projection (masked contact, no raw mobile):", JSON.stringify({
    id: staffView.id,
    mobileMasked: staffView.mobileNumberMasked,
    hasRawMobile: "mobileNumber" in staffView
  }, null, 2));

  if ("mobileNumber" in staffView) {
    throw new Error("Staff view leaked raw mobile number!");
  }

  // 4. Update status: New -> Under Review -> Assigned -> Resolved
  console.log("\n4. Updating status: Under Review...");
  const u1 = await db.complaints.updateStatus(complaint.id, {
    status: "Under Review",
    actor: "mla_staff",
    internalNote: "Assigned reviewer investigating report.",
  });
  console.log("   Status:", u1?.status);

  console.log("   Updating status: Assigned...");
  const u2 = await db.complaints.updateStatus(complaint.id, {
    status: "Assigned",
    assignedDepartment: "Municipal Administration",
    assignedTo: "MRO_Renigunta",
    actor: "reviewer",
  });
  console.log("   Status:", u2?.status);

  console.log("   Updating status: Resolved...");
  const u3 = await db.complaints.updateStatus(complaint.id, {
    status: "Resolved",
    actor: "dept_officer",
    internalNote: "Pipeline repair completed.",
  });
  console.log("   Status:", u3?.status);
  console.log("   Audit Timeline:", JSON.stringify(u3?.auditLog, null, 2));

  // 5. Query live complaints
  console.log("\n5. Querying live complaints...");
  const liveComplaints = await db.complaints.listLive();
  console.log("   Live Count:", liveComplaints.length);
  const sampleComplaints = await db.complaints.listSample();
  console.log("   Sample Count:", sampleComplaints.length);

  // 6. Verify Stats
  console.log("\n6. Querying dynamic DB stats...");
  const stats = await db.complaints.getStats();
  console.log("   Stats:", JSON.stringify(stats, null, 2));

  console.log("\n==================================================");
  console.log("   ✓ ALL DATABASE PERSISTENCE TESTS PASSED!");
  console.log("==================================================");
}

testDatabase().catch((e) => {
  console.error("Test error:", e);
  process.exit(1);
});
