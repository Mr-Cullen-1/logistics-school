import argon2 from "argon2";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { users } from "@/db/schema";
import { currentUser, destinationFor } from "@/lib/auth/current-user";
import { passwordProblem } from "@/lib/auth/password-policy";
import { sameOrigin } from "@/lib/auth/request";
import { SESSION_COOKIE, setSessionCookie, signSession } from "@/lib/auth/session";

const bodySchema = z.object({ password: z.string().max(256), confirmation: z.string().max(256) });

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const user = await currentUser(request.cookies.get(SESSION_COOKIE)?.value);
  if (!user) return NextResponse.json({ error: "Sessiya tugagan. Qayta kiring." }, { status: 401 });
  if (!user.mustChangePassword) return NextResponse.json({ error: "Parol allaqachon almashtirilgan" }, { status: 409 });
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Yangi parolni kiriting" }, { status: 400 });
  if (parsed.data.password !== parsed.data.confirmation) {
    return NextResponse.json({ error: "Parollar bir xil emas" }, { status: 400 });
  }
  const problem = passwordProblem(parsed.data.password, user.phone);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const [existing] = await getDatabase().select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, user.id)).limit(1);
  if (!existing || await argon2.verify(existing.passwordHash, parsed.data.password)) {
    return NextResponse.json({ error: "Yangi parol avvalgi PINga teng bo'lmasligi kerak" }, { status: 400 });
  }
  const passwordHash = await argon2.hash(parsed.data.password);
  const [updated] = await getDatabase().update(users).set({
    passwordHash,
    mustChangePassword: false,
    sessionVersion: sql`${users.sessionVersion} + 1`,
  }).where(and(eq(users.id, user.id), eq(users.sessionVersion, user.sessionVersion), eq(users.mustChangePassword, true))).returning({ sessionVersion: users.sessionVersion });
  if (!updated) return NextResponse.json({ error: "Sessiya o'zgargan. Qayta kiring." }, { status: 409 });

  const token = await signSession(user.id, updated.sessionVersion);
  const response = NextResponse.json({ next: destinationFor({ ...user, mustChangePassword: false }) });
  setSessionCookie(response, token);
  return response;
}
