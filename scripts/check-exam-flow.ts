// Local browser + real service/SQL harness. No production connection or credentials.
// HTTP transport is a fixture adapter; deployed auth routes are checked separately.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { build } from "esbuild";
import { chromium } from "playwright-core";
import { examDatabase } from "../tests/helpers/exam-db";
import { startOrResumeExam, getAttemptView, submitExam, saveExamAnswers, grantIkRetry } from "../src/lib/exams/attempts";
import { getExamEligibility } from "../src/lib/exams/access";
import { ExamError } from "../src/lib/exams/db";

async function main(){
  const executablePath=[process.env.CHROME_PATH,"C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(p=>p&&existsSync(p));assert(executablePath);
  const f=await examDatabase();const examId=f.exams[4].id;
  for(let i=0;i<4;i++){const a=await startOrResumeExam(f.student.id,f.exams[i].id,f.db);await submitExam(f.student.id,a.id,0,f.versions[i].definition.questions.map(q=>({questionId:q.id,value:q.grading.acceptedAnswers[0]})),f.db);}
  let failedId="";
  for(let i=0;i<2;i++){const a=await startOrResumeExam(f.student.id,examId,f.db);failedId=a.id;await submitExam(f.student.id,a.id,0,[],f.db);}
  await grantIkRetry(f.admin.id,f.student.id,examId,"Local browser regression fixture",crypto.randomUUID(),f.db);
  const bundle=await build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {StudentExamPlayer} from './src/components/learn/student-exam-player';createRoot(document.getElementById('root')).render(<StudentExamPlayer summary={window.fixture} lang="en" initialAttempt={new URLSearchParams(location.search).get('attempt')||undefined}/>);`,resolveDir:process.cwd(),loader:"tsx"},bundle:true,jsx:"automatic",write:false,outfile:".next/exam-harness.js",platform:"browser",format:"iife",define:{"process.env":"{}","process.env.NODE_ENV":'"production"'},logLevel:"silent",plugins:[{name:"fixture-router",setup(b){b.onResolve({filter:/^next\/navigation$/},()=>({path:"router",namespace:"fixture"}));b.onLoad({filter:/.*/,namespace:"fixture"},()=>({contents:"export function useRouter(){return {push(url){location.href=url},refresh(){location.reload()}}}",loader:"js"}));}}]});
  const server=createServer(async(req,res)=>{
    try{
      const path=new URL(req.url!,"http://localhost").pathname;
      if(path==="/app.css"){res.setHeader("Content-Type","text/css");res.end(bundle.outputFiles!.find(f=>f.path.endsWith(".css"))?.text||"");return;}
      if(path==="/app.js"){res.setHeader("Content-Type","text/javascript");res.end(bundle.outputFiles![0].text);return;}
      if(path==="/lesson-runtime.js"){res.setHeader("Content-Type","text/javascript");res.end(readFileSync("public/lesson-runtime.js"));return;}
      if(/^\/fonts\/[\w-]+\.woff2$/.test(path)){res.setHeader("Access-Control-Allow-Origin","*");res.end(readFileSync(`public${path}`));return;}
      if(path.startsWith("/api/")){
        let raw="";for await(const chunk of req)raw+=chunk;const body=raw?JSON.parse(raw):{};
        const match=path.match(/\/exam-attempts\/([^/]+)(?:\/(answers|submit))?$/);
        const data=path.endsWith("/attempts")?await startOrResumeExam(f.student.id,examId,f.db):!match?null:match[2]==="answers"?await saveExamAnswers(f.student.id,match[1],body.revision,body.answers,f.db):match[2]==="submit"?await submitExam(f.student.id,match[1],body.revision,body.answers,f.db):await getAttemptView(f.student.id,match[1],f.db);
        res.setHeader("Content-Type","application/json");res.end(JSON.stringify(data));return;
      }
      const eligibility=await getExamEligibility(f.student.id,examId,f.db),latest=eligibility.attempts.sort((a,b)=>b.attemptNo-a.attemptNo)[0];
      const summary={id:examId,courseId:f.course.id,moduleId:null,kind:"ik",title:"IK",courseTitle:f.course.title,passPercent:80,state:eligibility.state,remaining:eligibility.remaining,canStart:eligibility.canStart,canResume:eligibility.canResume,attemptId:latest.id,result:latest.result};
      res.setHeader("Content-Type","text/html; charset=utf-8");res.end(`<!doctype html><html><head><link rel="stylesheet" href="/app.css"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script>window.fixture=${JSON.stringify(summary).replaceAll("<","\\u003c")}</script><script src="/app.js"></script></body></html>`);
    }catch(error){res.statusCode=error instanceof ExamError?error.status:500;res.setHeader("Content-Type","application/json");res.end(JSON.stringify({error:(error as Error).message}));}
  });
  await new Promise<void>(resolve=>server.listen(0,"127.0.0.1",resolve));const origin=`http://127.0.0.1:${(server.address() as {port:number}).port}`;
  const browser=await chromium.launch({executablePath,headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1100,height:900}}),errors:string[]=[];page.on("pageerror",e=>{errors.push(e.message);console.error("Browser:",e.message)});
    await page.goto(`${origin}/?attempt=${failedId}`);
    // Regression: loading historical ?attempt must not hide the granted start button.
    await page.getByRole("heading",{name:"Pass mark not reached"}).waitFor();
    await page.waitForTimeout(300);
    await page.getByRole("button",{name:"Try again",exact:true}).click();
    const frame=page.frameLocator("iframe");await frame.locator("h1").waitFor();
    const id=new URL(page.url()).searchParams.get("attempt")!;assert.notEqual(id,failedId);
    await page.evaluate(()=>{
      window.dispatchEvent(new MessageEvent("message",{source:window,data:{type:"exam_submit",nonce:"forged",payload:[]}}));
      window.dispatchEvent(new MessageEvent("message",{source:document.querySelector("iframe")!.contentWindow,data:{type:"exam_submit",nonce:"wrong-nonce",payload:[]}}));
    });
    assert.equal((await getAttemptView(f.student.id,id,f.db)).status,"in_progress");
    const view=await getAttemptView(f.student.id,id,f.db),typedIndex=view.exam!.questions.findIndex(q=>q.type==="typed");
    await frame.getByRole("navigation").getByRole("button",{name:String(typedIndex+1),exact:true}).click();
    await frame.getByLabel("Your answer").fill("confirmed");
    await page.getByRole("status").filter({hasText:"Answers saved"}).waitFor();
    assert.equal((await getAttemptView(f.student.id,id,f.db)).answers[0].value,"confirmed");
    await page.reload();await page.frameLocator("iframe").locator("h1").waitFor();
    await page.frameLocator("iframe").getByRole("navigation").getByRole("button",{name:String(typedIndex+1),exact:true}).click();
    assert.equal(await page.frameLocator("iframe").getByLabel("Your answer").inputValue(),"confirmed");
    const secondTab=await browser.newPage();await secondTab.goto(page.url());await secondTab.frameLocator("iframe").locator("h1").waitFor();
    await secondTab.frameLocator("iframe").getByRole("navigation").getByRole("button",{name:String(typedIndex+1),exact:true}).click();
    assert.equal(await secondTab.frameLocator("iframe").getByLabel("Your answer").inputValue(),"confirmed");await secondTab.close();
    await page.frameLocator("iframe").getByRole("button",{name:"Finish",exact:true}).click();
    await page.frameLocator("iframe").getByRole("button",{name:"Submit exam",exact:true}).click();
    await page.getByText("An administrator must allow another attempt. Your progress is preserved.",{exact:true}).waitFor();
    assert.equal(await page.getByRole("button",{name:"Try again",exact:true}).count(),0);
    assert.equal((await getExamEligibility(f.student.id,examId,f.db)).state,"awaiting_admin");
    assert.deepEqual(errors,[]);
    console.log("PASS: IK admin grant -> historical result retry -> iframe start -> SQL autosave -> reload/resume -> submit -> budget exhausted, without progress reset.");
  }finally{await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));await f.client.close();}
}
main().catch(e=>{console.error(e);process.exit(1);});
