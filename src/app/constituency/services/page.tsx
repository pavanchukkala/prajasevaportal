"use client";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function ConstituencyServicesPage() {
  const { language, t } = useLanguage();
  const isTe = language === "te";

  return (
    <main style={{ minHeight: "100vh", background: "#060f1a", color: "#f0f4f8" }}>
      <Navbar />

      <section style={{ background: "linear-gradient(135deg, #060f1a 0%, #0D2137 100%)", padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
            {isTe ? "నియోజకవర్గ సేవల నిఘంటువు" : "Constituency Services"}
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.05rem", lineHeight: 1.7 }}>
            {isTe ? "శ్రీకాళహస్తి నియోజకవర్గంలో పనిచేసే ప్రభుత్వ విభాగాలు మరియు సేవలు." : "Departments and public-service categories active in Srikalahasti constituency."}
          </p>
        </div>
      </section>

      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {[
              { icon: "🏛️", dept: isTe ? "రెవెన్యూ శాఖ" : "Revenue", issues: isTe ? "భూమి రికార్డులు, సర్టిఫికెట్లు, పట్టాదార్ పాస్‌బుక్, సర్వే" : "Land records, certificates, pattadar passbook, crop survey" },
              { icon: "🚔", dept: isTe ? "పోలీస్ శాఖ" : "Police", issues: isTe ? "రక్షణ, ఎఫ్‌ఐఆర్, సైబర్ నేరాలు, వేధింపులు" : "Safety, FIR, cybercrime, harassment" },
              { icon: "🏙️", dept: isTe ? "మున్సిపల్ పరిపాలన" : "Municipal Administration", issues: isTe ? "రోడ్లు, డ్రైనేజీ, వీధిదీపాలు, చెత్త సేకరణ, తాగునీరు" : "Roads, drainage, streetlights, garbage, water supply" },
              { icon: "🌿", dept: isTe ? "పంచాయతీ రాజ్" : "Panchayat Raj", issues: isTe ? "గ్రామీణ రోడ్లు, ఉపాధి హామీ, తాగునీరు, గృహ నిర్మాణం" : "Rural roads, MGNREGS, village water, PMAY housing" },
              { icon: "📚", dept: isTe ? "పాఠశాల విద్య" : "Education", issues: isTe ? "పాఠశాలలు, ఉపాధ్యాయులు, మధ్యాహ్న భోజనం, స్కాలర్‌షిప్‌లు" : "Schools, teachers, mid-day meals, scholarships, textbooks" },
              { icon: "🏥", dept: isTe ? "వైద్య ఆరోగ్యం" : "Health", issues: isTe ? "పీహెచ్‌సీ సేవలు, మందులు, టీకాలు, పారిశుధ్యం" : "PHC functioning, medicines, vaccination, sanitation" },
              { icon: "👨‍👩‍👧", dept: isTe ? "మహిళా శిశు సంక్షేమం" : "Women & Child Welfare", issues: isTe ? "అంగన్‌వాడీ, ఐసిడిఎస్, మాతృత్వ ప్రయోజనాలు" : "Anganwadi, ICDS, maternity benefits, child safety" },
              { icon: "🤝", dept: isTe ? "సామాజిక సంక్షేమం" : "Social Welfare", issues: isTe ? "ఎస్సీ/ఎస్టీ సంక్షేమం, పింఛన్లు, హాస్టళ్లు" : "SC/ST welfare, pensions, hostels, scholarships" },
              { icon: "🍛", dept: isTe ? "పౌర సరఫరాలు" : "Civil Supplies", issues: isTe ? "రేషన్ కార్డు, బియ్యం, రేషన్ దుకాణాలు" : "Ration card, PDS grains, fair price shops" },
              { icon: "⚡", dept: isTe ? "విద్యుత్ శాఖ (APSPDCL)" : "Electricity (APSPDCL)", issues: isTe ? "విద్యుత్ కోతలు, బిల్లులు, మీటర్లు, కొత్త కనెక్షన్లు" : "Outages, billing, meters, new connections, transformers" },
              { icon: "💧", dept: isTe ? "నీటి వనరుల శాఖ" : "Water Resources", issues: isTe ? "సాగునీరు, కాలువలు, నీటి విడుదల" : "Irrigation, canals, water allocation" },
              { icon: "🛣️", dept: isTe ? "రోడ్లు మరియు భవనాలు" : "Roads & Buildings", issues: isTe ? "రహదారులు, వంతెనలు, ప్రభుత్వ భవనాలు" : "State highways, bridges, public buildings" },
              { icon: "🚌", dept: isTe ? "రవాణా శాఖ" : "APSRTC / Transport", issues: isTe ? "బస్సు సేవలు, డ్రైవింగ్ లైసెన్సులు, వాహన రిజిస్ట్రేషన్" : "Bus services, driving licenses, vehicle registration" },
              { icon: "👷", dept: isTe ? "కార్మిక శాఖ" : "Labour", issues: isTe ? "కార్మిక హక్కులు, భవన నిర్మాణ కార్మికులు, ఇఎస్‌ఐ" : "Labor rights, construction workers, ESIC, EPF" },
              { icon: "🌾", dept: isTe ? "వ్యవసాయ శాఖ" : "Agriculture", issues: isTe ? "విత్తనాలు, ఎరువులు, పంట భీమా, పీఎం కిసాన్" : "Seeds, fertilizers, crop insurance, PM Kisan" },
              { icon: "📋", dept: isTe ? "రిజిస్ట్రేషన్ & స్టాంపులు" : "Registration & Stamps", issues: isTe ? "రిజిస్ట్రేషన్, సేల్ డీడ్, ఈసీ వివరాలు" : "Land registration, mutation, encumbrance certificate" },
              { icon: "🔥", dept: isTe ? "అగ్నిమాపక శాఖ" : "Fire Services", issues: isTe ? "అగ్నిప్రమాద నివారణ, భవన భద్రత" : "Fire hazard, building safety compliance" },
            ].map(s => (
              <div key={s.dept} style={{ background: "rgba(13,33,55,0.5)", border: "1px solid rgba(212,160,23,0.1)", borderRadius: "12px", padding: "1.25rem" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
                <div style={{ fontWeight: 700, color: "#ffffff", marginBottom: "0.4rem", fontSize: "0.9rem" }}>{s.dept}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>{s.issues}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <Link href="/learn/departments" style={{ background: "#D4A017", color: "#060f1a", fontWeight: 700, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none", marginRight: "1rem" }}>
              {isTe ? "శాఖల పూర్తి వివరాలు →" : "Full Department Guide →"}
            </Link>
            <Link href="/submit" style={{ border: "1px solid rgba(212,160,23,0.3)", color: "#D4A017", fontWeight: 600, padding: "0.875rem 2rem", borderRadius: "9999px", textDecoration: "none" }}>
              {t("home.submitGrievance")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
