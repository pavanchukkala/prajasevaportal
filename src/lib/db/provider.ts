import { ComplaintData, ComplaintStatus } from "../db";

export interface DatabaseHealthInfo {
  provider: "postgres" | "sqlite_file";
  connected: boolean;
  latencyMs: number;
  totalRecords: number;
  liveRecords: number;
  sampleRecords: number;
}

export interface IDatabaseAdapter {
  providerName: "postgres" | "sqlite_file";
  init(): Promise<void>;
  getHealth(): Promise<DatabaseHealthInfo>;
  insertComplaint(data: Omit<ComplaintData, "id" | "trackingToken" | "createdAt" | "status" | "auditLog">): Promise<ComplaintData>;
  updateComplaintStatus(id: string, updates: {
    status?: ComplaintStatus;
    assignedTo?: string;
    assignedDepartment?: string;
    internalNote?: string;
    actor?: string;
  }): Promise<ComplaintData | null>;
  getComplaintById(id: string): Promise<ComplaintData | null>;
  getComplaintByTrackingToken(token: string): Promise<ComplaintData | null>;
  listComplaints(): Promise<ComplaintData[]>;
  listLiveComplaints(): Promise<ComplaintData[]>;
  listSampleComplaints(): Promise<ComplaintData[]>;
  getComplaintStats(): Promise<{
    total: number;
    live: number;
    sample: number;
    new: number;
    underReview: number;
    resolved: number;
    highPriority: number;
  }>;
}
