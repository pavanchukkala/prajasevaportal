// ============================================================
// AI Complaint Analyzer
// Uses Gemini API if GOOGLE_AI_API_KEY is configured.
// Falls back to structured local analysis with honest labeling.
// ============================================================

export interface ComplaintPayload {
  description: string;
  mandal: string;
  village?: string;
  department?: string;
  hasAudio: boolean;
  hasImages: boolean;
  language?: string;
}

export interface AIAnalysisResult {
  title: string;
  category: string;
  subcategory?: string;
  department: string;
  urgency: "Routine" | "Priority" | "High" | "Emergency";
  evidenceCompleteness: "Sufficient" | "Partial" | "Insufficient" | "None provided";
  credibilityBand: "High preliminary confidence" | "Medium preliminary confidence" | "Low preliminary confidence" | "Insufficient information to assess";
  confidenceScore: number;
  missingInformation: string[];
  duplicateLikelihood?: string;
  recommendedAction: string;
  humanReviewRequired: boolean;
  analysisMode: "local_fallback" | "llm";
  legalDisclaimer: string;
}

const LEGAL_DISCLAIMER =
  "AI-generated preliminary assessment for human review. This is not a legal finding, factual determination, finding of guilt, or replacement for official investigation or judicial process.";

// ── Local rule-based fallback ────────────────────────────────────────────────
function localAnalysis(payload: ComplaintPayload): AIAnalysisResult {
  const desc = payload.description.toLowerCase();

  // Urgency detection
  let urgency: AIAnalysisResult["urgency"] = "Routine";
  if (
    desc.includes("accident") ||
    desc.includes("emergency") ||
    desc.includes("life") ||
    desc.includes("injury") ||
    desc.includes("fire") ||
    desc.includes("flood") ||
    desc.includes("ప్రాణం") ||
    desc.includes("అగ్ని")
  ) {
    urgency = "Emergency";
  } else if (
    desc.includes("bribe") ||
    desc.includes("corruption") ||
    desc.includes("leak") ||
    desc.includes("burst") ||
    desc.includes("contamination") ||
    desc.includes("లంచం") ||
    desc.includes("అవినీతి")
  ) {
    urgency = "High";
  } else if (
    desc.includes("delay") ||
    desc.includes("pending") ||
    desc.includes("waiting") ||
    desc.includes("ఆలస్యం") ||
    desc.includes("నిరీక్షిస్తున్నారు")
  ) {
    urgency = "Priority";
  }

  // Category detection
  let category = "General Grievance";
  let subcategory = "Public Service Delivery";
  if (desc.includes("road") || desc.includes("pothole") || desc.includes("రోడ్డు")) {
    category = "Infrastructure";
    subcategory = "Road Maintenance";
  } else if (desc.includes("water") || desc.includes("pipeline") || desc.includes("నీరు")) {
    category = "Infrastructure — Water Supply";
    subcategory = "Water Pipeline / Supply";
  } else if (desc.includes("pension") || desc.includes("certificate") || desc.includes("పింఛను")) {
    category = "Welfare Access";
    subcategory = "Pension / Certificate Delay";
  } else if (desc.includes("electricity") || desc.includes("power") || desc.includes("విద్యుత్")) {
    category = "Infrastructure — Electricity";
    subcategory = "Power Supply Issue";
  } else if (
    desc.includes("bribe") || desc.includes("payment") || desc.includes("corruption") ||
    desc.includes("లంచం")
  ) {
    category = "Alleged Misconduct — Financial Irregularity";
    subcategory = "Alleged Bribery / Irregular Payment";
  } else if (desc.includes("school") || desc.includes("teacher") || desc.includes("పాఠశాల")) {
    category = "Education";
    subcategory = "School Service Delivery";
  } else if (desc.includes("ration") || desc.includes("pds") || desc.includes("rice")) {
    category = "Civil Supplies";
    subcategory = "Ration / PDS Issue";
  }

  // Department detection
  let department = payload.department || "To Be Determined";
  if (!payload.department) {
    if (category.includes("Infrastructure — Water") || category.includes("Municipal")) {
      department = "Municipal Administration";
    } else if (category.includes("Road")) {
      department = "Roads & Buildings";
    } else if (category.includes("Welfare") || category.includes("pension")) {
      department = "Revenue";
    } else if (category.includes("Electricity")) {
      department = "Electricity (APSPDCL)";
    } else if (category.includes("Misconduct")) {
      department = "Registration & Stamps";
    } else if (category.includes("Education")) {
      department = "Education";
    } else if (category.includes("Civil Supplies")) {
      department = "Civil Supplies";
    }
  }

  // Credibility / confidence
  let baseConfidence = 55;
  if (payload.hasImages) baseConfidence += 18;
  if (payload.hasAudio) baseConfidence += 10;
  if (payload.village) baseConfidence += 7;
  if (payload.description.length > 200) baseConfidence += 5;
  if (payload.description.length > 400) baseConfidence += 3;
  // Reduce if sounds vague or unverifiable
  if (desc.includes("someone told") || desc.includes("i heard") || desc.includes("allegedly")) {
    baseConfidence -= 10;
  }

  const confidenceScore = Math.min(Math.max(baseConfidence, 30), 95);

  const credibilityBand: AIAnalysisResult["credibilityBand"] =
    confidenceScore >= 80
      ? "High preliminary confidence"
      : confidenceScore >= 60
      ? "Medium preliminary confidence"
      : "Low preliminary confidence";

  const evidenceCompleteness: AIAnalysisResult["evidenceCompleteness"] =
    payload.hasImages && payload.hasAudio
      ? "Sufficient"
      : payload.hasImages || payload.hasAudio || payload.village
      ? "Partial"
      : "Insufficient";

  const missingInformation: string[] = [];
  if (!payload.village) missingInformation.push("Exact village or ward location not provided");
  if (!payload.hasImages) missingInformation.push("No photographic or video evidence attached");
  if (!payload.hasAudio) missingInformation.push("No audio recording provided");
  if (payload.description.length < 100) {
    missingInformation.push("Description is brief — more detail would help route this accurately");
  }

  return {
    title: `Issue reported in ${payload.mandal}${payload.village ? ` — ${payload.village}` : ""}`,
    category,
    subcategory,
    department,
    urgency,
    evidenceCompleteness,
    credibilityBand,
    confidenceScore,
    missingInformation,
    duplicateLikelihood: "Unknown — insufficient data for pattern matching in local mode",
    recommendedAction: `Forward to ${department} officer in ${payload.mandal} Mandal for preliminary verification. Human review required before any action.`,
    humanReviewRequired: true,
    analysisMode: "local_fallback",
    legalDisclaimer: LEGAL_DISCLAIMER,
  };
}

// ── Gemini LLM integration (if API key is available) ─────────────────────────
async function llmAnalysis(payload: ComplaintPayload): Promise<AIAnalysisResult> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error("No API key configured");

  const prompt = `You are a senior civic-technology analyst for Srikalahasti Assembly Constituency (No. 168), Tirupati District, Andhra Pradesh, India.

Analyze this citizen complaint and return a structured JSON assessment.

COMPLAINT:
Description: ${payload.description}
Mandal: ${payload.mandal}
Village/Ward: ${payload.village ?? "Not specified"}
Department (if known): ${payload.department ?? "Not specified"}
Has photographic evidence: ${payload.hasImages}
Has audio evidence: ${payload.hasAudio}

Return ONLY a JSON object with these exact fields:
{
  "title": "Neutral descriptive title (max 12 words)",
  "category": "Main issue category",
  "subcategory": "Specific sub-type",
  "department": "Most likely responsible government department",
  "urgency": "Routine|Priority|High|Emergency",
  "evidenceCompleteness": "Sufficient|Partial|Insufficient|None provided",
  "credibilityBand": "High preliminary confidence|Medium preliminary confidence|Low preliminary confidence|Insufficient information to assess",
  "confidenceScore": 60,
  "missingInformation": ["item1", "item2"],
  "duplicateLikelihood": "Low|Medium|High|Unknown",
  "recommendedAction": "Specific recommended next human action",
  "humanReviewRequired": true
}

IMPORTANT RULES:
- Never use words: genuine, fake, guilty, proven, confirmed, corrupt (as accusation), criminal
- Use "alleged" or "reported" for unverified claims
- credibilityBand must use one of the exact strings above
- confidenceScore must be between 30 and 95
- humanReviewRequired must always be true`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Could not parse Gemini response");

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    ...parsed,
    analysisMode: "llm" as const,
    legalDisclaimer: LEGAL_DISCLAIMER,
  };
}

// ── Public entry point ────────────────────────────────────────────────────────
export async function analyzeComplaint(payload: ComplaintPayload): Promise<AIAnalysisResult> {
  // Try LLM first if configured
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (apiKey) {
    try {
      return await llmAnalysis(payload);
    } catch (err) {
      console.warn("[AI] LLM analysis failed, falling back to local:", err);
    }
  }
  // Always falls back to local — never pretends local result is from LLM
  return localAnalysis(payload);
}
