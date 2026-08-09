export interface AssetAttribution {
  id: string;
  name: string;
  role: string;
  imagePath: string;
  sourceUrl: string;
  license: string;
  authorAttribution: string;
  notes: string;
}

export const ASSET_MANIFEST: Record<string, AssetAttribution> = {
  mla: {
    id: "mla",
    name: "Sri Bojjala Venkata Sudhir Reddy",
    role: "MLA, Srikalahasti Assembly Constituency (No. 168)",
    imagePath: "/assets/symbols/civic-emblem.svg",
    sourceUrl: "https://en.wikipedia.org/wiki/Bojjala_Sudhir_Reddy",
    license: "Public Representative Reference / Fair Use for Civic Tech Demonstration",
    authorAttribution: "Official Assembly Constituency Reference Data",
    notes: "Current elected representative for Srikalahasti Assembly Constituency (2024 Election: 1,21,565 votes).",
  },
  father: {
    id: "father",
    name: "Late Sri Bojjala Gopala Krishna Reddy",
    role: "Former Cabinet Minister & 5-Time MLA, Srikalahasti",
    imagePath: "/assets/symbols/civic-emblem.svg",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:Bojjala_Gopala_Krishna_Reddy",
    license: "Public Memorial & Historical Reference",
    authorAttribution: "Wikimedia Commons & Legislative Archives (1949 - 2022)",
    notes: "Distinguished public representative of Srikalahasti constituency for over three decades.",
  },
  cm: {
    id: "cm",
    name: "Sri N. Chandrababu Naidu",
    role: "Chief Minister of Andhra Pradesh",
    imagePath: "/assets/symbols/civic-emblem.svg",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:N._Chandrababu_Naidu",
    license: "Public Representative Reference / Government of Andhra Pradesh",
    authorAttribution: "Government of Andhra Pradesh Public Domain",
    notes: "Head of Government, State of Andhra Pradesh.",
  },
  lokesh: {
    id: "lokesh",
    name: "Sri Nara Lokesh",
    role: "Minister for Information Technology, Electronics & HRD, Andhra Pradesh",
    imagePath: "/assets/symbols/civic-emblem.svg",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:Nara_Lokesh",
    license: "Public Representative Reference / Government of Andhra Pradesh",
    authorAttribution: "Department of IT & Electronics, Govt of AP",
    notes: "State Minister overseeing Digital Governance, IT & Public Technology Initiatives.",
  },
  pm: {
    id: "pm",
    name: "Sri Narendra Modi",
    role: "Prime Minister of India",
    imagePath: "/assets/symbols/civic-emblem.svg",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:Narendra_Modi",
    license: "Public Domain / GODL-India (Government Open Data License)",
    authorAttribution: "Prime Minister's Office (PMO India)",
    notes: "Prime Minister of India.",
  },
  ntr: {
    id: "ntr",
    name: "Dr. N. T. Rama Rao (NTR)",
    role: "Founder, Telugu Desam Party & Former Chief Minister of Andhra Pradesh",
    imagePath: "/assets/symbols/civic-emblem.svg",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:N._T._Rama_Rao",
    license: "Historical & Cultural Public Domain",
    authorAttribution: "Public Archives",
    notes: "Founder of Telugu Desam Party (1923 - 1996).",
  },
  tdpSymbol: {
    id: "tdpSymbol",
    name: "Telugu Desam Party Symbol (Bicycle)",
    role: "Political Party Symbol",
    imagePath: "/assets/symbols/tdp-symbol.svg",
    sourceUrl: "https://nritdp.com/downloads.php",
    license: "Registered Electoral Party Symbol (Election Commission of India)",
    authorAttribution: "Telugu Desam Party Official Graphic Motif",
    notes: "Used solely for constituency representative party identification in presentation mode.",
  },
  templeHero: {
    id: "templeHero",
    name: "Srikalahasteeswara Temple Gopuram Skyline",
    role: "Constituency Cultural & Geographic Benchmark",
    imagePath: "/assets/symbols/civic-emblem.svg",
    sourceUrl: "https://commons.wikimedia.org/wiki/Category:Srikalahasteeswara_Temple",
    license: "Creative Commons Attribution-ShareAlike (CC BY-SA 4.0)",
    authorAttribution: "Wikimedia Commons Contributors",
    notes: "Ancient temple architecture representing the heritage of Srikalahasti town.",
  },
};
