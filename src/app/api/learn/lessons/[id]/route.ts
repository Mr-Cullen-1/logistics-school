import { and, asc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { lessonFiles, lessonProgress, practiceAttempts } from "@/db/schema";
import { currentUser } from "@/lib/auth/current-user";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { accessibleLesson } from "@/lib/lessons/access";
import { courseCycle } from "@/lib/exams/db";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const user = await currentUser(request.cookies.get(SESSION_COOKIE)?.value);
  if (!user) return NextResponse.json({ error: "Kirish talab qilinadi" }, { status: 401 });
  if (user.role !== "student" || user.mustChangePassword) return NextResponse.json({ error: "Ruxsat yo‘q" }, { status: 403 });
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "Dars topilmadi" }, { status: 404 });
  const lesson = await accessibleLesson(user.id, id);
  if (!lesson) return NextResponse.json({ error: "Dars topilmadi" }, { status: 404 });
  const db = getDatabase();
  const [files, [progress], attempts] = await Promise.all([
    db.select({ id: lessonFiles.id, kind: lessonFiles.kind, seq: lessonFiles.seq, compiledJs: lessonFiles.compiledJs }).from(lessonFiles).where(and(eq(lessonFiles.lessonId, id), eq(lessonFiles.isCurrent, true), eq(lessonFiles.status, "published"))).orderBy(asc(lessonFiles.seq)),
    db.select({ learnDoneAt: lessonProgress.learnDoneAt, practiceDoneAt: lessonProgress.practiceDoneAt }).from(lessonProgress).where(and(eq(lessonProgress.studentId, user.id), eq(lessonProgress.lessonId, id))).limit(1),
    db.select({ seq: practiceAttempts.seq, correct: practiceAttempts.correct, attempts: practiceAttempts.attempts }).from(practiceAttempts).where(and(eq(practiceAttempts.studentId, user.id), eq(practiceAttempts.lessonId, id))),
  ]);
  const cycle = lesson.code === "INTRO" ? 1 : await courseCycle(db, user.id, lesson.courseId);
  return NextResponse.json({ lesson, cycle, files, progress: progress || null, attempts }, { headers: { "Cache-Control": "private, no-store" } });
}
