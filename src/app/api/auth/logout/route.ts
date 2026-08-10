import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.delete("psip_session");
  return response;
}

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/staff/login", request.url));
  response.cookies.delete("psip_session");
  return response;
}
