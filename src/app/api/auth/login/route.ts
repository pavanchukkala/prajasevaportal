import { NextRequest, NextResponse } from "next/server";

type Role = "administrator" | "mla_staff";

interface StaffUser {
  username: string;
  passwordHash: string;
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
    const u = envUser && envUser.trim() ? envUser.trim() : devUser;
    const p = envPass && envPass.trim() ? envPass.trim() : devPass;
    if (u && p) users.push({ username: u, passwordHash: p, role, displayName });
  };

  add(process.env.PSIP_ADMIN_USER, process.env.PSIP_ADMIN_PASS, "administrator", "System Administrator", "admin", "dev-admin-2026");
  add(process.env.PSIP_MLA_USER, process.env.PSIP_MLA_PASS, "mla_staff", "Action Dashboard Staff", "mla_staff", "dev-mla-2026");

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
      (u) => u.username.trim() === username.trim() && u.passwordHash.trim() === password.trim()
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials. All login attempts are logged." },
        { status: 401 }
      );
    }

    const redirectMap: Record<Role, string> = {
      administrator: "/mla/dashboard",
      mla_staff: "/mla/dashboard",
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
        maxAge: 60 * 60 * 8,
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
