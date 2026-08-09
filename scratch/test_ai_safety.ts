import { analyzeComplaint, localAnalysis } from '../src/lib/ai/analyzer';

async function runSafetyTests() {
  console.log("==================================================");
  console.log("   PSIP AI SAFETY PRIORITIZATION TEST SUITE       ");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail: string) {
    if (condition) {
      console.log(`✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}: ${detail}`);
      failed++;
    }
  }

  // TEST 1: Rape complaint with complete fields
  console.log("\n--- TEST 1: Rape complaint with complete fields ---");
  const test1 = localAnalysis({
    description: "A 24-year-old woman was sexually assaulted and raped near Srikalahasti RTC bus stand last night. She suffered serious injuries and is currently at the local government hospital.",
    mandal: "Srikalahasti",
    village: "Ward 8",
    department: "Police",
    hasImages: true,
    hasAudio: true,
  });
  console.log("  Output:", JSON.stringify(test1, null, 2));

  assert(
    test1.safetyCategory === "Sexual Violence / Assault",
    "Test 1 Safety Category",
    `Expected "Sexual Violence / Assault", got "${test1.safetyCategory}"`
  );
  assert(
    test1.urgency === "Critical" || test1.urgency === "Emergency",
    "Test 1 Urgency",
    `Expected "Critical" or "Emergency", got "${test1.urgency}"`
  );
  assert(
    test1.safetyEscalationRequired === true,
    "Test 1 Escalation Flag",
    "Expected safetyEscalationRequired: true"
  );
  assert(
    test1.humanReviewRequired === true,
    "Test 1 Human Review Flag",
    "Expected humanReviewRequired: true"
  );

  // TEST 2: Rape complaint with almost no fields (INSUFFICIENT FIELDS SHOULD NOT DOWNGRADE URGENCY!)
  console.log("\n--- TEST 2: Rape complaint with almost no fields ---");
  const test2 = localAnalysis({
    description: "rape happened last night",
    mandal: "Yerpedu",
    // No village, no audio, no images, brief description
  });
  console.log("  Output:", JSON.stringify(test2, null, 2));

  assert(
    test2.safetyCategory === "Sexual Violence / Assault",
    "Test 2 Safety Category",
    `Expected "Sexual Violence / Assault", got "${test2.safetyCategory}"`
  );
  assert(
    test2.urgency === "Critical" || test2.urgency === "Emergency",
    "Test 2 Urgency (STILL CRITICAL/EMERGENCY!)",
    `Expected "Critical" or "Emergency" despite missing optional fields, got "${test2.urgency}"`
  );
  assert(
    test2.evidenceCompleteness === "Insufficient",
    "Test 2 Evidence Completeness",
    `Expected "Insufficient", got "${test2.evidenceCompleteness}"`
  );
  assert(
    test2.safetyEscalationRequired === true,
    "Test 2 Escalation Flag",
    "Expected safetyEscalationRequired: true"
  );

  // TEST 3: Child-safety complaint
  console.log("\n--- TEST 3: Child-safety complaint ---");
  const test3 = localAnalysis({
    description: "An 8-year-old child was reported missing from outside the ZPHS School. Witnesses suspect child kidnapping.",
    mandal: "Thottambedu",
    village: "Thottambedu Central",
    hasImages: false,
    hasAudio: false,
  });
  console.log("  Output:", JSON.stringify(test3, null, 2));

  assert(
    test3.safetyCategory === "Child Safety / Abuse" || test3.safetyCategory === "Threat to Life / Kidnapping",
    "Test 3 Safety Category",
    `Expected Child Safety or Kidnapping, got "${test3.safetyCategory}"`
  );
  assert(
    test3.urgency === "Critical" || test3.urgency === "Emergency",
    "Test 3 Urgency",
    `Expected "Critical" or "Emergency", got "${test3.urgency}"`
  );
  assert(
    test3.safetyEscalationRequired === true,
    "Test 3 Escalation Flag",
    "Expected safetyEscalationRequired: true"
  );

  // TEST 4: Road complaint
  console.log("\n--- TEST 4: Road complaint ---");
  const test4 = localAnalysis({
    description: "Severe potholes on the main road between Renigunta and Srikalahasti causing daily traffic delays.",
    mandal: "Renigunta",
    village: "Highway junction",
    hasImages: true,
  });
  console.log("  Output:", JSON.stringify(test4, null, 2));

  assert(
    test4.safetyCategory === "None",
    "Test 4 Safety Category (None)",
    `Expected "None", got "${test4.safetyCategory}"`
  );
  assert(
    test4.urgency === "Priority" || test4.urgency === "Routine",
    "Test 4 Urgency",
    `Expected "Priority" or "Routine", got "${test4.urgency}"`
  );
  assert(
    test4.safetyEscalationRequired === false,
    "Test 4 Escalation Flag",
    "Expected safetyEscalationRequired: false"
  );

  // TEST 5: Pension delay
  console.log("\n--- TEST 5: Pension delay ---");
  const test5 = localAnalysis({
    description: "Old age pension for 15 senior citizens in Yerpedu has been pending for over 45 days.",
    mandal: "Yerpedu",
    village: "Yerpedu South",
  });
  console.log("  Output:", JSON.stringify(test5, null, 2));

  assert(
    test5.safetyCategory === "None",
    "Test 5 Safety Category (None)",
    `Expected "None", got "${test5.safetyCategory}"`
  );
  assert(
    test5.urgency === "Priority",
    "Test 5 Urgency",
    `Expected "Priority", got "${test5.urgency}"`
  );

  // TEST 6: Water emergency
  console.log("\n--- TEST 6: Water emergency ---");
  const test6 = localAnalysis({
    description: "A main drinking water pipeline burst flooding 30 houses near Ward 12 junction in Srikalahasti town.",
    mandal: "Srikalahasti",
    village: "Ward 12",
    hasImages: true,
  });
  console.log("  Output:", JSON.stringify(test6, null, 2));

  assert(
    test6.urgency === "Emergency" || test6.urgency === "High",
    "Test 6 Urgency",
    `Expected "Emergency" or "High", got "${test6.urgency}"`
  );

  // TEST 7: False keyword without actual safety context
  console.log("\n--- TEST 7: False keyword without actual safety context ---");
  const test7 = localAnalysis({
    description: "Our village mandal organized a successful awareness program on child safety laws and women empowerment.",
    mandal: "Thottambedu",
    village: "Main Village",
  });
  console.log("  Output:", JSON.stringify(test7, null, 2));

  assert(
    test7.safetyCategory === "None",
    "Test 7 False Keyword Detection (None)",
    `Expected "None" for awareness program context, got "${test7.safetyCategory}"`
  );
  assert(
    test7.safetyEscalationRequired === false,
    "Test 7 Escalation Flag (false)",
    "Expected safetyEscalationRequired: false"
  );

  console.log("\n==================================================");
  console.log(`   TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runSafetyTests().catch((e) => {
  console.error("Test execution error:", e);
  process.exit(1);
});
