import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {existsSync,readFileSync} from 'node:fs';
import {chromium} from 'playwright-core';
import {validateAndCompileLesson} from '../src/lib/lessons/compile';
import {lessonFrameDocument} from '../src/lib/lessons/frame';

async function main(){
 const assets:Record<string,[string,string]>={'/lesson-runtime.js':['public/lesson-runtime.js','text/javascript'],'/fonts/Geist-Variable.woff2':['public/fonts/Geist-Variable.woff2','font/woff2'],'/fonts/GeistMono-Variable.woff2':['public/fonts/GeistMono-Variable.woff2','font/woff2']};
 const server=createServer((req,res)=>{const asset=assets[req.url||''];res.writeHead(200,{'content-type':asset?.[1]||'text/html','access-control-allow-origin':'*'});res.end(asset?readFileSync(asset[0]):'<!doctype html><title>Module 4 verification</title>');});
 await new Promise<void>(resolve=>server.listen(43224,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:43224';
 const executablePath=['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
 const browser=await chromium.launch({executablePath,headless:true});
 try{
  for(let lesson=1;lesson<=8;lesson++){
   const code=`M4L0${lesson}`,source=readFileSync(`jsx-lessons/module-04/${code}.learn.jsx`,'utf8');
   const compiled=validateAndCompileLesson(`${code}.learn.jsx`,source);assert.ok(compiled.ok,compiled.ok?'':compiled.error);
   const data=JSON.parse(source.match(/const DATA = (.+);/)![1]);
   assert.equal(data.slides.length,16+data.theoryCount);
   const selected=process.env.M4_LESSON?.split(',')||['M4L01','M4L08'];
   if(!selected.includes(code)){console.log(`${code}: compiled`);continue;}
   const page=await browser.newPage({viewport:{width:1536,height:720}}),errors:string[]=[];
   page.on('pageerror',error=>errors.push(error.message));await page.goto(origin);
   await page.evaluate(({html,compiledJs})=>{Object.assign(window,{lessonMessages:[]});const nonce=crypto.randomUUID(),iframe=document.createElement('iframe');iframe.setAttribute('sandbox','allow-scripts');iframe.style.cssText='position:fixed;inset:0;width:100vw;height:100dvh;border:0';iframe.srcdoc=html;window.addEventListener('message',event=>{if(event.source===iframe.contentWindow&&event.data?.nonce===nonce)(window as any).lessonMessages.push(event.data);});iframe.onload=()=>iframe.contentWindow?.postMessage({type:'init',nonce,compiledJs,kind:'learn',props:{lang:'uz'}},'*');document.body.append(iframe);},{html:lessonFrameDocument(origin),compiledJs:compiled.compiledJs});
   const frame=page.frameLocator('iframe');await frame.locator('.ml-root').waitFor();const next=frame.locator('.ml-foot .primary').last();
   for(const [index,slide] of data.slides.entries()){
    await frame.locator('.ml-eyebrow').filter({hasText:`${index+1}/${data.slides.length}`}).waitFor();
    assert.equal(await frame.locator('.ml-slide > div:first-child > .ml-kick').count(),0);
    if(index===0&&lesson===1){const console3d=frame.locator('.m4-console'),signal=frame.locator('.m4-track i');const before=await console3d.evaluate(el=>getComputedStyle(el).transform),left=await signal.evaluate(el=>getComputedStyle(el).left);await page.waitForTimeout(250);assert.notEqual(await console3d.evaluate(el=>getComputedStyle(el).transform),before);assert.notEqual(await signal.evaluate(el=>getComputedStyle(el).left),left);await frame.locator('.m4-motion').click();assert.equal(await console3d.evaluate(el=>getComputedStyle(el).animationPlayState),'paused');await frame.locator('.m4-motion').click();if(process.env.M4_SCREENSHOTS)await page.screenshot({path:'.tmp-module4-hook.png'});}
    if(slide.kind==='theory'){
     if(index===1&&lesson===1){assert.equal(await frame.locator('.ml-theory-step').first().getAttribute('aria-hidden'),'true');await frame.locator('.ml-theory-step[aria-hidden="false"]').first().waitFor();assert.equal(await frame.locator('.ml-theory-step').last().getAttribute('aria-hidden'),'true');}
     const all=frame.getByRole('button',{name:'Hammasi',exact:true});if(await all.isEnabled())await all.click();await frame.locator('.ml-theory-flip').click();assert.equal(await frame.locator('.ml-theory-flip').getAttribute('aria-pressed'),'true');
     if(index===1&&lesson===1){if(process.env.M4_SCREENSHOTS)await page.screenshot({path:'.tmp-module4-theory.png'});await page.emulateMedia({reducedMotion:'reduce'});}
    }else if(slide.kind==='evidence'){for(const card of await frame.locator('.m4-evidence-card').all())await card.click();}
    else if(slide.documents){for(let i=0;i<slide.documents.length;i++)await frame.getByRole('button',{name:/Hujjatni/}).click();}
    else if(slide.kind==='reveal'){for(const card of await frame.locator('.ml-card.reveal').all())await card.click();}
    else if(slide.kind==='vocab'){for(const card of await frame.locator('.ml-vocab-card').all())await card.click();}
    else if(slide.questions){
     const answerAll=async(wrong=false)=>{for(const [qi,q] of slide.questions.entries()){
      if(q.kind==='type'){await frame.getByLabel('Javobingiz',{exact:true}).fill(wrong?`not ${q.answerText}`:q.answerText);await frame.locator('.m4-written button').click();if(!wrong)await frame.locator('.ml-feedback.good').waitFor();}
      else {if(!slide.final&&lesson===1&&qi===0){await frame.locator('.ml-option span').getByText(q.options[(q.answer+1)%3],{exact:true}).click();await frame.locator('.ml-feedback.bad').waitFor();assert.ok((await frame.locator('.ml-feedback.bad').innerText()).includes(q.hints[(q.answer+1)%3]));}await frame.locator('.ml-option span').getByText(q.options[wrong?(q.answer+1)%3:q.answer],{exact:true}).click();}
      await frame.locator('.ml-slide > .ml-button.primary').click();
     }};
     if(slide.final&&lesson===8){await answerAll(true);assert.equal(await next.isDisabled(),true);assert.equal(await frame.locator('.ml-result .ml-ring strong').innerText(),'0/12');await frame.getByRole('button',{name:/Testni qayta ishlash/}).click();}
     await answerAll();
     if(slide.final&&lesson===8&&process.env.M4_SCREENSHOTS)await page.screenshot({path:'.tmp-module4-result.png'});
    }else if(slide.builds){for(const build of slide.builds){let remaining=build.answer.toLowerCase();const parts=[...build.parts];while(parts.length){const at=parts.findIndex(part=>remaining.startsWith(part.toLowerCase()));assert.ok(at>=0,build.answer);const [part]=parts.splice(at,1);await frame.locator('.ml-token-wrap').nth(1).getByRole('button',{name:part,exact:true}).filter({visible:true}).first().click();remaining=remaining.slice(part.length).trimStart();}await frame.getByRole('button',{name:/Tekshirish/}).click();await frame.getByRole('button',{name:/Keyingi gap/}).click();}}
    else if(slide.fields){if(lesson===8)await page.setViewportSize({width:390,height:844});for(const field of slide.fields)await frame.getByLabel(field.label,{exact:true}).fill(field.answer);await frame.getByRole('button',{name:/Tekshirish/}).click();await frame.locator('.m4-details .ml-feedback.good').waitFor();if(lesson===8){const width=await frame.locator('.ml-root').evaluate(el=>el.scrollWidth-el.clientWidth);assert.ok(width<=1);const bounds=await next.boundingBox();assert.ok(bounds&&bounds.y+bounds.height<=844);if(process.env.M4_SCREENSHOTS)await page.screenshot({path:'.tmp-module4-mobile.png'});await page.setViewportSize({width:1536,height:720});}}
    await next.click({timeout:8000});
   }
   await page.waitForFunction(()=>(window as any).lessonMessages.some((m:any)=>m.type==='finished'));
   const messages=await page.evaluate(()=>(window as any).lessonMessages),finished=messages.filter((m:any)=>m.type==='finished');
   assert.equal(finished.length,1);assert.equal(finished[0].payload.passed,true);assert.equal(finished[0].payload.scorePercent,100);assert.equal(finished[0].payload.totalQuestions,lesson===8?12:6);
   assert.ok(finished[0].payload.answers.some((s:any)=>s.answers?.some((q:any)=>q.kind==='type')));
   if(lesson===1)assert.ok(finished[0].payload.firstTryStats.firstTryCorrect<finished[0].payload.firstTryStats.total);
   assert.deepEqual(errors,[]);assert.ok(!messages.some((m:any)=>m.type==='error'));await page.close();console.log(`${code}: full flow, mixed assessment, payload${lesson===8?', failed final retry and mobile':''} passed`);
  }
 }finally{await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
