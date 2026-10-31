import { asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { lessonFiles, lessons } from "@/db/schema";
import { adminAccess } from "@/lib/auth/admin";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const access = await adminAccess(request);
  if (access.error) return access.error;
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "Dars topilmadi" }, { status: 404 });
  const db = getDatabase();
  const [lesson] = await db.select({ id: lessons.id, code: lessons.code, title: lessons.title, status: lessons.status, moduleId: lessons.moduleId }).from(lessons).where(eq(lessons.id, id)).limit(1);
  if (!lesson) return NextResponse.json({ error: "Dars topilmadi" }, { status: 404 });
  const files = await db.select({ id: lessonFiles.id, kind: lessonFiles.kind, seq: lessonFiles.seq, mechanic: lessonFiles.mechanic, version: lessonFiles.version, status: lessonFiles.status, isCurrent: lessonFiles.isCurrent, sizeBytes: lessonFiles.sizeBytes, uploadedAt: lessonFiles.uploadedAt }).from(lessonFiles).where(eq(lessonFiles.lessonId, id)).orderBy(asc(lessonFiles.seq), asc(lessonFiles.version));
  return NextResponse.json({ lesson, files, canEdit: access.user.role === "super_admin" }, { headers: { "Cache-Control": "no-store" } });
}
