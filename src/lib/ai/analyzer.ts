export interface ComplaintPayload {
  description: string;
  mandal: string;
  village?: string;
  department?: string;
  hasAudio: boolean;
  hasImages: boolean;
}

export interface AIAnalysisResult {
  title: string;
  category: string;
  department: string;
  urgency: "Routine" | "Priority" | "High" | "Emergency";
  credibilityBand: "Low" | "Medium" | "High" | "Insufficient Information";
  confidenceScore: number;
  missingInformation: string[];
  recommendedAction: string;
  legalDisclaimer: string;
}

/**
 * MOCK LLM ANALYZER
 * In production, this would make an API call to a secure LLM endpoint (e.g., Gemini).
 * For the prototype, we are structurally defining how the LLM should parse unstructured data.
 */
export async function analyzeComplaint(payload: ComplaintPayload): Promise<AIAnalysisResult> {
  // Simulate network/LLM processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Determine mock urgency based on keywords
  const desc = payload.description.toLowerCase();
  let urgency: AIAnalysisResult["urgency"] = "Routine";
  if (desc.includes("bribe") || desc.includes("corruption") || desc.includes("leak") || desc.includes("accident")) {
    urgency = "High";
  } else if (desc.includes("delay") || desc.includes("pending")) {
    urgency = "Priority";
  }

  // Calculate a mock confidence score based on evidence provided
  let baseConfidence = 60;
  if (payload.hasImages) baseConfidence += 15;
  if (payload.hasAudio) baseConfidence += 10;
  if (payload.village) baseConfidence += 5;

  return {
    title: `Issue reported in ${payload.mandal} ${payload.village ? `(${payload.village})` : ""}`,
    category: "General Grievance",
    department: payload.department || "To Be Determined",
    urgency,
    credibilityBand: baseConfidence > 80 ? "High" : baseConfidence > 65 ? "Medium" : "Low",
    confidenceScore: Math.min(baseConfidence, 98), // Cap at 98%
    missingInformation: [
      !payload.village ? "Exact village/ward location missing" : "",
      !payload.hasImages ? "Photographic evidence missing" : "",
    ].filter(Boolean),
    recommendedAction: "Forward to Mandal Revenue Officer for preliminary verification.",
    
    // CRITICAL REQUIREMENT: This disclaimer must always be present and visible on UI.
    legalDisclaimer: "AI-generated preliminary assessment. This is not a legal finding, factual determination, finding of guilt, or replacement for official investigation."
  };
}
