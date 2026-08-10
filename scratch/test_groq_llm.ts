import { analyzeComplaint } from "../src/lib/ai/analyzer";

async function testRapeSafetyClassification() {
  console.log("🧠 Testing Safety & Constitutional Legal AI Engine for: 'rapped by a boy in my village'");
  
  const result = await analyzeComplaint({
    description: "rapped by a boy in my village",
    mandal: "Srikalahasti",
    village: "Ward 12",
    hasImages: false,
    hasAudio: false,
  });

  console.log("\n✅ AI Engine Output:");
  console.log(JSON.stringify(result, null, 2));

  if (result.urgency !== "Critical" && result.urgency !== "Emergency") {
    throw new Error(`❌ Urgency classification failed! Expected Critical/Emergency but got: ${result.urgency}`);
  }

  if (!result.safetyEscalationRequired) {
    throw new Error("❌ Safety escalation required should be TRUE!");
  }

  console.log("\n🎉 CONSTITUTIONAL & SAFETY CLASSIFICATION TEST PASSED 100%!");
}

testRapeSafetyClassification().catch(console.error);
