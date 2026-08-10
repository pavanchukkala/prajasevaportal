import { db, toPublicSummary, toStaffView } from "../src/lib/db";
import { isRouteAllowedForRole, SessionUser } from "../src/lib/auth";

async function runRbacAndSubportalTests() {
  console.log("=== 🧪 Running Sub-Portals & RBAC Verification Suite ===");

  // 1. Health check
  const health = await db.getHealth();
  console.log("1. Health Output:", JSON.stringify(health, null, 2));
  if (health.provider !== "sqlite_file" || !health.connected) {
    throw new Error("❌ Health check failed!");
  }
  console.log("✅ Health check verified (sqlite_file adapter connected).");

  // 2. Query complaints
  const all = await db.complaints.list();
  const live = await db.complaints.listLive();
  const sample = await db.complaints.listSample();

  console.log(`2. Database Complaints Count — Total: ${all.length}, Live: ${live.length}, Sample: ${sample.length}`);
  if (all.length === 0) {
    throw new Error("❌ No complaint records found!");
  }
  console.log("✅ Complaint query verified.");

  // 3. Test RBAC Route Enforcement Matrix
  console.log("3. Testing Role-Based Access Control (RBAC) Route Matrix:");
  const testCases: { role: SessionUser["role"]; path: string; expected: boolean }[] = [
    // Administrator
    { role: "administrator", path: "/admin/settings", expected: true },
    { role: "administrator", path: "/reviewer/cases", expected: true },
    { role: "administrator", path: "/department/workspace", expected: true },
    { role: "administrator", path: "/mla/dashboard", expected: true },

    // Case Reviewer
    { role: "reviewer", path: "/reviewer/cases", expected: true },
    { role: "reviewer", path: "/mla/dashboard", expected: true },
    { role: "reviewer", path: "/admin/settings", expected: false },
    { role: "reviewer", path: "/department/workspace", expected: false },

    // Department Officer
    { role: "department_officer", path: "/department/workspace", expected: true },
    { role: "department_officer", path: "/mla/dashboard", expected: false },
    { role: "department_officer", path: "/reviewer/cases", expected: false },
    { role: "department_officer", path: "/admin/settings", expected: false },

    // MLA Staff
    { role: "mla_staff", path: "/mla/dashboard", expected: true },
    { role: "mla_staff", path: "/reviewer/cases", expected: false },
    { role: "mla_staff", path: "/department/workspace", expected: false },
    { role: "mla_staff", path: "/admin/settings", expected: false },
  ];

  for (const tc of testCases) {
    const allowed = isRouteAllowedForRole(tc.role, tc.path);
    if (allowed !== tc.expected) {
      throw new Error(`❌ RBAC Violation! Role '${tc.role}' on path '${tc.path}' got ${allowed}, expected ${tc.expected}`);
    }
  }
  console.log("✅ All 16 RBAC route authorization assertions passed!");

  // 4. Privacy & Masking Verification
  console.log("4. Testing Privacy Guardrails (Public vs Staff Views):");
  const testRecord = all[0];
  const publicView: any = toPublicSummary(testRecord);
  const staffView: any = toStaffView(testRecord);

  if ("mobileNumber" in publicView || "internalNotes" in publicView) {
    throw new Error("❌ Security violation: Public view exposed confidential fields!");
  }
  if ("mobileNumber" in staffView) {
    throw new Error("❌ Security violation: Staff view exposed raw mobile number!");
  }
  console.log("✅ Privacy projections verified — raw mobile and internal notes stripped from public payloads.");

  // 5. Test Status Update Action & Audit Trail
  console.log("5. Testing Reviewer & Department Status Update Actions:");
  const testId = sample[0]?.id ?? all[0].id;
  const updated = await db.complaints.updateStatus(testId, {
    status: "Under Review",
    assignedDepartment: "Panchayat Raj",
    internalNote: "Automated test triage verification note.",
    actor: "test_reviewer",
  });

  if (!updated || updated.status !== "Under Review" || updated.assignedDepartment !== "Panchayat Raj") {
    throw new Error("❌ Status update action failed!");
  }

  const lastAudit = updated.auditLog?.[updated.auditLog.length - 1];
  console.log("Updated Audit Entry:", lastAudit);
  if (!lastAudit || lastAudit.actor !== "test_reviewer") {
    throw new Error("❌ Audit trail entry missing or incorrect!");
  }
  console.log("✅ Status update action and audit trail verified!");

  console.log("\n🎉 ALL SUB-PORTALS & RBAC VERIFICATION CHECKS PASSED SUCCESSFULLY!");
}

runRbacAndSubportalTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
