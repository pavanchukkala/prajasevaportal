import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/mla", "/staff", "/reviewer", "/department", "/admin"];

type SessionRole = "administrator" | "mla_staff" | "reviewer" | "department_officer";

const ROLE_HOME: Record<SessionRole, string> = {
  administrator: "/admin/settings",
  reviewer: "/reviewer/cases",
  department_officer: "/department/workspace",
  mla_staff: "/mla/dashboard",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname.startsWith(path) && pathname !== "/staff/login"
  );

  if (isProtected) {
    const session = request.cookies.get("psip_session");
    if (!session?.value) {
      const loginUrl = new URL("/staff/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const parts = session.value.split(":");
    const role = (parts[1] ?? "") as SessionRole;

    // RBAC Route Enforcement
    if (pathname.startsWith("/admin") && role !== "administrator") {
      const home = ROLE_HOME[role] ?? "/mla/dashboard";
      return NextResponse.redirect(new URL(home, request.url));
    }

    if (pathname.startsWith("/department") && role !== "department_officer" && role !== "administrator") {
      const home = ROLE_HOME[role] ?? "/mla/dashboard";
      return NextResponse.redirect(new URL(home, request.url));
    }

    if (pathname.startsWith("/reviewer") && role !== "reviewer" && role !== "administrator") {
      const home = ROLE_HOME[role] ?? "/mla/dashboard";
      return NextResponse.redirect(new URL(home, request.url));
    }

    if (pathname.startsWith("/mla") && role !== "mla_staff" && role !== "reviewer" && role !== "administrator") {
      const home = ROLE_HOME[role] ?? "/department/workspace";
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  // Old /dashboard and /complaint routes — redirect to safe equivalents
  if (pathname === "/dashboard") {
    const session = request.cookies.get("psip_session");
    if (!session?.value) {
      return NextResponse.redirect(new URL("/staff/login", request.url));
    }
    const role = (session.value.split(":")[1] ?? "mla_staff") as SessionRole;
    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/mla/dashboard", request.url));
  }

  if (pathname.startsWith("/complaint/")) {
    const session = request.cookies.get("psip_session");
    if (!session?.value) {
      return NextResponse.redirect(new URL("/staff/login", request.url));
    }
    const id = pathname.replace("/complaint/", "");
    const role = (session.value.split(":")[1] ?? "mla_staff") as SessionRole;
    if (role === "reviewer") {
      return NextResponse.redirect(new URL(`/reviewer/case/${id}`, request.url));
    }
    if (role === "department_officer") {
      return NextResponse.redirect(new URL(`/department/case/${id}`, request.url));
    }
    return NextResponse.redirect(new URL(`/mla/complaint/${id}`, request.url));
  }

  // Security and Cache Freshness headers
  const response = NextResponse.next();
  const APP_VERSION = process.env.RENDER_GIT_COMMIT?.slice(0, 7) || process.env.NEXT_PUBLIC_APP_VERSION || "8d92257";

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-App-Version", APP_VERSION);
  response.headers.set("X-Commit-SHA", APP_VERSION);

  // Dynamic & protected routes MUST revalidate to prevent stale shells
  if (pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  } else if (
    pathname.startsWith("/mla") ||
    pathname.startsWith("/reviewer") ||
    pathname.startsWith("/department") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/staff")
  ) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
  } else if (!pathname.startsWith("/_next/static")) {
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0");
    response.headers.set("Pragma", "no-cache");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/health).*)",
  ],
};
