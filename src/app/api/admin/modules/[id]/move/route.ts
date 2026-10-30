import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, modules } from "@/db/schema";
import { superAdminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";
import { moveInput } from "@/lib/courses/validation";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const access = await superAdminAccess(request);
  if (access.error) return access.error;
  const { id } = await context.params;
  const parsed = moveInput.safeParse(await request.json().catch(() => null));
  if (!z.uuid().safeParse(id).success || !parsed.success) return NextResponse.json({ error: "Tartib noto'g'ri" }, { status: 400 });
  const moved = await getDatabase().transaction(async (tx) => {
    const [target] = await tx.select({ courseId: modules.courseId }).from(modules).where(eq(modules.id, id)).limit(1);
    if (!target) return false;
    const rows = await tx.select({ id: modules.id }).from(modules).where(eq(modules.courseId, target.courseId)).orderBy(asc(modules.order), asc(modules.id)).for("update");
    const index = rows.findIndex((row) => row.id === id);
    const other = index + (parsed.data.direction === "up" ? -1 : 1);
    if (index < 0 || other < 0 || other >= rows.length) return false;
    [rows[index], rows[other]] = [rows[other], rows[index]];
    for (const [position, row] of rows.entries()) await tx.update(modules).set({ order: position + 1 }).where(eq(modules.id, row.id));
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "module.reordered", targetType: "module", targetId: id, meta: { courseId: target.courseId } });
    return true;
  });
  if (!moved) return NextResponse.json({ error: "Modulni ko'chirib bo'lmadi" }, { status: 409 });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
