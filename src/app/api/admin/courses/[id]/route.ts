import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, courses, lessons, modules } from "@/db/schema";
import { superAdminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";
import { courseEditInput } from "@/lib/courses/validation";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Context) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const access = await superAdminAccess(request);
  if (access.error) return access.error;
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 });
  const parsed = courseEditInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Kurs ma'lumotlarini tekshiring" }, { status: 400 });
  const updated = await getDatabase().transaction(async (tx) => {
    const [course] = await tx.update(courses).set(parsed.data).where(eq(courses.id, id)).returning({ id: courses.id });
    if (!course) return false;
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "course.updated", targetType: "course", targetId: course.id });
    return true;
  });
  if (!updated) return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

export async function DELETE(request: NextRequest, context: Context) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const access = await superAdminAccess(request);
  if (access.error) return access.error;
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 });
  const hasLesson = await getDatabase().select({ id: lessons.id }).from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id)).where(eq(modules.courseId, id)).limit(1);
  if (hasLesson.length) return NextResponse.json({ error: "Darslari bor kursni o'chirib bo'lmaydi" }, { status: 409 });
  const deleted = await getDatabase().transaction(async (tx) => {
    const [course] = await tx.delete(courses).where(eq(courses.id, id)).returning({ id: courses.id });
    if (!course) return false;
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "course.deleted", targetType: "course", targetId: course.id });
    return true;
  });
  if (!deleted) return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
