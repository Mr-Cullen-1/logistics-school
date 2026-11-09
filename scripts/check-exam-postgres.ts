import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { and, eq } from "drizzle-orm";
import * as s from "../src/db/schema";
import { nativeExamFixture } from "./exam-postgres-fixture";
import { startOrResumeExam, saveExamAnswers, submitExam, getAttemptView } from "../src/lib/exams/attempts";
import { lockCourse, courseCycle, lockAchievements, ExamError } from "../src/lib/exams/db";
import { recordLessonAchievement, lifetimeLessons } from "../src/lib/exams/achievements";

async function main() {
  const f = await nativeExamFixture();
  const a = f.connect(), b = f.connect(), blocker = f.connect();
  try {
    const pids = await Promise.all([a, b, blocker].map(c => c.client`select pg_backend_pid() as pid`));
    assert.equal(new Set(pids.map(rows => rows[0].pid)).size, 3);

    // Hold a real database lock until BOTH independent backends demonstrably wait.
    // This cannot pass by accidentally serializing work on one pooled connection.
    async function contend<T>(kind: "course" | "achievement", operations: (() => Promise<T>)[]) {
      let release!: () => void, acquired!: () => void;
      const gate = new Promise<void>(resolve => { release = resolve; });
      const ready = new Promise<void>(resolve => { acquired = resolve; });
      const held = blocker.db.transaction(async tx => {
        if (kind === "course") await lockCourse(tx, f.student.id, f.course.id);
        else await lockAchievements(tx, f.student.id);
        acquired(); await gate;
      });
      await ready;
      const results = Promise.allSettled(operations.map(operation => operation()));
      try {
        let blocked = false;
        for (let n = 0; n < 100; n++) {
          const rows = await f.adminConnection`select count(*)::int as n from pg_stat_activity where datname = ${f.name} and wait_event_type = 'Lock'`;
          if (rows[0].n >= 2) { blocked = true; break; }
          await delay(30);
        }
        assert(blocked, "Both independent PostgreSQL connections must wait for a lock");
      } finally { release(); await held; }
      return results;
    }
    const started = await contend("course", [a, b].map(c => () => startOrResumeExam(f.student.id, f.exams[0].id, c.db)));
    assert(started.every(r => r.status === "fulfilled"));
    const ids = started.map(r => r.status === "fulfilled" ? r.value.id : "");
    assert.equal(ids[0], ids[1]);
    assert.equal((await f.db.select().from(s.examAttempts)).length, 1);
    console.log("PASS: independent connections contend on parallel start; exactly one attempt.");

    const autosave = await contend<unknown>("course", [
      () => saveExamAnswers(f.student.id, ids[0], 0, [], a.db),
      () => submitExam(f.student.id, ids[0], 0, [], b.db),
    ]);
    assert.equal(autosave.filter(r => r.status === "fulfilled").length, 1);
    const conflict = autosave.find(r => r.status === "rejected");
    assert(conflict?.status === "rejected" && conflict.reason instanceof ExamError && conflict.reason.status === 409);
    const current = await getAttemptView(f.student.id, ids[0], f.db);
    if (current.status === "in_progress") await submitExam(f.student.id, current.id, current.answerRevision, [], f.db);
    console.log("PASS: autosave/submit race rejects stale revision; no lost successful write.");

    // Intro plus a second course earn awards concurrently at the 5-lesson boundary.
    await f.db.delete(s.studentAchievements).where(eq(s.studentAchievements.studentId, f.student.id));
    for (const lesson of f.lessons.slice(0, 3)) await f.db.transaction(tx => recordLessonAchievement(tx, f.student.id, lesson.id));
    const [intro] = await f.db.insert(s.lessons).values({ moduleId: f.sections[0].id, code: "INTRO", title: "Intro", jsxSource: "", compiledJs: "", status: "published" }).returning();
    const [other] = await f.db.insert(s.courses).values({ title: "Other course", isPublished: true }).returning();
    const [module] = await f.db.insert(s.modules).values({ courseId: other.id, title: "Other module" }).returning();
    const [lesson] = await f.db.insert(s.lessons).values({ moduleId: module.id, code: "M1L01", title: "Other lesson", jsxSource: "", compiledJs: "", status: "published" }).returning();
    await f.db.insert(s.lessonProgress).values([intro, lesson].map(l => ({ studentId: f.student.id, lessonId: l.id, learnDoneAt: new Date(), practiceDoneAt: new Date() })));
    await f.db.insert(s.progress).values([intro, lesson].map(l => ({ studentId: f.student.id, lessonId: l.id, completedAt: new Date() })));
    const awards = await contend("achievement", [
      () => a.db.transaction(tx => recordLessonAchievement(tx, f.student.id, intro.id)),
      () => b.db.transaction(tx => recordLessonAchievement(tx, f.student.id, lesson.id)),
    ]);
    assert(awards.every(r => r.status === "fulfilled"));
    assert.equal(await lifetimeLessons(f.student.id, f.db), 5);
    assert.equal((await f.db.select().from(s.studentAchievements).where(and(eq(s.studentAchievements.studentId, f.student.id), eq(s.studentAchievements.achievementKey, "badge:5")))).length, 1);
    console.log("PASS: Intro and another course contend on achievement lock; badge:5 awarded once.");

    const second = await startOrResumeExam(f.student.id, f.exams[0].id, f.db);
    const resets = await contend("course", [a, b].map(c => () => submitExam(f.student.id, second.id, 0, [], c.db)));
    assert(resets.every(r => r.status === "fulfilled"));
    assert.deepEqual(resets[0], resets[1]);
    assert.equal(await courseCycle(f.db, f.student.id, f.course.id), 2);
    const remaining = await f.db.select().from(s.lessonProgress).where(eq(s.lessonProgress.studentId, f.student.id));
    assert.deepEqual(remaining.map(r => r.lessonId).sort(), [intro.id, lesson.id].sort());
    assert.equal(await lifetimeLessons(f.student.id, f.db), 5);
    assert.equal((await f.db.select().from(s.auditLog).where(and(eq(s.auditLog.targetId, second.id), eq(s.auditLog.action, "exam.submitted")))).length, 1);
    console.log("PASS: concurrent second-failure submit resets once; Intro/other course/awards preserved.");
  } finally { await f.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
