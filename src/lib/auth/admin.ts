import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { currentUser } from "./current-user";
import { SESSION_COOKIE } from "./session";

export async function adminAccess(request: NextRequest) {
  const user = await currentUser(request.cookies.get(SESSION_COOKIE)?.value ?? "");
  if (!user) return { error: NextResponse.json({ error: "Kirish talab qilinadi" }, { status: 401 }) } as const;
  if (user.mustChangePassword || user.role === "student") {
    return { error: NextResponse.json({ error: "Ruxsat yo'q" }, { status: 403 }) } as const;
  }
  return { user } as const;
}

export async function superAdminAccess(request: NextRequest) {
  const access = await adminAccess(request);
  if (access.error) return access;
  if (access.user.role !== "super_admin") {
    return { error: NextResponse.json({ error: "Faqat super admin ruxsatiga ega" }, { status: 403 }) } as const;
  }
  return access;
}
