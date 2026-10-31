import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, lessonFiles } from "@/db/schema";
import { superAdminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string; fileId: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So‘rov rad etildi" }, { status: 403 });
  const access = await superAdminAccess(request);
  if (access.error) return access.error;
  const { id, fileId } = await context.params;
  if (!z.uuid().safeParse(id).success || !z.uuid().safeParse(fileId).success) return NextResponse.json({ error: "Fayl topilmadi" }, { status: 404 });
  const db = getDatabase();
  const [file] = await db.select({ id: lessonFiles.id }).from(lessonFiles).where(and(eq(lessonFiles.id, fileId), eq(lessonFiles.lessonId, id))).limit(1);
  if (!file) return NextResponse.json({ error: "Fayl topilmadi" }, { status: 404 });
  const [existing] = await db.select({ id: auditLog.id }).from(auditLog).where(and(eq(auditLog.action, "lesson.file_previewed"), eq(auditLog.targetType, "lesson_file"), eq(auditLog.targetId, fileId))).limit(1);
  if (!existing) await db.insert(auditLog).values({ actorId: access.user.id, action: "lesson.file_previewed", targetType: "lesson_file", targetId: fileId, meta: { lessonId: id } });
  return NextResponse.json({ verified: true }, { headers: { "Cache-Control": "no-store" } });
}
