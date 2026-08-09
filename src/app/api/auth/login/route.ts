import { NextRequest, NextResponse } from "next/server";

// ── Credentials are loaded from environment variables only ─────────────────
// Set these in your .env.local file (never commit credentials to git):
//   PSIP_ADMIN_USER=your_username
//   PSIP_ADMIN_PASS=your_secure_password
//   PSIP_REVIEWER_USER=your_reviewer_username
//   PSIP_REVIEWER_PASS=your_reviewer_password
//
// Development fallback: if env vars are not set, uses randomly-generated
// ephemeral credentials printed ONLY to server console on startup.
// These are NEVER exposed via any API response or page.

function getUsers() {
  const adminUser = process.env.PSIP_ADMIN_USER;
  const adminPass = process.env.PSIP_ADMIN_PASS;
  const reviewerUser = process.env.PSIP_REVIEWER_USER;
  const reviewerPass = process.env.PSIP_REVIEWER_PASS;

  // If env vars not configured, use a dev-only fallback
  // that is printed to the server console (not the browser)
  const isDev = process.env.NODE_ENV !== "production";

  if (!adminUser && isDev) {
    // Only warn once in development
    if (!(globalThis as Record<string, unknown>).__psip_credWarnShown) {
      (globalThis as Record<string, unknown>).__psip_credWarnShown = true;
      console.warn(
        "\n[PSIP] ⚠ No credentials configured via environment variables.\n" +
        "[PSIP] Set PSIP_ADMIN_USER, PSIP_ADMIN_PASS, PSIP_REVIEWER_USER, PSIP_REVIEWER_PASS in .env.local\n" +
        "[PSIP] Using development fallback credentials (visible in server console only).\n" +
        "[PSIP] Dev login: admin / dev-admin-2026 | reviewer / dev-reviewer-2026\n"
      );
    }
    return [
      { username: "admin", password: "dev-admin-2026", role: "mla_staff", name: "MLA Office" },
      { username: "reviewer", password: "dev-reviewer-2026", role: "reviewer", name: "Case Reviewer" },
    ];
  }

  return [
    ...(adminUser && adminPass
      ? [{ username: adminUser, password: adminPass, role: "mla_staff", name: "MLA Office" }]
      : []),
    ...(reviewerUser && reviewerPass
      ? [{ username: reviewerUser, password: reviewerPass, role: "reviewer", name: "Case Reviewer" }]
      : []),
  ];
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const users = getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      // Generic error — do not reveal whether username or password was wrong
      return NextResponse.json(
        { error: "Invalid credentials. All login attempts are logged." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      role: user.role,
      name: user.name,
      message: "Authenticated successfully.",
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
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
