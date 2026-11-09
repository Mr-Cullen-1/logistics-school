import { and, eq, inArray, ne, sql } from "drizzle-orm";
import { auditLog, courseLearningState, lessons, modules, lessonProgress, practiceAttempts, progress } from "@/db/schema";
import type { Transaction } from "./db";

export async function resetCourseProgress(tx:Transaction,studentId:string,courseId:string,failedAttemptId:string) {
  const rows=await tx.select({id:lessons.id}).from(lessons).innerJoin(modules,eq(modules.id,lessons.moduleId)).where(and(eq(modules.courseId,courseId),ne(lessons.code,"INTRO")));
  const ids=rows.map(l=>l.id);
  if(ids.length) {
    await tx.delete(practiceAttempts).where(and(eq(practiceAttempts.studentId,studentId),inArray(practiceAttempts.lessonId,ids)));
    await tx.delete(lessonProgress).where(and(eq(lessonProgress.studentId,studentId),inArray(lessonProgress.lessonId,ids)));
    await tx.delete(progress).where(and(eq(progress.studentId,studentId),inArray(progress.lessonId,ids)));
  }
  const [state]=await tx.update(courseLearningState).set({cycle:sql`${courseLearningState.cycle}+1`}).where(and(eq(courseLearningState.studentId,studentId),eq(courseLearningState.courseId,courseId))).returning();
  await tx.insert(auditLog).values({actorId:studentId,action:"course.progress_reset",targetType:"course",targetId:courseId,meta:{failedAttemptId,previousCycle:state.cycle-1,cycle:state.cycle,lessonCount:ids.length}});
  return state.cycle;
}
