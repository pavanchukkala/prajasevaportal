import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export const metadata = {
  title: "Learn: Welfare Schemes | Srikalahasti Praja Seva",
};

export default function WelfarePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>Government Welfare Schemes</h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7 }}>Understanding what benefits you may be entitled to and what to do if they are not reaching you.</p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ background: "rgba(30,136,229,0.06)", border: "1px solid rgba(30,136,229,0.2)", borderRadius: "12px", padding: "1.5rem", marginBottom: "3rem" }}>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.7 }}>ℹ️ <strong style={{ color: "#60a5fa" }}>Disclaimer:</strong> The following is general educational information only. Eligibility criteria, amounts and scheme names may change. Always verify current information with the relevant government department or your Village Secretariat.</p>
          </div>

          {[
            {
              category: "Pensions & Financial Assistance",
              schemes: [
                { name: "YSR Pension Kanuka (AP)", desc: "Monthly pension for elderly citizens (aged 60+), widows, disabled persons and weavers. Apply at your Village Secretariat.", dept: "Social Welfare" },
                { name: "PM Kisan Samman Nidhi", desc: "₹6,000 per year in three installments for eligible small and marginal farmers. Register through PM Kisan portal or your Village Secretariat.", dept: "Agriculture" },
                { name: "PM Shram Yogi Maandhan", desc: "Pension scheme for unorganized sector workers. Monthly contribution required. Enroll at Common Service Centre.", dept: "Labour" },
              ],
            },
            {
              category: "Food & Ration",
              schemes: [
                { name: "National Food Security Act (Ration Card)", desc: "Subsidized rice, wheat, and other essentials through PDS Fair Price Shops. Apply for ration card at your Village Secretariat or Mandal office.", dept: "Civil Supplies" },
                { name: "PM Garib Kalyan Anna Yojana", desc: "Free foodgrain for eligible households under NFSA. Check your ration card entitlement.", dept: "Civil Supplies" },
              ],
            },
            {
              category: "Housing",
              schemes: [
                { name: "PM Awas Yojana (Gramin & Urban)", desc: "Financial assistance for construction of pucca houses for eligible beneficiaries. Apply through your Gram Panchayat or Municipal office.", dept: "Panchayat Raj / Municipal" },
              ],
            },
            {
              category: "Employment",
              schemes: [
                { name: "MGNREGS (Job Card)", desc: "100 days of guaranteed wage employment per year for rural households. Obtain your Job Card through your Gram Panchayat.", dept: "Panchayat Raj" },
              ],
            },
            {
              category: "Education",
              schemes: [
                { name: "AP Amma Vodi", desc: "Financial assistance of ₹15,000 per year for mothers sending their children to government schools.", dept: "Education" },
                { name: "Pre-Matric and Post-Matric Scholarships", desc: "Scholarships for SC/ST/OBC/Minority students. Apply through the National Scholarship Portal.", dept: "Social Welfare / Education" },
              ],
            },
          ].map(cat => (
            <div key={cat.category} style={{ marginBottom: "2.5rem" }}>
              <h2 style={{ fontWeight: 800, color: "#D4A017", fontSize: "1.25rem", marginBottom: "1.25rem" }}>{cat.category}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {cat.schemes.map(s => (
                  <div key={s.name} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.1)", borderRadius: "12px", padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      <h3 style={{ fontWeight: 700, color: "#ffffff", fontSize: "0.95rem" }}>{s.name}</h3>
                      <span style={{ padding: "0.2rem 0.6rem", background: "rgba(212,160,23,0.1)", borderRadius: "6px", fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, whiteSpace: "nowrap", marginLeft: "0.5rem" }}>{s.dept}</span>
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: "0.85rem", lineHeight: 1.6 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.15)", borderRadius: "16px", padding: "2rem", marginTop: "2rem" }}>
            <h3 style={{ fontWeight: 700, color: "#ffffff", marginBottom: "1rem" }}>Welfare Not Reaching You?</h3>
            <p style={{ color: "#94a3b8", lineHeight: 1.7, marginBottom: "1.5rem" }}>If you are entitled to a scheme but are not receiving your benefits — or if you have been wrongly excluded — you can submit a complaint through this platform. Select the relevant department (e.g., Social Welfare, Civil Supplies, Panchayat Raj) when submitting.</p>
            <Link href="/submit" style={{ display: "inline-block", background: "#D4A017", color: "#060f1a", fontWeight: 700, padding: "0.75rem 1.75rem", borderRadius: "9999px", textDecoration: "none" }}>Report a Welfare Issue →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
