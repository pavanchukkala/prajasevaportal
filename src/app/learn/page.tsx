import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Citizen Education Centre | Srikalahasti Praja Seva",
  description: "Learn how to report public issues, understand departments, submit useful complaints, and protect your information.",
};

export default function LearnPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Citizen Education Centre</div>
          <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1.25rem" }}>Know Your Rights. Report Effectively.</h1>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem", lineHeight: 1.7 }}>Understanding how to report an issue, what evidence is useful, and which department to approach makes every complaint more likely to be acted upon.</p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {[
            {
              icon: "📝",
              title: "How to Submit an Effective Complaint",
              desc: "A clear, factual complaint with date, location and evidence is far more effective than a vague allegation. Learn what to include.",
              href: "/learn/how-to-complain",
              cta: "Read Guide →",
            },
            {
              icon: "📸",
              title: "Evidence Guide",
              desc: "What evidence is useful, how to preserve it, and what NOT to upload. Your safety and the quality of the report both matter.",
              href: "/learn/evidence",
              cta: "Read Guide →",
            },
            {
              icon: "🏛️",
              title: "Department Directory",
              desc: "Which government department handles which type of issue? Find the right office before you submit.",
              href: "/learn/departments",
              cta: "View Directory →",
            },
            {
              icon: "💰",
              title: "Government Welfare Schemes",
              desc: "Understand what benefits and schemes you may be entitled to, and what to do if they are not reaching you.",
              href: "/learn/welfare",
              cta: "Learn More →",
            },
          ].map(c => (
            <Link key={c.href} href={c.href} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "2rem", textDecoration: "none", display: "block", transition: "border-color 0.2s" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{c.icon}</div>
              <h3 style={{ fontWeight: 700, color: "#ffffff", marginBottom: "0.75rem", fontSize: "1.1rem" }}>{c.title}</h3>
              <p style={{ color: "#94a3b8", lineHeight: 1.6, fontSize: "0.9rem", marginBottom: "1.5rem" }}>{c.desc}</p>
              <span style={{ color: "#D4A017", fontWeight: 700, fontSize: "0.85rem" }}>{c.cta}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
