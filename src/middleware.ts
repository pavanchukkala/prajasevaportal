import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/mla", "/staff", "/reviewer", "/department", "/admin"];

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
  }

  // Old /dashboard and /complaint routes — redirect to safe equivalents
  if (pathname === "/dashboard") {
    const session = request.cookies.get("psip_session");
    if (!session?.value) {
      return NextResponse.redirect(new URL("/staff/login", request.url));
    }
    return NextResponse.redirect(new URL("/mla/dashboard", request.url));
  }

  if (pathname.startsWith("/complaint/")) {
    const session = request.cookies.get("psip_session");
    if (!session?.value) {
      return NextResponse.redirect(new URL("/staff/login", request.url));
    }
    const id = pathname.replace("/complaint/", "");
    return NextResponse.redirect(new URL(`/mla/complaint/${id}`, request.url));
  }

  // Security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/health).*)",
  ],
};
