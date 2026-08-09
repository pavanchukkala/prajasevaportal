import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Learn: Evidence Guide | Srikalahasti Praja Seva",
};

export default function EvidencePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📸</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>Evidence Guide</h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7 }}>What evidence is useful, how to preserve it safely, and what to avoid uploading.</p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontWeight: 800, color: "#22c55e", fontSize: "1.5rem", marginBottom: "1.5rem" }}>✓ What Makes Evidence Useful</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { icon: "📅", title: "Date and Time", desc: "Photos and videos taken with your phone automatically record date and time. Do not edit them — this information proves when the incident occurred." },
                { icon: "📍", title: "Location", desc: "Photos taken on location are more valuable than photos taken elsewhere. Include recognizable landmarks, street signs or building names in the frame." },
                { icon: "📷", title: "Original Media", desc: "Send the original unedited file from your phone. Screenshots of photos are weaker than original photos. Editing may remove important metadata." },
                { icon: "🎤", title: "Voice Description", desc: "Recording yourself explaining what happened in your own words — in Telugu or English — can be very powerful when combined with visual evidence." },
                { icon: "📄", title: "Documents", desc: "Copies of rejection letters, application receipts, official notices, or correspondence can strongly support a complaint about administrative delays." },
                { icon: "👥", title: "Multiple Accounts", desc: "If multiple citizens experienced the same issue, each submitting separately with their own evidence makes the pattern clearer and the complaint more credible." },
              ].map(c => (
                <div key={c.title} style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "12px", padding: "1.25rem" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{c.icon}</div>
                  <div style={{ fontWeight: 700, color: "#ffffff", marginBottom: "0.5rem", fontSize: "0.95rem" }}>{c.title}</div>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.6 }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontWeight: 800, color: "#ef4444", fontSize: "1.5rem", marginBottom: "1.5rem" }}>✗ What NOT to Upload</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                "Do NOT upload photos or videos of faces of individuals without their knowledge. Blur faces in photos if possible.",
                "Do NOT upload Aadhaar cards, PAN cards, bank account numbers, voter IDs or other personal identity documents unless absolutely necessary.",
                "Do NOT upload medical reports or records that identify individuals.",
                "Do NOT upload files that have been edited, cropped, filtered or watermarked — this may reduce credibility.",
                "Do NOT upload evidence of crimes in progress if doing so would put you in danger. Your safety comes first.",
                "Do NOT record government officials without understanding the legal context. The legality of recording depends on the situation.",
              ].map((w, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", padding: "1rem", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "10px" }}>
                  <span style={{ color: "#ef4444", flexShrink: 0, fontWeight: 700 }}>⚠</span>
                  <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>{w}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.15)", borderRadius: "16px", padding: "2rem" }}>
            <h2 style={{ fontWeight: 800, color: "#ffffff", marginBottom: "1rem" }}>How to Report Safely</h2>
            <p style={{ color: "#94a3b8", lineHeight: 1.7, marginBottom: "1rem" }}>If you are concerned about retaliation or personal safety:</p>
            <ul style={{ paddingLeft: "1.5rem", color: "#94a3b8" }}>
              <li style={{ marginBottom: "0.5rem", lineHeight: 1.6 }}>You are not required to give your name or contact information.</li>
              <li style={{ marginBottom: "0.5rem", lineHeight: 1.6 }}>Use a general description of the location rather than your exact address.</li>
              <li style={{ marginBottom: "0.5rem", lineHeight: 1.6 }}>Submit from a shared device or public WiFi if you are concerned about device tracing.</li>
              <li style={{ marginBottom: "0.5rem", lineHeight: 1.6 }}>You can describe what you witnessed without identifying yourself as the person directly affected.</li>
            </ul>
          </div>

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link href="/submit" style={{ background: "#D4A017", color: "#060f1a", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>Submit a Complaint →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
