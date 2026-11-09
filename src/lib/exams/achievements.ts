import { and, count, eq, like, sql } from "drizzle-orm";
import { getDatabase } from "@/db";
import { studentAchievements } from "@/db/schema";
import { lockAchievements, type Reader, type Transaction } from "./db";

export async function recordLessonAchievement(tx: Transaction, studentId: string, lessonId: string) {
  await lockAchievements(tx, studentId);
  await tx.insert(studentAchievements).values({ studentId, achievementKey: `lesson:${lessonId}` }).onConflictDoNothing();
  const total = await lifetimeLessons(studentId, tx);
  for (const n of [1, 5, 10]) if (total >= n) await tx.insert(studentAchievements).values({ studentId, achievementKey: `badge:${n}` }).onConflictDoNothing();
}
export async function lifetimeLessons(studentId: string, db: Reader = getDatabase()) {
  const [row] = await db.select({ total: count() }).from(studentAchievements).where(and(eq(studentAchievements.studentId, studentId), like(studentAchievements.achievementKey, "lesson:%")));
  return row.total;
}
export async function backfillAchievements(tx: Transaction) {
  // Migration runs before serving traffic; repeated runs never erase earned awards.
  await tx.execute(sql`insert into student_achievements(student_id, achievement_key, earned_at)
    select student_id, 'lesson:' || lesson_id::text, completed_at from progress where completed_at is not null on conflict do nothing`);
  await tx.execute(sql`insert into student_achievements(student_id, achievement_key)
    select s.student_id, 'badge:' || b.n::text from (select student_id, count(*) as total from student_achievements where achievement_key like 'lesson:%' group by student_id) s
    cross join (values (1), (5), (10)) b(n) where s.total >= b.n on conflict do nothing`);
}
