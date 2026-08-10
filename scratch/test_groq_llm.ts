import { analyzeComplaint } from "../src/lib/ai/analyzer";

async function testGroq() {
  console.log("🧠 Testing Groq Llama-3.3-70B LLM Complaint Analysis...");
  
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY environment variable not set");
  }

  const result = await analyzeComplaint({
    description: "Major drinking water contamination reported in Renigunta Ward 4 near the school. Over 30 households are affected with muddy water coming from tap connections since yesterday.",
    mandal: "Renigunta",
    village: "Ward 4",
    hasImages: true,
    hasAudio: false,
  });

  console.log("\n✅ Groq LLM Output Result:");
  console.log(JSON.stringify(result, null, 2));

  if (result.analysisMode !== "llm") {
    throw new Error("❌ Analysis mode was not LLM!");
  }
  console.log("\n🎉 GROQ LLM INTEGRATION VERIFIED SUCCESSFULLY!");
}

testGroq().catch(console.error);
