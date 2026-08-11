export interface DepartmentInfo {
  key: string;
  label: string;
  shortName: string;
}

export const CANONICAL_DEPARTMENTS: DepartmentInfo[] = [
  { key: "revenue", label: "Revenue (MRO / Tahsildar)", shortName: "Revenue" },
  { key: "municipal", label: "Municipal Administration", shortName: "Municipal" },
  { key: "panchayat_raj", label: "Panchayat Raj & Rural Dev", shortName: "Panchayat Raj" },
  { key: "roads_buildings", label: "Roads & Buildings (R&B)", shortName: "Roads & Buildings" },
  { key: "ap_transco", label: "AP Transco (Electricity)", shortName: "AP Transco" },
  { key: "rural_water_supply", label: "Rural Water Supply (RWS)", shortName: "Rural Water Supply" },
  { key: "police", label: "Police / Law & Order", shortName: "Police" },
  { key: "women_child_welfare", label: "Women & Child Welfare", shortName: "Women & Child Welfare" },
  { key: "irrigation", label: "Irrigation Department", shortName: "Irrigation" },
];

export function normalizeDepartmentKey(deptStr?: string | null): string {
  if (!deptStr) return "unassigned";
  const s = deptStr.toLowerCase().trim();

  if (s.includes("revenue") || s.includes("mro") || s.includes("tahsildar")) return "revenue";
  if (s.includes("municipal") || s.includes("urban")) return "municipal";
  if (s.includes("panchayat") || s.includes("rural dev")) return "panchayat_raj";
  if (s.includes("road") || s.includes("building") || s.includes("r&b")) return "roads_buildings";
  if (s.includes("transco") || s.includes("electricity") || s.includes("power")) return "ap_transco";
  if (s.includes("water") || s.includes("rws") || s.includes("rural water")) return "rural_water_supply";
  if (s.includes("police") || s.includes("law") || s.includes("order")) return "police";
  if (s.includes("women") || s.includes("child") || s.includes("welfare")) return "women_child_welfare";
  if (s.includes("irrigation")) return "irrigation";

  return "unassigned";
}

export function getDepartmentLabel(deptStr?: string | null): string {
  const key = normalizeDepartmentKey(deptStr);
  const found = CANONICAL_DEPARTMENTS.find((d) => d.key === key);
  if (found) return found.label;
  if (key === "unassigned") return "Unassigned Live Complaints";
  return deptStr || "Unassigned";
}

export function isSameDepartment(deptA?: string | null, deptB?: string | null): boolean {
  const keyA = normalizeDepartmentKey(deptA);
  const keyB = normalizeDepartmentKey(deptB);
  if (keyA === "unassigned" || keyB === "unassigned") return false;
  return keyA === keyB;
}
