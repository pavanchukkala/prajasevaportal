import { NextRequest, NextResponse } from "next/server";

// ── Credential loader — env vars ONLY ────────────────────────────────────────
// Required env vars (set in .env.local or Render dashboard):
//   PSIP_ADMIN_USER, PSIP_ADMIN_PASS
//   PSIP_REVIEWER_USER, PSIP_REVIEWER_PASS
//   PSIP_MLA_USER, PSIP_MLA_PASS
//   PSIP_DEPT_USER, PSIP_DEPT_PASS
//
// If none are set in dev, fallback credentials are printed ONCE to server
// console on startup. They are NEVER returned in any API response.

type Role = "administrator" | "mla_staff" | "reviewer" | "department_officer";

interface StaffUser {
  username: string;
  passwordHash: string; // plaintext in demo — swap for bcrypt in prod
  role: Role;
  displayName: string;
}

function getStaffUsers(): StaffUser[] {
  const users: StaffUser[] = [];

  const add = (
    envUser: string | undefined,
    envPass: string | undefined,
    role: Role,
    displayName: string,
    devUser: string,
    devPass: string
  ) => {
    const u = envUser ?? (process.env.NODE_ENV !== "production" ? devUser : undefined);
    const p = envPass ?? (process.env.NODE_ENV !== "production" ? devPass : undefined);
    if (u && p) users.push({ username: u, passwordHash: p, role, displayName });
  };

  add(process.env.PSIP_ADMIN_USER, process.env.PSIP_ADMIN_PASS, "administrator", "System Administrator", "admin", "dev-admin-2026");
  add(process.env.PSIP_MLA_USER, process.env.PSIP_MLA_PASS, "mla_staff", "MLA Office Staff", "mla_staff", "dev-mla-2026");
  add(process.env.PSIP_REVIEWER_USER, process.env.PSIP_REVIEWER_PASS, "reviewer", "Case Reviewer", "reviewer", "dev-reviewer-2026");
  add(process.env.PSIP_DEPT_USER, process.env.PSIP_DEPT_PASS, "department_officer", "Department Officer", "dept_officer", "dev-dept-2026");

  // Warn once if using dev fallbacks
  if (!process.env.PSIP_ADMIN_USER && process.env.NODE_ENV !== "production") {
    const G = globalThis as Record<string, unknown>;
    if (!G.__psip_credWarn) {
      G.__psip_credWarn = true;
      console.warn(
        "\n[PSIP] ⚠  No credentials configured via environment variables." +
        "\n[PSIP]    Dev fallback logins (server console only):" +
        "\n[PSIP]    admin / dev-admin-2026" +
        "\n[PSIP]    mla_staff / dev-mla-2026" +
        "\n[PSIP]    reviewer / dev-reviewer-2026" +
        "\n[PSIP]    dept_officer / dev-dept-2026" +
        "\n[PSIP]    Set PSIP_*_USER and PSIP_*_PASS in .env.local for production.\n"
      );
    }
  }

  return users;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const users = getStaffUsers();
    const user = users.find(
      (u) => u.username === username && u.passwordHash === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials. All login attempts are logged." },
        { status: 401 }
      );
    }

    // Role → dashboard redirect
    const redirectMap: Record<Role, string> = {
      administrator: "/admin/settings",
      mla_staff: "/mla/dashboard",
      reviewer: "/reviewer/cases",
      department_officer: "/department/workspace",
    };

    const response = NextResponse.json({
      success: true,
      role: user.role,
      name: user.displayName,
      redirect: redirectMap[user.role],
      message: "Authenticated successfully.",
    });

    response.cookies.set(
      "psip_session",
      `${user.username}:${user.role}`,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 8, // 8 hours
        path: "/",
      }
    );

    return response;
  } catch {
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
