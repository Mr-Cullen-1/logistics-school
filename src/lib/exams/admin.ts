import { and, asc, desc, eq, inArray, ne } from "drizzle-orm";
import { getDatabase } from "@/db";
import { auditLog, courses, exams, examVersions, examAttempts, lessons, lessonFiles, modules } from "@/db/schema";
import { parseExamUpload } from "./compile";
import { validateExamDefinition } from "./definition";
import { ExamError, type Database, type Reader } from "./db";
import type { ExamDefinition } from "./types";

export async function verifyExamSources(db:Reader,courseId:string,definition:ExamDefinition,moduleId:string|null) {
  const files=await db.select({code:lessons.code,moduleId:lessons.moduleId,kind:lessonFiles.kind,seq:lessonFiles.seq,hash:lessonFiles.sha256}).from(lessonFiles).innerJoin(lessons,eq(lessons.id,lessonFiles.lessonId)).innerJoin(modules,eq(modules.id,lessons.moduleId)).where(and(eq(modules.courseId,courseId),eq(lessons.status,"published"),eq(lessonFiles.status,"published"),eq(lessonFiles.isCurrent,true)));
  for(const q of definition.questions)for(const ref of q.sourceRefs){
    const slot=ref.slot==="learn"?{kind:"learn",seq:0}:{kind:"practice",seq:Number(ref.slot.slice(1))};
    const file=files.find(f=>f.code===ref.lessonCode&&f.kind===slot.kind&&f.seq===slot.seq&&f.hash===ref.sha256);
    if(!file || (definition.kind==="pk"&&file.moduleId!==moduleId))throw new ExamError(409,`${q.id}: ${ref.lessonCode}/${ref.slot} nashrdagi manba/hash bilan mos emas`);
  }
}
export async function createExam(courseId:string,input:{kind:"pk"|"ik";moduleId?:string;title:string;passPercent:number},actorId:string,db:Database=getDatabase()) {
  return db.transaction(async tx=>{
    const [course]=await tx.select().from(courses).where(eq(courses.id,courseId)).for("update");
    if(!course)throw new ExamError(404,"Kurs topilmadi");
    if(course.examPolicy!=="disabled")throw new ExamError(409,"Faol kurs exam tarkibini o‘zgartirib bo‘lmaydi");
    if(input.kind==="pk") {const [m]=await tx.select().from(modules).where(and(eq(modules.id,input.moduleId!),eq(modules.courseId,courseId)));if(!m)throw new ExamError(400,"Modul shu kursga tegishli emas");}
    const [existing]=await tx.select().from(exams).where(input.kind==="pk"?eq(exams.moduleId,input.moduleId!):and(eq(exams.courseId,courseId),eq(exams.kind,"ik")));
    if(existing)throw new ExamError(409,"Bu PK/IK allaqachon yaratilgan");
    const [exam]=await tx.insert(exams).values({...input,courseId,moduleId:input.kind==="pk"?input.moduleId!:null}).returning();
    await tx.insert(auditLog).values({actorId,action:"exam.created",targetType:"exam",targetId:exam.id});return exam;
  });
}
export async function uploadExam(examId:string,filename:string,source:string,passPercent:number,actorId:string,db:Database=getDatabase()) {
  const parsed=parseExamUpload(filename,source);
  if(!Number.isInteger(passPercent)||passPercent<1||passPercent>100)throw new ExamError(400,"O‘tish foizi 1–100 bo‘lsin");
  return db.transaction(async tx=>{
    const [exam]=await tx.select().from(exams).where(eq(exams.id,examId)).for("update");
    if(!exam)throw new ExamError(404,"Imtihon topilmadi");
    if(parsed.definition.kind!==exam.kind)throw new ExamError(400,"Imtihon turi mos emas");
    await verifyExamSources(tx,exam.courseId,parsed.definition,exam.moduleId);
    const [last]=await tx.select({version:examVersions.version}).from(examVersions).where(eq(examVersions.examId,examId)).orderBy(desc(examVersions.version)).limit(1);
    const [v]=await tx.insert(examVersions).values({examId,version:(last?.version||0)+1,source,sha256:parsed.sha256,definition:parsed.definition,passPercent,uploadedBy:actorId}).returning();
    await tx.insert(auditLog).values({actorId,action:"exam.uploaded",targetType:"exam_version",targetId:v.id,meta:{sha256:v.sha256}});return {id:v.id,version:v.version,sha256:v.sha256};
  });
}
export async function reviewExam(examId:string,versionId:string,sha256:string,actorId:string,db:Database=getDatabase()) {
  const [v]=await db.update(examVersions).set({reviewedAt:new Date(),reviewedBy:actorId}).where(and(eq(examVersions.id,versionId),eq(examVersions.examId,examId),eq(examVersions.sha256,sha256),eq(examVersions.status,"draft"))).returning({id:examVersions.id});
  if(!v)throw new ExamError(409,"Draft versiya/hash mos emas");
  await db.insert(auditLog).values({actorId,action:"exam.reviewed",targetType:"exam_version",targetId:versionId,meta:{sha256}});return v;
}
export async function publishExam(examId:string,versionId:string,actorId:string,db:Database=getDatabase()) {
  return db.transaction(async tx=>{
    const [scope]=await tx.select({courseId:exams.courseId}).from(exams).where(eq(exams.id,examId));
    if(!scope)throw new ExamError(404,"Imtihon topilmadi");
    await tx.select({id:courses.id}).from(courses).where(eq(courses.id,scope.courseId)).for("update");
    const [exam]=await tx.select().from(exams).where(eq(exams.id,examId)).for("update");
    if(!exam)throw new ExamError(404,"Imtihon topilmadi");
    const [v]=await tx.select().from(examVersions).where(and(eq(examVersions.id,versionId),eq(examVersions.examId,examId)));
    if(!v||v.status!=="draft"||!v.reviewedAt)throw new ExamError(409,"Avval preview va kontentni tekshirib tasdiqlang");
    if(validateExamDefinition(v.definition).length)throw new ExamError(400,"Blueprint noto‘g‘ri");
    await verifyExamSources(tx,exam.courseId,v.definition,exam.moduleId);
    await tx.update(examVersions).set({status:"published"}).where(eq(examVersions.id,versionId));
    await tx.update(exams).set({currentVersion:v.version,passPercent:v.passPercent}).where(eq(exams.id,examId));
    await tx.insert(auditLog).values({actorId,action:"exam.published",targetType:"exam",targetId:examId,meta:{versionId}});return {ok:true};
  });
}
export async function setExamPolicy(courseId:string,policy:"enabled"|"paused",actorId:string,db:Database=getDatabase()) {
  return db.transaction(async tx=>{
    const [course]=await tx.select().from(courses).where(eq(courses.id,courseId)).for("update");
    if(!course)throw new ExamError(404,"Kurs topilmadi");
    if(policy==="paused"&&course.examPolicy==="disabled")throw new ExamError(409,"Avval imtihonlarni tayyorlang");
    if(policy==="enabled"){
      const rows=await tx.select({id:lessons.id,moduleId:lessons.moduleId,code:lessons.code,status:lessons.status}).from(lessons).innerJoin(modules,eq(modules.id,lessons.moduleId)).where(and(eq(modules.courseId,courseId),ne(lessons.code,"INTRO")));
      const moduleIds=[...new Set(rows.map(l=>l.moduleId))];
      if(rows.length!==32||moduleIds.length!==4||rows.some(l=>l.status!=="published")||moduleIds.some(id=>rows.filter(l=>l.moduleId===id).length!==8))throw new ExamError(409,"4 modul va 32 nashrdagi dars kerak");
      const files=await tx.select().from(lessonFiles).where(and(inArray(lessonFiles.lessonId,rows.map(l=>l.id)),eq(lessonFiles.isCurrent,true),eq(lessonFiles.status,"published")));
      if(rows.some(l=>!files.some(f=>f.lessonId===l.id&&f.kind==="learn")||Array.from({length:10},(_,i)=>i+1).some(seq=>!files.some(f=>f.lessonId===l.id&&f.kind==="practice"&&f.seq===seq))))throw new ExamError(409,"Barcha Learn + p01–p10 nashr qilinsin");
      const all=await tx.select().from(exams).where(eq(exams.courseId,courseId));
      if(all.length!==5||!all.some(e=>e.kind==="ik")||moduleIds.some(id=>!all.some(e=>e.kind==="pk"&&e.moduleId===id)))throw new ExamError(409,"4 PK + 1 IK kerak");
      for(const exam of all){const [v]=await tx.select().from(examVersions).where(and(eq(examVersions.examId,exam.id),eq(examVersions.version,exam.currentVersion||0),eq(examVersions.status,"published")));if(!v||!v.reviewedAt)throw new ExamError(409,"Barcha imtihonlar tekshirilib nashr qilinsin");await verifyExamSources(tx,courseId,v.definition,exam.moduleId);}
    }
    await tx.update(courses).set({examPolicy:policy}).where(eq(courses.id,courseId));
    await tx.insert(auditLog).values({actorId,action:"exam.policy_changed",targetType:"course",targetId:courseId,meta:{policy}});return {ok:true};
  });
}
export async function courseExamAdmin(courseId:string,db:Reader=getDatabase()) {
  const rows=await db.select().from(exams).where(eq(exams.courseId,courseId)).orderBy(asc(exams.kind),asc(exams.title));
  const versions=rows.length?await db.select({id:examVersions.id,examId:examVersions.examId,version:examVersions.version,status:examVersions.status,sha256:examVersions.sha256,passPercent:examVersions.passPercent,reviewedAt:examVersions.reviewedAt}).from(examVersions).where(inArray(examVersions.examId,rows.map(e=>e.id))).orderBy(desc(examVersions.version)):[];
  return rows.map(e=>({...e,versions:versions.filter(v=>v.examId===e.id)}));
}
export async function assertCurriculumEditable(db:Reader,courseId:string) {
  const [c]=await db.select().from(courses).where(eq(courses.id,courseId)).for("update");
  if(c&&c.examPolicy!=="disabled")throw new ExamError(409,"Imtihonli kurs tarkibi muzlatilgan. O‘zgarish alohida migratsiya/review talab qiladi.");
}
export async function guardCurriculum(db:Reader,kind:"lesson"|"module"|"course",id:string) {
  if(kind==="course")return assertCurriculumEditable(db,id);
  const [row]=kind==="module"
    ? await db.select({courseId:modules.courseId}).from(modules).where(eq(modules.id,id))
    : await db.select({courseId:modules.courseId}).from(lessons).innerJoin(modules,eq(modules.id,lessons.moduleId)).where(eq(lessons.id,id));
  if(row)await assertCurriculumEditable(db,row.courseId);
}
export async function voidAttempt(actorId:string,id:string,reason:string,db:Database=getDatabase()) {
  // Same course lock as student submissions; imported lazily to keep admin/content code focused.
  const {lockCourse}=await import("./db");
  return db.transaction(async tx=>{
    const [a]=await tx.select().from(examAttempts).where(eq(examAttempts.id,id));
    if(!a)throw new ExamError(404,"Urinish topilmadi");
    await lockCourse(tx,a.studentId,a.courseId);
    const [updated]=await tx.update(examAttempts).set({status:"void",submittedAt:new Date()}).where(and(eq(examAttempts.id,id),eq(examAttempts.status,"in_progress"))).returning({id:examAttempts.id});
    if(!updated)throw new ExamError(409,"Faqat faol texnik nosoz urinish bekor qilinadi");
    await tx.insert(auditLog).values({actorId,action:"exam.voided",targetType:"exam_attempt",targetId:id,meta:{reason}});return {ok:true};
  });
}
