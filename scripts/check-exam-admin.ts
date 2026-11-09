// Local React admin UI + actual SQL services. Fixture HTTP adapter (no real login).
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { build } from "esbuild";
import { chromium } from "playwright-core";
import { eq, and } from "drizzle-orm";
import { examDatabase } from "../tests/helpers/exam-db";
import { courses, exams, examVersions, lessonFiles } from "../src/db/schema";
import { createExam, uploadExam, reviewExam, publishExam, setExamPolicy, courseExamAdmin } from "../src/lib/exams/admin";
import { toPublicExam } from "../src/lib/exams/public";
import { ExamError } from "../src/lib/exams/db";

async function main(){
  const executablePath=[process.env.CHROME_PATH,"C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(p=>p&&existsSync(p));assert(executablePath);
  const f=await examDatabase();await f.db.delete(examVersions);await f.db.delete(exams);await f.db.update(courses).set({examPolicy:"disabled"});
  const corpus=JSON.parse(readFileSync("jsx-lessons/exams/source-corpus.json","utf8")) as {files:{lessonCode:string;slot:string;sha256:string}[]};
  await f.db.insert(lessonFiles).values(corpus.files.filter(x=>x.lessonCode!=="INTRO").map(x=>({lessonId:f.lessons.find(l=>l.code===x.lessonCode)!.id,kind:x.slot==="learn"?"learn":"practice",seq:x.slot==="learn"?0:Number(x.slot.slice(1)),source:"fixture",compiledJs:"",sizeBytes:7,sha256:x.sha256,version:1,status:"published" as const,isCurrent:true})));
  const bundle=await build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {ExamManager} from './src/components/admin/exam-manager';const root=createRoot(document.getElementById('root'));const render=props=>root.render(<ExamManager {...props}/>);window.refreshFixture=()=>fetch('/fixture').then(r=>r.json()).then(render);render(window.fixture);`,loader:"tsx",resolveDir:process.cwd()},bundle:true,jsx:"automatic",write:false,outfile:".next/exam-admin-harness.js",platform:"browser",format:"iife",define:{"process.env":"{}","process.env.NODE_ENV":'"production"'},logLevel:"silent",plugins:[{name:"fixture-router",setup(b){b.onResolve({filter:/^next\/navigation$/},()=>({path:"router",namespace:"fixture"}));b.onLoad({filter:/.*/,namespace:"fixture"},()=>({contents:"export function useRouter(){return {refresh(){window.refreshFixture()}}}",loader:"js"}));}}]});
  const server=createServer(async(req,res)=>{try{
    const path=new URL(req.url!,"http://localhost").pathname;
    if(path==="/app.js"){res.setHeader("Content-Type","text/javascript");res.end(bundle.outputFiles!.find(f=>f.path.endsWith(".js"))!.text);return;}
    if(path==="/app.css"){res.setHeader("Content-Type","text/css");res.end(bundle.outputFiles!.find(f=>f.path.endsWith(".css"))?.text);return;}
    if(path==="/lesson-runtime.js"){res.setHeader("Content-Type","text/javascript");res.end(readFileSync("public/lesson-runtime.js"));return;}
    if(/^\/fonts\/[\w-]+\.woff2$/.test(path)){res.setHeader("Access-Control-Allow-Origin","*");res.end(readFileSync(`public${path}`));return;}
    if(path.startsWith("/api/")){
      let raw="";for await(const c of req)raw+=c;const body=raw?JSON.parse(raw):{};const parts=path.split("/");let result:unknown;
      if(parts[3]==="courses")result=parts[5]==="exams"?await createExam(f.course.id,body,f.admin.id,f.db):await setExamPolicy(f.course.id,body.policy,f.admin.id,f.db);
      else if(parts[5]==="files")result=await uploadExam(parts[4],body.filename,body.source,body.passPercent,f.admin.id,f.db);
      else if(parts[5]==="publish")result=await publishExam(parts[4],body.versionId,f.admin.id,f.db);
      else if(parts[7]==="verify")result=await reviewExam(parts[4],parts[6],body.sha256,f.admin.id,f.db);
      else{const [v]=await f.db.select().from(examVersions).where(and(eq(examVersions.id,parts[6]),eq(examVersions.examId,parts[4])));result={definition:v.definition,sha256:v.sha256,exam:toPublicExam(v.definition)};}
      res.setHeader("Content-Type","application/json");res.end(JSON.stringify(result));return;
    }
    const [course]=await f.db.select().from(courses).where(eq(courses.id,f.course.id));
    const props={courseId:f.course.id,policy:course.examPolicy,modules:f.sections.map(m=>({id:m.id,title:m.title})),exams:await courseExamAdmin(f.course.id,f.db)};
    if(path==="/fixture"){res.setHeader("Content-Type","application/json");res.end(JSON.stringify(props));return;}
    res.setHeader("Content-Type","text/html; charset=utf-8");res.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/app.css"></head><body style="background:#0d1114"><div id="root"></div><script>window.fixture=${JSON.stringify(props).replaceAll("<","\\u003c")}</script><script src="/app.js"></script></body></html>`);
  }catch(e){res.statusCode=e instanceof ExamError?e.status:500;res.setHeader("Content-Type","application/json");res.end(JSON.stringify({error:(e as Error).message}));}});
  await new Promise<void>(resolve=>server.listen(0,"127.0.0.1",resolve));const origin=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
  const browser=await chromium.launch({executablePath,headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:900}}),errors:string[]=[];page.on("pageerror",e=>{errors.push(e.message);console.error("Browser:",e.message)});await page.goto(origin);
    for(let i=0;i<5;i++){
      await page.locator("form").first().locator("select").selectOption(i===4?"ik":f.sections[i].id);
      const [created]=await Promise.all([page.waitForResponse(r=>r.url().endsWith("/exams")&&r.request().method()==="POST"),page.getByRole("button",{name:"Imtihon yaratish",exact:true}).click()]);assert.equal(created.status(),200);
      const title=i===4?"IK — Final exam":`PK — Module ${i+1}`;
      const card=page.locator("article").filter({has:page.getByRole("heading",{name:title,exact:true})});await card.waitFor();
      await card.locator('input[type="file"]').setInputFiles(`jsx-lessons/exams/${i===4?"COURSE.ik.jsx":`M${i+1}.pk.jsx`}`);
      await card.locator('input[type="number"]').fill("85");await card.getByRole("button",{name:"Draft yuklash",exact:true}).click();
      await card.getByRole("button",{name:"Ko‘rib chiqish",exact:true}).click();await card.frameLocator("iframe").locator("h1").waitFor();
      await card.frameLocator("iframe").getByRole("button",{name:"Yakunlash",exact:true}).click();await card.frameLocator("iframe").getByRole("button",{name:"Natijani yuborish",exact:true}).click();
      await card.getByRole("checkbox").check();await card.getByRole("button",{name:"Preview OK",exact:true}).click();
      await card.getByRole("button",{name:"Nashr qilish",exact:true}).click();await card.getByText("Joriy versiya: 1 · O‘tish: 85%",{exact:true}).waitFor();
      console.log(`${title}: create -> JSX upload (85%) -> iframe preview -> review -> SQL publish PASS`);
    }
    await page.getByRole("button",{name:"Imtihonlarni faollashtirish",exact:true}).click();await page.getByRole("button",{name:"Yangi urinishlarni to‘xtatish",exact:true}).waitFor();
    assert.equal((await f.db.select().from(courses).where(eq(courses.id,f.course.id)))[0].examPolicy,"enabled");assert.deepEqual(errors,[]);
    console.log("PASS: real five-file admin flow and explicit readiness enable.");
  }finally{await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));await f.client.close();}
}
main().catch(e=>{console.error(e);process.exit(1);});
