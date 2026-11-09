import { lessonAccess } from "@/lib/lessons/access";
import { eq } from "drizzle-orm";
import { courses } from "@/db/schema";
import { ExamError, lockCourse, type Transaction } from "./db";

export async function assertLessonWrite(tx:Transaction,studentId:string,lesson:{id:string;code:string;courseId:string},cycle:number|undefined) {
  if(lesson.code!=="INTRO") {
    const state=await lockCourse(tx,studentId,lesson.courseId);
    const [course]=await tx.select({policy:courses.examPolicy}).from(courses).where(eq(courses.id,lesson.courseId));
    // Preserve the existing API contract for courses that never enabled exams.
    if(cycle!==state.cycle && !(cycle===undefined&&course?.policy==="disabled")) throw new ExamError(409,"Kurs progressi yangilangan. Darsni qayta oching.");
  }
  const current=await lessonAccess(studentId,lesson.id,tx);
  if(!current?.unlocked||current.reviewOnly) throw new ExamError(403,"Dars hozir faqat qayta ko‘rish uchun yoki yopiq");
}
