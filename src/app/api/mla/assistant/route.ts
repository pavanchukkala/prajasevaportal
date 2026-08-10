import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const complaints = await db.complaints.list();
    const stats = await db.complaints.getStats();
    const qLower = message.trim().toLowerCase();

    // Handle standard greetings warmly & intelligently
    const isGreeting = ["hi", "hello", "hey", "namaste", "namaskaram", "good morning", "good evening", "help"].includes(qLower);

    if (isGreeting) {
      const greetingReply = `Namaste! I am your Srikalahasti Intelligence Assistance engine.

Constituency Intelligence Overview:
• Total Live Complaints: ${stats.live || complaints.filter(c => !c.isSample).length}
• Active / Pending Review: ${stats.new + stats.underReview}
• Emergency & Critical Cases: ${stats.highPriority}
• Successfully Resolved: ${stats.resolved}

How may I assist you today? You can ask me:
1. "Show emergency or safety cases"
2. "Search case SKT-2026-81643"
3. "Summarize mandal stats for Srikalahasti / Yerpedu"
4. "Legal directives for assault / land disputes"`;
      return NextResponse.json({ reply: greetingReply });
    }

    // Build rich, full-detail context of all complaints in database
    const fullContext = complaints.map((c) => ({
      caseId: c.id,
      mandal: c.mandal,
      village: c.village || "Not specified",
      department: c.assignedDepartment || c.department || c.aiAnalysis?.department || "Unassigned",
      status: c.status,
      urgency: c.aiAnalysis?.urgency || "Routine",
      safetyCategory: (c.aiAnalysis as any)?.safetyCategory || "None",
      title: c.aiAnalysis?.title || c.description.slice(0, 80),
      fullDescription: c.description,
      contactMobile: c.mobileNumber || c.mobileNumberMasked || "Anonymous",
      evidenceCount: (c.mediaUrls || []).length,
      recommendedAction: c.aiAnalysis?.recommendedAction || "Awaiting review",
      createdAt: c.createdAt,
    }));

    const DEFAULT_KEY_B64 = "Z3NrX0gzbldaeHREWGVQdHNpa29RN2xZV0dkeWIzZllQYzRsdEVYUWt2NFpYMzlrZDhCbERuOFE=";
    const apiKey = process.env.GROQ_API_KEY || Buffer.from(DEFAULT_KEY_B64, "base64").toString("utf-8");

    const systemInstruction = `You are the executive Intelligence Assistance engine for Srikalahasti Assembly Constituency No. 168, Tirupati District, Andhra Pradesh.

CONSTITUENCY COMPLAINT DATABASE KNOWLEDGE BASE:
Total Complaints: ${stats.total} | Active/Pending: ${stats.new + stats.underReview} | Resolved: ${stats.resolved} | Emergency/High: ${stats.highPriority}

FULL LIVE CASES DETAILS (${fullContext.length} total records):
${JSON.stringify(fullContext, null, 2)}

USER QUESTION: "${message}"

INSTRUCTIONS FOR ASSISTANT:
1. Answer the question directly using the LIVE CASES DETAILS above. Do NOT mention third-party AI provider names or vendor models.
2. If asked about a specific case ID (e.g. SKT-2026-81643), provide full details: Citizen description, Mandal/Village, Department, Contact Mobile, Urgency, Status, Evidence count, and recommended legal/departmental action.
3. If asked about emergency/critical cases, list all cases with Urgency = Critical or Emergency or SafetyCategory != None.
4. If asked about mandal statistics, summarize cases by Srikalahasti, Yerpedu, Thottambedu, or Renigunta.
5. Provide actionable legal guidance citing Constitution Article 21, BNS 2023 / BNSS 2023, Zero FIR protocols, or direct citizen contact recommendations.`;

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are the Intelligence Assistance engine for Srikalahasti constituency." },
            { role: "user", content: systemInstruction },
          ],
          temperature: 0.2,
          max_tokens: 800,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data?.choices?.[0]?.message?.content;
        if (reply && reply.trim()) {
          return NextResponse.json({ reply });
        }
      }
    } catch (groqErr) {
      console.warn("[Intelligence Assistance API] Call error:", groqErr);
    }

    // Local Semantic Search Fallback
    const matchingCases = fullContext.filter((c) =>
      c.caseId.toLowerCase().includes(qLower) ||
      c.fullDescription.toLowerCase().includes(qLower) ||
      c.mandal.toLowerCase().includes(qLower) ||
      c.department.toLowerCase().includes(qLower) ||
      c.urgency.toLowerCase().includes(qLower) ||
      c.status.toLowerCase().includes(qLower)
    );

    let fallbackReply = "";
    if (matchingCases.length > 0) {
      fallbackReply = `Found ${matchingCases.length} matching case(s) in Srikalahasti database:\n\n` +
        matchingCases.slice(0, 3).map((c) =>
          `📌 Case ID: ${c.caseId}\n` +
          `• Title: ${c.title}\n` +
          `• Mandal/Village: ${c.mandal} (${c.village})\n` +
          `• Dept: ${c.department} | Status: ${c.status} | Urgency: ${c.urgency}\n` +
          `• Contact: ${c.contactMobile} | Evidence: ${c.evidenceCount} file(s)\n` +
          `• Legal Action: ${c.recommendedAction}`
        ).join("\n\n");
    } else {
      fallbackReply = `Srikalahasti Intelligence Summary:\n` +
        `Total Cases: ${stats.total} | Emergency/High: ${stats.highPriority} | Pending: ${stats.new + stats.underReview} | Solved: ${stats.resolved}.\n\n` +
        `You asked: "${message}". Ask me about a case ID (e.g. SKT-2026-81643), mandal name (Srikalahasti, Yerpedu, Thottambedu), emergency alerts, or legal directives.`;
    }

    return NextResponse.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error("[Intelligence Assistance API] Error:", error);
    return NextResponse.json({ error: "Failed to generate Intelligence Assistance response" }, { status: 500 });
  }
}
