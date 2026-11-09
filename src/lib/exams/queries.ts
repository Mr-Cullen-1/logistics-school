import { and, asc, desc, eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { courses, enrollments, exams, examAttempts } from "@/db/schema";
import { activeCourseAccess } from "@/lib/courses/access";
import { getExamEligibility, courseExamContext } from "./access";

export async function studentExams(studentId:string,courseId?:string) {
  const db=getDatabase();
  const rows=await db.select({exam:exams,courseTitle:courses.title,policy:courses.examPolicy}).from(exams).innerJoin(courses,eq(courses.id,exams.courseId)).innerJoin(enrollments,eq(enrollments.courseId,courses.id)).where(and(activeCourseAccess(studentId),...(courseId?[eq(courses.id,courseId)]:[]))).orderBy(asc(courses.order),asc(exams.title));
  const result=[];
  const contexts=new Map<string,Awaited<ReturnType<typeof courseExamContext>>>();
  for(const row of rows){
    if(row.policy==="disabled")continue;
    if(!contexts.has(row.exam.courseId))contexts.set(row.exam.courseId,await courseExamContext(studentId,row.exam.courseId,db));
    const e=await getExamEligibility(studentId,row.exam.id,db,contexts.get(row.exam.courseId));
    const latest=[...e.attempts].filter(a=>a.status!=="void").sort((a,b)=>b.attemptNo-a.attemptNo)[0];
    result.push({id:row.exam.id,courseId:row.exam.courseId,moduleId:row.exam.moduleId,kind:row.exam.kind,title:row.exam.title,courseTitle:row.courseTitle,passPercent:row.exam.passPercent,state:e.state,remaining:e.remaining,canStart:e.canStart,canResume:e.canResume,attemptId:latest?.id||null,result:latest?.result||null});
  }
  return result;
}
export async function adminStudentExams(studentId:string) {
  const rows=await getDatabase().select({id:examAttempts.id,examId:exams.id,title:exams.title,kind:exams.kind,courseTitle:courses.title,cycle:examAttempts.cycle,attemptNo:examAttempts.attemptNo,status:examAttempts.status,result:examAttempts.result,startedAt:examAttempts.startedAt}).from(examAttempts).innerJoin(exams,eq(exams.id,examAttempts.examId)).innerJoin(courses,eq(courses.id,exams.courseId)).where(eq(examAttempts.studentId,studentId)).orderBy(desc(examAttempts.startedAt));
  const seen=new Set<string>(),result=[];
  for(const row of rows){const first=!seen.has(row.examId);seen.add(row.examId);const canGrant=first&&row.kind==="ik"&&(await getExamEligibility(studentId,row.examId)).state==="awaiting_admin";result.push({...row,canGrant});}
  return result;
}
