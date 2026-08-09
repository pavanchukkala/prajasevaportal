export interface AssetAttribution {
  id: string;
  name: string;
  role: string;
  imagePath: string;
  sourceUrl: string;
  attribution: string;
  permissionStatus: string;
  usagePurpose: string;
  notes?: string;
}

export const ASSET_MANIFEST: Record<string, AssetAttribution> = {
  mla: {
    id: "mla",
    name: "Sri Bojjala Venkata Sudhir Reddy",
    role: "MLA, Srikalahasti Assembly Constituency (No. 168)",
    imagePath: "/assets/portraits/mla.svg",
    sourceUrl: "https://en.wikipedia.org/wiki/Bojjala_Sudhir_Reddy",
    attribution: "Official Assembly Constituency Representative Data",
    permissionStatus: "Public Representative Reference / Authorized Presentation Placeholder",
    usagePurpose: "Constituency Leadership Representation",
    notes: "Elected MLA for Srikalahasti Assembly Constituency (2024 Election: 1,21,565 votes).",
  },
  father: {
    id: "father",
    name: "Late Sri Bojjala Gopala Krishna Reddy",
    role: "Former Cabinet Minister & 5-Time MLA, Srikalahasti",
    imagePath: "/assets/portraits/father.svg",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:Bojjala_Gopala_Krishna_Reddy",
    attribution: "Wikimedia Commons & Legislative Archives (1949 - 2022)",
    permissionStatus: "Public Memorial & Historical Reference",
    usagePurpose: "Legacy & Historical Leadership Memorial",
    notes: "Distinguished representative of Srikalahasti constituency for over three decades.",
  },
  cm: {
    id: "cm",
    name: "Sri N. Chandrababu Naidu",
    role: "Chief Minister of Andhra Pradesh",
    imagePath: "/assets/portraits/cm.svg",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:N._Chandrababu_Naidu",
    attribution: "Government of Andhra Pradesh Public Domain Reference",
    permissionStatus: "Public State Executive Officer Reference",
    usagePurpose: "State Leadership Presentation",
    notes: "Head of Government, State of Andhra Pradesh.",
  },
  lokesh: {
    id: "lokesh",
    name: "Sri Nara Lokesh",
    role: "Minister for Information Technology, Electronics & HRD, Andhra Pradesh",
    imagePath: "/assets/portraits/lokesh.svg",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:Nara_Lokesh",
    attribution: "Department of IT & Electronics, Govt of AP",
    permissionStatus: "Public Ministerial Reference",
    usagePurpose: "Technology Governance & IT Policy Leadership",
    notes: "State Minister overseeing Digital Governance & Public Technology.",
  },
  pm: {
    id: "pm",
    name: "Sri Narendra Modi",
    role: "Prime Minister of India",
    imagePath: "/assets/portraits/pm.svg",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:Narendra_Modi",
    attribution: "Prime Minister's Office (PMO India / GODL-India)",
    permissionStatus: "Public Domain / GODL-India License",
    usagePurpose: "National Executive Leadership Context",
    notes: "Prime Minister of India.",
  },
  ntr: {
    id: "ntr",
    name: "Dr. N. T. Rama Rao (NTR)",
    role: "Founder, Telugu Desam Party & Former Chief Minister",
    imagePath: "/assets/portraits/ntr.svg",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:N._T._Rama_Rao",
    attribution: "Public Historical Archives",
    permissionStatus: "Historical & Cultural Public Domain",
    usagePurpose: "Party Founder & Historical Inspiration",
    notes: "Founder of Telugu Desam Party (1923 - 1996).",
  },
  tdpSymbol: {
    id: "tdpSymbol",
    name: "Telugu Desam Party Symbol (Bicycle)",
    role: "Political Party Symbol",
    imagePath: "/assets/symbols/tdp-symbol.svg",
    sourceUrl: "https://nritdp.com/downloads.php",
    attribution: "Telugu Desam Party Official Graphic Motif",
    permissionStatus: "Registered Electoral Party Symbol",
    usagePurpose: "Party Affiliation Identification",
    notes: "Used solely for constituency representative identification.",
  },
  indianFlag: {
    id: "indianFlag",
    name: "Indian National Flag Motif",
    role: "National Flag Identity",
    imagePath: "/assets/symbols/indian-flag-motif.svg",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:Flag_of_India",
    attribution: "National Flag Graphic Specification",
    permissionStatus: "Public Domain Civic Motif",
    usagePurpose: "Civic Patriotism & Official Governance Motif",
  },
  civicLogo: {
    id: "civicLogo",
    name: "Praja Seva Official Civic Emblem",
    role: "Platform Brand Identity",
    imagePath: "/assets/symbols/civic-emblem.svg",
    sourceUrl: "Self-Generated Civic Emblem Asset",
    attribution: "Srikalahasti Praja Seva Intelligence Platform Design System",
    permissionStatus: "Authorized Official Platform Brand Emblem",
    usagePurpose: "Primary Brand Logo for Public Header, Navigation & Footer",
  },
  templeHero: {
    id: "templeHero",
    name: "Srikalahasteeswara Temple Gopuram Skyline",
    role: "Constituency Cultural & Geographic Benchmark",
    imagePath: "/assets/portraits/temple-hero.svg",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:Srikalahasteeswara_Temple",
    attribution: "Wikimedia Commons Contributors / Cultural Heritage Archive",
    permissionStatus: "Creative Commons Attribution-ShareAlike (CC BY-SA 4.0)",
    usagePurpose: "Homepage Hero Graphic & Constituency Heritage Banner",
  },
};
