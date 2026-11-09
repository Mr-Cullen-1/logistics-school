import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { and, eq } from "drizzle-orm";
import { examDatabase } from "./helpers/exam-db";
import { courses, lessons, modules, lessonProgress, lessonFiles, examVersions, exams, examAttempts, enrollments, progress, practiceAttempts } from "../src/db/schema";
import { uploadExam, reviewExam, publishExam, setExamPolicy, guardCurriculum, voidAttempt } from "../src/lib/exams/admin";
import { getAttemptView, startOrResumeExam, saveExamAnswers, submitExam } from "../src/lib/exams/attempts";
import { courseLessonSequence } from "../src/lib/lessons/access";
import { assertLessonWrite } from "../src/lib/exams/lesson-write";
import { backfillAchievements, lifetimeLessons } from "../src/lib/exams/achievements";
import { getExamEligibility } from "../src/lib/exams/access";

test("actual prerequisite rows: missing p10, unpublished lesson and expired access all block start",async()=>{
  const f=await examDatabase();try{
    const lessonId=f.lessons[0].id;
    await f.db.update(practiceAttempts).set({correct:false}).where(and(eq(practiceAttempts.lessonId,lessonId),eq(practiceAttempts.seq,10)));
    assert.equal((await getExamEligibility(f.student.id,f.exams[0].id,f.db)).state,"locked");
    await assert.rejects(startOrResumeExam(f.student.id,f.exams[0].id,f.db));
    await f.db.update(practiceAttempts).set({correct:true}).where(eq(practiceAttempts.lessonId,lessonId));
    await f.db.update(lessons).set({status:"draft"}).where(eq(lessons.id,lessonId));
    assert.equal((await getExamEligibility(f.student.id,f.exams[0].id,f.db)).state,"locked");
    await f.db.update(lessons).set({status:"published"}).where(eq(lessons.id,lessonId));
    await f.db.update(enrollments).set({expiresAt:new Date(Date.now()-86400000)}).where(eq(enrollments.studentId,f.student.id));
    assert.equal((await getExamEligibility(f.student.id,f.exams[0].id,f.db)).state,"no_access");
    await assert.rejects(startOrResumeExam(f.student.id,f.exams[0].id,f.db));
  }finally{await f.client.close();}
});

test("real five JSX uploads: source validation, review, publish, readiness and curriculum freeze",async()=>{
  const f=await examDatabase();try{
    await f.db.update(courses).set({examPolicy:"disabled"}).where(eq(courses.id,f.course.id));
    await f.db.delete(examVersions);
    await f.db.update(exams).set({currentVersion:null});
    await assert.rejects(setExamPolicy(f.course.id,"enabled",f.admin.id,f.db));
    const corpus=JSON.parse(readFileSync("jsx-lessons/exams/source-corpus.json","utf8")) as {files:{lessonCode:string;slot:string;sha256:string}[]};
    await f.db.insert(lessonFiles).values(corpus.files.filter(x=>x.lessonCode!=="INTRO").map(x=>({lessonId:f.lessons.find(l=>l.code===x.lessonCode)!.id,kind:x.slot==="learn"?"learn":"practice",seq:x.slot==="learn"?0:Number(x.slot.slice(1)),source:"fixture",compiledJs:"",sizeBytes:7,sha256:x.sha256,version:1,status:"published" as const,isCurrent:true})));
    for(let i=0;i<5;i++){
      const name=i===4?"COURSE.ik.jsx":`M${i+1}.pk.jsx`,source=readFileSync(`jsx-lessons/exams/${name}`,"utf8"),id=f.exams[i].id;
      if(i===0)await assert.rejects(uploadExam(id,name,source.replace(/"sha256": "[a-f0-9]+"/,`"sha256": "${"0".repeat(64)}"`),80,f.admin.id,f.db));
      const version=await uploadExam(id,name,source,i===0?90:80,f.admin.id,f.db);
      await assert.rejects(publishExam(id,version.id,f.admin.id,f.db));
      await assert.rejects(reviewExam(id,version.id,"0".repeat(64),f.admin.id,f.db));
      await reviewExam(id,version.id,version.sha256,f.admin.id,f.db);
      await publishExam(id,version.id,f.admin.id,f.db);
    }
    await setExamPolicy(f.course.id,"enabled",f.admin.id,f.db);
    await assert.rejects(f.db.transaction(tx=>guardCurriculum(tx,"lesson",f.lessons[0].id)));
    await assert.rejects(f.db.transaction(tx=>guardCurriculum(tx,"module",f.sections[0].id)));
    const a=await startOrResumeExam(f.student.id,f.exams[0].id,f.db);assert.equal(a.passPercent,90);
    const {definition}= (await f.db.select().from(examVersions).where(eq(examVersions.examId,f.exams[0].id)))[0];
    const [stored]=await f.db.select().from(examAttempts).where(eq(examAttempts.id,a.id));
    assert(a.exam!.questions.flatMap(q=>q.options||[]).every(o=>/^choice-\d+$/.test(o.id)));
    const answers=definition.questions.slice(0,44).map(q=>({questionId:q.id,value:q.type==="typed"?q.grading.acceptedAnswers[0]:`choice-${stored.optionOrder[q.id].indexOf(q.grading.acceptedAnswers[0])+1}`}));
    assert.equal((await submitExam(f.student.id,a.id,0,answers,f.db)).percent,88);
    await setExamPolicy(f.course.id,"paused",f.admin.id,f.db);
    await assert.rejects(startOrResumeExam(f.student.id,f.exams[0].id,f.db));
  }finally{await f.client.close();}
});

test("legacy completed lessons are review-only until PK; reset preserves Intro and other course; stale writes fail",async()=>{
  const f=await examDatabase();try{
    const [intro]=await f.db.insert(lessons).values({moduleId:f.sections[0].id,code:"INTRO",title:"Intro",jsxSource:"",compiledJs:"",status:"published"}).returning();
    await f.db.insert(lessonProgress).values({studentId:f.student.id,lessonId:intro.id,learnDoneAt:new Date()});
    const [other]=await f.db.insert(courses).values({title:"Other",isPublished:true}).returning();
    const [otherModule]=await f.db.insert(modules).values({courseId:other.id,title:"Other module"}).returning();
    const [otherLesson]=await f.db.insert(lessons).values({moduleId:otherModule.id,code:"M1L01",title:"Other lesson",jsxSource:"",compiledJs:"",status:"published"}).returning();
    await f.db.insert(lessonProgress).values({studentId:f.student.id,lessonId:otherLesson.id,learnDoneAt:new Date(),practiceDoneAt:new Date()});
    await f.db.insert(progress).values([intro,otherLesson].map(l=>({studentId:f.student.id,lessonId:l.id,completedAt:new Date()})));
    await f.db.transaction(backfillAchievements);
    const sequence=await courseLessonSequence(f.student.id,f.course.id,f.db);
    assert.equal(sequence.lessons[8].reviewOnly,true);
    assert.equal(sequence.lessons[8].unlocked,true);
    await assert.rejects(f.db.transaction(tx=>assertLessonWrite(tx,f.student.id,{...f.lessons[8],code:f.lessons[8].code!,courseId:f.course.id},1)));
    for(let i=0;i<2;i++){const a=await startOrResumeExam(f.student.id,f.exams[0].id,f.db);await submitExam(f.student.id,a.id,0,[],f.db);}
    const after=await courseLessonSequence(f.student.id,f.course.id,f.db);
    assert.equal(after.lessons[0].unlocked,true);assert.equal(after.lessons[8].unlocked,false);
    assert((await f.db.select().from(lessonProgress).where(eq(lessonProgress.lessonId,intro.id))).length);
    assert((await f.db.select().from(lessonProgress).where(eq(lessonProgress.lessonId,otherLesson.id))).length);
    assert.equal(await lifetimeLessons(f.student.id,f.db),34);
    await assert.rejects(f.db.transaction(tx=>assertLessonWrite(tx,f.student.id,{...f.lessons[0],code:f.lessons[0].code!,courseId:f.course.id},1)));
    // A legacy course that has never enabled exams still accepts the old payload.
    await f.db.update(courses).set({examPolicy:"disabled"}).where(eq(courses.id,f.course.id));
    await f.db.transaction(tx=>assertLessonWrite(tx,f.student.id,{...f.lessons[0],code:f.lessons[0].code!,courseId:f.course.id},undefined));
  }finally{await f.client.close();}
});

test("pinned version and threshold; paused resume; ownership, revoked access, duplicate starts and void budget",async()=>{
  const f=await examDatabase();try{
    const [a,b]=await Promise.all([startOrResumeExam(f.student.id,f.exams[0].id,f.db),startOrResumeExam(f.student.id,f.exams[0].id,f.db)]);assert.equal(a.id,b.id);
    await assert.rejects(getAttemptView(f.admin.id,a.id,f.db));
    await assert.rejects(saveExamAnswers(f.student.id,a.id,0,[{questionId:"unknown",value:"test"}],f.db));
    await f.db.insert(examVersions).values({...f.versions[0],id:undefined,version:2,passPercent:100});
    await f.db.update(exams).set({currentVersion:2,passPercent:100}).where(eq(exams.id,f.exams[0].id));
    await f.db.update(courses).set({examPolicy:"paused"}).where(eq(courses.id,f.course.id));
    assert.equal((await startOrResumeExam(f.student.id,f.exams[0].id,f.db)).passPercent,80);
    await f.db.update(enrollments).set({isActive:false}).where(eq(enrollments.studentId,f.student.id));
    await assert.rejects(saveExamAnswers(f.student.id,a.id,0,[],f.db));
    await assert.rejects(submitExam(f.student.id,a.id,0,[],f.db));
    await f.db.update(enrollments).set({isActive:true}).where(eq(enrollments.studentId,f.student.id));
    await voidAttempt(f.admin.id,a.id,"Browser runtime failed",f.db);
    await assert.rejects(getAttemptView(f.student.id,a.id,f.db));
    await f.db.update(courses).set({examPolicy:"enabled"}).where(eq(courses.id,f.course.id));
    const next=await startOrResumeExam(f.student.id,f.exams[0].id,f.db);assert.equal(next.attemptNo,2);assert.equal(next.passPercent,100);
    await submitExam(f.student.id,next.id,0,[],f.db);
    const third=await startOrResumeExam(f.student.id,f.exams[0].id,f.db);assert.equal(third.attemptNo,3);
    assert.equal((await f.db.select().from(examAttempts).where(and(eq(examAttempts.examId,f.exams[0].id),eq(examAttempts.status,"void")))).length,1);
  }finally{await f.client.close();}
});
