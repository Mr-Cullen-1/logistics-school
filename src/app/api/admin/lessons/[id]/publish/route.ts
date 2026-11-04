import { and, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, lessonFiles, lessons } from "@/db/schema";
import { superAdminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";
import { practiceMechanics, publishReadiness } from "@/lib/lessons/rules";

const requestSchema = z.object({ fileIds: z.array(z.uuid()).min(1).max(11) });

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So‘rov rad etildi" }, { status: 403 });
  const access = await superAdminAccess(request);
  if (access.error) return access.error;
  const { id } = await context.params;
  const body = requestSchema.safeParse(await request.json().catch(() => null));
  if (!z.uuid().safeParse(id).success || !body.success || new Set(body.data.fileIds).size !== body.data.fileIds.length) {
    return NextResponse.json({ error: "Nashr qilinadigan fayllarni tanlang" }, { status: 400 });
  }

  const db = getDatabase();
  const outcome = await db.transaction(async (tx) => {
    const [lesson] = await tx.select({ id: lessons.id, code: lessons.code, status: lessons.status }).from(lessons).where(eq(lessons.id, id)).for("update").limit(1);
    if (!lesson?.code) return { status: 404, error: "Dars topilmadi" };
    const files = await tx.select({ id: lessonFiles.id, kind: lessonFiles.kind, seq: lessonFiles.seq, mechanic: lessonFiles.mechanic, status: lessonFiles.status, isCurrent: lessonFiles.isCurrent }).from(lessonFiles).where(eq(lessonFiles.lessonId, id));
    const selected = files.filter((file) => body.data.fileIds.includes(file.id));
    if (selected.length !== body.data.fileIds.length || selected.some((file) => file.status !== "draft")) {
      return { status: 400, error: "Faqat shu darsning draft fayllarini nashr qilish mumkin" };
    }
    if (selected.some((file) => file.kind === "practice" && (!file.mechanic || !practiceMechanics.includes(file.mechanic as typeof practiceMechanics[number]) || (file.seq === 10 && file.mechanic !== "SCENE")))) {
      return { status: 400, error: "Practice mexanikasi nashr qoidasiga mos emas" };
    }
    const slots = selected.map((file) => `${file.kind}:${file.seq}`);
    if (new Set(slots).size !== slots.length) return { status: 400, error: "Bir slotning bir nechta versiyasini birga nashr qilib bo‘lmaydi" };
    const approvals = await tx.select({ targetId: auditLog.targetId }).from(auditLog).where(and(eq(auditLog.action, "lesson.file_previewed"), eq(auditLog.targetType, "lesson_file"), inArray(auditLog.targetId, selected.map((file) => file.id))));
    const approved = new Set(approvals.map((item) => item.targetId));
    const unchecked = selected.filter((file) => !approved.has(file.id));
    if (unchecked.length) return { status: 400, error: "Avval tanlangan fayllarni Preview OK qiling", errors: unchecked.map((file) => file.kind === "learn" ? "Learn" : `p${String(file.seq).padStart(2, "0")}`) };

    const proposed = files.filter((file) => file.isCurrent && !slots.includes(`${file.kind}:${file.seq}`)).concat(selected);
    const errors = publishReadiness(lesson.code, proposed.map((file) => ({ kind: file.kind as "learn" | "practice", seq: file.seq, mechanic: file.mechanic })));
    if (lesson.status === "published" && errors.length) return { status: 400, error: "Bu o‘zgarish ochiq darsni to‘liqsiz qoldiradi", errors };

    for (const file of selected) {
      await tx.update(lessonFiles).set({ isCurrent: false }).where(and(eq(lessonFiles.lessonId, id), eq(lessonFiles.kind, file.kind), eq(lessonFiles.seq, file.seq), eq(lessonFiles.isCurrent, true)));
    }
    await tx.update(lessonFiles).set({ isCurrent: true, status: "published" }).where(inArray(lessonFiles.id, selected.map((file) => file.id)));
    const lessonPublished = errors.length === 0;
    await tx.update(lessons).set({ status: lessonPublished ? "published" : "draft", updatedAt: new Date(), updatedBy: access.user.id }).where(eq(lessons.id, id));
    await tx.insert(auditLog).values({ actorId: access.user.id, action: lessonPublished ? "lesson.published" : "lesson.files_published", targetType: "lesson", targetId: id, meta: { fileIds: selected.map((file) => file.id), lessonPublished } });
    return { status: 200, files: selected.length, lessonPublished, pendingReasons: errors };
  });
  return NextResponse.json(outcome, { status: outcome.status, headers: { "Cache-Control": "no-store" } });
}
