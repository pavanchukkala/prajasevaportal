import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Srikalahasti Praja Seva Intelligence Platform",
};

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <nav style={{ background: "rgba(6,15,26,0.95)", borderBottom: "1px solid rgba(212,160,23,0.15)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50, padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ color: "#D4A017", textDecoration: "none", fontWeight: 700 }}>← Praja Seva</Link>
      </nav>

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Privacy & Data Protection</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>Privacy Policy</h1>
          <p style={{ color: "#94a3b8" }}>Last updated: August 2026</p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {[
            {
              title: "1. What We Collect",
              content: "When you submit a complaint, we collect: your complaint description, location (mandal and village if provided), selected department, and any evidence files you upload (photos, audio, video, documents). We do NOT require your name, phone number, Aadhaar, or email address. Submissions are anonymous by design.",
            },
            {
              title: "2. How Your Data Is Used",
              content: "Your submission is processed by an AI system that generates a preliminary structural assessment (category, urgency, credibility indicators). This assessment is a prioritization tool only. The complaint and assessment are then made available to authorized constituency staff for human review. Your data is never sold, shared publicly, or used for advertising.",
            },
            {
              title: "3. Evidence Files",
              content: "Uploaded evidence files are stored securely and are NOT publicly accessible. They are only visible to authorized reviewers assigned to your case. Evidence URLs are signed and time-limited. We recommend you do not upload documents containing sensitive personal information (Aadhaar, bank details, medical records) unless directly relevant to the complaint.",
            },
            {
              title: "4. Access Control",
              content: "Your complaint is visible only to authorized personnel assigned to review or act on it. Access is controlled by authentication, role-based permissions and audit logging. Political branding and party affiliation do not affect who can see your complaint or how it is prioritized.",
            },
            {
              title: "5. AI Processing",
              content: "AI-generated outputs are preliminary assessments only. The AI does not determine guilt, confirm the truth of allegations, or trigger automatic action. All AI outputs are labeled as preliminary assessments requiring human review. The AI disclaimer is always visible alongside any AI output.",
            },
            {
              title: "6. Data Retention",
              content: "In the current demonstration phase, all complaint data is mock/sample data. In production, complaints will be retained for a minimum period required for accountability tracking and deleted in accordance with a formal data retention policy. Citizens may request deletion of their complaint subject to legal and accountability requirements.",
            },
            {
              title: "7. Contact",
              content: "For privacy-related questions, please use the Contact page. This platform is a proposed civic-technology initiative and is not an official government website unless formally authorized.",
            },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontWeight: 700, color: "#D4A017", fontSize: "1.1rem", marginBottom: "0.75rem" }}>{s.title}</h2>
              <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: "0.95rem" }}>{s.content}</p>
            </div>
          ))}

          <div style={{ background: "rgba(212,160,23,0.06)", border: "1px solid rgba(212,160,23,0.2)", borderRadius: "12px", padding: "1.5rem", marginTop: "2rem" }}>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.7 }}>
              <strong style={{ color: "#D4A017" }}>Disclaimer:</strong> This platform is a proposed civic-technology concept and is not an official government website unless formally authorized. Data handling practices in the full production version must comply with applicable Indian data protection laws including the Digital Personal Data Protection Act (DPDPA) 2023.
            </p>
          </div>

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/security" style={{ color: "#D4A017", textDecoration: "none", fontSize: "0.9rem" }}>Security Policy →</Link>
            <Link href="/contact" style={{ color: "#D4A017", textDecoration: "none", fontSize: "0.9rem" }}>Contact Us →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
