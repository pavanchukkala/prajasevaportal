import { cookies } from "next/headers";

export interface SessionUser {
  username: string;
  role: "mla_staff" | "reviewer" | "department_officer" | "administrator";
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("psip_session");

  if (!session?.value) return null;

  const [username, role] = session.value.split(":");
  if (!username || !role) return null;

  return {
    username,
    role: role as SessionUser["role"],
  };
}

export function hasRole(user: SessionUser | null, requiredRole: string): boolean {
  if (!user) return false;
  const roleHierarchy = ["reviewer", "mla_staff", "department_officer", "administrator"];
  const userLevel = roleHierarchy.indexOf(user.role);
  const requiredLevel = roleHierarchy.indexOf(requiredRole);
  return userLevel >= requiredLevel;
}
