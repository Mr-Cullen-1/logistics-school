import { and, desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, lessonFiles, lessons } from "@/db/schema";
import { superAdminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";
import { validateAndCompileLesson } from "@/lib/lessons/compile";
import { detectPracticeMechanic, validateUploadSelection } from "@/lib/lessons/rules";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So‘rov rad etildi" }, { status: 403 });
  const access = await superAdminAccess(request);
  if (access.error) return access.error;
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "Dars topilmadi" }, { status: 404 });
  const db = getDatabase();
  const [lesson] = await db.select({ code: lessons.code }).from(lessons).where(eq(lessons.id, id)).limit(1);
  if (!lesson?.code) return NextResponse.json({ error: "Dars kodi belgilanmagan" }, { status: 404 });
  if (Number(request.headers.get("content-length")) > 6_000_000) {
    return NextResponse.json({ error: "Yuklama 6 MB dan oshmasin" }, { status: 413 });
  }
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Fayllar o‘qilmadi" }, { status: 400 });
  const uploads = form.getAll("files");
  if (uploads.reduce((size, item) => size + (item instanceof File ? item.size : 0), 0) > 5_000_000) {
    return NextResponse.json({ error: "Fayllar jami 5 MB dan oshmasin" }, { status: 413 });
  }
  if (uploads.some((item) => !(item instanceof File))) return NextResponse.json({ error: "JSX fayllarni tanlang" }, { status: 400 });
  const kind = form.get("kind");
  if (kind !== "learn" && kind !== "practice") return NextResponse.json({ error: "Fayl turini tanlang" }, { status: 400 });
  const selectionError = validateUploadSelection(lesson.code, kind, uploads.map((item) => (item as File).name));
  if (selectionError) return NextResponse.json({ error: selectionError }, { status: 400 });
  const results: { name: string; ok: boolean; error?: string; version?: number }[] = [];
  for (const item of uploads) {
    const file = item as File;
    if (!file.name.endsWith(".jsx")) { results.push({ name: file.name, ok: false, error: "Faqat .jsx fayl" }); continue; }
    if (file.size > 1_500_000) { results.push({ name: file.name, ok: false, error: "Fayl juda katta" }); continue; }
    const source = await file.text();
    const result = validateAndCompileLesson(file.name, source);
    if (!result.ok) { results.push({ name: file.name, ok: false, error: result.error }); continue; }
    if (result.slot.code !== lesson.code) { results.push({ name: file.name, ok: false, error: "Dars kodi mos emas" }); continue; }
    const mechanic = result.slot.kind === "practice" ? detectPracticeMechanic(source) : null;
    if (result.slot.kind === "practice" && !mechanic) {
      results.push({ name: file.name, ok: false, error: "JSX ichidagi meta.mechanic va task.kind mos yoki tanilgan emas" });
      continue;
    }
    const version = await db.transaction(async (tx) => {
      await tx.select({ id: lessons.id }).from(lessons).where(eq(lessons.id, id)).for("update").limit(1);
      const [last] = await tx.select({ version: lessonFiles.version }).from(lessonFiles).where(and(eq(lessonFiles.lessonId, id), eq(lessonFiles.kind, result.slot.kind), eq(lessonFiles.seq, result.slot.seq))).orderBy(desc(lessonFiles.version)).limit(1);
      // Deleted versions stay in the audit trail, so their numbers must not be reused.
      const [historical] = await tx.select({ version: sql<number>`coalesce(max((${auditLog.meta}->>'version')::integer), 0)` }).from(auditLog).where(and(eq(auditLog.action, "lesson.file_uploaded"), sql`${auditLog.meta}->>'lessonId' = ${id}`, sql`${auditLog.meta}->>'kind' = ${result.slot.kind}`, sql`(${auditLog.meta}->>'seq')::integer = ${result.slot.seq}`));
      const version = Math.max(last?.version ?? 0, Number(historical?.version ?? 0)) + 1;
      const [saved] = await tx.insert(lessonFiles).values({ lessonId: id, kind: result.slot.kind, seq: result.slot.seq, mechanic, source, compiledJs: result.compiledJs, sizeBytes: result.sizeBytes, sha256: result.sha256, version, uploadedBy: access.user.id }).returning({ id: lessonFiles.id });
      await tx.insert(auditLog).values({ actorId: access.user.id, action: "lesson.file_uploaded", targetType: "lesson_file", targetId: saved.id, meta: { lessonId: id, kind: result.slot.kind, seq: result.slot.seq, version } });
      return version;
    });
    results.push({ name: file.name, ok: true, version });
  }
  return NextResponse.json({ results }, { status: results.some((item) => !item.ok) ? 207 : 201, headers: { "Cache-Control": "no-store" } });
}
