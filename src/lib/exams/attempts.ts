import { randomInt } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { auditLog, examAttempts, examRetryGrants, exams, examVersions, users } from "@/db/schema";
import { getExamEligibility, courseExamContext } from "./access";
import { courseCycle, ExamError, lockCourse, type Database, type Reader, type Transaction } from "./db";
import { gradeExam } from "./grading";
import { toPublicExam } from "./public";
import { resetCourseProgress } from "./reset";
import type { ExamAnswer, ExamDefinition, PublicExam } from "./types";

// Only shuffled positions cross the student boundary. Authored option IDs may
// contain clues such as "correct"; never expose them to an exam candidate.
function decodeAnswers(a:typeof examAttempts.$inferSelect,def:ExamDefinition,answers:ExamAnswer[]) {
  return answers.map(answer=>{
    const q=def.questions.find(q=>q.id===answer.questionId);
    if(!q||q.type==="typed"||!answer.value)return answer;
    const match=/^choice-(\d+)$/.exec(answer.value),index=match?Number(match[1])-1:-1;
    const original=a.optionOrder[q.id]?.[index];
    if(!original)throw new ExamError(400,"Variant identifikatori noto‘g‘ri");
    return {...answer,value:original};
  });
}

function shuffle<T>(values:T[]) { const copy=[...values]; for(let i=copy.length-1;i>0;i--){const j=randomInt(i+1);[copy[i],copy[j]]=[copy[j],copy[i]];}return copy; }
async function ownedAttempt(db:Reader,studentId:string,id:string) {
  const [a]=await db.select().from(examAttempts).where(and(eq(examAttempts.id,id),eq(examAttempts.studentId,studentId)));
  if(!a) throw new ExamError(404,"Urinish topilmadi"); return a;
}
async function versionFor(db:Reader,a:typeof examAttempts.$inferSelect) {
  const [v]=await db.select().from(examVersions).where(eq(examVersions.id,a.versionId));
  if(!v) throw new ExamError(404,"Imtihon versiyasi topilmadi");return v;
}
export async function getAttemptView(studentId:string,id:string,db:Reader=getDatabase()) {
  const a=await ownedAttempt(db,studentId,id);
  const ctx=await courseExamContext(studentId,a.courseId,db);
  if(!ctx.hasAccess) throw new ExamError(403,"Kursga dostup yo‘q");
  if(a.status==="void") throw new ExamError(409,"Bu urinish bekor qilingan");
  let exam:PublicExam|undefined;
  if(a.status==="in_progress") {
    if(ctx.cycle!==a.cycle) throw new ExamError(409,"Kurs sikli yangilangan");
    const v=await versionFor(db,a),publicExam=toPublicExam(v.definition);
    exam={...publicExam,questions:a.questionOrder.map(id=>{
      const q=publicExam.questions.find(q=>q.id===id)!;
      return {...q,...(q.options?{options:a.optionOrder[id].map((id,index)=>({id:`choice-${index+1}`,text:q.options!.find(o=>o.id===id)!.text}))}:{})};
    })};
  }
  return {id:a.id,examId:a.examId,courseId:a.courseId,cycle:a.cycle,attemptNo:a.attemptNo,status:a.status,passPercent:a.passPercent,answerRevision:a.answerRevision,answers:a.status==="in_progress"?a.answers:[],result:a.result,exam};
}
export async function startOrResumeExam(studentId:string,examId:string,db:Database=getDatabase()) {
  const [exam]=await db.select().from(exams).where(eq(exams.id,examId));
  if(!exam) throw new ExamError(404,"Imtihon topilmadi");
  const id=await db.transaction(async tx=>{
    await lockCourse(tx,studentId,exam.courseId);
    const eligibility=await getExamEligibility(studentId,examId,tx);
    if(eligibility.canResume) return eligibility.attempts.find(a=>a.status==="in_progress")!.id;
    if(!eligibility.canStart) throw new ExamError(409,`Imtihon ochilmagan: ${eligibility.state}`);
    const [other]=await tx.select({id:examAttempts.id}).from(examAttempts).where(and(eq(examAttempts.studentId,studentId),eq(examAttempts.courseId,exam.courseId),eq(examAttempts.cycle,eligibility.cycle),eq(examAttempts.status,"in_progress")));
    if(other) throw new ExamError(409,"Avval boshlangan imtihonni yakunlang");
    const [v]=await tx.select().from(examVersions).where(and(eq(examVersions.examId,examId),eq(examVersions.version,eligibility.exam.currentVersion!),eq(examVersions.status,"published")));
    if(!v) throw new ExamError(409,"Imtihon nashr qilinmagan");
    // Keep each passage and each section together; option IDs never depend on position.
    const groups=new Map<string,string[]>();
    for(const q of v.definition.questions) {const key=q.passageId||q.section;groups.set(key,[...(groups.get(key)||[]),q.id]);}
    const questionOrder=[...groups.values()].flatMap(shuffle);
    const optionOrder=Object.fromEntries(v.definition.questions.filter(q=>q.options).map(q=>[q.id,shuffle(q.options!.map(o=>o.id))]));
    const [a]=await tx.insert(examAttempts).values({studentId,courseId:exam.courseId,examId,versionId:v.id,cycle:eligibility.cycle,attemptNo:Math.max(0,...eligibility.attempts.map(a=>a.attemptNo))+1,passPercent:v.passPercent,questionOrder,optionOrder}).returning();
    await tx.insert(auditLog).values({actorId:studentId,action:"exam.started",targetType:"exam_attempt",targetId:a.id});return a.id;
  });
  return getAttemptView(studentId,id,db);
}
async function editable(tx:Transaction,studentId:string,id:string,revision:number) {
  const a=await ownedAttempt(tx,studentId,id);
  if(a.status!=="in_progress"||a.answerRevision!==revision) throw new ExamError(409,"Urinish yoki javoblar yangilangan; qayta yuklang");
  const e=await getExamEligibility(studentId,a.examId,tx);
  if(!e.hasAccess || !e.prerequisitesDone || e.cycle!==a.cycle) throw new ExamError(403,"Urinishga ruxsat yo‘q");
  return a;
}
export async function saveExamAnswers(studentId:string,id:string,revision:number,answers:ExamAnswer[],db:Database=getDatabase()) {
  const initial=await ownedAttempt(db,studentId,id);
  await db.transaction(async tx=>{
    await lockCourse(tx,studentId,initial.courseId);
    const a=await editable(tx,studentId,id,revision),v=await versionFor(tx,a);
    gradeExam(v.definition,decodeAnswers(a,v.definition,answers),a.passPercent); // Validate without returning correctness.
    await tx.update(examAttempts).set({answers,answerRevision:revision+1}).where(eq(examAttempts.id,id));
  });
  return getAttemptView(studentId,id,db);
}
export async function submitExam(studentId:string,id:string,revision:number,answers:ExamAnswer[],db:Database=getDatabase()) {
  const initial=await ownedAttempt(db,studentId,id);
  return db.transaction(async tx=>{
    await lockCourse(tx,studentId,initial.courseId);
    const existing=await ownedAttempt(tx,studentId,id);
    // A replay is a read: never re-grade or repeat a progress reset.
    if(existing.result) { const ctx=await courseExamContext(studentId,existing.courseId,tx);if(!ctx.hasAccess)throw new ExamError(403,"Dostup yo‘q");return existing.result; }
    const a=await editable(tx,studentId,id,revision),v=await versionFor(tx,a);
    const result=gradeExam(v.definition,decodeAnswers(a,v.definition,answers),a.passPercent);
    const eligibility=await getExamEligibility(studentId,a.examId,tx);
    result.nextAction=result.passed?(v.definition.kind==="ik"?"completed":"continue"):eligibility.remaining>0?"retry":v.definition.kind==="pk"?"restart_course":"awaiting_admin";
    await tx.update(examAttempts).set({answers,answerRevision:revision+1,status:result.passed?"passed":"failed",result,submittedAt:new Date()}).where(eq(examAttempts.id,id));
    if(result.nextAction==="restart_course") await resetCourseProgress(tx,studentId,a.courseId,id);
    await tx.insert(auditLog).values({actorId:studentId,action:"exam.submitted",targetType:"exam_attempt",targetId:id,meta:{passed:result.passed,percent:result.percent,nextAction:result.nextAction}});
    return result;
  });
}
export async function grantIkRetry(actorId:string,studentId:string,examId:string,reason:string,requestId:string,db:Database=getDatabase()) {
  const [actor]=await db.select().from(users).where(eq(users.id,actorId));
  if(!actor||!actor.isActive||actor.mustChangePassword||actor.role==="student") throw new ExamError(403,"Admin ruxsati kerak");
  if(reason.trim().length<3||reason.length>1000)throw new ExamError(400,"Sabab kiriting");
  const [exam]=await db.select().from(exams).where(eq(exams.id,examId));
  if(!exam||exam.kind!=="ik")throw new ExamError(400,"Faqat IK uchun");
  return db.transaction(async tx=>{
    await lockCourse(tx,studentId,exam.courseId);
    const cycle=await courseCycle(tx,studentId,exam.courseId);
    const [old]=await tx.select().from(examRetryGrants).where(eq(examRetryGrants.requestId,requestId));
    if(old){if(old.studentId!==studentId||old.examId!==examId||old.cycle!==cycle)throw new ExamError(409,"Ruxsat identifikatori mos emas");return old;}
    const e=await getExamEligibility(studentId,examId,tx);
    if(e.state!=="awaiting_admin")throw new ExamError(409,"Hozir qo‘shimcha urinish kerak emas");
    const [grant]=await tx.insert(examRetryGrants).values({studentId,examId,cycle,reason:reason.trim(),requestId,grantedBy:actorId}).returning();
    await tx.insert(auditLog).values({actorId,action:"exam.retry_granted",targetType:"exam",targetId:examId,meta:{studentId,cycle,grantId:grant.id,reason}});return grant;
  });
}
