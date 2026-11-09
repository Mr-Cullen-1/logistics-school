import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { chromium } from "playwright-core";
import { parseExamUpload } from "../src/lib/exams/compile";
import { toPublicExam } from "../src/lib/exams/public";
import { lessonFrameDocument } from "../src/lib/lessons/frame";

async function main(){
  const executablePath=[process.env.CHROME_PATH,"C:/Program Files/Google/Chrome/Application/chrome.exe","C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(p=>p&&existsSync(p));
  assert(executablePath,"Chrome/Edge required");
  const server=createServer((req,res)=>{
    if(req.url==="/lesson-runtime.js"){res.setHeader("Content-Type","application/javascript");res.end(readFileSync("public/lesson-runtime.js"));}
    else if(req.url?.startsWith("/fonts/")&&/^\/fonts\/[\w-]+\.woff2$/.test(req.url)){res.setHeader("Access-Control-Allow-Origin","*");res.end(readFileSync(`public${req.url}`));}
    else{res.setHeader("Content-Type","text/html");res.end('<!doctype html><html><body style="margin:0"><div id="host"></div></body></html>');}
  });
  await new Promise<void>(resolve=>server.listen(0,"127.0.0.1",resolve));
  const port=(server.address() as {port:number}).port,origin=`http://127.0.0.1:${port}`;
  const browser=await chromium.launch({executablePath,headless:true});
  try{
    const page=await browser.newPage();const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
    for(const width of [1280,390])for(const filename of ["M1.pk.jsx","M2.pk.jsx","M3.pk.jsx","M4.pk.jsx","COURSE.ik.jsx"]){
      await page.setViewportSize({width,height:900});await page.goto(origin);
      const exam=toPublicExam(parseExamUpload(filename,readFileSync(`jsx-lessons/exams/${filename}`,"utf8")).definition);
      await page.evaluate(({html,exam})=>{
        const frame=document.createElement("iframe");frame.title="Exam";frame.style.cssText="width:100%;height:850px;border:0";frame.setAttribute("sandbox","allow-scripts");frame.srcdoc=html;
        const nonce=crypto.randomUUID();
        Object.assign(window,{examMessages:[]});
        window.addEventListener("message",e=>{if(e.source===frame.contentWindow&&e.data?.nonce===nonce)(window as unknown as {examMessages:unknown[]}).examMessages.push(e.data);});
        frame.addEventListener("load",()=>frame.contentWindow?.postMessage({type:"init",nonce,kind:"exam",compiledJs:'module.exports.default=require("@coliseum/kit").ExamScreen',props:{exam,lang:"en"}},"*"));
        document.getElementById("host")!.append(frame);
      },{html:lessonFrameDocument(origin),exam});
      const frame=page.frameLocator("iframe");await frame.locator("h1").waitFor();
      const typed=exam.questions.findIndex(q=>q.type==="typed");
      await frame.getByRole("navigation").getByRole("button",{name:String(typed+1),exact:true}).click();
      await frame.getByLabel("Your answer").fill("draft answer");
      await frame.getByRole("button",{name:"Next",exact:true}).click();
      await frame.getByRole("button",{name:"Previous",exact:true}).click();
      assert.equal(await frame.getByLabel("Your answer").inputValue(),"draft answer");
      const matching=exam.questions.findIndex(q=>q.type==="matching");
      if(matching>=0){await frame.getByRole("navigation").getByRole("button",{name:String(matching+1),exact:true}).click();await frame.getByRole("combobox").selectOption({index:1});}
      const mc=exam.questions.findIndex(q=>q.type==="single_choice");
      await frame.getByRole("navigation").getByRole("button",{name:String(mc+1),exact:true}).click();await frame.locator(".options button").first().click();
      const overflow=await frame.locator("body").evaluate(el=>el.scrollWidth>window.innerWidth);assert.equal(overflow,false,`${filename} width ${width}`);
      await frame.getByRole("button",{name:"Finish",exact:true}).click();await frame.getByRole("button",{name:"Submit exam",exact:true}).click();
      const messages=await page.evaluate(()=>(window as unknown as {examMessages:{type:string;payload:unknown}[]}).examMessages);
      assert(messages.some(m=>m.type==="mounted"));assert(messages.some(m=>m.type==="exam_answers"));assert(messages.some(m=>m.type==="exam_submit"));assert(!messages.some(m=>m.type==="error"));
      console.log(`${filename} ${width}px: mount, typed/choice controls, navigation, submit, no horizontal overflow PASS`);
    }
    assert.deepEqual(errors,[]);
  }finally{await browser.close();await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
