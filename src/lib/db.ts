// Mock Database Client
// In production: replace with Supabase, PlanetScale, or PostgreSQL

export interface ComplaintData {
  id: string;
  description: string;
  mandal: string;
  village?: string;
  department?: string;
  mediaUrls: string[];
  audioUrl?: string;
  createdAt: string;
  updatedAt?: string;
  status: "New" | "AI Processed" | "Under Review" | "Forwarded" | "Resolved" | "Closed";
  aiAnalysis?: {
    title: string;
    category: string;
    department: string;
    urgency: string;
    credibilityBand: string;
    confidenceScore: number;
    missingInformation: string[];
    recommendedAction: string;
    legalDisclaimer: string;
  };
  dataSource: "citizen_submission" | "sample_presentation";
  isSample: boolean;
  reviewNotes?: string;
  assignedTo?: string;
  auditLog?: Array<{ timestamp: string; action: string; actor: string }>;
}

export const SAMPLE_COMPLAINTS: ComplaintData[] = [
  {
    id: "SKT-2026-00142",
    description: "There appears to be a significant delay in the processing and issuance of welfare certificates at the local village secretariat. Multiple families have waited over 30 days without receiving their documents.",
    mandal: "Yerpedu",
    village: "Yerpedu Town",
    department: "Revenue",
    mediaUrls: [],
    createdAt: "2026-08-07T09:15:00Z",
    status: "Under Review",
    aiAnalysis: {
      title: "Welfare Certificate Issuance Delay — Village Secretariat",
      category: "Welfare Access",
      department: "Revenue",
      urgency: "Priority",
      credibilityBand: "Medium",
      confidenceScore: 78,
      missingInformation: ["Names of affected families not provided", "No photographic evidence of queues or notices"],
      recommendedAction: "Route to Mandal Revenue Officer, Yerpedu for verification of processing timelines.",
      legalDisclaimer: "AI-generated preliminary assessment. This is not a legal finding, factual determination, finding of guilt, or replacement for official investigation."
    },
    dataSource: "sample_presentation",
    isSample: true,
  },
  {
    id: "SKT-2026-00143",
    description: "A major underground drinking water pipeline has reportedly burst near the central junction in Ward 12 of Srikalahasti town. Local residents report water contamination affecting approximately 50 households.",
    mandal: "Srikalahasti",
    village: "Ward 12",
    department: "Municipal Administration",
    mediaUrls: [],
    createdAt: "2026-08-08T11:30:00Z",
    status: "AI Processed",
    aiAnalysis: {
      title: "Drinking Water Pipeline Failure — 50 Households Affected",
      category: "Infrastructure — Water Supply",
      department: "Municipal Administration",
      urgency: "High",
      credibilityBand: "High",
      confidenceScore: 91,
      missingInformation: ["Photographic evidence of burst would strengthen this"],
      recommendedAction: "Alert Municipal Commissioner immediately. Public health risk classification applies.",
      legalDisclaimer: "AI-generated preliminary assessment. This is not a legal finding, factual determination, finding of guilt, or replacement for official investigation."
    },
    dataSource: "sample_presentation",
    isSample: true,
  },
  {
    id: "SKT-2026-00144",
    description: "Complainant reports being asked for an unofficial payment to process a land mutation file at the sub-registrar office in Thottambedu. No receipt was offered.",
    mandal: "Thottambedu",
    village: "Thottambedu",
    department: "Registration & Stamps",
    mediaUrls: [],
    createdAt: "2026-08-08T14:00:00Z",
    status: "Under Review",
    aiAnalysis: {
      title: "Alleged Unofficial Payment Request — Land Mutation",
      category: "Alleged Misconduct — Financial Irregularity",
      department: "Registration & Stamps",
      urgency: "High",
      credibilityBand: "Low",
      confidenceScore: 58,
      missingInformation: ["No documentary or audio evidence provided", "Single complainant — no corroborating account", "Specific name not provided"],
      recommendedAction: "Flag for human review before escalation. Contradiction indicators present. Request additional evidence from complainant before any departmental action.",
      legalDisclaimer: "AI-generated preliminary assessment. This is not a legal finding, factual determination, finding of guilt, or replacement for official investigation. Do not act on this assessment without human review and additional verification."
    },
    dataSource: "sample_presentation",
    isSample: true,
  },
];

export const db = {
  complaints: {
    async insert(data: Omit<ComplaintData, "id" | "createdAt" | "status">): Promise<ComplaintData> {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        ...data,
        id: "SKT-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000),
        createdAt: new Date().toISOString(),
        status: "New",
        dataSource: data.dataSource ?? "citizen_submission",
        isSample: data.isSample ?? false,
      };
    },

    async update(id: string, updates: Partial<ComplaintData>): Promise<void> {
      console.log(`[DB] Update ${id}:`, updates);
      await new Promise(resolve => setTimeout(resolve, 500));
    },

    async getById(id: string): Promise<ComplaintData | null> {
      await new Promise(resolve => setTimeout(resolve, 300));
      return SAMPLE_COMPLAINTS.find(c => c.id === id) ?? null;
    },

    async list(): Promise<ComplaintData[]> {
      await new Promise(resolve => setTimeout(resolve, 300));
      return SAMPLE_COMPLAINTS;
    },
  },

  storage: {
    async uploadFile(file: File, path: string): Promise<string> {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `https://mock-storage.url/${path}/${file.name}`;
    },
  },
};
