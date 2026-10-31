import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, lessonFiles, lessons } from "@/db/schema";
import { superAdminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";
import { publishReadiness } from "@/lib/lessons/rules";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So‘rov rad etildi" }, { status: 403 });
  const access = await superAdminAccess(request);
  if (access.error) return access.error;
  const { id } = await context.params;
  const body = z.object({ fileId: z.uuid() }).safeParse(await request.json().catch(() => null));
  if (!z.uuid().safeParse(id).success || !body.success) return NextResponse.json({ error: "Fayl topilmadi" }, { status: 404 });
  const db = getDatabase();
  const outcome = await db.transaction(async (tx) => {
    const [lesson] = await tx.select({ id: lessons.id, code: lessons.code, status: lessons.status }).from(lessons).where(eq(lessons.id, id)).for("update").limit(1);
    if (!lesson) return { status: 404, error: "Dars topilmadi" };
    if (lesson.status !== "published" || !lesson.code) return { status: 400, error: "Faqat nashrdagi dars qaytariladi" };
    const [file] = await tx.select({ id: lessonFiles.id, kind: lessonFiles.kind, seq: lessonFiles.seq, mechanic: lessonFiles.mechanic, version: lessonFiles.version, status: lessonFiles.status }).from(lessonFiles).where(and(eq(lessonFiles.id, body.data.fileId), eq(lessonFiles.lessonId, id))).limit(1);
    if (!file || file.status !== "published") return { status: 400, error: "Faqat oldin nashr qilingan versiya qaytariladi" };
    const current = await tx.select({ id: lessonFiles.id, kind: lessonFiles.kind, seq: lessonFiles.seq, mechanic: lessonFiles.mechanic }).from(lessonFiles).where(and(eq(lessonFiles.lessonId, id), eq(lessonFiles.isCurrent, true)));
    const proposed = current.filter((item) => item.kind !== file.kind || item.seq !== file.seq).concat(file);
    const errors = publishReadiness(lesson.code, proposed.map((item) => ({ kind: item.kind as "learn" | "practice", seq: item.seq, mechanic: item.mechanic })));
    if (errors.length) return { status: 400, error: "Bu versiya nashr qoidalariga mos emas", errors };
    await tx.update(lessonFiles).set({ isCurrent: false }).where(and(eq(lessonFiles.lessonId, id), eq(lessonFiles.kind, file.kind), eq(lessonFiles.seq, file.seq), eq(lessonFiles.isCurrent, true)));
    await tx.update(lessonFiles).set({ isCurrent: true }).where(eq(lessonFiles.id, file.id));
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "lesson.file_restored", targetType: "lesson_file", targetId: file.id, meta: { lessonId: id, version: file.version } });
    return { status: 200, version: file.version };
  });
  return NextResponse.json(outcome, { status: outcome.status, headers: { "Cache-Control": "no-store" } });
}
