import assert from "node:assert/strict";
import { test } from "node:test";
import { eq } from "drizzle-orm";
import { examDatabase } from "./helpers/exam-db";
import { backfillAchievements, lifetimeLessons, recordLessonAchievement } from "../src/lib/exams/achievements";
import { studentAchievements } from "../src/db/schema";

test("migrations and idempotent backfill preserve lifetime achievements", async () => {
  const f = await examDatabase();
  try {
    await f.db.transaction(backfillAchievements); await f.db.transaction(backfillAchievements);
    assert.equal(await lifetimeLessons(f.student.id, f.db), 32);
    await f.db.transaction(tx => recordLessonAchievement(tx, f.student.id, f.lessons[0].id));
    const awards = await f.db.select().from(studentAchievements).where(eq(studentAchievements.studentId, f.student.id));
    assert.equal(awards.filter(a => a.achievementKey.startsWith("badge:")).length, 3);
  } finally { await f.client.close(); }
});

test("simultaneous completions award the five-lesson badge once; repeat completion cannot inflate totals",async()=>{
  const f=await examDatabase();try{
    for(const lesson of f.lessons.slice(0,3))await f.db.transaction(tx=>recordLessonAchievement(tx,f.student.id,lesson.id));
    await Promise.all(f.lessons.slice(3,5).map(lesson=>f.db.transaction(tx=>recordLessonAchievement(tx,f.student.id,lesson.id))));
    await f.db.transaction(tx=>recordLessonAchievement(tx,f.student.id,f.lessons[4].id));
    assert.equal(await lifetimeLessons(f.student.id,f.db),5);
    const rows=await f.db.select().from(studentAchievements).where(eq(studentAchievements.studentId,f.student.id));
    assert.equal(rows.filter(r=>r.achievementKey==="badge:5").length,1);
  }finally{await f.client.close();}
});
