import { NextResponse } from "next/server";

function clearSession(response: NextResponse) {
  response.cookies.set("psip_session", "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "strict" });
  return response;
}

export async function POST() {
  return clearSession(NextResponse.json({ success: true, redirect: "/staff/login" }, { headers: { "Cache-Control": "no-store" } }));
}

export async function GET(request: Request) {
  return clearSession(NextResponse.redirect(new URL("/staff/login", request.url)));
}
