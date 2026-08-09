"use client";

import Link from "next/link";
import { FileText, Camera, Building2, HeartHandshake } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { useLanguage } from "@/context/LanguageContext";

export default function LearnPage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)", color: "var(--text-main)", transition: "background-color 0.25s ease, color 0.25s ease" }}>
      <Navbar />
      <Breadcrumb />

      <section style={{ backgroundColor: "var(--bg-surface)", padding: "5rem 1.5rem", borderBottom: "1px solid var(--border-main)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: "var(--accent-gold)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            {isTe ? "పౌర విద్యా కేంద్రం" : "Citizen Education Centre"}
          </div>
          <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "var(--text-main)", letterSpacing: "-0.03em", marginBottom: "1.25rem" }}>
            {t("learn.title")}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", lineHeight: 1.7 }}>
            {t("learn.subtitle")}
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem", backgroundColor: "var(--bg-main)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {[
            {
              icon: <FileText size={32} style={{ color: "var(--accent-teal)" }} />,
              title: t("learn.howToTitle"),
              desc: t("learn.howToDesc"),
              href: "/learn/how-to-complain",
              cta: isTe ? "మార్గదర్శిని చదవండి →" : "Read Guide →",
            },
            {
              icon: <Camera size={32} style={{ color: "var(--accent-gold)" }} />,
              title: t("learn.evidenceTitle"),
              desc: t("learn.evidenceDesc"),
              href: "/learn/evidence",
              cta: isTe ? "మార్గదర్శిని చదవండి →" : "Read Guide →",
            },
            {
              icon: <Building2 size={32} style={{ color: "var(--accent-teal)" }} />,
              title: t("learn.deptsTitle"),
              desc: t("learn.deptsDesc"),
              href: "/learn/departments",
              cta: isTe ? "విభాగాలను చూడండి →" : "View Directory →",
            },
            {
              icon: <HeartHandshake size={32} style={{ color: "var(--accent-gold)" }} />,
              title: t("learn.welfareTitle"),
              desc: t("learn.welfareDesc"),
              href: "/learn/welfare",
              cta: isTe ? "పథకాలను చూడండి →" : "Explore Schemes →",
            },
          ].map(item => (
            <div key={item.href} style={{ background: "var(--bg-elevated)", border: "1.5px solid var(--border-main)", borderRadius: "16px", padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}>
              <div>
                <div style={{ marginBottom: "1rem" }}>{item.icon}</div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.75rem" }}>{item.title}</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>{item.desc}</p>
              </div>
              <Link href={item.href} style={{ color: "var(--accent-gold)", fontWeight: 700, textDecoration: "none", fontSize: "0.88rem" }}>
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
