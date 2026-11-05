import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { chromium, type Page } from 'playwright-core';
import { validateAndCompileLesson } from '../src/lib/lessons/compile';
import { lessonFrameDocument } from '../src/lib/lessons/frame';
import { detectPracticeMechanic, publishReadiness, type LessonSlot } from '../src/lib/lessons/rules';

async function main() {
  const examples = new Map<string, { name: string; task: any; compiledJs: string }>();
  for (let lesson = 1; lesson <= 8; lesson++) {
    const code = `M3L0${lesson}`;
    const slots: LessonSlot[] = [{ kind: 'learn', seq: 0, mechanic: null }];
    for (let seq = 1; seq <= 10; seq++) {
      const name = `${code}.p${String(seq).padStart(2, '0')}.jsx`;
      const source = readFileSync(`jsx-lessons/practice/${code}/${name}`, 'utf8');
      const task = JSON.parse(source.match(/const task = ([\s\S]*?);\n\nconst STYLE/)![1]);
      const compiled = validateAndCompileLesson(name, source);
      if (!compiled.ok) throw new Error(`${name}: ${compiled.error}`);
      const mechanic = detectPracticeMechanic(source);
      assert.equal(mechanic, task.kind, name);
      slots.push({ ...compiled.slot, mechanic });
      if (!examples.has(task.kind)) examples.set(task.kind, { name, task, compiledJs: compiled.compiledJs });
      if (lesson === 8 && seq === 9) examples.set('READ-TYPE-final', { name, task, compiledJs: compiled.compiledJs });
    }
    assert.deepEqual(publishReadiness(code, slots), [], code);
  }
  console.log('80/80 files: upload compiler, mechanic detection and 8 lesson readiness checks passed.');
  const files: Record<string, [string, string]> = {
    '/lesson-runtime.js': ['public/lesson-runtime.js', 'text/javascript'],
    '/fonts/Geist-Variable.woff2': ['public/fonts/Geist-Variable.woff2', 'font/woff2'],
    '/fonts/GeistMono-Variable.woff2': ['public/fonts/GeistMono-Variable.woff2', 'font/woff2'],
  };
  const server = createServer((req, res) => {
    const file = files[req.url || ''];
    res.writeHead(200, { 'content-type': file?.[1] || 'text/html', 'access-control-allow-origin': '*' });
    res.end(file ? readFileSync(file[0]) : '<!doctype html><title>Module 3 Practice check</title>');
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const origin = `http://127.0.0.1:${address.port}`;
  const executablePath = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
  assert.ok(executablePath, 'Chrome/Edge required');
  const browser = await chromium.launch({ executablePath, headless: true });
  const errors: string[] = [];
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  page.on('pageerror', error => errors.push(error.message));
  const sendCheck = async (page: Page) => {
    await page.waitForFunction(() => (window as any).practiceReady === true);
    await page.evaluate(() => {
      document.querySelector('iframe')!.contentWindow!.postMessage({ type: 'check', nonce: (window as any).practiceNonce }, '*');
    });
  };
  try {
    await page.goto(origin);
    for (const [key, { name, task, compiledJs }] of examples) {
      const mobile = ['MATCH', 'SORT', 'FORM'].includes(key);
      await page.setViewportSize(mobile ? { width: 390, height: 844 } : { width: 1280, height: 800 });
      await page.evaluate(({ html, compiledJs }) => {
        document.querySelector('iframe')?.remove();
        const nonce = crypto.randomUUID();
        Object.assign(window, { practiceNonce: nonce, practiceMessages: [], practiceReady: false });
        const iframe = document.createElement('iframe');
        iframe.setAttribute('sandbox', 'allow-scripts');
        iframe.style.cssText = 'position:fixed;inset:0;width:100vw;height:100dvh;border:0';
        iframe.srcdoc = html;
        window.onmessage = event => {
          if (event.source !== iframe.contentWindow || event.data?.nonce !== nonce) return;
          (window as any).practiceMessages.push(event.data);
          if (event.data.type === 'ready') (window as any).practiceReady = event.data.payload;
        };
        iframe.onload = () => iframe.contentWindow!.postMessage({ type: 'init', nonce, compiledJs, kind: 'practice', props: { lang: 'uz', fullScreen: true } }, '*');
        document.body.append(iframe);
      }, { html: lessonFrameDocument(origin), compiledJs });
      const frame = page.frameLocator('iframe');
      await frame.locator('.pt-shell').waitFor();
      const metrics = await frame.locator('.pt').evaluate(el => ({ width: document.documentElement.scrollWidth, viewport: innerWidth, background: getComputedStyle(el).backgroundColor, animation: getComputedStyle(el.querySelector('.pt-shell')!).animationName }));
      assert.ok(metrics.width <= metrics.viewport + 1, `${name}: horizontal overflow`);
      assert.equal(metrics.background, 'rgb(20, 18, 28)', name);
      assert.equal(metrics.animation, 'pt-enter', name);
      if (task.options) {
        if (key === 'MC') {
          await frame.locator('.pt-grid button').filter({ hasText: task.options[1].label }).click();
          await sendCheck(page);
          await frame.locator('.pt-help.bad').waitFor();
          assert.ok(await page.evaluate(() => (window as any).practiceMessages.some((message: any) => message.type === 'submit' && message.payload.correct === false)));
        }
        await frame.locator('.pt-grid button').filter({ hasText: task.options[task.answer].label }).click();
      } else if (task.tokens) {
        for (const token of task.expected) await frame.locator('.pt-row').getByRole('button', { name: token, exact: true }).click();
      } else if (task.fields) {
        for (let index = 0; index < task.fields.length; index++) await frame.locator('.pt-input').nth(index).fill(task.fields[index].answers[0]);
        if (key === 'FORM') {
          await frame.locator('.pt-input').first().fill('Wrong company');
          await sendCheck(page);
          await frame.locator('.pt-help.bad').waitFor();
          await frame.locator('.pt-input').first().fill(task.fields[0].answers[0]);
        }
      } else if (task.pairs || task.groups) {
        const values = task.pairs ? new Map(task.pairs.map((pair: any) => [pair.left, pair.right])) : new Map(task.groups.flatMap((group: any) => group.items.map((item: string) => [item, group.label])));
        for (;;) {
          const rows = frame.locator('.pt-pair');
          for (let index = 0; index < await rows.count(); index++) {
            const label = await rows.nth(index).locator('span').innerText();
            await rows.nth(index).locator('select').selectOption(String(values.get(label)));
          }
          const next = frame.getByRole('button', { name: 'Keyingi →', exact: true });
          if (!await next.count() || await next.isDisabled()) break;
          await next.click();
        }
      } else if (task.steps) {
        for (let index = 0; index < task.steps.length; index++) {
          const step = task.steps[index];
          await frame.locator('.pt-question').filter({ hasText: step.prompt }).waitFor();
          await frame.locator('.pt-grid button').filter({ hasText: step.options[step.answer].label }).click();
          if (index < task.steps.length - 1) await sendCheck(page);
        }
      }
      await sendCheck(page);
      await frame.locator('.pt-help.good').waitFor();
      const messages = await page.evaluate(() => (window as any).practiceMessages);
      assert.ok(!messages.some((m: any) => m.type === 'error'), name);
      const result = messages.findLast((m: any) => m.type === 'submit');
      assert.equal(result?.payload.correct, true, name);
      assert.equal(result?.payload.meta.kind, task.kind, name);
      console.log(`${name}: ${key}, correct payload${mobile ? ', mobile' : ''}`);
    }
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
