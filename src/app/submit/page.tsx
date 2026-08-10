"use client";
import { useState, useRef, FormEvent, useEffect } from "react";
import Link from "next/link";

type Lang = "en" | "te";

const T = {
  en: {
    back: "← Home",
    badge: "Secure Submission · Anonymous Option Available",
    title: "Report a Public Service Issue",
    subtitle: "Your submission is private. Name and contact are never required.",
    step1: "What happened",
    step2: "Where & when",
    step3: "Contact (optional)",
    step4: "Evidence",
    step5: "Review & submit",
    descLabel: "Describe the issue",
    descPlaceholder:
      "Describe clearly: what happened, what was the expected outcome vs what occurred. Be factual and specific — include dates, locations and roles where possible.",
    mandal: "Mandal",
    selectMandal: "Select Mandal",
    village: "Village / Ward (optional)",
    villagePlaceholder: "Village or ward name",
    dept: "Department (optional)",
    selectDept: "Select if known",
    dateLabel: "Date of incident (optional)",
    // Mobile section
    mobileLabel: "Mobile number (optional)",
    mobilePlaceholder: "+91 98765 43210",
    mobilePurpose:
      "Your mobile number is collected only to send your Complaint ID, status updates and clarification requests. It will not be publicly displayed or used for advertising.",
    consentLabel: "I consent to receive complaint-related SMS or WhatsApp updates.",
    notifPref: "Preferred channel",
    notifSMS: "SMS",
    notifWhatsApp: "WhatsApp",
    emailLabel: "Email (optional)",
    emailPlaceholder: "you@example.com",
    anonymous: "I want to submit confidentially (no contact stored)",
    anonNote: "When checked, no mobile number or email is stored. You can still track via Complaint ID.",
    evidenceLabel: "Upload evidence (optional)",
    evidenceNote:
      "Photos, videos, audio, documents. Max 10MB each. Do not upload Aadhaar, PAN, bank details or sensitive personal data unrelated to this complaint.",
    submit: "Submit Complaint",
    submitting: "Submitting & analysing...",
    disclaimer:
      "AI will generate a preliminary structural assessment for human review. AI outputs do not determine truth, establish guilt or replace any investigation or judicial process.",
    successTitle: "Complaint Submitted",
    successNote: "Save your Complaint ID and tracking token — you will need them to track this complaint.",
    trackBtn: "Track This Complaint",
    submitAnother: "Submit Another",
    mandals: ["Srikalahasti", "Renigunta", "Yerpedu", "Thottambedu"],
    depts: [
      "Revenue", "Police", "Municipal Administration", "Panchayat Raj",
      "Education", "Health", "Women & Child Welfare", "Social Welfare",
      "Civil Supplies", "Electricity (APSPDCL)", "Water Resources",
      "Roads & Buildings", "Registration & Stamps", "Labour", "Agriculture", "Other",
    ],
    next: "Next →",
    back2: "← Back",
    review: "Review →",
  },
  te: {
    back: "← హోమ్",
    badge: "సురక్షిత సమర్పణ · అనామక ఎంపిక అందుబాటులో ఉంది",
    title: "ప్రభుత్వ సేవా సమస్యను నివేదించండి",
    subtitle: "మీ సమర్పణ ప్రైవేట్. పేరు మరియు పరిచయం ఎప్పుడూ అవసరం లేదు.",
    step1: "ఏం జరిగింది",
    step2: "ఎక్కడ & ఎప్పుడు",
    step3: "పరిచయం (ఐచ్ఛికం)",
    step4: "సాక్ష్యాలు",
    step5: "సమీక్ష & సమర్పించండి",
    descLabel: "సమస్యను వివరించండి",
    descPlaceholder:
      "స్పష్టంగా వివరించండి: ఏం జరిగింది, ఏం ఆశించారు vs ఏం జరిగింది. వాస్తవాలు, తేదీలు, స్థానాలు చేర్చండి.",
    mandal: "మండలం",
    selectMandal: "మండలం ఎంచుకోండి",
    village: "గ్రామం / వార్డు (ఐచ్ఛికం)",
    villagePlaceholder: "గ్రామం లేదా వార్డు పేరు",
    dept: "విభాగం (ఐచ్ఛికం)",
    selectDept: "తెలిసినట్లయితే ఎంచుకోండి",
    dateLabel: "సంఘటన తేది (ఐచ్ఛికం)",
    mobileLabel: "మొబైల్ నంబర్ (ఐచ్ఛికం)",
    mobilePlaceholder: "+91 98765 43210",
    mobilePurpose:
      "మీ మొబైల్ నంబర్ కేవలం మీ ఫిర్యాదు ID, స్థితి అప్‌డేట్‌లు మరియు స్పష్టీకరణ అభ్యర్థనలు పంపడానికి మాత్రమే సేకరించబడుతుంది. ఇది బహిరంగంగా ప్రదర్శించబడదు లేదా ప్రకటనలకు ఉపయోగించబడదు.",
    consentLabel: "ఫిర్యాదు సంబంధిత SMS లేదా WhatsApp అప్‌డేట్‌లు స్వీకరించడానికి నేను అంగీకరిస్తున్నాను.",
    notifPref: "ప్రాధాన్య ఛానెల్",
    notifSMS: "SMS",
    notifWhatsApp: "WhatsApp",
    emailLabel: "ఇమెయిల్ (ఐచ్ఛికం)",
    emailPlaceholder: "మీ@example.com",
    anonymous: "నేను రహస్యంగా సమర్పించాలనుకుంటున్నాను (పరిచయం నిల్వ కాదు)",
    anonNote: "తనిఖీ చేసినప్పుడు, మొబైల్ నంబర్ లేదా ఇమెయిల్ నిల్వ చేయబడదు. ఫిర్యాదు ID ద్వారా ట్రాక్ చేయవచ్చు.",
    evidenceLabel: "సాక్ష్యాలు అప్లోడ్ చేయండి (ఐచ్ఛికం)",
    evidenceNote:
      "ఫోటోలు, వీడియోలు, ఆడియో, పత్రాలు. ప్రతి 10MB. ఆధార్, PAN లేదా వ్యక్తిగత డేటాను అప్లోడ్ చేయవద్దు.",
    submit: "ఫిర్యాదు సమర్పించండి",
    submitting: "సమర్పిస్తున్నది & విశ్లేషిస్తున్నది...",
    disclaimer:
      "AI మానవ సమీక్ష కోసం ప్రాథమిక అంచనాను రూపొందిస్తుంది. AI అవుట్‌పుట్‌లు నిజం నిర్ధారించవు, అపరాధం స్థాపించవు.",
    successTitle: "ఫిర్యాదు సమర్పించబడింది",
    successNote: "మీ ఫిర్యాదు ID మరియు ట్రాకింగ్ టోకెన్ సేవ్ చేయండి.",
    trackBtn: "ఈ ఫిర్యాదును ట్రాక్ చేయండి",
    submitAnother: "మరొక సమర్పించండి",
    mandals: ["శ్రీకాళహస్తి", "రేణిగుంట", "ఏర్పేడు", "తొట్టంబేడు"],
    depts: [
      "రెవెన్యూ", "పోలీసు", "పురపాలక", "పంచాయతీ రాజ్", "విద్య",
      "ఆరోగ్యం", "మహిళా శిశు సంక్షేమం", "సామాజిక సంక్షేమం",
      "పౌర సరఫరాలు", "విద్యుత్", "నీటి వనరులు", "రోడ్లు",
      "నమోదు & స్టాంపులు", "కార్మికులు", "వ్యవసాయం", "ఇతర",
    ],
    next: "తదుపరి →",
    back2: "← వెనుకకు",
    review: "సమీక్ష →",
  },
} as const;

interface SubmitResult {
  id: string;
  trackingToken: string;
  mandal: string;
  department: string;
  createdAt: string;
  aiAnalysis: {
    title: string;
    category: string;
    urgency: string;
    credibilityBand: string;
    confidenceScore: number;
    evidenceCompleteness: string;
    missingInformation: string[];
    recommendedAction: string;
    analysisMode: string;
    legalDisclaimer: string;
  };
  notificationStatus: string;
}

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";

export default function SubmitPage() {
  const { language: lang, setLanguage: setLang } = useLanguage();
  const [step, setStep] = useState(1);
  // Step 1
  const [description, setDescription] = useState("");
  // Step 2
  const [mandal, setMandal] = useState("");
  const [village, setVillage] = useState("");
  const [dept, setDept] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  // Step 3 — Contact
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [mobileNumber, setMobileNumber] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [notificationPreference, setNotificationPreference] = useState<"sms" | "whatsapp">("sms");
  const [email, setEmail] = useState("");
  // Step 4 — Evidence
  const [files, setFiles] = useState<File[]>([]);
  // Submit
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const tx = T[lang];

  // Persist language in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("psip_lang") as Lang | null;
    if (saved && (saved === "en" || saved === "te")) setLang(saved);
  }, []);

  function switchLang(l: Lang) {
    setLang(l);
    localStorage.setItem("psip_lang", l);
  }

  const STEPS = [tx.step1, tx.step2, tx.step3, tx.step4, tx.step5];
  const TOTAL_STEPS = 5;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!description.trim() || description.length < 20) {
      setError(lang === "en" ? "Please describe the issue in at least 20 characters." : "కనీసం 20 అక్షరాలు రాయండి.");
      return;
    }
    if (!mandal) {
      setError(lang === "en" ? "Please select a mandal." : "మండలం ఎంచుకోండి.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Map Telugu mandal name to English for API
      const englishMandals = T.en.mandals;
      const teluguMandals = T.te.mandals as readonly string[];
      const teIdx = teluguMandals.indexOf(mandal);
      const englishMandal = teIdx >= 0 ? englishMandals[teIdx] : mandal;

      const body = {
        description,
        mandal: englishMandal,
        village: village || undefined,
        department: dept || undefined,
        incidentDate: incidentDate || undefined,
        hasImages: files.some((f) => f.type.startsWith("image/")),
        hasAudio: files.some((f) => f.type.startsWith("audio/")),
        isAnonymous,
        mobileNumber: !isAnonymous && consentGiven ? mobileNumber : undefined,
        consentGiven: !isAnonymous && consentGiven,
        notificationPreference: !isAnonymous && consentGiven ? notificationPreference : undefined,
        email: !isAnonymous && email ? email : undefined,
      };

      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok && data.id) {
        const uploadedUrls: string[] = [];
        // Upload any attached evidence files
        if (files.length > 0) {
          for (const file of files) {
            try {
              const fileFormData = new FormData();
              fileFormData.append("file", file);
              fileFormData.append("complaintId", data.id);
              const upRes = await fetch("/api/evidence/upload", {
                method: "POST",
                body: fileFormData,
              });
              if (upRes.ok) {
                const upData = await upRes.json();
                const url = upData.authorizedUrl || upData.evidence?.storagePath;
                if (url) {
                  uploadedUrls.push(url);
                }
              }
            } catch (upErr) {
              console.warn("[Upload] Evidence upload error:", upErr);
            }
          }
        }
        setResult({ ...data, mediaUrls: uploadedUrls } as any);
      } else {
        setError(data.error ?? "Submission failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const inp: React.CSSProperties = {
    width: "100%",
    background: "var(--bg-elevated)",
    border: "1.5px solid var(--border-main)",
    borderRadius: "12px",
    padding: "0.875rem 1rem",
    color: "var(--text-main)",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'Inter','Noto Sans Telugu',sans-serif",
  };

  const lbl: React.CSSProperties = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 800,
    color: "var(--text-muted)",
    marginBottom: "0.5rem",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  };

  const card: React.CSSProperties = {
    background: "var(--bg-surface)",
    border: "1px solid var(--border-main)",
    borderRadius: "20px",
    padding: "2.25rem",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  };

  const btnPrimary: React.CSSProperties = {
    background: "linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)",
    color: "#FFFFFF",
    fontWeight: 800,
    fontSize: "0.95rem",
    padding: "0.875rem 2rem",
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(13,148,136,0.3)",
  };

  const btnSecondary: React.CSSProperties = {
    border: "1.5px solid #0D9488",
    color: "#0D9488",
    background: "#FFFFFF",
    fontWeight: 700,
    padding: "0.875rem 1.5rem",
    borderRadius: "9999px",
    cursor: "pointer",
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (result) {
    const credColor =
      result.aiAnalysis.credibilityBand.includes("High")
        ? "#22c55e"
        : result.aiAnalysis.credibilityBand.includes("Medium")
        ? "#eab308"
        : "#f97316";

    return (
      <main style={{ minHeight: "100vh", background: "#04091A", color: "#f0f4f8", padding: "2rem" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto" }}>
          {/* Success header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ width: "88px", height: "88px", borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "2.25rem", boxShadow: "0 0 40px rgba(34,197,94,0.15)" }}>✅</div>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>{tx.successTitle}</h1>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>{tx.successNote}</p>
          </div>

          {/* IDs */}
          <div style={{ ...card, border: "1px solid rgba(212,160,23,0.3)", marginBottom: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <div style={{ fontSize: "0.62rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.4rem", fontWeight: 700 }}>Complaint ID</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "#D4A017", fontFamily: "monospace", letterSpacing: "0.05em" }}>{result.id}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.62rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.4rem", fontWeight: 700 }}>Tracking Token</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8", fontFamily: "monospace", letterSpacing: "0.03em", wordBreak: "break-all" }}>{result.trackingToken}</div>
              </div>
            </div>
            <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
              <div>
                <div style={{ fontSize: "0.62rem", color: "#64748b", textTransform: "uppercase", marginBottom: "2px", fontWeight: 700 }}>Mandal</div>
                <div style={{ fontSize: "0.85rem", color: "#ffffff", fontWeight: 600 }}>{result.mandal}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.62rem", color: "#64748b", textTransform: "uppercase", marginBottom: "2px", fontWeight: 700 }}>Department</div>
                <div style={{ fontSize: "0.85rem", color: "#ffffff", fontWeight: 600 }}>{result.department}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.62rem", color: "#64748b", textTransform: "uppercase", marginBottom: "2px", fontWeight: 700 }}>Submitted</div>
                <div style={{ fontSize: "0.82rem", color: "#ffffff", fontWeight: 600 }}>{new Date(result.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <div style={{ ...card, marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ fontWeight: 700, color: "#60a5fa", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                🧠 AI Preliminary Assessment
                {result.aiAnalysis.analysisMode === "local_fallback" && (
                  <span style={{ marginLeft: "0.5rem", color: "#eab308", fontSize: "0.65rem" }}>(Local analysis mode)</span>
                )}
              </div>
            </div>
            <h3 style={{ fontWeight: 700, color: "#ffffff", marginBottom: "1rem", lineHeight: 1.4 }}>{result.aiAnalysis.title}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
              {[
                ["Category", result.aiAnalysis.category],
                ["Urgency", result.aiAnalysis.urgency],
                ["Evidence", result.aiAnalysis.evidenceCompleteness],
              ].map(([k, v]) => (
                <div key={k} style={{ background: "rgba(4,9,26,0.5)", borderRadius: "8px", padding: "0.75rem" }}>
                  <div style={{ fontSize: "0.6rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px", fontWeight: 700 }}>{k}</div>
                  <div style={{ fontWeight: 700, color: k === "Urgency" ? (v === "High" || v === "Emergency" ? "#ef4444" : v === "Priority" ? "#f97316" : "#22c55e") : "#94a3b8", fontSize: "0.85rem" }}>{v}</div>
                </div>
              ))}
              <div style={{ background: "rgba(4,9,26,0.5)", borderRadius: "8px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.6rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "2px", fontWeight: 700 }}>Credibility</div>
                <div style={{ fontWeight: 700, color: credColor, fontSize: "0.82rem" }}>{result.aiAnalysis.credibilityBand}</div>
              </div>
            </div>
            {result.aiAnalysis.missingInformation.length > 0 && (
              <div style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)", borderRadius: "10px", padding: "1rem", marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.65rem", color: "#eab308", fontWeight: 700, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Missing Information</div>
                <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                  {result.aiAnalysis.missingInformation.map((m, i) => (
                    <li key={i} style={{ color: "#94a3b8", fontSize: "0.82rem", marginBottom: "0.2rem" }}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)", borderRadius: "8px", padding: "0.875rem", fontSize: "0.72rem", color: "#94a3b8", lineHeight: 1.6 }}>
              ⚠️ {result.aiAnalysis.legalDisclaimer}
            </div>
          </div>

          {/* Notification status */}
          {result.notificationStatus && (
            <div style={{ background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.15)", borderRadius: "12px", padding: "1rem", marginBottom: "1.25rem", fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.6 }}>
              📱 {result.notificationStatus}
            </div>
          )}

          {/* Next steps */}
          <div style={{ background: "rgba(13,33,55,0.4)", border: "1px solid rgba(212,160,23,0.1)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.5rem" }}>
            <div style={{ fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem", fontSize: "0.9rem" }}>Next Steps</div>
            {[
              "Your complaint is in the processing queue.",
              "An AI preliminary assessment has been generated for human review.",
              "An authorized reviewer will examine the complaint and AI assessment.",
              "Use your Complaint ID or tracking token to check status on the Track page.",
              "If more information is requested, you may submit a new complaint with additional details.",
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ color: "#D4A017", flexShrink: 0, fontSize: "0.8rem" }}>{i + 1}.</span>
                <span style={{ color: "#94a3b8", fontSize: "0.82rem", lineHeight: 1.5 }}>{s}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/track" style={{ ...btnPrimary, textDecoration: "none", display: "inline-flex" }}>{tx.trackBtn}</Link>
            <button
              onClick={() => { setResult(null); setDescription(""); setMandal(""); setVillage(""); setDept(""); setFiles([]); setMobileNumber(""); setConsentGiven(false); setEmail(""); setStep(1); }}
              style={btnSecondary}
            >
              {tx.submitAnother}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ── Main form ───────────────────────────────────────────────────────────────
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-main)", color: "var(--text-main)", transition: "background-color 0.25s ease, color 0.25s ease" }}>
      {/* Nav */}
      <Navbar />
      <Breadcrumb />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1.1rem", borderRadius: "9999px", background: "rgba(13,148,136,0.1)", border: "1px solid rgba(13,148,136,0.25)", marginBottom: "1.25rem" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0D9488", boxShadow: "0 0 8px #0D9488" }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 800, color: "#0D9488", textTransform: "uppercase", letterSpacing: "0.12em" }}>{tx.badge}</span>
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.025em", marginBottom: "0.5rem" }}>{tx.title}</h1>
          <p style={{ color: "#475569", fontSize: "0.98rem" }}>{tx.subtitle}</p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0", marginBottom: "2.5rem", position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: "5%", right: "5%", height: "2px", background: "#E2E8F0", transform: "translateY(-50%)", zIndex: 0 }} />
          {STEPS.map((s, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <button key={i} onClick={() => n < step && setStep(n)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.35rem", background: "none", border: "none", cursor: n < step ? "pointer" : "default", padding: "0 0.75rem", position: "relative", zIndex: 1 }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: done ? "#0F766E" : active ? "#0D9488" : "#FFFFFF", border: `2px solid ${done ? "#0F766E" : active ? "#0D9488" : "#CBD5E1"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem", color: done || active ? "#FFFFFF" : "#64748B", transition: "all 0.3s" }}>
                  {done ? "✓" : n}
                </div>
                <span style={{ fontSize: "0.62rem", color: active ? "#0D9488" : done ? "#0F766E" : "#64748B", fontWeight: active ? 800 : 500, whiteSpace: "nowrap" }}>{s}</span>
              </button>
            );
          })}
        </div>

        {/* Error banner */}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", padding: "0.875rem 1.25rem", marginBottom: "1.5rem", color: "#f87171", fontSize: "0.875rem" }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ── STEP 1: Description ── */}
          {step === 1 && (
            <div style={card}>
              <h2 style={{ fontWeight: 800, color: "#0F172A", marginBottom: "1.25rem" }}>{tx.step1}</h2>
              <label style={lbl}>{tx.descLabel}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={tx.descPlaceholder}
                required
                rows={7}
                style={{ ...inp, resize: "vertical", minHeight: "160px" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: description.length >= 20 ? "#0F766E" : "#EF4444" }}>
                  {description.length < 20 ? `${20 - description.length} more characters needed` : `${description.length} characters ✓`}
                </span>
              </div>
              <div style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "10px", padding: "0.875rem", marginBottom: "1.5rem", fontSize: "0.82rem", color: "#334155", lineHeight: 1.6 }}>
                💡 {lang === "en" ? "Specific, verifiable information helps identify the correct department and helps human reviewers understand the case." : "నిర్దిష్ట, ధృవీకరించదగిన సమాచారం సరైన విభాగాన్ని గుర్తించడానికి సహాయపడుతుంది."}
              </div>
              <button type="button" onClick={() => { if (description.length >= 20) { setError(""); setStep(2); } else setError(lang === "en" ? "Please write at least 20 characters." : "కనీసం 20 అక్షరాలు రాయండి."); }} style={btnPrimary}>{tx.next}</button>
            </div>
          )}

          {/* ── STEP 2: Location ── */}
          {step === 2 && (
            <div style={card}>
              <h2 style={{ fontWeight: 800, color: "#0F172A", marginBottom: "1.25rem" }}>{tx.step2}</h2>
              <div style={{ display: "grid", gap: "1.25rem" }}>
                <div>
                  <label style={lbl}>{tx.mandal} <span style={{ color: "#EF4444" }}>*</span></label>
                  <select value={mandal} onChange={(e) => setMandal(e.target.value)} required style={{ ...inp, cursor: "pointer" }}>
                    <option value="">{tx.selectMandal}</option>
                    {tx.mandals.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>{tx.village}</label>
                  <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder={tx.villagePlaceholder} style={inp} />
                </div>
                <div>
                  <label style={lbl}>{tx.dept}</label>
                  <select value={dept} onChange={(e) => setDept(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
                    <option value="">{tx.selectDept}</option>
                    {tx.depts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>{tx.dateLabel}</label>
                  <input type="date" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} style={inp} max={new Date().toISOString().split("T")[0]} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button type="button" onClick={() => setStep(1)} style={btnSecondary}>{tx.back2}</button>
                <button type="button" onClick={() => { if (!mandal) { setError(lang === "en" ? "Please select a mandal." : "మండలం ఎంచుకోండి."); return; } setError(""); setStep(3); }} style={btnPrimary}>{tx.next}</button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Contact & Consent ── */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Anonymous toggle */}
              <div style={card}>
                <h2 style={{ fontWeight: 800, color: "#0F172A", marginBottom: "1.25rem" }}>{tx.step3}</h2>

                <label style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", cursor: "pointer", marginBottom: "1.5rem" }}>
                  <div
                    onClick={() => setIsAnonymous((a) => !a)}
                    style={{ width: "22px", height: "22px", borderRadius: "6px", border: `2px solid ${isAnonymous ? "#0D9488" : "#CBD5E1"}`, background: isAnonymous ? "rgba(13,148,136,0.12)" : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", marginTop: "2px" }}
                  >
                    {isAnonymous && <span style={{ color: "#0D9488", fontSize: "0.8rem", fontWeight: 800 }}>✓</span>}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: "#0F172A", fontSize: "0.95rem" }}>{tx.anonymous}</div>
                    <div style={{ fontSize: "0.82rem", color: "#64748B", marginTop: "2px", lineHeight: 1.5 }}>{tx.anonNote}</div>
                  </div>
                </label>

                {!isAnonymous && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {/* Mobile number */}
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "1.25rem" }}>
                      <label style={lbl}>{tx.mobileLabel}</label>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder={tx.mobilePlaceholder}
                        style={inp}
                      />
                      <div style={{ marginTop: "0.75rem", fontSize: "0.82rem", color: "#475569", lineHeight: 1.6 }}>
                        ℹ️ {tx.mobilePurpose}
                      </div>

                      {/* Consent checkbox */}
                      {mobileNumber && (
                        <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer", marginTop: "1rem" }}>
                          <div
                            onClick={() => setConsentGiven((c) => !c)}
                            style={{ width: "20px", height: "20px", borderRadius: "5px", border: `2px solid ${consentGiven ? "#0F766E" : "#CBD5E1"}`, background: consentGiven ? "rgba(15,118,110,0.12)" : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", marginTop: "2px" }}
                          >
                            {consentGiven && <span style={{ color: "#0F766E", fontSize: "0.8rem", fontWeight: 800 }}>✓</span>}
                          </div>
                          <span style={{ fontSize: "0.85rem", color: "#334155", lineHeight: 1.6, fontWeight: 600 }}>{tx.consentLabel}</span>
                        </label>
                      )}

                      {/* Channel preference */}
                      {consentGiven && (
                        <div style={{ marginTop: "0.875rem" }}>
                          <label style={lbl}>{tx.notifPref}</label>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            {(["sms", "whatsapp"] as const).map((ch) => (
                              <button
                                key={ch}
                                type="button"
                                onClick={() => setNotificationPreference(ch)}
                                style={{ padding: "0.4rem 1rem", borderRadius: "9999px", border: "1.5px solid", fontSize: "0.8rem", fontWeight: 800, cursor: "pointer", background: notificationPreference === ch ? "rgba(13,148,136,0.15)" : "#FFFFFF", borderColor: notificationPreference === ch ? "#0D9488" : "#CBD5E1", color: notificationPreference === ch ? "#0D9488" : "#64748B" }}
                              >
                                {ch === "sms" ? tx.notifSMS : tx.notifWhatsApp}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label style={lbl}>{tx.emailLabel}</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={tx.emailPlaceholder} style={inp} />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="button" onClick={() => setStep(2)} style={btnSecondary}>{tx.back2}</button>
                <button type="button" onClick={() => { setError(""); setStep(4); }} style={btnPrimary}>{tx.next}</button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Evidence ── */}
          {step === 4 && (
            <div style={card}>
              <h2 style={{ fontWeight: 800, color: "#0F172A", marginBottom: "1.25rem" }}>{tx.step4}</h2>
              <label style={lbl}>{tx.evidenceLabel}</label>
              <div
                onClick={() => fileRef.current?.click()}
                style={{ border: "2px dashed #0D9488", borderRadius: "16px", padding: "2rem", textAlign: "center", cursor: "pointer", background: "#F8FAFC", transition: "border-color 0.2s" }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📎</div>
                <div style={{ color: "#0D9488", fontWeight: 800, marginBottom: "0.3rem", fontSize: "0.95rem" }}>{lang === "en" ? "Click to upload evidence files" : "ఫైళ్ళు అప్లోడ్ చేయండి"}</div>
                <div style={{ color: "#64748B", fontSize: "0.82rem" }}>All photos, videos, voice notes, documents accepted without restriction</div>
              </div>
              <input ref={fileRef} type="file" multiple style={{ display: "none" }} onChange={(e) => { const f = Array.from(e.target.files ?? []); setFiles((prev) => [...prev, ...f]); }} />
              {files.length > 0 && (
                <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {files.map((f, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "8px", padding: "0.6rem 0.875rem" }}>
                      <span style={{ color: "#0F172A", fontSize: "0.85rem", fontWeight: 600 }}>📎 {f.name} ({Math.round(f.size / 1024)} KB)</span>
                      <button type="button" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", fontWeight: 800 }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
              <p style={{ marginTop: "1rem", fontSize: "0.78rem", color: "#64748B", lineHeight: 1.6 }}>⚠ {tx.evidenceNote}</p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button type="button" onClick={() => setStep(3)} style={btnSecondary}>{tx.back2}</button>
                <button type="button" onClick={() => { setError(""); setStep(5); }} style={btnPrimary}>{tx.review}</button>
              </div>
            </div>
          )}

          {/* ── STEP 5: Review & Submit ── */}
          {step === 5 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={card}>
                <h2 style={{ fontWeight: 800, color: "#0F172A", marginBottom: "1.25rem" }}>{tx.step5}</h2>
                <div style={{ display: "grid", gap: "0.6rem" }}>
                  {[
                    [lang === "en" ? "Mandal" : "మండలం", mandal],
                    [lang === "en" ? "Village / Ward" : "గ్రామం", village || (lang === "en" ? "Not provided" : "అందించలేదు")],
                    [lang === "en" ? "Department" : "విభాగం", dept || (lang === "en" ? "Not specified — AI will suggest" : "పేర్కొనలేదు")],
                    [lang === "en" ? "Evidence files" : "సాక్ష్య ఫైళ్ళు", files.length > 0 ? `${files.length} file(s)` : lang === "en" ? "None" : "లేదు"],
                    [lang === "en" ? "Confidential mode" : "రహస్య మోడ్", isAnonymous ? (lang === "en" ? "Yes — no contact stored" : "అవును") : (lang === "en" ? "No — contact provided" : "కాదు")],
                    ...(!isAnonymous && consentGiven && mobileNumber ? [[lang === "en" ? "Notification consent" : "నోటిఫికేషన్ అంగీకారం", `${notificationPreference.toUpperCase()} · +91 ******${mobileNumber.replace(/\D/g, "").slice(-4)}`]] : []),
                  ].map(([k, v]) => (
                    <div key={k as string} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #E2E8F0" }}>
                      <span style={{ color: "#64748B", fontSize: "0.85rem" }}>{k}</span>
                      <span style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.85rem", textAlign: "right", maxWidth: "60%" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "1rem", padding: "0.875rem", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: "0.68rem", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem", fontWeight: 800 }}>Description</div>
                  <p style={{ color: "#334155", fontSize: "0.85rem", lineHeight: 1.6 }}>{description}</p>
                </div>
              </div>

              {/* AI disclaimer */}
              <div style={{ background: "#F0FDFA", border: "1px solid #99F6E4", borderRadius: "12px", padding: "1.25rem", display: "flex", gap: "0.75rem" }}>
                <span style={{ flexShrink: 0 }}>🧠</span>
                <p style={{ color: "#0F766E", fontSize: "0.82rem", lineHeight: 1.6, margin: 0, fontWeight: 600 }}>{tx.disclaimer}</p>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="button" onClick={() => setStep(4)} style={btnSecondary}>{tx.back2}</button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ flex: 1, ...btnPrimary, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                >
                  {loading ? tx.submitting : tx.submit}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      <Footer />
    </main>
  );
}
