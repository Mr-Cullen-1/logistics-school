import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { parseExamUpload } from "../src/lib/exams/compile";
import { gradeExam } from "../src/lib/exams/grading";
import { toPublicExam } from "../src/lib/exams/public";

const corpus=JSON.parse(readFileSync("jsx-lessons/exams/source-corpus.json","utf8")) as {files:{path:string;lessonCode:string;slot:string;sha256:string;strings:{text:string}[]}[]};
assert.equal(corpus.files.length,353);
for(const file of corpus.files)assert.equal(createHash("sha256").update(readFileSync(file.path)).digest("hex"),file.sha256,`Stale corpus: ${file.path}`);
let total=0;
for(const name of ["M1.pk.jsx","M2.pk.jsx","M3.pk.jsx","M4.pk.jsx","COURSE.ik.jsx"]){
  const {definition:d}=parseExamUpload(name,readFileSync(`jsx-lessons/exams/${name}`,"utf8"));
  assert.equal(new Set(d.questions.map(q=>q.prompt)).size,d.questions.length,`${name}: duplicate prompt`);
  for(const q of d.questions){for(const ref of q.sourceRefs){const source=corpus.files.find(f=>f.lessonCode===ref.lessonCode&&f.slot===ref.slot);assert(source);assert.equal(source.sha256,ref.sha256);
      const pointer=/^DATA\.slides\[(\d+)\]: (.+)$/.exec(ref.reference);
      if(pointer){const data=JSON.parse(readFileSync(source.path,"utf8").match(/const DATA = (.*);/)![1]);assert.equal(data.slides[Number(pointer[1])]?.heading,pointer[2]);}
      else assert(/^THEORY\[[0-4]\]$|^vocabulary: .+/.test(ref.reference),`${q.id}: precise source pointer required`);
    }
    if(q.lemma){const f=corpus.files.find(f=>f.lessonCode===q.sourceRefs[0].lessonCode&&f.slot===q.sourceRefs[0].slot)!;assert(f.strings.some(s=>s.text.toLowerCase().includes(q.lemma!.toLowerCase())),`${q.id}: lemma missing`);}
    assert(q.grading.acceptedAnswers.every(a=>a.trim().length>0));
  }
  for(const p of d.passages){const words=p.text.split(/\s+/).length;assert(words>=250&&words<=350,`${p.id}: ${words} words`);}
  assert.equal(gradeExam(d,d.questions.map(q=>({questionId:q.id,value:q.grading.acceptedAnswers[0]}))).percent,100);
  assert.equal(gradeExam(d,[]).percent,0);
  assert(!JSON.stringify(toPublicExam(d)).includes('"grading"'));
  assert(!JSON.stringify(toPublicExam(d)).includes('"sourceRefs"'));
  total+=d.questions.length;console.log(`${name}: blueprint, source hashes, answer round-trip and public payload PASS`);
}
assert.equal(total,300);console.log("PASS: 300 items; 353 source files; 4 PK + 1 IK.");
