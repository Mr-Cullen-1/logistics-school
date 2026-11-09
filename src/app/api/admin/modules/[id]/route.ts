import { guardCurriculum } from "@/lib/exams/admin";
import { curriculumRequest } from "@/lib/exams/curriculum-http";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, lessons, modules } from "@/db/schema";
import { superAdminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";
import { moduleInput } from "@/lib/courses/validation";

type Context = { params: Promise<{ id: string }> };

async function PATCHHandler(request: NextRequest, context: Context) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const access = await superAdminAccess(request);
  if (access.error) return access.error;
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "Modul topilmadi" }, { status: 404 });
  const parsed = moduleInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Modul nomini tekshiring" }, { status: 400 });
  const updated = await getDatabase().transaction(async (tx) => {
    await guardCurriculum(tx,"module",id);
    const [module] = await tx.update(modules).set(parsed.data).where(eq(modules.id, id)).returning({ id: modules.id, courseId: modules.courseId });
    if (!module) return false;
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "module.updated", targetType: "module", targetId: id, meta: { courseId: module.courseId } });
    return true;
  });
  if (!updated) return NextResponse.json({ error: "Modul topilmadi" }, { status: 404 });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

async function DELETEHandler(request: NextRequest, context: Context) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const access = await superAdminAccess(request);
  if (access.error) return access.error;
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "Modul topilmadi" }, { status: 404 });
  const [lesson] = await getDatabase().select({ id: lessons.id }).from(lessons).where(eq(lessons.moduleId, id)).limit(1);
  if (lesson) return NextResponse.json({ error: "Darslari bor modulni o'chirib bo'lmaydi" }, { status: 409 });
  const deleted = await getDatabase().transaction(async (tx) => {
    await guardCurriculum(tx,"module",id);
    const [module] = await tx.delete(modules).where(eq(modules.id, id)).returning({ id: modules.id, courseId: modules.courseId });
    if (!module) return false;
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "module.deleted", targetType: "module", targetId: id, meta: { courseId: module.courseId } });
    return true;
  });
  if (!deleted) return NextResponse.json({ error: "Modul topilmadi" }, { status: 404 });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

export const PATCH = curriculumRequest(PATCHHandler);

export const DELETE = curriculumRequest(DELETEHandler);
