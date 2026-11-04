import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { auditLog, lessons, modules } from "@/db/schema";
import { superAdminAccess } from "@/lib/auth/admin";
import { sameOrigin } from "@/lib/auth/request";
import { parseLessonFilename } from "@/lib/lessons/rules";

const input = z.object({ moduleId: z.uuid(), code: z.string(), title: z.string().trim().min(2).max(160) });

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So‘rov rad etildi" }, { status: 403 });
  const access = await superAdminAccess(request);
  if (access.error) return access.error;
  const parsed = input.safeParse(await request.json().catch(() => null));
  if (!parsed.success || !parseLessonFilename(`${parsed.data.code}.learn.jsx`)) return NextResponse.json({ error: "Dars kodi yoki nomi noto‘g‘ri" }, { status: 400 });
  const db = getDatabase();
  const [section] = await db.select({ id: modules.id }).from(modules).where(eq(modules.id, parsed.data.moduleId)).limit(1);
  if (!section) return NextResponse.json({ error: "Modul topilmadi" }, { status: 404 });
  if (parsed.data.code === "INTRO") {
    const [intro] = await db.select({ id: lessons.id }).from(lessons).where(eq(lessons.code, "INTRO")).limit(1);
    if (intro) return NextResponse.json({ error: "Intro darsi allaqachon mavjud" }, { status: 409 });
  }
  const [exists] = await db.select({ id: lessons.id }).from(lessons).where(and(eq(lessons.moduleId, section.id), eq(lessons.code, parsed.data.code))).limit(1);
  if (exists) return NextResponse.json({ error: "Bu dars kodi modulda bor" }, { status: 409 });
  const created = await db.transaction(async (tx) => {
    const [lesson] = await tx.insert(lessons).values({ moduleId: section.id, code: parsed.data.code, title: parsed.data.title, order: parsed.data.code === "INTRO" ? 0 : Number(parsed.data.code.slice(-2)), jsxSource: "", compiledJs: "", updatedBy: access.user.id }).returning({ id: lessons.id, code: lessons.code, title: lessons.title });
    await tx.insert(auditLog).values({ actorId: access.user.id, action: "lesson.created", targetType: "lesson", targetId: lesson.id });
    return lesson;
  });
  return NextResponse.json({ lesson: created }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
