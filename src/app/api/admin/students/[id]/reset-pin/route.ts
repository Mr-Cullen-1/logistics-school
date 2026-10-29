import argon2 from "argon2";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, users } from "@/db/schema";
import { adminAccess } from "@/lib/auth/admin";
import { generatePin } from "@/lib/auth/pin";
import { sameOrigin } from "@/lib/auth/request";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const access = await adminAccess(request);
  if (access.error) return access.error;
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "O'quvchi topilmadi" }, { status: 404 });

  const pin = generatePin();
  const passwordHash = await argon2.hash(pin);
  const reset = await getDatabase().transaction(async (tx) => {
    const [student] = await tx.update(users).set({
      passwordHash,
      mustChangePassword: true,
      sessionVersion: sql`${users.sessionVersion} + 1`,
    }).where(and(eq(users.id, id), eq(users.role, "student"))).returning({ id: users.id });
    if (!student) return false;
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "student.pin_reset", targetType: "user", targetId: student.id });
    return true;
  });
  if (!reset) return NextResponse.json({ error: "O'quvchi topilmadi" }, { status: 404 });
  return NextResponse.json({ pin }, { headers: { "Cache-Control": "no-store" } });
}
