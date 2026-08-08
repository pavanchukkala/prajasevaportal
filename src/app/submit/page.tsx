"use client";

import { useState } from "react";
import Link from "next/link";
import { geographyConfig } from "@/config/geography";

type Lang = "en" | "te";

export default function SubmitPage() {
  const [lang, setLang] = useState<Lang>("te");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const t = {
    en: {
      title: "Report a Public Issue",
      subtitle: "Secure & Anonymous Grievance Submission",
      descLabel: "Describe the Issue",
      descPlaceholder: "What happened? Where? When?",
      mandalLabel: "Select Mandal",
      villageLabel: "Village / Ward (Optional)",
      deptLabel: "Concerned Department (if known)",
      mediaLabel: "Upload Evidence (Photos, Videos, Documents)",
      audioLabel: "Record / Upload Voice Message",
      submitBtn: "Submit Grievance securely",
      submitting: "Processing...",
      success: "Grievance Submitted Successfully",
      successSub: "Please save your Complaint ID to track status:",
      returnHome: "Return to Home",
    },
    te: {
      title: "ప్రజా సమస్యను నివేదించండి",
      subtitle: "సురక్షితమైన & అనామక ఫిర్యాదు సమర్పణ",
      descLabel: "సమస్యను వివరించండి",
      descPlaceholder: "ఏమి జరిగింది? ఎక్కడ? ఎప్పుడు?",
      mandalLabel: "మండలాన్ని ఎంచుకోండి",
      villageLabel: "గ్రామం / వార్డు (ఐచ్ఛికం)",
      deptLabel: "సంబంధిత శాఖ (తెలిస్తే)",
      mediaLabel: "ఆధారాలను అప్‌లోడ్ చేయండి (ఫోటోలు, వీడియోలు, పత్రాలు)",
      audioLabel: "వాయిస్ సందేశం రికార్డ్ / అప్‌లోడ్ చేయండి",
      submitBtn: "ఫిర్యాదును సురక్షితంగా సమర్పించండి",
      submitting: "ప్రాసెస్ చేయబడుతోంది...",
      success: "ఫిర్యాదు విజయవంతంగా సమర్పించబడింది",
      successSub: "స్థితిని ట్రాక్ చేయడానికి దయచేసి మీ కంప్లైంట్ ID ని సేవ్ చేయండి:",
      returnHome: "హోమ్‌కు తిరిగి వెళ్లండి",
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call and LLM processing delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedId("SKT-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000));
    }, 2000);
  };

  if (submittedId) {
    return (
      <main className="min-h-screen bg-navy-dark text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="bg-navy p-10 rounded-2xl border border-navy-light max-w-xl w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">{t[lang].success}</h1>
          <p className="text-slate-400 mb-6">{t[lang].successSub}</p>
          <div className="bg-navy-dark border border-navy-light p-4 rounded-xl text-3xl font-mono text-saffron tracking-widest mb-10">
            {submittedId}
          </div>
          <Link href="/" className="px-8 py-4 bg-navy-light hover:bg-navy text-white font-bold rounded-full border border-navy transition-colors">
            {t[lang].returnHome}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navy-dark text-slate-100 p-6 flex justify-center">
      <div className="max-w-2xl w-full">
        <header className="flex justify-between items-center mb-8 pt-4">
          <Link href="/" className="text-saffron hover:text-white transition-colors">
            &larr; Back
          </Link>
          <div className="flex gap-2">
            <button onClick={() => setLang("en")} className={`px-4 py-1 rounded-full text-sm font-bold border ${lang === "en" ? "bg-saffron text-navy-dark border-saffron" : "border-navy-light text-slate-400"}`}>EN</button>
            <button onClick={() => setLang("te")} className={`px-4 py-1 rounded-full text-sm font-bold border ${lang === "te" ? "bg-saffron text-navy-dark border-saffron" : "border-navy-light text-slate-400"}`}>తెలుగు</button>
          </div>
        </header>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">{t[lang].title}</h1>
          <p className="text-saffron-light">{t[lang].subtitle}</p>
        </div>

        <form onSubmit={handleFormSubmit} className="bg-navy p-8 rounded-3xl border border-navy-light shadow-2xl space-y-6">
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-300">{t[lang].descLabel} *</label>
            <textarea 
              required
              rows={4}
              placeholder={t[lang].descPlaceholder}
              className="w-full bg-navy-dark border border-navy-light rounded-xl p-4 text-white focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron transition-all"
            ></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">{t[lang].mandalLabel} *</label>
              <select required className="w-full bg-navy-dark border border-navy-light rounded-xl p-4 text-white focus:outline-none focus:border-saffron">
                <option value="">-- Select --</option>
                {geographyConfig.constituency.mandals.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">{t[lang].villageLabel}</label>
              <input type="text" className="w-full bg-navy-dark border border-navy-light rounded-xl p-4 text-white focus:outline-none focus:border-saffron" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-300">{t[lang].deptLabel}</label>
            <select className="w-full bg-navy-dark border border-navy-light rounded-xl p-4 text-white focus:outline-none focus:border-saffron">
              <option value="">-- Optional --</option>
              {geographyConfig.departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-navy-light space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">📸 {t[lang].mediaLabel}</label>
              <input type="file" multiple accept="image/*,video/*,.pdf" className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navy-light file:text-saffron hover:file:bg-navy-dark transition-colors cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-300">🎙️ {t[lang].audioLabel}</label>
              {/* `capture` natively opens recorder on mobile devices */}
              <input type="file" accept="audio/*" capture="user" className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navy-light file:text-saffron hover:file:bg-navy-dark transition-colors cursor-pointer" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full mt-8 py-5 bg-saffron hover:bg-saffron-light text-navy-dark text-lg font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {isSubmitting ? t[lang].submitting : t[lang].submitBtn}
          </button>
          
          <p className="text-xs text-center text-slate-500 mt-4">
            Your identity remains anonymous. AI will analyze the submission to alert appropriate authorities.
          </p>
        </form>
      </div>
    </main>
  );
}
