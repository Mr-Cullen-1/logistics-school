import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { chromium } from "playwright-core";
import { validateAndCompileLesson } from "../src/lib/lessons/compile";
import { lessonFrameDocument } from "../src/lib/lessons/frame";

type Slide = { kind: string; heading: string; questions?: { options: string[]; answer: number }[]; builds?: { answer: string; parts: string[] }[]; documents?: unknown[]; fields?: { label: string; answer: string }[] };
type Message = { type: string; payload?: { scorePercent: number; passed: boolean; totalQuestions: number } };
async function main() {
  const files: Record<string, [string, string]> = {
    "/lesson-runtime.js": ["public/lesson-runtime.js", "text/javascript"],
    "/fonts/Geist-Variable.woff2": ["public/fonts/Geist-Variable.woff2", "font/woff2"],
    "/fonts/GeistMono-Variable.woff2": ["public/fonts/GeistMono-Variable.woff2", "font/woff2"],
  };
  const server = createServer((request, response) => {
    const file = files[request.url || ""];
    response.writeHead(200, { "content-type": file?.[1] || "text/html", "access-control-allow-origin": "*" });
    response.end(file ? readFileSync(file[0]) : "<!doctype html><title>Module 3 smoke</title>");
  });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const origin = `http://127.0.0.1:${address.port}`;
  const executablePath = [process.env.CHROME_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(path => path && existsSync(path));
  assert.ok(executablePath, "Chrome/Edge required");
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    for (let lesson = 1; lesson <= 8; lesson++) {
      const code = `M3L0${lesson}`;
      if (process.env.M3_LESSON && !process.env.M3_LESSON.split(",").includes(code)) continue;
      const source = readFileSync(`jsx-lessons/module-03/${code}.learn.jsx`, "utf8");
      const compiled = validateAndCompileLesson(`${code}.learn.jsx`, source);
      assert.ok(compiled.ok, compiled.ok ? "" : compiled.error);
      const data = JSON.parse(source.match(/const DATA = (.+);/)![1]) as { theoryCount: number; slides: Slide[] };
      assert.equal(data.slides.length, 15 + data.theoryCount);
      assert.equal(data.slides[0].kind, "hook");
      assert.ok(data.slides.slice(1, 1 + data.theoryCount).every(slide => slide.kind === "theory"));
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(origin);
      await page.evaluate(({ html, compiledJs }) => {
        const nonce = crypto.randomUUID();
        Object.assign(window, { lessonMessages: [] });
        const frame = document.createElement("iframe");
        frame.setAttribute("sandbox", "allow-scripts");
        frame.style.cssText = "width:100vw;height:100dvh;border:0;position:fixed;inset:0";
        frame.srcdoc = html;
        window.addEventListener("message", event => {
          if (event.source === frame.contentWindow && event.data?.nonce === nonce) (window as unknown as { lessonMessages: Message[] }).lessonMessages.push(event.data);
        });
        frame.addEventListener("load", () => frame.contentWindow?.postMessage({ type: "init", nonce, compiledJs, kind: "learn", props: { lang: "uz" } }, "*"), { once: true });
        document.body.append(frame);
      }, { html: lessonFrameDocument(origin), compiledJs: compiled.compiledJs });
      const frame = page.frameLocator("iframe");
      await frame.locator(".ml-root").waitFor();
      const footerNext = frame.locator(".ml-foot .primary").last();
      for (const [index, slide] of data.slides.entries()) {
        await frame.locator(".ml-eyebrow").filter({ hasText: `${index + 1}/${data.slides.length}` }).waitFor();
        if (lesson === 1 && index === 0) {
          const device = frame.locator(".m3-dossier");
          const first = await device.evaluate(el => getComputedStyle(el).transform);
          const packet = frame.locator(".m3-track i").first();
          const packetFirst = await packet.evaluate(el => getComputedStyle(el).left);
          await page.waitForTimeout(350);
          assert.notEqual(await device.evaluate(el => getComputedStyle(el).transform), first, "3D scene must move");
          assert.notEqual(await packet.evaluate(el => getComputedStyle(el).left), packetFirst, "2D packet must move");
          await frame.locator(".m3-motion").click();
          assert.equal(await device.evaluate(el => getComputedStyle(el).animationPlayState), "paused");
          await frame.locator(".m3-motion").click();
          if (process.env.M3_SCREENSHOTS) await page.screenshot({ path: ".tmp-module3-hook.png" });
        }
        if (slide.kind === "theory") {
          if (lesson === 1 && index === 1) {
            assert.equal(await frame.locator(".ml-theory-step").first().getAttribute("aria-hidden"), "true");
            await frame.locator('.ml-theory-step[aria-hidden="false"]').first().waitFor();
            assert.equal(await frame.locator(".ml-theory-step").last().getAttribute("aria-hidden"), "true");
          }
          await frame.getByRole("button", { name: "Hammasi", exact: true }).click();
          await frame.locator(".ml-theory-flip").click();
          assert.equal(await frame.locator(".ml-theory-flip").getAttribute("aria-pressed"), "true");
          if (lesson === 1 && index === 1 && process.env.M3_SCREENSHOTS) await page.screenshot({ path: ".tmp-module3-theory.png" });
        } else if (slide.documents) {
          for (let documentIndex = 0; documentIndex < slide.documents.length; documentIndex++) await frame.getByRole("button", { name: /Hujjatni/ }).click();
          if (lesson === 1 && process.env.M3_SCREENSHOTS) await page.screenshot({ path: ".tmp-module3-document.png" });
        } else if (slide.kind === "reveal") {
          for (const card of await frame.locator(".ml-card.reveal").all()) await card.click();
        } else if (slide.kind === "vocab") {
          for (const card of await frame.locator(".ml-vocab-card").all()) await card.click();
        } else if (slide.questions) {
          const answerQuestions = async (wrong = false) => {
            for (const question of slide.questions!) {
              const answer = question.options[wrong ? (question.answer + 1) % 3 : question.answer];
              await frame.locator(".ml-option").filter({ has: frame.locator("span", { hasText: new RegExp(`^${answer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`) }) }).click();
              await frame.locator(".ml-slide > .ml-button.primary").click();
            }
          };
          if (lesson === 8 && index === data.slides.length - 2) {
            await answerQuestions(true);
            assert.equal(await footerNext.isDisabled(), true, "Failed checkpoint must not advance");
            await frame.getByRole("button", { name: /Testni qayta ishlash/ }).click();
          }
          await answerQuestions();
          if (lesson === 8 && index === data.slides.length - 2 && process.env.M3_SCREENSHOTS) await page.screenshot({ path: ".tmp-module3-result.png" });
        } else if (slide.builds) {
          for (const build of slide.builds) {
            let remaining = build.answer.toLowerCase();
            const parts = [...build.parts];
            while (parts.length) {
              const at = parts.findIndex(part => remaining.startsWith(part.toLowerCase()));
              assert.ok(at >= 0, `Cannot assemble ${build.answer}: ${remaining}`);
              const [part] = parts.splice(at, 1);
              await frame.locator(".ml-token-wrap").nth(1).getByRole("button", { name: part, exact: true }).filter({ visible: true }).first().click();
              remaining = remaining.slice(part.length).trimStart();
            }
            await frame.getByRole("button", { name: /Tekshirish/ }).click();
            await frame.getByRole("button", { name: /Keyingi gap/ }).click();
          }
        } else if (slide.fields) {
          if (lesson === 6) await page.setViewportSize({ width: 390, height: 844 });
          for (const field of slide.fields) await frame.getByLabel(field.label, { exact: true }).fill(field.answer);
          await frame.getByRole("button", { name: /Tekshirish/ }).click();
          await frame.locator(".m3-details .ml-feedback.good").waitFor();
          if (lesson === 6) {
            const root = await frame.locator(".ml-root").evaluate(el => ({ width: el.clientWidth, scroll: el.scrollWidth }));
            assert.ok(root.scroll <= root.width + 1, "Mobile horizontal overflow");
            const bounds = await footerNext.boundingBox();
            assert.ok(bounds && bounds.y + bounds.height <= 844, "Mobile footer out of viewport");
            if (process.env.M3_SCREENSHOTS) await page.screenshot({ path: ".tmp-module3-mobile.png" });
            await page.setViewportSize({ width: 1440, height: 900 });
          }
        }
        await footerNext.click({ timeout: 8000 });
      }
      await page.waitForFunction(() => (window as unknown as { lessonMessages: Message[] }).lessonMessages.some(message => message.type === "finished"));
      const messages = await page.evaluate(() => (window as unknown as { lessonMessages: Message[] }).lessonMessages);
      const finished = messages.filter(message => message.type === "finished");
      assert.equal(finished.length, 1);
      assert.equal(finished[0].payload?.scorePercent, 100);
      assert.equal(finished[0].payload?.passed, true);
      assert.equal(finished[0].payload?.totalQuestions, lesson === 8 ? 8 : 4);
      assert.deepEqual(errors, []);
      assert.ok(!messages.some(message => message.type === "error"), JSON.stringify(messages));
      await page.close();
      console.log(`${code}: compiled, ${data.slides.length} slides completed, score payload OK`);
    }
  } finally { await browser.close(); await new Promise<void>(resolve => server.close(() => resolve())); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
