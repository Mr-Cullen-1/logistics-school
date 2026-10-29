import { and, eq, ne, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, users } from "@/db/schema";
import { adminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";

const input = z.object({ isActive: z.boolean() });

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const access = await adminAccess(request);
  if (access.error) return access.error;
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "O'quvchi topilmadi" }, { status: 404 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Holat noto'g'ri" }, { status: 400 });

  const changed = await getDatabase().transaction(async (tx) => {
    const [student] = await tx.update(users).set({
      isActive: parsed.data.isActive,
      sessionVersion: sql`${users.sessionVersion} + 1`,
    }).where(and(eq(users.id, id), eq(users.role, "student"), ne(users.isActive, parsed.data.isActive))).returning({ id: users.id });
    if (!student) return false;
    await tx.insert(auditLog).values({
      actorId: access.user.id,
      action: parsed.data.isActive ? "student.unblocked" : "student.blocked",
      targetType: "user",
      targetId: student.id,
    });
    return true;
  });
  if (!changed) return NextResponse.json({ error: "O'quvchi topilmadi yoki holat o'zgarmagan" }, { status: 409 });
  return NextResponse.json({ isActive: parsed.data.isActive }, { headers: { "Cache-Control": "no-store" } });
}
