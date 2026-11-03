import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, lessonFiles, lessons } from "@/db/schema";
import { adminAccess, superAdminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string; fileId: string }> }) {
  const access = await adminAccess(request);
  if (access.error) return access.error;
  const { id, fileId } = await context.params;
  if (!z.uuid().safeParse(id).success || !z.uuid().safeParse(fileId).success) return NextResponse.json({ error: "Fayl topilmadi" }, { status: 404 });
  const [file] = await getDatabase().select({ id: lessonFiles.id, kind: lessonFiles.kind, seq: lessonFiles.seq, compiledJs: lessonFiles.compiledJs }).from(lessonFiles).where(and(eq(lessonFiles.id, fileId), eq(lessonFiles.lessonId, id))).limit(1);
  return file ? NextResponse.json({ file }, { headers: { "Cache-Control": "private, no-store" } }) : NextResponse.json({ error: "Fayl topilmadi" }, { status: 404 });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string; fileId: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So‘rov rad etildi" }, { status: 403 });
  const access = await superAdminAccess(request);
  if (access.error) return access.error;
  const { id, fileId } = await context.params;
  if (!z.uuid().safeParse(id).success || !z.uuid().safeParse(fileId).success) return NextResponse.json({ error: "Fayl topilmadi" }, { status: 404 });

  const outcome = await getDatabase().transaction(async (tx) => {
    const [lesson] = await tx.select({ id: lessons.id }).from(lessons).where(eq(lessons.id, id)).for("update").limit(1);
    if (!lesson) return { status: 404, error: "Dars topilmadi" };
    const [file] = await tx.select({ id: lessonFiles.id, kind: lessonFiles.kind, seq: lessonFiles.seq, version: lessonFiles.version, isCurrent: lessonFiles.isCurrent }).from(lessonFiles).where(and(eq(lessonFiles.id, fileId), eq(lessonFiles.lessonId, id))).for("update").limit(1);
    if (!file) return { status: 404, error: "Fayl topilmadi" };
    if (file.isCurrent) return { status: 409, error: "Joriy versiyani o‘chirib bo‘lmaydi" };
    await tx.delete(lessonFiles).where(eq(lessonFiles.id, fileId));
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "lesson.file_deleted", targetType: "lesson_file", targetId: fileId, meta: { lessonId: id, kind: file.kind, seq: file.seq, version: file.version } });
    return { status: 200, deleted: true };
  });
  return NextResponse.json(outcome, { status: outcome.status, headers: { "Cache-Control": "no-store" } });
}
