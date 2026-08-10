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

export function getDefaultRedirectForRole(role: SessionUser["role"]): string {
  switch (role) {
    case "administrator":
      return "/admin/settings";
    case "reviewer":
      return "/reviewer/cases";
    case "department_officer":
      return "/department/workspace";
    case "mla_staff":
    default:
      return "/mla/dashboard";
  }
}

export function isRouteAllowedForRole(role: SessionUser["role"], pathname: string): boolean {
  if (role === "administrator") return true;

  if (pathname.startsWith("/admin")) {
    return false;
  }

  if (pathname.startsWith("/department")) {
    return role === "department_officer";
  }

  if (pathname.startsWith("/reviewer")) {
    return role === "reviewer";
  }

  if (pathname.startsWith("/mla")) {
    return role === "mla_staff" || role === "reviewer";
  }

  return true;
}

