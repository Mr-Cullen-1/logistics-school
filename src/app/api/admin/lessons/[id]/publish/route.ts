import { and, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, lessonFiles, lessons } from "@/db/schema";
import { superAdminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";
import { publishReadiness, selectPublishFiles } from "@/lib/lessons/rules";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So‘rov rad etildi" }, { status: 403 });
  const access = await superAdminAccess(request);
  if (access.error) return access.error;
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "Dars topilmadi" }, { status: 404 });
  const db = getDatabase();
  const outcome = await db.transaction(async (tx) => {
    const [lesson] = await tx.select({ id: lessons.id, code: lessons.code }).from(lessons).where(eq(lessons.id, id)).for("update").limit(1);
    if (!lesson?.code) return { status: 404, error: "Dars topilmadi" };
    const files = await tx.select({ id: lessonFiles.id, kind: lessonFiles.kind, seq: lessonFiles.seq, mechanic: lessonFiles.mechanic, version: lessonFiles.version, status: lessonFiles.status, isCurrent: lessonFiles.isCurrent }).from(lessonFiles).where(eq(lessonFiles.lessonId, id));
    const selected = selectPublishFiles(files);
    const errors = publishReadiness(lesson.code, selected.map(({ kind, seq, mechanic }) => ({ kind: kind as "learn" | "practice", seq, mechanic })));
    if (errors.length) return { status: 400, error: "Dars nashrga tayyor emas", errors };
    const previews = await tx.select({ targetId: auditLog.targetId }).from(auditLog).where(and(eq(auditLog.action, "lesson.file_previewed"), eq(auditLog.targetType, "lesson_file"), inArray(auditLog.targetId, selected.map((file) => file.id))));
    const verified = new Set(previews.map((item) => item.targetId));
    const missingPreview = selected.filter((file) => !verified.has(file.id));
    if (missingPreview.length) return { status: 400, error: "Fayllar iframe previewda tekshirilmagan", errors: missingPreview.map((file) => `${file.kind === "learn" ? "Learn" : `p${String(file.seq).padStart(2, "0")}`} v${file.version}`) };
    await tx.update(lessonFiles).set({ isCurrent: false }).where(and(eq(lessonFiles.lessonId, id), eq(lessonFiles.isCurrent, true)));
    await tx.update(lessonFiles).set({ isCurrent: true, status: "published" }).where(inArray(lessonFiles.id, selected.map((file) => file.id)));
    await tx.update(lessons).set({ status: "published", updatedAt: new Date(), updatedBy: access.user.id }).where(eq(lessons.id, id));
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "lesson.published", targetType: "lesson", targetId: id, meta: { files: selected.map((file) => ({ id: file.id, version: file.version })) } });
    return { status: 200, files: selected.length };
  });
  return NextResponse.json(outcome, { status: outcome.status, headers: { "Cache-Control": "no-store" } });
}
