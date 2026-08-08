export type PresentationMode = "public" | "mla-demo";

export interface LeadershipConfig {
  mode: PresentationMode;
  currentRepresentative: {
    name: string;
    title: string;
    party: string;
    partyShortName: string;
    partySymbol: string; // URL or local path
    portrait: string; // URL or local path
    father?: {
      name: string;
      portrait: string;
      legacyText: string;
    };
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo?: string;
    watermark?: string;
  };
}

export const leadershipConfig: LeadershipConfig = {
  // Toggle this to "public" for the neutral, unbranded citizen view.
  // Toggle to "mla-demo" for the emotionally resonant presentation view.
  mode: "mla-demo",
  
  currentRepresentative: {
    name: "Sri Bojjala Venkata Sudhir Reddy",
    title: "MLA, Srikalahasti Assembly Constituency",
    party: "Telugu Desam Party",
    partyShortName: "TDP",
    partySymbol: "/images/tdp-symbol.png", // We can add actual assets later
    portrait: "/images/sudhir-reddy.jpg",
    father: {
      name: "Sri Bojjala Gopala Krishna Reddy",
      portrait: "/images/gopala-krishna-reddy.jpg",
      legacyText: "A legacy of public leadership in Srikalahasti. This proposed platform carries that spirit into the digital age by giving citizens a structured voice and giving public representatives a clearer view of constituency needs."
    }
  },
  
  branding: {
    primaryColor: "#123B63",   // Deep Navy Blue
    secondaryColor: "#D49A28", // Saffron / Gold
    accentColor: "#F4E4B5",
  }
};
