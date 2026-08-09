import { ASSET_MANIFEST, AssetAttribution } from "./assets";

export type PresentationMode = "public" | "mla-demo";

export interface PoliticalLeader {
  id: string;
  name: string;
  title: string;
  role: string;
  assetKey: string;
  quote?: string;
}

export interface LeadershipConfig {
  mode: PresentationMode;
  currentRepresentative: {
    name: string;
    nameTe: string;
    title: string;
    titleTe: string;
    party: string;
    partyShortName: string;
    partySymbol: string;
    father?: {
      name: string;
      nameTe: string;
      legacyText: string;
      years: string;
    };
  };
  stateAndNationalLeaders: PoliticalLeader[];
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    tricolorMotif: string;
    civicEmblem: string;
  };
  attributions: Record<string, AssetAttribution>;
}

export const leadershipConfig: LeadershipConfig = {
  mode: "mla-demo",
  
  currentRepresentative: {
    name: "Sri Bojjala Venkata Sudhir Reddy",
    nameTe: "బొజ్జల సుధీర్ రెడ్డి",
    title: "MLA, Srikalahasti Assembly Constituency (No. 168)",
    titleTe: "శాసనసభ్యులు (MLA), శ్రీకాళహస్తి నియోజకవర్గం",
    party: "Telugu Desam Party",
    partyShortName: "TDP",
    partySymbol: "/assets/symbols/tdp-symbol.svg",
    father: {
      name: "Late Sri Bojjala Gopala Krishna Reddy",
      nameTe: "లేట్ శ్రీ బొజ్జల గోపాలకృష్ణారెడ్డి",
      legacyText: "A legacy of public leadership in Srikalahasti. This proposed platform carries that spirit into the digital age by giving citizens a structured voice and giving public representatives a clearer view of constituency needs.",
      years: "1949 — 2022",
    }
  },
  
  stateAndNationalLeaders: [
    {
      id: "cm",
      name: "Sri N. Chandrababu Naidu",
      title: "Chief Minister of Andhra Pradesh",
      role: "State Leadership",
      assetKey: "cm",
      quote: "Governance must be swift, digital, and accountable to every citizen."
    },
    {
      id: "lokesh",
      name: "Sri Nara Lokesh",
      title: "Minister for IT, Electronics & HRD",
      role: "Digital Technology Leadership",
      assetKey: "lokesh",
      quote: "Leveraging technology to bring transparency and efficient public service delivery."
    },
    {
      id: "pm",
      name: "Sri Narendra Modi",
      title: "Prime Minister of India",
      role: "National Leadership",
      assetKey: "pm",
      quote: "Digital India empowering citizens at the grassroots level."
    },
    {
      id: "ntr",
      name: "Dr. N. T. Rama Rao (NTR)",
      title: "Founder, Telugu Desam Party",
      role: "Party Founder & Visionary",
      assetKey: "ntr",
      quote: "Society is the temple. People are the deities."
    }
  ],
  
  branding: {
    primaryColor: "#0D2137",
    secondaryColor: "#D4A017",
    accentColor: "#F3E5AB",
    tricolorMotif: "/assets/symbols/indian-flag-motif.svg",
    civicEmblem: "/assets/symbols/civic-emblem.svg",
  },

  attributions: ASSET_MANIFEST,
};
