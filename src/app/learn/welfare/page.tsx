"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function WelfarePage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            {t("learn.welfareTitle")}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7 }}>
            {t("learn.welfareDesc")}
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {[
            {
              title: isTe ? "ఎన్టీఆర్ భరోసా పింఛన్లు" : "NTR Bharosa Pensions",
              dept: isTe ? "సామాజిక సంక్షేమ శాఖ" : "Social Welfare Department",
              desc: isTe ? "వృద్ధులు, వితంతువులు, దివ్యాంగులకు నెలకు ఆర్థిక పింఛన్ల పంపిణీ." : "Monthly financial assistance pensions for senior citizens, widows, and differently-abled individuals."
            },
            {
              title: isTe ? "పీఎం కిసాన్ / రైతు సంక్షేమం" : "PM Kisan / Farmer Welfare",
              dept: isTe ? "వ్యవసాయ శాఖ" : "Agriculture Department",
              desc: isTe ? "రైతులకు ఏటా పెట్టుబడి సహాయం, విత్తనాలు మరియు సబ్సిడీ ఎరువులు." : "Annual investment support, subsidized seeds, and fertilizer distribution for farmers."
            },
            {
              title: isTe ? "తల్లికి వందనం / విద్యా దీవెన" : "Education & Student Welfare",
              dept: isTe ? "పాఠశాల విద్యా శాఖ" : "School Education Department",
              desc: isTe ? "విద్యార్థులకు ఫీజు రీయింబర్స్‌మెంట్ మరియు మౌలిక సదుపాయాల కల్పన." : "Scholarships, fee reimbursement, and school infrastructure support for students."
            },
            {
              title: isTe ? "పీఎంఏవై ఇళ్ల నిర్మాణం" : "PMAY Housing Scheme",
              dept: isTe ? "గృహ నిర్మాణ శాఖ" : "Housing Department",
              desc: isTe ? "పేదలకు పక్కా ఇళ్ల నిర్మాణం మరియు ఆర్థిక సహాయం." : "Permanent housing construction support and financial sanction for eligible poor families."
            }
          ].map(scheme => (
            <div key={scheme.title} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "1.75rem" }}>
              <div style={{ fontSize: "0.75rem", color: "#D4A017", fontWeight: 700, marginBottom: "0.5rem" }}>{scheme.dept}</div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.75rem" }}>{scheme.title}</h2>
              <p style={{ color: "#94a3b8", lineHeight: 1.6, fontSize: "0.9rem" }}>{scheme.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
