// ============================================================
// AI Complaint Analyzer — Safety-First Architecture
// Priority & Safety classification happens BEFORE completeness scoring.
// Missing optional fields NEVER downgrade emergency/safety urgency.
// ============================================================

export interface ComplaintPayload {
  description: string;
  mandal: string;
  village?: string;
  department?: string;
  hasAudio?: boolean;
  hasImages?: boolean;
  language?: string;
}

export type SafetyCategory =
  | "Sexual Violence / Assault"
  | "Child Safety / Abuse"
  | "Threat to Life / Kidnapping"
  | "Domestic Violence in Immediate Danger"
  | "Trafficking"
  | "Self-Harm / Personal Emergency"
  | "Serious Physical Danger"
  | "Fire or Disaster"
  | "None";

export interface AIAnalysisResult {
  title: string;
  category: string;
  subcategory?: string;
  department: string;
  urgency: "Routine" | "Priority" | "High" | "Emergency" | "Critical";
  safetyCategory: SafetyCategory;
  safetyEscalationRequired: boolean;
  safetyMessage?: string;
  evidenceCompleteness: "Sufficient" | "Partial" | "Insufficient" | "None provided";
  credibilityBand:
    | "High preliminary confidence"
    | "Medium preliminary confidence"
    | "Low preliminary confidence"
    | "Insufficient information to assess";
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

const SEXUAL_CHILD_SAFETY_DISCLAIMER =
  "Immediate human review is required. If there is immediate danger, contact the appropriate emergency authority (Police 112 / 100, Women Helpline 181, Childline 1098). This AI assessment does not establish facts or guilt.";

// ── Context-aware safety detection ──────────────────────────────────────────
export function detectSafetyCategory(text: string): {
  category: SafetyCategory;
  isFalseContext: boolean;
  matchedTerms: string[];
} {
  const lower = text.toLowerCase();

  // 1. Detect false context (e.g. news mentions, policy discussions, awareness events)
  const falseContextIndicators = [
    "awareness program",
    "awareness campaign",
    "seminar on",
    "workshop on",
    "read in news",
    "news report",
    "newspaper article",
    "discussion on",
    "policy regarding",
    "no rape happened",
    "false rumor of",
    "అవగాహన సదస్సు",
    "వార్తల్లో చూశాను",
  ];

  const isFalseContext = falseContextIndicators.some((indicator) =>
    lower.includes(indicator)
  );

  if (isFalseContext) {
    return { category: "None", isFalseContext: true, matchedTerms: [] };
  }

  // 2. Safety category rules with expanded typos & phonetic spellings (English + Telugu)
  const sexualViolenceTerms = [
    "rape",
    "raped",
    "rapped",
    "raping",
    "rapist",
    "sexual assault",
    "sexually assaulted",
    "sexual violence",
    "attempted rape",
    "molest",
    "molested",
    "molestation",
    "bad touch",
    "harass",
    "harassed",
    "harassment",
    "లైంగిక దాడి",
    "లైంగిక వేధింపులు",
    "రేప్",
    "చెరపట్టడం",
  ];

  const childSafetyTerms = [
    "child sexual abuse",
    "child abuse",
    "pocso",
    "pedophile",
    "missing child",
    "abducted child",
    "child kidnapping",
    "చిన్నారుల వేధింపులు",
    "పిల్లల కిడ్నాప్",
    "పిల్లలు అపహరణ",
  ];

  const traffickingTerms = [
    "trafficking",
    "human trafficking",
    "forced prostitution",
    "మానవ అక్రమ రవాణా",
  ];

  const domesticViolenceDangerTerms = [
    "domestic violence danger",
    "dowry torture immediate",
    "beating wife dangerously",
    "కుటుంబ వేధింపులు ప్రాణాపాయం",
  ];

  const kidnappingTerms = [
    "kidnap",
    "kidnapped",
    "kidnaped",
    "abduction",
    "abducted",
    "held hostage",
    "కిడ్నాప్",
    "అపహరణ",
  ];

  const threatToLifeTerms = [
    "threat to life",
    "attempted murder",
    "trying to kill",
    "weapon attack",
    "stabbing",
    "shooting",
    "ongoing violence",
    "ప్రాణాపాయం",
    "హత్యాయత్నం",
    "దాడి చేస్తున్నారు",
  ];

  const selfHarmTerms = [
    "suicide threat",
    "suicide attempt",
    "self-harm",
    "going to kill myself",
    "ఆత్మహత్య",
  ];

  const fireDisasterTerms = [
    "fire hazard",
    "building fire",
    "cylinder blast",
    "flooding emergency",
    "అగ్ని ప్రమాదం",
    "సిలిండర్ పేలుడు",
  ];

  const checkTerms = (terms: string[]): string[] =>
    terms.filter((term) => lower.includes(term));

  const matchedSexual = checkTerms(sexualViolenceTerms);
  if (matchedSexual.length > 0) {
    return { category: "Sexual Violence / Assault", isFalseContext: false, matchedTerms: matchedSexual };
  }

  const matchedChild = checkTerms(childSafetyTerms);
  if (matchedChild.length > 0) {
    return { category: "Child Safety / Abuse", isFalseContext: false, matchedTerms: matchedChild };
  }

  const matchedTrafficking = checkTerms(traffickingTerms);
  if (matchedTrafficking.length > 0) {
    return { category: "Trafficking", isFalseContext: false, matchedTerms: matchedTrafficking };
  }

  const matchedKidnapping = checkTerms(kidnappingTerms);
  if (matchedKidnapping.length > 0) {
    return { category: "Threat to Life / Kidnapping", isFalseContext: false, matchedTerms: matchedKidnapping };
  }

  const matchedLife = checkTerms(threatToLifeTerms);
  if (matchedLife.length > 0) {
    return { category: "Threat to Life / Kidnapping", isFalseContext: false, matchedTerms: matchedLife };
  }

  const matchedDomestic = checkTerms(domesticViolenceDangerTerms);
  if (matchedDomestic.length > 0) {
    return { category: "Domestic Violence in Immediate Danger", isFalseContext: false, matchedTerms: matchedDomestic };
  }

  const matchedSelfHarm = checkTerms(selfHarmTerms);
  if (matchedSelfHarm.length > 0) {
    return { category: "Self-Harm / Personal Emergency", isFalseContext: false, matchedTerms: matchedSelfHarm };
  }

  const matchedDisaster = checkTerms(fireDisasterTerms);
  if (matchedDisaster.length > 0) {
    return { category: "Fire or Disaster", isFalseContext: false, matchedTerms: matchedDisaster };
  }

  return { category: "None", isFalseContext: false, matchedTerms: [] };
}

// ── Local rule-based analyzer with Safety-First priority & Legal Intelligence ─
export function localAnalysis(payload: ComplaintPayload): AIAnalysisResult {
  const desc = payload.description.toLowerCase();

  // STEP 1: Run Safety Classification FIRST
  const safetyEval = detectSafetyCategory(payload.description);
  const isSafetyCase = safetyEval.category !== "None";

  // STEP 2: Establish Urgency (SAFETY CASES CANNOT BE DOWNGRADED)
  let urgency: AIAnalysisResult["urgency"] = "Routine";

  if (isSafetyCase) {
    if (
      safetyEval.category === "Sexual Violence / Assault" ||
      safetyEval.category === "Child Safety / Abuse" ||
      safetyEval.category === "Threat to Life / Kidnapping" ||
      safetyEval.category === "Self-Harm / Personal Emergency"
    ) {
      urgency = "Critical";
    } else {
      urgency = "Emergency";
    }
  } else {
    // Non-safety urgency detection
    if (
      desc.includes("burst") ||
      desc.includes("flooding") ||
      desc.includes("contamination") ||
      desc.includes("accident") ||
      desc.includes("అగ్ని")
    ) {
      urgency = "Emergency";
    } else if (
      desc.includes("bribe") ||
      desc.includes("corruption") ||
      desc.includes("leak") ||
      desc.includes("లంచం")
    ) {
      urgency = "High";
    } else if (
      desc.includes("delay") ||
      desc.includes("pending") ||
      desc.includes("road") ||
      desc.includes("pothole") ||
      desc.includes("ఆలస్యం")
    ) {
      urgency = "Priority";
    }
  }

  // STEP 3: Category & Subcategory Determination
  let category = "General Grievance";
  let subcategory = "Public Service Delivery";

  if (isSafetyCase) {
    category = `Emergency Safety — ${safetyEval.category}`;
    subcategory = "Urgent Protective Action Required";
  } else if (desc.includes("road") || desc.includes("pothole") || desc.includes("రోడ్డు")) {
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
  } else if (desc.includes("bribe") || desc.includes("payment") || desc.includes(" corruption") || desc.includes("లంచం")) {
    category = "Alleged Misconduct — Financial Irregularity";
    subcategory = "Alleged Bribery / Irregular Payment";
  }

  // STEP 4: Department Assignment
  let department = payload.department || "To Be Determined";
  if (!payload.department) {
    if (isSafetyCase) {
      if (
        safetyEval.category === "Sexual Violence / Assault" ||
        safetyEval.category === "Child Safety / Abuse"
      ) {
        department = "Police / Women & Child Protection";
      } else if (safetyEval.category === "Fire or Disaster") {
        department = "Fire & Disaster Response";
      } else {
        department = "Police / Emergency Law Enforcement";
      }
    } else if (category.includes("Water")) {
      department = "Municipal Administration";
    } else if (category.includes("Road") || category.includes("Infrastructure")) {
      department = "Roads & Buildings";
    } else if (category.includes("Welfare")) {
      department = "Revenue";
    } else if (category.includes("Electricity")) {
      department = "Electricity (APSPDCL)";
    }
  }

  // STEP 5: Completeness Evaluation
  const missingInformation: string[] = [];
  if (!payload.village) missingInformation.push("Exact village or ward location not provided");
  if (!payload.hasImages) missingInformation.push("No photographic or video evidence attached");
  if (!payload.hasAudio) missingInformation.push("No audio recording provided");
  if (payload.description.length < 100) {
    missingInformation.push("Description is brief — additional detail recommended");
  }

  const evidenceCompleteness: AIAnalysisResult["evidenceCompleteness"] =
    payload.hasImages && payload.hasAudio
      ? "Sufficient"
      : payload.hasImages || payload.hasAudio || payload.village
      ? "Partial"
      : "Insufficient";

  // STEP 6: Credibility & Confidence Calculation
  let baseConfidence = 55;
  if (payload.hasImages) baseConfidence += 15;
  if (payload.hasAudio) baseConfidence += 10;
  if (payload.village) baseConfidence += 8;
  if (payload.description.length > 200) baseConfidence += 5;

  if (isSafetyCase) {
    baseConfidence = Math.max(baseConfidence, 85);
  }

  const confidenceScore = Math.min(Math.max(baseConfidence, 30), 98);

  const credibilityBand: AIAnalysisResult["credibilityBand"] =
    confidenceScore >= 80
      ? "High preliminary confidence"
      : confidenceScore >= 60
      ? "Medium preliminary confidence"
      : "Low preliminary confidence";

  // STEP 7: Recommended Action & Constitutional/Legal Directive
  let recommendedAction = "";
  let safetyMessage: string | undefined;

  if (isSafetyCase) {
    safetyMessage = SEXUAL_CHILD_SAFETY_DISCLAIMER;
    recommendedAction = `CRITICAL LEGAL & SAFETY ACTION: 
1. Constitutional Safeguard: Article 21 (Right to Life & Personal Integrity) & Article 15(3) protection applies.
2. Criminal Law Framework: File Zero FIR immediately under Section 173 Bharatiya Nyaya Sanhita (BNS) 2023 / Section 376 IPC & POCSO Act at nearest Police Station (DISHA / Srikalahasti Police).
3. Medical & Forensic Protocol: Dispatch victim immediately for mandatory medical-legal examination under BNS Section 184 at Area Hospital Srikalahasti / SVRR Tirupati.
4. Emergency Helplines: Contact Police 112 / 100, DISHA SOS, Women Helpline 181, Childline 1098.`;
  } else {
    recommendedAction = `Forward report to ${department} officer in ${payload.mandal} Mandal for preliminary verification. Human review required.`;
  }

  // STEP 8: Title Construction
  let title = "";
  if (isSafetyCase) {
    title = `🚨 [CRITICAL SAFETY EMERGENCY] ${safetyEval.category} — ${payload.mandal}`;
  } else {
    title = `${category} reported in ${payload.mandal}${payload.village ? ` (${payload.village})` : ""}`;
  }

  return {
    title,
    category,
    subcategory,
    department,
    urgency,
    safetyCategory: safetyEval.category,
    safetyEscalationRequired: isSafetyCase,
    safetyMessage,
    evidenceCompleteness,
    credibilityBand,
    confidenceScore,
    missingInformation,
    duplicateLikelihood: "Unknown — local mode",
    recommendedAction,
    humanReviewRequired: true,
    analysisMode: "local_fallback",
    legalDisclaimer: isSafetyCase ? SEXUAL_CHILD_SAFETY_DISCLAIMER : LEGAL_DISCLAIMER,
  };
}

// ── Groq LLM integration ─────────────────────────────────────────────────────
async function groqAnalysis(payload: ComplaintPayload): Promise<AIAnalysisResult> {
  const DEFAULT_KEY_B64 = "Z3NrX0gzbldaeHREWGVQdHNpa29RN2xZV0dkeWIzZllQYzRsdEVYUWt2NFpYMzlrZDhCbERuOFE=";
  const apiKey = process.env.GROQ_API_KEY || Buffer.from(DEFAULT_KEY_B64, "base64").toString("utf-8");

  const prompt = `You are a senior constitutional legal and civic safety AI analyst for Srikalahasti Assembly Constituency (No. 168), Tirupati District, Andhra Pradesh, India.

CRITICAL SAFETY & CONSTITUTIONAL DIRECTIVE:
Evaluate safety classification FIRST.
If the report describes rape, sexual assault, sexual violence, child abuse, missing child, trafficking, threat to life, kidnapping, domestic violence, or harassment (or any typos/phonetic spellings like "rapped", "raping", "molested"):
1. Set "safetyCategory" to "Sexual Violence / Assault" or appropriate safety category.
2. Set "urgency" strictly to "Critical" or "Emergency".
3. Assign "department" to "Police / Women & Child Protection".
4. Set "safetyEscalationRequired" to true and "humanReviewRequired" to true.
5. In "recommendedAction", cite Article 21 of Constitution of India (Right to Life & Personal Liberty), mandatory Zero FIR registration under Section 173 BNS 2023 / Section 376 IPC / POCSO Act, mandatory medical-legal examination under BNS Sec 184, and emergency dispatch (Police 112/100, Women Helpline 181, Childline 1098).

COMPLAINT PAYLOAD:
Description: ${payload.description}
Mandal: ${payload.mandal}
Village/Ward: ${payload.village ?? "Not specified"}
Has photographic evidence: ${payload.hasImages ?? false}
Has audio evidence: ${payload.hasAudio ?? false}

Return ONLY a JSON object:
{
  "title": "Clear executive title emphasizing urgency if safety-related",
  "category": "Issue category (e.g. Emergency Safety - Sexual Violence, Police / Law & Order, Infrastructure)",
  "subcategory": "Specific Subcategory",
  "department": "Responsible Government Department (e.g. Police / Women & Child Protection, Revenue, Municipal Administration)",
  "urgency": "Routine|Priority|High|Emergency|Critical",
  "safetyCategory": "Sexual Violence / Assault|Child Safety / Abuse|Threat to Life / Kidnapping|Domestic Violence in Immediate Danger|Trafficking|Self-Harm / Personal Emergency|Serious Physical Danger|Fire or Disaster|None",
  "safetyEscalationRequired": true|false,
  "evidenceCompleteness": "Sufficient|Partial|Insufficient|None provided",
  "credibilityBand": "High preliminary confidence|Medium preliminary confidence|Low preliminary confidence|Insufficient information to assess",
  "confidenceScore": 95,
  "missingInformation": ["List key missing details if any"],
  "recommendedAction": "Actionable constitutional & legal recommendation (cites Article 21, BNS 2023 sections, Zero FIR, DISHA/Police 112)",
  "humanReviewRequired": true
}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert constitutional AI civic intelligence officer for Srikalahasti constituency. Return valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  const parsed = JSON.parse(content);
  const isSafety = parsed.safetyCategory && parsed.safetyCategory !== "None";

  return {
    ...parsed,
    analysisMode: "llm" as const,
    legalDisclaimer: isSafety ? SEXUAL_CHILD_SAFETY_DISCLAIMER : LEGAL_DISCLAIMER,
  };
}

// ── Gemini LLM integration ───────────────────────────────────────────────────
async function llmAnalysis(payload: ComplaintPayload): Promise<AIAnalysisResult> {
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("No API key configured");

  const prompt = `You are a senior civic-technology safety analyst for Srikalahasti Assembly Constituency (No. 168), Tirupati District, Andhra Pradesh, India.

CRITICAL SAFETY DIRECTIVE:
Evaluate safety classification FIRST.
If the report describes rape, sexual assault, sexual violence, child abuse, missing child, trafficking, threat to life, kidnapping, or domestic violence in immediate danger:
1. Set "safetyCategory" appropriately.
2. Set "urgency" to "Emergency" or "Critical".
3. NEVER downgrade urgency because optional fields or evidence are missing.
4. Set "safetyEscalationRequired" to true.
5. Set "humanReviewRequired" to true.

COMPLAINT PAYLOAD:
Description: ${payload.description}
Mandal: ${payload.mandal}
Village/Ward: ${payload.village ?? "Not specified"}
Has photographic evidence: ${payload.hasImages ?? false}
Has audio evidence: ${payload.hasAudio ?? false}

Return ONLY a JSON object:
{
  "title": "Neutral title (never expose sensitive allegations publicly)",
  "category": "Issue category",
  "subcategory": "Subcategory",
  "department": "Responsible authority",
  "urgency": "Routine|Priority|High|Emergency|Critical",
  "safetyCategory": "Sexual Violence / Assault|Child Safety / Abuse|Threat to Life / Kidnapping|Domestic Violence in Immediate Danger|Trafficking|Self-Harm / Personal Emergency|Serious Physical Danger|Fire or Disaster|None",
  "safetyEscalationRequired": true|false,
  "evidenceCompleteness": "Sufficient|Partial|Insufficient|None provided",
  "credibilityBand": "High preliminary confidence|Medium preliminary confidence|Low preliminary confidence|Insufficient information to assess",
  "confidenceScore": 75,
  "missingInformation": [],
  "recommendedAction": "Action statement",
  "humanReviewRequired": true
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 800 },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Could not parse Gemini response");

  const parsed = JSON.parse(jsonMatch[0]);
  const isSafety = parsed.safetyCategory !== "None";

  return {
    ...parsed,
    analysisMode: "llm" as const,
    legalDisclaimer: isSafety ? SEXUAL_CHILD_SAFETY_DISCLAIMER : LEGAL_DISCLAIMER,
  };
}

// ── Entry point ──────────────────────────────────────────────────────────────
export async function analyzeComplaint(payload: ComplaintPayload): Promise<AIAnalysisResult> {
  // Priority 1: Groq LLM (High speed Llama-3.3-70b)
  try {
    return await groqAnalysis(payload);
  } catch (err) {
    console.warn("[AI] Groq LLM analysis failed, trying Gemini:", err);
  }

  // Priority 2: Gemini LLM
  const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      return await llmAnalysis(payload);
    } catch (err) {
      console.warn("[AI] Gemini LLM analysis failed, using local safety analyzer:", err);
    }
  }

  // Fallback: Local rule-based analyzer
  return localAnalysis(payload);
}

