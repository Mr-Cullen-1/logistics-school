import { guardCurriculum } from "@/lib/exams/admin";
import { curriculumRequest } from "@/lib/exams/curriculum-http";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, courses, modules } from "@/db/schema";
import { superAdminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";
import { moduleInput } from "@/lib/courses/validation";

async function POSTHandler(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const access = await superAdminAccess(request);
  if (access.error) return access.error;
  const { id: courseId } = await context.params;
  if (!z.uuid().safeParse(courseId).success) return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 });
  const parsed = moduleInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Modul nomini tekshiring" }, { status: 400 });
  const [course] = await getDatabase().select({ id: courses.id }).from(courses).where(eq(courses.id, courseId)).limit(1);
  if (!course) return NextResponse.json({ error: "Kurs topilmadi" }, { status: 404 });
  const [last] = await getDatabase().select({ order: modules.order }).from(modules).where(eq(modules.courseId, courseId)).orderBy(desc(modules.order)).limit(1);
  const createdModule = await getDatabase().transaction(async (tx) => {
    await guardCurriculum(tx,"course",courseId);
    const [created] = await tx.insert(modules).values({ courseId, title: parsed.data.title, order: (last?.order ?? 0) + 1 }).returning({ id: modules.id, title: modules.title });
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "module.created", targetType: "module", targetId: created.id, meta: { courseId } });
    return created;
  });
  return NextResponse.json({ module: createdModule }, { status: 201, headers: { "Cache-Control": "no-store" } });
}

export const POST = curriculumRequest(POSTHandler);
