import argon2 from "argon2";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { users } from "@/db/schema";
import { currentUser } from "@/lib/auth/current-user";
import { passwordProblem } from "@/lib/auth/password-policy";
import { tooManyFailures, recordLoginAttempt } from "@/lib/auth/rate-limit";
import { clientIp, sameOrigin } from "@/lib/auth/request";
import { SESSION_COOKIE, setSessionCookie, signSession } from "@/lib/auth/session";

const bodySchema = z.object({ currentPassword: z.string().max(256), newPassword: z.string().max(256), confirmation: z.string().max(256) });

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So‘rov rad etildi" }, { status: 403 });
  const user = await currentUser(request.cookies.get(SESSION_COOKIE)?.value);
  if (!user || user.role !== "student" || user.mustChangePassword) return NextResponse.json({ error: "Ruxsat yo‘q" }, { status: 401 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Parollarni to‘liq kiriting" }, { status: 400 });
  if (await tooManyFailures(user.phone, clientIp(request))) return NextResponse.json({ error: "Urinishlar ko‘p. 15 daqiqadan keyin qayta urinib ko‘ring" }, { status: 429 });

  const [existing] = await getDatabase().select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, user.id)).limit(1);
  if (!existing || !await argon2.verify(existing.passwordHash, parsed.data.currentPassword)) {
    await recordLoginAttempt(user.phone, clientIp(request), false);
    return NextResponse.json({ error: "Joriy parol noto‘g‘ri" }, { status: 400 });
  }
  if (parsed.data.newPassword !== parsed.data.confirmation) return NextResponse.json({ error: "Yangi parollar bir xil emas" }, { status: 400 });
  const problem = passwordProblem(parsed.data.newPassword, user.phone);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });
  if (await argon2.verify(existing.passwordHash, parsed.data.newPassword)) return NextResponse.json({ error: "Yangi parol joriy paroldan farq qilishi kerak" }, { status: 400 });

  const passwordHash = await argon2.hash(parsed.data.newPassword);
  const [updated] = await getDatabase().update(users).set({ passwordHash, sessionVersion: sql`${users.sessionVersion} + 1` })
    .where(and(eq(users.id, user.id), eq(users.sessionVersion, user.sessionVersion))).returning({ sessionVersion: users.sessionVersion });
  if (!updated) return NextResponse.json({ error: "Sessiya o‘zgargan. Qayta kiring" }, { status: 409 });
  const response = NextResponse.json({ ok: true });
  setSessionCookie(response, await signSession(user.id, updated.sessionVersion));
  return response;
}
