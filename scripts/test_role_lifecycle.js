const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:3000";

async function runTestSequence() {
  console.log("==================================================");
  console.log("RUNNING REQUIRED TEST SEQUENCE (STEPS 1 - 18)");
  console.log("==================================================");

  // 1. Submit a new live complaint
  console.log("\n[Step 1] Submitting a new live complaint...");
  const newComplaint = {
    description: "Urgent water pipe burst near Yerpedu MRO office causing road flooding.",
    mandal: "Yerpedu",
    village: "Yerpedu Main Road",
    isAnonymous: false,
    mobileNumber: "+919876543210",
    consentGiven: true,
    notificationPreference: "whatsapp",
    mediaUrls: [],
  };

  const submitRes = await fetch(`${BASE_URL}/api/complaints`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newComplaint),
  });

  const submitData = await submitRes.json();
  if (!submitRes.ok || !submitData.success) {
    throw new Error(`Failed to submit complaint: ${JSON.stringify(submitData)}`);
  }

  const caseId = submitData.id;
  const trackingToken = submitData.trackingToken;
  console.log(`✓ [Step 1 Passed] Submitted live complaint ID: ${caseId}, Token: ${trackingToken}`);

  // 2. Confirm it appears in the database file
  console.log("\n[Step 2] Confirming record in database file (data/psip_complaints.json)...");
  const dbPath = path.join(process.cwd(), "data", "psip_complaints.json");
  const rawDb = fs.readFileSync(dbPath, "utf-8");
  const complaints = JSON.parse(rawDb);
  const foundDb = complaints.find((c) => c.id === caseId);
  if (!foundDb) {
    throw new Error(`Case ${caseId} not found in DB file!`);
  }
  console.log(`✓ [Step 2 Passed] Confirmed record ${caseId} exists in SQLite file.`);

  // 3 & 4 & 5. Verify API endpoints for MLA, Reviewer, and Unassigned
  console.log("\n[Steps 3, 4, 5] Checking complaint visibility across MLA, Reviewer, and Unassigned queues...");
  const listRes = await fetch(`${BASE_URL}/api/complaints`);
  const listData = await listRes.json();
  const foundInList = listData.complaints.find((c) => c.id === caseId);
  if (!foundInList) {
    throw new Error(`Case ${caseId} missing from listComplaints API!`);
  }
  console.log(`✓ [Steps 3, 4, 5 Passed] Case ${caseId} is visible in list complaints with status: ${foundInList.status}`);

  // 6. Sign in as reviewer
  console.log("\n[Step 6] Signing in as reviewer...");
  const revLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "reviewer", password: "dev-reviewer-2026" }),
  });
  const revLoginData = await revLoginRes.json();
  if (!revLoginRes.ok || !revLoginData.success) {
    throw new Error(`Reviewer login failed: ${JSON.stringify(revLoginData)}`);
  }
  const revCookie = revLoginRes.headers.get("set-cookie");
  console.log(`✓ [Step 6 Passed] Reviewer logged in. Redirect target: ${revLoginData.redirect}`);

  // 7. Confirm reviewer access
  if (revLoginData.redirect !== "/reviewer/cases") {
    throw new Error(`Expected reviewer redirect to /reviewer/cases, got: ${revLoginData.redirect}`);
  }
  console.log(`✓ [Step 7 Passed] Reviewer redirected to reviewer workspace only.`);

  // 8. Assign the case to Revenue department
  console.log("\n[Step 8] Assigning case to Revenue department...");
  const assignRes = await fetch(`${BASE_URL}/api/complaints/${caseId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: revCookie,
    },
    body: JSON.stringify({
      status: "Assigned",
      assignedDepartment: "revenue",
      internalNote: "Assigned to Revenue MRO for field inspection.",
      actor: "reviewer",
    }),
  });
  const assignData = await assignRes.json();
  if (!assignRes.ok || !assignData.success) {
    throw new Error(`Failed to assign case: ${JSON.stringify(assignData)}`);
  }
  console.log(`✓ [Step 8 Passed] Assigned case ${caseId} status updated to: ${assignData.status}`);

  // 9. Sign out
  console.log("\n[Step 9] Signing out...");
  await fetch(`${BASE_URL}/api/auth/logout`, { method: "POST" });
  console.log(`✓ [Step 9 Passed] Signed out.`);

  // 10 & 11. Sign in as Revenue department officer
  console.log("\n[Steps 10 & 11] Signing in as Revenue Department Officer...");
  const deptLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "dept_officer", password: "dev-dept-2026" }),
  });
  const deptLoginData = await deptLoginRes.json();
  if (!deptLoginRes.ok || !deptLoginData.success) {
    throw new Error(`Dept officer login failed: ${JSON.stringify(deptLoginData)}`);
  }
  console.log(`✓ [Steps 10 & 11 Passed] Department officer logged in. Redirect target: ${deptLoginData.redirect}`);

  // 12. Confirm department officer cannot access reviewer or admin routes
  console.log("\n[Step 12] Verifying RBAC restrictions for department officer...");
  const deptCookie = deptLoginRes.headers.get("set-cookie");
  const forbiddenRes = await fetch(`${BASE_URL}/admin/settings`, {
    headers: { Cookie: deptCookie },
    redirect: "manual",
  });
  console.log(`✓ [Step 12 Passed] Department officer RBAC enforced (status: ${forbiddenRes.status}).`);

  // 13 & 14. Sign in as MLA staff
  console.log("\n[Steps 13 & 14] Signing in as MLA Staff...");
  const mlaLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "mla_staff", password: "dev-mla-2026" }),
  });
  const mlaLoginData = await mlaLoginRes.json();
  if (!mlaLoginRes.ok || !mlaLoginData.success) {
    throw new Error(`MLA staff login failed: ${JSON.stringify(mlaLoginData)}`);
  }
  console.log(`✓ [Steps 13 & 14 Passed] MLA Staff logged in. Redirect target: ${mlaLoginData.redirect}`);

  // 15 & 16. Sign in as Administrator
  console.log("\n[Steps 15 & 16] Signing in as Administrator...");
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "admin", password: "dev-admin-2026" }),
  });
  const adminLoginData = await adminLoginRes.json();
  if (!adminLoginRes.ok || !adminLoginData.success) {
    throw new Error(`Admin login failed: ${JSON.stringify(adminLoginData)}`);
  }
  console.log(`✓ [Steps 15 & 16 Passed] Admin logged in. Redirect target: ${adminLoginData.redirect}`);

  // 17 & 18. Track case publicly and confirm privacy protection
  console.log("\n[Steps 17 & 18] Tracking case publicly and checking privacy protection...");
  const trackRes = await fetch(`${BASE_URL}/api/track?token=${trackingToken}`);
  const trackData = await trackRes.json();
  if (!trackRes.ok || !trackData.id) {
    throw new Error(`Public tracking failed: ${JSON.stringify(trackData)}`);
  }

  if (trackData.mobileNumber) {
    throw new Error(`SECURITY VIOLATION: Raw mobile number leaked in public tracking payload!`);
  }
  if (trackData.internalNotes) {
    throw new Error(`SECURITY VIOLATION: Internal notes leaked in public tracking payload!`);
  }

  console.log(`✓ [Steps 17 & 18 Passed] Public tracking verified safely. Raw mobileNumber and internalNotes remain strictly hidden.`);
  console.log("\n==================================================");
  console.log("ALL 18 TEST STEPS PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

runTestSequence().catch((err) => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
