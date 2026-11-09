import type { getDatabase } from "@/db";
import { and, eq, sql } from "drizzle-orm";
import { courseLearningState } from "@/db/schema";

export type Database = ReturnType<typeof getDatabase>;
export type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0];
export type Reader = Database | Transaction;
export class ExamError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export async function lockCourse(tx: Transaction, studentId: string, courseId: string) {
  await tx.insert(courseLearningState).values({ studentId, courseId }).onConflictDoNothing();
  const [state] = await tx.select().from(courseLearningState).where(and(eq(courseLearningState.studentId, studentId), eq(courseLearningState.courseId, courseId))).for("update");
  return state;
}
export async function courseCycle(db: Reader, studentId: string, courseId: string) {
  const [state] = await db.select().from(courseLearningState).where(and(eq(courseLearningState.studentId, studentId), eq(courseLearningState.courseId, courseId)));
  return state?.cycle ?? 1;
}
export async function lockAchievements(tx: Transaction, studentId: string) {
  await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${'achievements:' + studentId}, 0))`);
}
