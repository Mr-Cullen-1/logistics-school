import argon2 from "argon2";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { users } from "@/db/schema";
import { destinationFor } from "@/lib/auth/current-user";
import { normalizePhone } from "@/lib/auth/phone";
import { tooManyFailures, recordLoginAttempt } from "@/lib/auth/rate-limit";
import { clientIp, sameOrigin } from "@/lib/auth/request";
import { setSessionCookie, signSession } from "@/lib/auth/session";

const bodySchema = z.object({ phone: z.string().max(40), password: z.string().min(1).max(256) });
const genericError = "Telefon yoki parol noto'g'ri";
const dummyHash = argon2.hash("no-account-placeholder");

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: genericError }, { status: 400 });

  const phone = normalizePhone(parsed.data.phone);
  if (!phone) return NextResponse.json({ error: genericError }, { status: 401 });
  const ip = clientIp(request);
  if (await tooManyFailures(phone, ip)) {
    return NextResponse.json({ error: "Juda ko'p urinish. 15 daqiqadan keyin qayta urinib ko'ring." }, { status: 429 });
  }

  const [user] = await getDatabase().select().from(users).where(eq(users.phone, phone)).limit(1);
  const valid = await argon2.verify(user?.isActive ? user.passwordHash : await dummyHash, parsed.data.password);
  if (!user?.isActive || !valid) {
    await recordLoginAttempt(phone, ip, false);
    return NextResponse.json({ error: genericError }, { status: 401 });
  }

  await recordLoginAttempt(phone, ip, true);
  await getDatabase().update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
  const token = await signSession(user.id, user.sessionVersion);
  const response = NextResponse.json({ next: destinationFor(user) });
  setSessionCookie(response, token);
  return response;
}
