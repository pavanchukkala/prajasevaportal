import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Learn: How to Complain Effectively | Srikalahasti Praja Seva",
};

export default function HowToComplainPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>How to Submit an Effective Complaint</h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7 }}>A structured, factual complaint is significantly more likely to result in action than a vague one. Here is how to write one.</p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {[
            { n: 1, title: "State what happened — not just how you feel", content: "Describe the specific event or situation clearly. Include: What happened? Who was involved (by role, not necessarily by name)? What was the expected outcome versus what actually occurred? Avoid vague language like 'they are corrupt' — instead, describe the specific action or inaction that you experienced." },
            { n: 2, title: "Specify where and when", content: "Include the exact location (village, ward number, office name), the date of the incident, and if applicable, the approximate time. If the problem is ongoing, say so and note when it started. A complaint with a specific date and location is far easier to investigate than one without." },
            { n: 3, title: "Attach relevant evidence", content: "Photos, videos, audio recordings and documents all strengthen your complaint. Read the Evidence Guide for what to attach and what to avoid. Unedited original files from your phone are always preferable to screenshots or edited images." },
            { n: 4, title: "Identify the type of issue", content: "Selecting the correct department helps route your complaint to the right authority. If you are unsure, describe the issue clearly and the system will assist. Check the Department Directory to find which office handles your type of problem." },
            { n: 5, title: "Be factual — not accusatory", content: "Use factual language: 'The certificate was not issued after 30 days despite multiple visits' is more useful than 'the officer is corrupt and lazy.' Factual complaints are stronger and less likely to be dismissed. The AI system is also calibrated to reward factual, specific language with higher preliminary credibility indicators." },
            { n: 6, title: "Save your Complaint ID", content: "After submitting, you will receive a unique Complaint ID (format: SKT-YYYY-NNNNN). Save this. You can use it to track the status of your complaint using the Track page. Without this ID, you cannot check the status of your submission." },
          ].map(step => (
            <div key={step.n} style={{ display: "flex", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "2px solid rgba(212,160,23,0.4)", background: "#0D2137", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#D4A017", fontSize: "1.1rem", flexShrink: 0 }}>{step.n}</div>
              <div>
                <h3 style={{ fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem", fontSize: "1.05rem" }}>{step.title}</h3>
                <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.9rem" }}>{step.content}</p>
              </div>
            </div>
          ))}

          <div style={{ background: "rgba(212,160,23,0.06)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "16px", padding: "2rem", marginTop: "1rem" }}>
            <h3 style={{ fontWeight: 700, color: "#D4A017", marginBottom: "0.75rem" }}>Remember</h3>
            <p style={{ color: "#94a3b8", lineHeight: 1.7 }}>AI-generated assessments are preliminary only. A clear, factual, evidenced complaint will receive a higher credibility indicator — but all complaints receive human review regardless. You do not need to be eloquent. You just need to be truthful and specific.</p>
          </div>

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link href="/submit" style={{ background: "#D4A017", color: "#060f1a", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>Submit a Complaint Now →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
