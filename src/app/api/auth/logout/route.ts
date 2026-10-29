import { NextRequest, NextResponse } from "next/server";

import { sameOrigin } from "@/lib/auth/request";
import { clearSessionCookie } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const response = NextResponse.json({ next: "/login" });
  clearSessionCookie(response);
  return response;
}
