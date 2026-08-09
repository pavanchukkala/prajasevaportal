// ============================================================
// Developer Configuration
// All fields are editable. Empty fields display elegant placeholders.
// Do NOT invent facts not provided here.
// ============================================================

export interface DeveloperConfig {
  name: string;
  title: string;
  shortBio: string;         // Displayed in popup — approved sentences only
  longStory: string;        // Displayed on /developer page — approved paragraphs only
  photo?: string;           // Path to photo file in /public/
  location?: string;
  email?: string;
  links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  values: string[];         // Approved values/principles
  approvedFacts: string[];  // Only display these — do not add more
  platformContext: string;  // What this platform is about
}

export const developerConfig: DeveloperConfig = {
  name: "Pavan Chukkala",
  title: "Civic Technology Architect",
  shortBio:
    "This platform is an independent civic-technology initiative created to explore how responsible AI, citizen evidence and constituency-level public-service coordination can work together.",
  longStory:
    "This platform was designed and built as a proposed civic-technology initiative. It explores a central question: can responsible AI, secure citizen reporting and constituency-level coordination meaningfully improve public-service accountability in India? The design reflects a belief that technology should serve citizens rather than impress them, and that AI must augment human judgment — not replace it.",
  photo: undefined, // Set to '/images/developer.jpg' when available
  location: "Andhra Pradesh, India",
  email: undefined, // Add when ready to receive enquiries
  links: {
    github: "https://github.com/pavanchukkala",
    linkedin: undefined,
    twitter: undefined,
    portfolio: undefined,
  },
  values: [
    "Responsible AI — humans must make decisions",
    "Privacy by design — collect only what is needed",
    "Honest representation — never claim more than implemented",
    "Bilingual by default — Telugu is a first-class language here",
    "Public accountability — the system serves citizens, not officials",
  ],
  approvedFacts: [
    "Built this platform as an independent civic-technology initiative",
    "Designed for Srikalahasti Assembly Constituency No. 168, Tirupati District",
    "Used Next.js, TypeScript and Tailwind CSS",
    "Implemented bilingual English/Telugu support",
    "Implemented role-based authentication and route protection",
    "Used Gemini API with a structured local fallback for AI analysis",
  ],
  platformContext:
    "Srikalahasti Assembly Constituency No. 168 · Tirupati District · Andhra Pradesh",
};
