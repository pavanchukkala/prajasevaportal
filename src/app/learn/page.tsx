"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";

export default function LearnPage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />
      <Breadcrumb />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: "#D4A017", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            {isTe ? "పౌర విద్యా కేంద్రం" : "Citizen Education Centre"}
          </div>
          <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1.25rem" }}>
            {t("learn.title")}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem", lineHeight: 1.7 }}>
            {t("learn.subtitle")}
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {[
            {
              icon: "📝",
              title: t("learn.howToTitle"),
              desc: t("learn.howToDesc"),
              href: "/learn/how-to-complain",
              cta: isTe ? "మార్గదర్శిని చదవండి →" : "Read Guide →",
            },
            {
              icon: "📸",
              title: t("learn.evidenceTitle"),
              desc: t("learn.evidenceDesc"),
              href: "/learn/evidence",
              cta: isTe ? "మార్గదర్శిని చదవండి →" : "Read Guide →",
            },
            {
              icon: "🏢",
              title: t("learn.deptsTitle"),
              desc: t("learn.deptsDesc"),
              href: "/learn/departments",
              cta: isTe ? "విభాగాలను చూడండి →" : "View Directory →",
            },
            {
              icon: "🤝",
              title: t("learn.welfareTitle"),
              desc: t("learn.welfareDesc"),
              href: "/learn/welfare",
              cta: isTe ? "పథకాలను చూడండి →" : "Explore Schemes →",
            },
          ].map(item => (
            <div key={item.href} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.12)", borderRadius: "16px", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "2.25rem", marginBottom: "1rem" }}>{item.icon}</div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.75rem" }}>{item.title}</h2>
                <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>{item.desc}</p>
              </div>
              <Link href={item.href} style={{ color: "#D4A017", fontWeight: 700, textDecoration: "none", fontSize: "0.88rem" }}>
                {item.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
