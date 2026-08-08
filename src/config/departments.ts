export interface DepartmentGuide {
  id: string;
  name: string;
  nameTe: string;
  issues: string[];
  firstContact: string;
  commonDocuments: string[];
  escalationRoute: string;
  color: string;
}

export const departmentsConfig: DepartmentGuide[] = [
  {
    id: "revenue",
    name: "Revenue",
    nameTe: "రెవెన్యూ",
    issues: ["Income certificate", "Caste certificate", "Land records", "Pattadar passbook", "Crop loan", "Revenue records"],
    firstContact: "Village Revenue Officer (VRO) → Mandal Revenue Officer (MRO) → Revenue Divisional Officer (RDO)",
    commonDocuments: ["Aadhaar", "Ration card", "Land documents", "Application form"],
    escalationRoute: "MRO → RDO → District Collector",
    color: "#3b82f6",
  },
  {
    id: "police",
    name: "Police",
    nameTe: "పోలీసు",
    issues: ["Safety concern", "Theft or robbery", "Harassment", "Property dispute", "Missing person", "Cybercrime"],
    firstContact: "Nearest Police Station → Sub-Inspector (SI) → Inspector",
    commonDocuments: ["Aadhaar", "Written complaint", "Evidence photographs", "Witnesses list"],
    escalationRoute: "Inspector → DSP → SP (Superintendent of Police)",
    color: "#64748b",
  },
  {
    id: "municipal",
    name: "Municipal Administration",
    nameTe: "పురపాలక సంస్థ",
    issues: ["Road damage", "Streetlights", "Drainage", "Garbage collection", "Water supply", "Storm drains"],
    firstContact: "Ward Councilor → Municipal Commissioner",
    commonDocuments: ["Address proof", "Complaint in writing", "Photos of issue"],
    escalationRoute: "Municipal Commissioner → Director of Municipal Administration",
    color: "#10b981",
  },
  {
    id: "health",
    name: "Health",
    nameTe: "ఆరోగ్య శాఖ",
    issues: ["PHC not functioning", "Medicine unavailability", "Doctor absent", "Sanitation", "Vaccination"],
    firstContact: "Primary Health Centre (PHC) → Mandal Health Officer",
    commonDocuments: ["Patient records if relevant", "Photographic evidence"],
    escalationRoute: "Mandal Health Officer → District Medical Officer (DMO)",
    color: "#ef4444",
  },
  {
    id: "civil-supplies",
    name: "Civil Supplies",
    nameTe: "పౌర సరఫరాలు",
    issues: ["Ration card issue", "PDS grain not received", "Ration shop closed", "Quality of grains"],
    firstContact: "Fair Price Shop → Mandal Supply Officer",
    commonDocuments: ["Ration card", "Aadhaar", "Complaint in writing"],
    escalationRoute: "Mandal Supply Officer → District Collector (Food & Civil Supplies)",
    color: "#f59e0b",
  },
  {
    id: "electricity",
    name: "Electricity (APSPDCL)",
    nameTe: "విద్యుత్ శాఖ",
    issues: ["Power outage", "Excess billing", "Transformer issue", "New connection", "Meter issue"],
    firstContact: "APSPDCL Section Office → Assistant Engineer (AE)",
    commonDocuments: ["Consumer number", "Electricity bill", "Application form"],
    escalationRoute: "AE → DE → SE → Superintending Engineer",
    color: "#f59e0b",
  },
  {
    id: "panchayat-raj",
    name: "Panchayat Raj",
    nameTe: "పంచాయతీ రాజ్",
    issues: ["MGNREGS payment", "Village roads", "Drinking water (rural)", "Anganwadi", "PMAY housing"],
    firstContact: "Village Panchayat Secretary → MPDO (Mandal Panchayat Development Officer)",
    commonDocuments: ["Job card (NREGS)", "Aadhaar", "Complaint in writing"],
    escalationRoute: "MPDO → District Panchayat Officer",
    color: "#22c55e",
  },
  {
    id: "education",
    name: "Education",
    nameTe: "విద్యా శాఖ",
    issues: ["School not functioning", "Teacher absent", "Mid-day meal", "Scholarship", "Books not distributed"],
    firstContact: "School Headmaster → Mandal Educational Officer (MEO)",
    commonDocuments: ["Student ID", "Parent Aadhaar", "Complaint in writing"],
    escalationRoute: "MEO → District Education Officer (DEO)",
    color: "#8b5cf6",
  },
];
