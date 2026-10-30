import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, enrollments } from "@/db/schema";
import { adminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string; courseId: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So'rov rad etildi" }, { status: 403 });
  const access = await adminAccess(request);
  if (access.error) return access.error;
  const { id: studentId, courseId } = await context.params;
  if (!z.uuid().safeParse(studentId).success || !z.uuid().safeParse(courseId).success) {
    return NextResponse.json({ error: "Dostup topilmadi" }, { status: 404 });
  }
  const revoked = await getDatabase().transaction(async (tx) => {
    const [row] = await tx.update(enrollments).set({ isActive: false }).where(and(
      eq(enrollments.studentId, studentId),
      eq(enrollments.courseId, courseId),
      eq(enrollments.isActive, true),
    )).returning({ id: enrollments.id });
    if (!row) return false;
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "access.revoked", targetType: "course", targetId: courseId, meta: { studentId } });
    return true;
  });
  if (!revoked) return NextResponse.json({ error: "Faol dostup topilmadi" }, { status: 404 });
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
