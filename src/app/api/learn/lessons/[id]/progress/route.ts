import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getDatabase } from "@/db";
import { lessonProgress, practiceAttempts, progress as legacyProgress } from "@/db/schema";
import { currentUser } from "@/lib/auth/current-user";
import { sameOrigin } from "@/lib/auth/request";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { accessibleLesson } from "@/lib/lessons/access";
import { canRecordPractice, learnPassed } from "@/lib/lessons/progress";

const eventInput = z.discriminatedUnion("type", [
  z.object({ type: z.literal("learn"), payload: z.object({ scorePercent: z.number().min(0).max(100).optional(), passed: z.boolean().optional() }).passthrough() }),
  z.object({ type: z.literal("practice"), seq: z.number().int().min(1).max(10), correct: z.boolean(), durationMs: z.number().int().min(0).max(3_600_000).default(0) }),
]);

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "So‘rov rad etildi" }, { status: 403 });
  const user = await currentUser(request.cookies.get(SESSION_COOKIE)?.value);
  if (!user) return NextResponse.json({ error: "Kirish talab qilinadi" }, { status: 401 });
  if (user.role !== "student" || user.mustChangePassword) return NextResponse.json({ error: "Ruxsat yo‘q" }, { status: 403 });
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return NextResponse.json({ error: "Dars topilmadi" }, { status: 404 });
  const lesson = await accessibleLesson(user.id, id);
  if (!lesson) return NextResponse.json({ error: "Dars topilmadi" }, { status: 404 });
  if (Number(request.headers.get("content-length")) > 65_536) return NextResponse.json({ error: "Natija juda katta" }, { status: 413 });
  const raw = await request.json().catch(() => null);
  if (JSON.stringify(raw).length > 65_536) return NextResponse.json({ error: "Natija juda katta" }, { status: 413 });
  const parsed = eventInput.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Natija noto‘g‘ri" }, { status: 400 });
  const event = parsed.data;
  const db = getDatabase();
  const now = new Date();
  if (event.type === "learn") {
    const learnEvent = event;
    const passed = learnPassed(lesson.code, learnEvent.payload);
    await db.transaction(async (tx) => {
      const [existing] = await tx.select({ learnDoneAt: lessonProgress.learnDoneAt }).from(lessonProgress).where(and(eq(lessonProgress.studentId, user.id), eq(lessonProgress.lessonId, id))).limit(1);
      const learnDoneAt = existing?.learnDoneAt || (passed ? now : null);
      await tx.insert(lessonProgress).values({ studentId: user.id, lessonId: id, learnDoneAt, learnPayload: learnEvent.payload, practiceDoneAt: lesson.code === "INTRO" && passed ? now : null }).onConflictDoUpdate({ target: [lessonProgress.studentId, lessonProgress.lessonId], set: { learnDoneAt, learnPayload: learnEvent.payload, ...(lesson.code === "INTRO" && passed ? { practiceDoneAt: now } : {}) } });
      if (lesson.code === "INTRO" && passed) await tx.insert(legacyProgress).values({ studentId: user.id, lessonId: id, completedAt: now }).onConflictDoUpdate({ target: [legacyProgress.studentId, legacyProgress.lessonId], set: { completedAt: now } });
    });
    return NextResponse.json({ passed }, { headers: { "Cache-Control": "no-store" } });
  }
  if (lesson.code === "INTRO") return NextResponse.json({ error: "Intro da Practice yo‘q" }, { status: 400 });
  const practiceEvent = event;
  const outcome = await db.transaction(async (tx) => {
    const [learn] = await tx.select({ done: lessonProgress.learnDoneAt }).from(lessonProgress).where(and(eq(lessonProgress.studentId, user.id), eq(lessonProgress.lessonId, id))).limit(1);
    const attempts = await tx.select({ seq: practiceAttempts.seq, attempts: practiceAttempts.attempts, correct: practiceAttempts.correct, firstTryCorrect: practiceAttempts.firstTryCorrect, durationMs: practiceAttempts.durationMs }).from(practiceAttempts).where(and(eq(practiceAttempts.studentId, user.id), eq(practiceAttempts.lessonId, id)));
    if (!canRecordPractice(practiceEvent.seq, !!learn?.done, attempts.filter((item) => item.correct).map((item) => item.seq))) return { status: 409, error: "Oldingi topshiriq tugatilmagan" };
    const previous = attempts.find((item) => item.seq === practiceEvent.seq);
    if (previous?.correct) return { status: 200, correct: true, attempts: previous.attempts };
    const count = (previous?.attempts || 0) + 1;
    const values = { attempts: count, correct: practiceEvent.correct, firstTryCorrect: count === 1 && practiceEvent.correct, durationMs: (previous?.durationMs || 0) + practiceEvent.durationMs, updatedAt: now };
    await tx.insert(practiceAttempts).values({ studentId: user.id, lessonId: id, seq: practiceEvent.seq, ...values }).onConflictDoUpdate({ target: [practiceAttempts.studentId, practiceAttempts.lessonId, practiceAttempts.seq], set: values });
    if (practiceEvent.seq === 10 && practiceEvent.correct) {
      await tx.update(lessonProgress).set({ practiceDoneAt: now }).where(and(eq(lessonProgress.studentId, user.id), eq(lessonProgress.lessonId, id)));
      await tx.insert(legacyProgress).values({ studentId: user.id, lessonId: id, completedAt: now }).onConflictDoUpdate({ target: [legacyProgress.studentId, legacyProgress.lessonId], set: { completedAt: now } });
    }
    return { status: 200, correct: practiceEvent.correct, attempts: count, completed: practiceEvent.seq === 10 && practiceEvent.correct };
  });
  return NextResponse.json(outcome, { status: outcome.status, headers: { "Cache-Control": "no-store" } });
}
