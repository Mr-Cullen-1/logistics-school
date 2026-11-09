import { and, asc, eq, ne } from "drizzle-orm";
import { getDatabase } from "@/db";
import { courses, enrollments, examAttempts, examRetryGrants, exams, lessons, lessonProgress, modules, practiceAttempts, users } from "@/db/schema";
import { activeCourseAccess } from "@/lib/courses/access";
import { courseCycle, ExamError, type Reader } from "./db";
import { examEligibility } from "./policy";

export async function courseExamContext(studentId: string, courseId: string, db: Reader = getDatabase()) {
  const [course] = await db.select().from(courses).where(eq(courses.id, courseId));
  if (!course) throw new ExamError(404, "Kurs topilmadi");
  const cycle = await courseCycle(db, studentId, courseId);
  const [access] = await db.select({ id: enrollments.id }).from(enrollments).innerJoin(courses, eq(courses.id,enrollments.courseId)).innerJoin(users,eq(users.id,enrollments.studentId)).where(and(activeCourseAccess(studentId),eq(courses.id,courseId),eq(users.isActive,true),eq(users.role,"student"),eq(users.mustChangePassword,false)));
  const sections = await db.select().from(modules).where(eq(modules.courseId,courseId)).orderBy(asc(modules.order),asc(modules.id));
  const rows = await db.select({ id:lessons.id, code:lessons.code, moduleId:lessons.moduleId, status:lessons.status, learnDoneAt:lessonProgress.learnDoneAt, practiceDoneAt:lessonProgress.practiceDoneAt }).from(lessons).innerJoin(modules,eq(modules.id,lessons.moduleId)).leftJoin(lessonProgress,and(eq(lessonProgress.lessonId,lessons.id),eq(lessonProgress.studentId,studentId))).where(and(eq(modules.courseId,courseId),ne(lessons.code,"INTRO")));
  const practice = await db.select({ lessonId:practiceAttempts.lessonId, seq:practiceAttempts.seq }).from(practiceAttempts).innerJoin(lessons,eq(lessons.id,practiceAttempts.lessonId)).innerJoin(modules,eq(modules.id,lessons.moduleId)).where(and(eq(modules.courseId,courseId),eq(practiceAttempts.studentId,studentId),eq(practiceAttempts.correct,true)));
  const examRows = await db.select().from(exams).where(eq(exams.courseId,courseId));
  const attempts = await db.select().from(examAttempts).where(and(eq(examAttempts.studentId,studentId),eq(examAttempts.courseId,courseId),eq(examAttempts.cycle,cycle)));
  const passed = new Set(attempts.filter(a => a.status === "passed").map(a => a.examId));
  const mainSections = sections.filter(s=>rows.some(l=>l.moduleId===s.id));
  const completedModule = (moduleId: string) => {
    const items=rows.filter(l=>l.moduleId===moduleId);
    return items.length===8 && items.every(l=>l.status==="published" && l.learnDoneAt && l.practiceDoneAt && new Set(practice.filter(p=>p.lessonId===l.id).map(p=>p.seq)).size===10);
  };
  return { course,cycle,hasAccess:!!access,sections:mainSections,lessons:rows,exams:examRows,attempts,passed,completedModule };
}

export async function getExamEligibility(studentId:string, examId:string, db:Reader=getDatabase(), context?:Awaited<ReturnType<typeof courseExamContext>>) {
  const [exam]=await db.select().from(exams).where(eq(exams.id,examId));
  if(!exam) throw new ExamError(404,"Imtihon topilmadi");
  const ctx=context||await courseExamContext(studentId,exam.courseId,db);
  const moduleIndex=ctx.sections.findIndex(m=>m.id===exam.moduleId);
  const required=exam.kind==="ik" ? ctx.sections : ctx.sections.slice(0,moduleIndex+1);
  const prerequisitesDone=ctx.sections.length===4 && required.length>0 && required.every(m=>ctx.completedModule(m.id)) && (exam.kind==="ik" || moduleIndex>=0) && (exam.kind==="ik" ? required : required.slice(0,-1)).every(m=>ctx.exams.some(e=>e.moduleId===m.id && e.kind==="pk" && ctx.passed.has(e.id)));
  const attempts=ctx.attempts.filter(a=>a.examId===exam.id);
  const grants=await db.select({id:examRetryGrants.id}).from(examRetryGrants).where(and(eq(examRetryGrants.studentId,studentId),eq(examRetryGrants.examId,examId),eq(examRetryGrants.cycle,ctx.cycle)));
  const eligibility=examEligibility({ policy:ctx.course.examPolicy,hasAccess:ctx.hasAccess,prerequisitesDone:prerequisitesDone && !!exam.currentVersion,passed:ctx.passed.has(exam.id),active:attempts.some(a=>a.status==="in_progress"),used:attempts.filter(a=>a.status!=="void").length,grants:grants.length,kind:exam.kind });
  return { ...eligibility,exam,cycle:ctx.cycle,attempts,hasAccess:ctx.hasAccess,prerequisitesDone };
}

export async function moduleExamGate(studentId:string, courseId:string, moduleId:string, db:Reader=getDatabase()) {
  const ctx=await courseExamContext(studentId,courseId,db);
  if(ctx.course.examPolicy==="disabled") return true;
  const index=ctx.sections.findIndex(m=>m.id===moduleId);
  return index>=0 && ctx.sections.slice(0,index).every(m=>ctx.exams.some(e=>e.moduleId===m.id && e.kind==="pk" && ctx.passed.has(e.id)));
}
