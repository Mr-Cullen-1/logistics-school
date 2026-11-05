import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { validateAndCompileLesson } from '../src/lib/lessons/compile';
import { lessonFrameDocument } from '../src/lib/lessons/frame';

// Focused layout audit: direct navigation exists only in the compiled test copy.
async function main() {
  const assets:Record<string,[string,string]>={
    '/lesson-runtime.js':['public/lesson-runtime.js','text/javascript'],
    '/fonts/Geist-Variable.woff2':['public/fonts/Geist-Variable.woff2','font/woff2'],
    '/fonts/GeistMono-Variable.woff2':['public/fonts/GeistMono-Variable.woff2','font/woff2'],
  };
  const server=createServer((req,res)=>{const asset=assets[req.url||''];res.writeHead(200,{'content-type':asset?.[1]||'text/html','access-control-allow-origin':'*'});res.end(asset?readFileSync(asset[0]):'<!doctype html><title>Module 2 layout</title>');});
  await new Promise<void>(resolve=>server.listen(43219,'127.0.0.1',resolve));
  const address=server.address();assert.ok(address&&typeof address!=='string');const origin=`http://127.0.0.1:${address.port}`;
  const executablePath=['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
  const browser=await chromium.launch({executablePath,headless:true});
  const page=await browser.newPage({reducedMotion:'reduce'});
  const failures:string[]=[];const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  try {
    await page.goto(origin);
    for(let lesson=1;lesson<=8;lesson++) {
      const code=`M2L0${lesson}`;
      if(process.env.M2_LAYOUT_LESSON&&!process.env.M2_LAYOUT_LESSON.split(',').includes(code))continue;
      const source=readFileSync(`jsx-lessons/module-02/${code}.learn.jsx`,'utf8');
      const original=validateAndCompileLesson(`${code}.learn.jsx`,source);assert.ok(original.ok);
      const data=JSON.parse(source.match(/const DATA = (.+);/)![1]);
      const hook='const [current, setCurrent] = useState(0);';assert.ok(source.includes(hook));
      const test=validateAndCompileLesson(`${code}.learn.jsx`,source.replace(hook,hook+`\nuseEffect(() => { const go = event => { if(event.data?.type === 'layout-slide') setCurrent(event.data.index); }; window.addEventListener('message',go); return () => window.removeEventListener('message',go); }, []);`));assert.ok(test.ok);
      await page.evaluate(({html,compiledJs})=>{
        document.querySelector('iframe')?.remove();
        const iframe=document.createElement('iframe');iframe.setAttribute('sandbox','allow-scripts');iframe.style.cssText='position:fixed;inset:0;width:100vw;height:100dvh;border:0';iframe.srcdoc=html;
        iframe.onload=()=>iframe.contentWindow?.postMessage({type:'init',nonce:crypto.randomUUID(),compiledJs,kind:'learn',props:{lang:'uz'}},'*');document.body.append(iframe);
      },{html:lessonFrameDocument(origin),compiledJs:test.compiledJs});
      const frame=page.frameLocator('iframe');await frame.locator('.ml-root').waitFor();
      for(const viewport of [{width:1536,height:650},{width:1280,height:620},{width:1920,height:810}]) {
        await page.setViewportSize(viewport);
        for(const [index,slide] of data.slides.entries() as IterableIterator<[number,any]>) {
          if(process.env.M2_LAYOUT_SLIDES&&!process.env.M2_LAYOUT_SLIDES.split(',').includes(String(index+1)))continue;
          await page.evaluate(index=>document.querySelector('iframe')!.contentWindow!.postMessage({type:'layout-slide',index},'*'),index);
          await frame.locator('.ml-eyebrow').filter({hasText:`${index+1}/20`}).waitFor();
          assert.equal(await frame.locator('.ml-slide > div:first-child > .ml-kick').count(),0);
          const check=async(state:string)=>{
            const metrics=await frame.locator('.ml-body').evaluate(async el=>{
              await document.fonts.ready;await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
              const footer=document.querySelector('.ml-foot')!.getBoundingClientRect();
              return {overflow:el.scrollHeight-el.clientHeight,horizontal:el.scrollWidth-el.clientWidth,footer:footer.bottom,viewport:innerHeight};
            });
            if(metrics.overflow>2||metrics.horizontal>2||metrics.footer>metrics.viewport+1)failures.push(`${code} ${index+1} ${slide.kind} ${viewport.width}x${viewport.height} ${state}: ${JSON.stringify(metrics)}`);
          };
          await check('initial');
          if(slide.kind==='theory') {await frame.locator('.ml-theory-flip').click();await check('flipped');}
          if(slide.questions) {await frame.locator('.ml-option span').getByText(slide.questions[0].options[slide.questions[0].answer],{exact:true}).click();await check('feedback');}
          if(slide.fields) {for(const field of slide.fields)await frame.getByLabel(field.label,{exact:true}).fill(field.answer);await frame.getByRole('button',{name:/Tekshirish/}).click();await check('completed');}
          if(code==='M2L02'&&index===5&&viewport.width===1536&&process.env.M2_LAYOUT_SCREENSHOT)await page.screenshot({path:'.tmp-module2-layout.png'});
        }
      }
      console.log(`${code}: ${process.env.M2_LAYOUT_SLIDES||'all 20 slides'} inspected at 3 desktop iframe sizes`);
    }
    assert.deepEqual(errors,[]);
    assert.deepEqual(failures,[],'Scroll/layout issues');
    console.log('No duplicated title labels or desktop scroll; footer remains visible.');
  } finally {await browser.close();await new Promise<void>(resolve=>server.close(()=>resolve()));}
}
main().catch(error=>{console.error(error);process.exitCode=1});
