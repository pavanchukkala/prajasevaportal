import { NextRequest, NextResponse } from "next/server";

// Demo credentials — replace with real hashed password check in production
const DEMO_USERS = [
  { username: "mla_admin", password: "PrajaSevaDemo2026", role: "mla_staff", name: "MLA Office" },
  { username: "reviewer", password: "ReviewerDemo2026", role: "reviewer", name: "Case Reviewer" },
];

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const user = DEMO_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // In production: use JWT or session DB. For demo: simple cookie.
    const response = NextResponse.json({
      success: true,
      role: user.role,
      name: user.name,
      message: "Authenticated successfully",
    });

    response.cookies.set("psip_session", `${user.username}:${user.role}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
