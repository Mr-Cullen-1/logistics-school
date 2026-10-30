import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, courses, enrollments, users } from "@/db/schema";
import { adminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";
import { expirationAt } from "@/lib/courses/validation";

const input = z.object({ courseId: z.uuid(), expiresOn: z.string().nullable() });

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const access = await adminAccess(request);
  if (access.error) return access.error;
  const { id: studentId } = await context.params;
  if (!z.uuid().safeParse(studentId).success) return NextResponse.json({ error: "O'quvchi topilmadi" }, { status: 404 });
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Kurs yoki muddat noto'g'ri" }, { status: 400 });
  const expiresAt = expirationAt(parsed.data.expiresOn);
  if (expiresAt === undefined) return NextResponse.json({ error: "Muddat noto'g'ri" }, { status: 400 });
  const [student] = await getDatabase().select({ id: users.id }).from(users).where(and(eq(users.id, studentId), eq(users.role, "student"))).limit(1);
  const [course] = await getDatabase().select({ id: courses.id }).from(courses).where(eq(courses.id, parsed.data.courseId)).limit(1);
  if (!student || !course) return NextResponse.json({ error: "O'quvchi yoki kurs topilmadi" }, { status: 404 });

  await getDatabase().transaction(async (tx) => {
    await tx.insert(enrollments).values({
      studentId,
      courseId: course.id,
      startsAt: new Date(),
      expiresAt,
      grantedBy: access.user.id,
      isActive: true,
    }).onConflictDoUpdate({
      target: [enrollments.studentId, enrollments.courseId],
      set: { startsAt: new Date(), expiresAt, grantedBy: access.user.id, isActive: true },
    });
    await tx.insert(auditLog).values({
      actorId: access.user.id,
      action: "access.granted",
      targetType: "course",
      targetId: course.id,
      meta: { studentId, expiresOn: parsed.data.expiresOn },
    });
  });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
