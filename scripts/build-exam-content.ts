import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { parse } from "@babel/parser";
import { examJsxSource } from "../src/lib/exams/compile";
import { validateExamDefinition } from "../src/lib/exams/definition";
import type { ExamDefinition, ExamQuestion, ModuleCode } from "../src/lib/exams/types";
import { pkItems, pkTheoryRefs, type Item } from "./exam-content-spec";
import { finalItems, finalTheoryRefs, passages } from "./exam-final-spec";

// Static AST traversal, never eval/import lesson code. DATA/task, custom M1L01,
// JSX text and literal props are all inspected. Style sheets are excluded.
function strings(value:unknown,result:{line:number;text:string}[]=[]) {
  if(!value||typeof value!=="object")return result;
  const node=value as Record<string,unknown>;
  if(node.type==="VariableDeclarator"&&["CSS","STYLES"].includes(String((node.id as {name?:string})?.name)))return result;
  if(node.type==="StringLiteral"||node.type==="JSXText") {
    const text=String(node.value).trim();
    if(text.length>1)result.push({line:(node.loc as {start:{line:number}}).start.line,text});
  }
  for(const [key,child] of Object.entries(node))if(!["loc","extra","comments"].includes(key)){
    if(Array.isArray(child))child.forEach(c=>strings(c,result));else if(child&&typeof child==="object")strings(child,result);
  }
  return result;
}
function paths(dir:string):string[]{return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()&&e.name!=="exams"?paths(join(dir,e.name)):e.isFile()&&e.name.endsWith(".jsx")?[join(dir,e.name)]:[]);}
const corpus=paths("jsx-lessons").sort().map(path=>{
  const source=readFileSync(path,"utf8"),name=path.split(/[\\/]/).pop()!,[lessonCode,slot]=name.split(".");
  return {path:path.replaceAll("\\","/"),lessonCode,slot,sha256:createHash("sha256").update(source).digest("hex"),strings:strings(parse(source,{sourceType:"module",plugins:["jsx"]}))};
});
const out="jsx-lessons/exams";mkdirSync(out,{recursive:true});
writeFileSync(join(out,"source-corpus.json"),JSON.stringify({description:"Static literal inventory of 353 source JSX files; includes metadata literals. Not all strings are student-facing. CSS/STYLES excluded; custom M1L01 and all practice files included.",files:corpus},null,2)+"\n");
function ref(module:number,lesson:number,reference="theory and examples"){const code=`M${module}L0${lesson}`,file=corpus.find(f=>f.lessonCode===code&&f.slot==="learn")!;return {lessonCode:code,slot:"learn",sha256:file.sha256,reference};}
function theoryRef(module:number,lesson:number,ordinal:number){
  if(module===1&&lesson===1)return ref(module,lesson,`THEORY[${ordinal-1}]`);
  const source=readFileSync(`jsx-lessons/module-0${module}/M${module}L0${lesson}.learn.jsx`,"utf8");
  const data=JSON.parse(source.match(/const DATA = (.*);/)![1]) as {slides:{kind:string;heading:string}[]};
  const slides=data.slides.map((slide,index)=>({...slide,index})).filter(s=>s.kind==="theory"),selected=slides[ordinal-1];
  if(!selected)throw new Error(`Missing theory ${module}/${lesson}/${ordinal}`);
  return ref(module,lesson,`DATA.slides[${selected.index}]: ${selected.heading}`);
}
function question(item:Item,module:number,lesson:number,bloom:ExamQuestion["bloom"],section:ExamQuestion["section"],index:number,type?:ExamQuestion["type"]):ExamQuestion {
  const [prompt,answer,...distractors]=item,hasOptions=distractors.length>0;
  const optionId=(text:string)=>createHash("sha256").update(`${prompt}:${text}`).digest("hex").slice(0,16);
  return {id:`${section}-M${module}-${index}`,moduleCode:`M${module}` as ModuleCode,section,bloom,difficulty:bloom==="remember"?"easy":["analyze","evaluate"].includes(bloom)?"hard":"medium",type:type||(hasOptions?"single_choice":"typed"),prompt,
    ...(hasOptions?{options:[answer,...distractors].map(text=>({id:optionId(text),text})).sort((a,b)=>a.id.localeCompare(b.id))}:{}),sourceRefs:[ref(module,lesson)],
    grading:{acceptedAnswers:[hasOptions?optionId(answer):answer],caseSensitive:answer==="KT-4821",...(!hasOptions?{maxWords:Math.max(1,answer.split(/\s+/).length)}:{})}};
}
type Term={lemma:string;meaning:string;example:string;lesson:number};
function terms(module:number):Term[]{
  const all:Term[]=[];
  // M1L01 has a custom multilingual slide component, not DATA.
  if(module===1)all.push({lemma:"dispatcher",meaning:"haydovchini yo‘naltiruvchi xodim",example:"The dispatcher sends the address.",lesson:1},{lemma:"broker",meaning:"yuk bo‘yicha vositachi",example:"The broker needs a truck.",lesson:1},{lemma:"address",meaning:"manzil",example:"I need the address.",lesson:1});
  for(let lesson=1;lesson<=8;lesson++){
    const source=readFileSync(`jsx-lessons/module-0${module}/M${module}L0${lesson}.learn.jsx`,"utf8"),match=source.match(/const DATA = (.*);/);
    if(!match)continue;
    const data=JSON.parse(match[1]) as {slides:{kind:string;rows?:string[][]}[]};
    for(const row of data.slides.filter(s=>s.kind==="vocab").flatMap(s=>s.rows||[])){
      // Prefer a single unambiguous base term; no slash alternatives or expansions.
      if(/[(/]/.test(row[0]))continue;
      all.push({lemma:row[0],meaning:row[1],example:row[2],lesson});
    }
  }
  return all;
}
const finalLemmas=new Set<string>();
function vocabulary(module:number,count:number,remember:number,isFinal:boolean):ExamQuestion[]{
  const pool=terms(module),selected:Term[]=[],seen=new Set<string>();
  // Round-robin coverage across eight lessons, with no duplicated headword.
  for(let round=0;selected.length<count&&round<20;round++)for(let lesson=1;lesson<=8&&selected.length<count;lesson++){
    const candidate=pool.filter(t=>t.lesson===lesson&&(!isFinal||!finalLemmas.has(t.lemma.toLowerCase()))&&new RegExp(`\\b${t.lemma.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\b`,"i").test(t.example)).filter(t=>!seen.has(t.lemma.toLowerCase()))[0];if(!candidate)continue;
    const key=candidate.lemma.toLowerCase();
    if(seen.has(key)||(isFinal&&finalLemmas.has(key)))continue;
    // A contextual item needs the exact base term in its source sentence.
    if(!new RegExp(`\\b${candidate.lemma.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\b`,"i").test(candidate.example))continue;
    selected.push(candidate);seen.add(key);if(isFinal)finalLemmas.add(key);
  }
  if(selected.length!==count)throw new Error(`Vocabulary pool too small M${module}`);
  return selected.map((term,i)=>{
    const contextual=i>=remember;
    const blank=term.example.replace(new RegExp(`\\b${term.lemma.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\b`,"ig"),"___");
    const prompt=contextual?`Complete the sentence with the course term meaning “${term.meaning}”. Write only the missing English word or phrase: ${blank}`:`Write the English course term meaning “${term.meaning}”. Use the base word or phrase (${term.lemma.split(/\s+/).length} word${term.lemma.includes(" ")?"s":""}).`;
    return {...question([prompt,term.lemma],module,term.lesson,contextual?"understand":"remember","vocabulary",i+1),lemma:term.lemma,sourceRefs:[ref(module,term.lesson,`vocabulary: ${term.lemma}`)]};
  });
}
function save(filename:string,definition:ExamDefinition){const errors=validateExamDefinition(definition);if(errors.length)throw new Error(`${filename}: ${errors.join("; ")}`);writeFileSync(join(out,filename),examJsxSource(definition));console.log(`${filename}: ${definition.questions.length} questions`);}
for(let m=1;m<=4;m++){
  const core=pkItems[m-1].flatMap((items,l)=>items.map((item,i)=>({...question(item,m,l+1,l<6?(["remember","understand","apply","analyze"] as const)[i]:(["apply","apply","evaluate"] as const)[i],"core",l*4+i+1),sourceRefs:[theoryRef(m,l+1,pkTheoryRefs[m-1][l][i])]})));
  save(`M${m}.pk.jsx`,{schemaVersion:1,kind:"pk",moduleCode:`M${m}` as ModuleCode,title:`PK ${m} — Module ${m}`,passages:[],questions:[...core,...vocabulary(m,20,10,false)]});
}
const core=finalItems.map((q,i)=>({...question(q.item,q.module,q.lesson,q.bloom,q.section,i+1,q.type),sourceRefs:[theoryRef(q.module,q.lesson,finalTheoryRefs[i])],...(q.passageId?{passageId:q.passageId}:{})}));
save("COURSE.ik.jsx",{schemaVersion:1,kind:"ik",title:"IK — Final English Exam",passages,questions:[...core,...[1,2,3,4].flatMap(m=>vocabulary(m,m<3?12:13,6,true))]});
console.log(`Source inventory: ${corpus.length} JSX files`);
