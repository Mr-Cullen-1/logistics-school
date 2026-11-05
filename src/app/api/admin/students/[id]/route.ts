import { and, eq, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, loginAttempts, users } from "@/db/schema";
import { adminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So‘rov rad etildi" }, { status: 403 });
  const access = await adminAccess(request);
  if (access.error) return access.error;
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "O‘quvchi topilmadi" }, { status: 404 });

  const deleted = await getDatabase().transaction(async (tx) => {
    // Foreign keys cascade profiles, enrollments, progress and practice attempts.
    // currentUser checks the user row on every request, invalidating existing sessions.
    const [student] = await tx.delete(users).where(and(eq(users.id, id), eq(users.role, "student"))).returning({ phone: users.phone });
    if (!student) return false;
    await tx.delete(loginAttempts).where(eq(loginAttempts.phone, student.phone));
    await tx.delete(auditLog).where(or(
      and(eq(auditLog.targetType, "user"), eq(auditLog.targetId, id)),
      sql`${auditLog.meta}->>'studentId' = ${id}`,
    ));
    // Keep only a deletion receipt with the opaque ID, without name or phone.
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "student.deleted", targetType: "user", targetId: id });
    return true;
  });
  if (!deleted) return NextResponse.json({ error: "O‘quvchi topilmadi" }, { status: 404 });
  return NextResponse.json({ deleted: true }, { headers: { "Cache-Control": "no-store" } });
}
