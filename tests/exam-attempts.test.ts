import assert from "node:assert/strict";
import { test } from "node:test";
import { and, eq } from "drizzle-orm";
import { examDatabase } from "./helpers/exam-db";
import { startOrResumeExam, saveExamAnswers, submitExam, grantIkRetry } from "../src/lib/exams/attempts";
import { backfillAchievements, lifetimeLessons } from "../src/lib/exams/achievements";
import { courseCycle } from "../src/lib/exams/db";
import { examAttempts, lessonProgress } from "../src/db/schema";

test("PK two failures reset only current course progress; duplicate submit cannot reset twice", async () => {
  const f = await examDatabase();
  try {
    await f.db.transaction(backfillAchievements);
    const a = await startOrResumeExam(f.student.id, f.exams[0].id, f.db);
    const same = await startOrResumeExam(f.student.id, f.exams[0].id, f.db); assert.equal(a.id, same.id);
    const saved = await saveExamAnswers(f.student.id, a.id, 0, [], f.db);
    assert.equal(saved.answerRevision, 1);
    await assert.rejects(saveExamAnswers(f.student.id, a.id, 0, [], f.db));
    await submitExam(f.student.id, a.id, 1, [], f.db);
    const b = await startOrResumeExam(f.student.id, f.exams[0].id, f.db);
    const [result,replayed] = await Promise.all([submitExam(f.student.id, b.id, 0, [], f.db),submitExam(f.student.id, b.id, 0, [], f.db)]);
    assert.deepEqual(replayed,result);
    assert.equal(result.nextAction, "restart_course");
    assert.equal(await courseCycle(f.db, f.student.id, f.course.id), 2);
    assert.equal((await f.db.select().from(lessonProgress).where(eq(lessonProgress.studentId, f.student.id))).length, 0);
    assert.equal(await lifetimeLessons(f.student.id, f.db), 32);
    assert.deepEqual(await submitExam(f.student.id, b.id, 0, [], f.db), result);
    assert.equal(await courseCycle(f.db, f.student.id, f.course.id), 2);
    await assert.rejects(startOrResumeExam(f.student.id, f.exams[0].id, f.db));
  } finally { await f.client.close(); }
});
test("all PKs required for IK; two IK failures keep progress and require deduplicated admin grant", async () => {
  const f = await examDatabase();
  try {
    await assert.rejects(startOrResumeExam(f.student.id, f.exams[4].id, f.db));
    for (let i=0;i<4;i++) {
      const a = await startOrResumeExam(f.student.id, f.exams[i].id, f.db);
      const answers = f.versions[i].definition.questions.map(q => ({ questionId:q.id,value:q.grading.acceptedAnswers[0] }));
      assert.equal((await submitExam(f.student.id, a.id, 0, answers, f.db)).passed, true);
    }
    for (let i=0;i<2;i++) { const a = await startOrResumeExam(f.student.id, f.exams[4].id, f.db); await submitExam(f.student.id,a.id,0,[],f.db); }
    await assert.rejects(startOrResumeExam(f.student.id,f.exams[4].id,f.db));
    assert.equal((await f.db.select().from(lessonProgress)).length,32);
    const requestId=crypto.randomUUID();
    await grantIkRetry(f.admin.id,f.student.id,f.exams[4].id,"Reviewed with student",requestId,f.db);
    await grantIkRetry(f.admin.id,f.student.id,f.exams[4].id,"Reviewed with student",requestId,f.db);
    const a=await startOrResumeExam(f.student.id,f.exams[4].id,f.db);
    await submitExam(f.student.id,a.id,0,[],f.db);
    await assert.rejects(startOrResumeExam(f.student.id,f.exams[4].id,f.db));
    assert.equal((await f.db.select().from(examAttempts).where(and(eq(examAttempts.examId,f.exams[4].id),eq(examAttempts.status,"failed")))).length,3);
  } finally { await f.client.close(); }
});
