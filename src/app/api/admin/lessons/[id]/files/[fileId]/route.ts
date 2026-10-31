import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { lessonFiles } from "@/db/schema";
import { adminAccess } from "@/lib/auth/admin";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string; fileId: string }> }) {
  const access = await adminAccess(request);
  if (access.error) return access.error;
  const { id, fileId } = await context.params;
  if (!z.uuid().safeParse(id).success || !z.uuid().safeParse(fileId).success) return NextResponse.json({ error: "Fayl topilmadi" }, { status: 404 });
  const [file] = await getDatabase().select({ id: lessonFiles.id, kind: lessonFiles.kind, seq: lessonFiles.seq, compiledJs: lessonFiles.compiledJs }).from(lessonFiles).where(and(eq(lessonFiles.id, fileId), eq(lessonFiles.lessonId, id))).limit(1);
  return file ? NextResponse.json({ file }, { headers: { "Cache-Control": "private, no-store" } }) : NextResponse.json({ error: "Fayl topilmadi" }, { status: 404 });
}
