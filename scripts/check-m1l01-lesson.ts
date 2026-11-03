import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { chromium } from "playwright-core";

import { validateAndCompileLesson } from "../src/lib/lessons/compile";
import { lessonFrameDocument } from "../src/lib/lessons/frame";

async function main() {
  const source = readFileSync("jsx-lessons/module-01/M1L01.learn.jsx", "utf8");
  const result = validateAndCompileLesson("M1L01.learn.jsx", source);
  if (!result.ok) throw new Error(result.error);

  const files: Record<string, [string, string]> = {
    "/lesson-runtime.js": ["public/lesson-runtime.js", "text/javascript"],
    "/fonts/Geist-Variable.woff2": ["public/fonts/Geist-Variable.woff2", "font/woff2"],
    "/fonts/GeistMono-Variable.woff2": ["public/fonts/GeistMono-Variable.woff2", "font/woff2"],
  };
  const server = createServer((request, response) => {
    const file = files[request.url || ""];
    if (file) { response.writeHead(200, { "content-type": file[1], "access-control-allow-origin": "*" }); response.end(readFileSync(file[0])); }
    else { response.writeHead(200, { "content-type": "text/html" }); response.end("<!doctype html><title>Lesson smoke</title>"); }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const origin = `http://127.0.0.1:${address.port}`;
  const executablePath = [process.env.CHROME_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find((path) => path && existsSync(path));
  if (!executablePath) throw new Error("Chrome/Edge topilmadi");
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on("pageerror", (error) => console.error("Browser error:", error.message));
    page.on("console", (message) => { if (message.type() === "error") console.error("Browser console:", message.text()); });
    await page.goto(origin);
    await page.evaluate(({ html, compiledJs }) => {
      const nonce = crypto.randomUUID();
      const messages: { type: string; payload: unknown }[] = [];
      Object.assign(window, { lessonMessages: messages });
      const frame = document.createElement("iframe");
      frame.setAttribute("sandbox", "allow-scripts");
      frame.style.cssText = "width:100vw;height:100dvh;border:0;position:fixed;inset:0";
      frame.srcdoc = html;
      window.addEventListener("message", (event) => {
        if (event.source === frame.contentWindow && event.data?.nonce === nonce) messages.push(event.data);
      });
      frame.addEventListener("load", () => frame.contentWindow?.postMessage({ type: "init", nonce, compiledJs, kind: "learn", props: { lang: "uz" } }, "*"), { once: true });
      document.body.append(frame);
    }, { html: lessonFrameDocument(origin), compiledJs: result.compiledJs });
    await page.waitForFunction(() => (window as unknown as { lessonMessages: { type: string }[] }).lessonMessages.some((message) => message.type === "mounted" || message.type === "error"), { timeout: 15_000 });
    const messages = await page.evaluate(() => (window as unknown as { lessonMessages: { type: string; payload: unknown }[] }).lessonMessages);
    assert.ok(messages.some((message) => message.type === "mounted"), JSON.stringify(messages));
    const frame = page.frameLocator("iframe");
    assert.match((await frame.locator(".m1-eyebrow").textContent()) || "", /1\/19/);
    const theoryTitles = ["Gap qanday quriladi?", "be: am, is, are", "have va need", "Yes/No savollar", "Wh-savollar"];
    for (const [index, title] of theoryTitles.entries()) {
      await frame.getByRole("heading", { name: title }).waitFor();
      assert.equal(await frame.locator(".m1-theory-flow").count(), 1, `Qoida ${index + 1}: 2D sxema yo‘q`);
      assert.equal(await frame.locator(".m1-theory-flip").count(), 1, `Qoida ${index + 1}: 3D karta yo‘q`);
      assert.equal(await frame.locator(".m1-foot .m1-btn.p").isDisabled(), true);
      if (index === 0) {
        assert.equal(await frame.locator(".m1-theory-step").first().isVisible(), false, "So‘z sxemasi qoidadan oldin ko‘rindi");
        await frame.locator(".m1-theory-step").first().waitFor({ state: "visible" });
        assert.equal(await frame.locator(".m1-theory-step").last().isVisible(), false, "Sxema bo‘laklari bir vaqtda ko‘rindi");
        await frame.locator(".m1-theory-flip").waitFor({ state: "visible" });
      } else await frame.locator(".m1-theory-controls button").last().click();
      await frame.locator(".m1-theory-flip").click();
      assert.equal(await frame.locator(".m1-foot .m1-btn.p").isEnabled(), true);
      await page.setViewportSize({ width: 390, height: 844 });
      const mobileTheory = await frame.locator(".m1-body").evaluate((element) => ({ scroll: element.scrollHeight, client: element.clientHeight }));
      assert.ok(mobileTheory.scroll <= mobileTheory.client + 1, `Qoida ${index + 1} mobil ekranga sig‘madi: ${mobileTheory.scroll}/${mobileTheory.client}`);
      if (index === 0 && process.env.M1L01_THEORY_SCREENSHOT) await frame.locator(".m1-root").screenshot({ path: process.env.M1L01_THEORY_SCREENSHOT });
      await page.setViewportSize({ width: 320, height: 568 });
      const compactTheory = await frame.locator(".m1-body").evaluate((element) => ({ scroll: element.scrollHeight, client: element.clientHeight }));
      assert.ok(compactTheory.scroll <= compactTheory.client + 1, `Qoida ${index + 1} kichik ekranga sig‘madi: ${compactTheory.scroll}/${compactTheory.client}`);
      await page.setViewportSize({ width: 1440, height: 900 });
      await frame.locator(".m1-foot .m1-btn.p").click();
      await frame.locator(".m1-eyebrow").filter({ hasText: new RegExp(`${index + 2}/19`) }).waitFor();
      assert.match((await frame.locator(".m1-eyebrow").textContent()) || "", new RegExp(`${index + 2}\\/19`), `Qoida ${index + 1} dan keyin o‘tilmadi`);
    }
    await frame.locator(".m1-route-canvas").waitFor();
    let drawn = false;
    for (let attempt = 0; attempt < 40 && !drawn; attempt += 1) {
      drawn = Boolean(await frame.locator(".m1-route-canvas").evaluate((element) => {
        const canvas = element as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        return context?.getImageData(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1).data[3];
      }));
      if (!drawn) await page.waitForTimeout(200);
    }
    if (!drawn) {
      console.error("Canvas:", await frame.locator(".m1-route-canvas").evaluate((element) => {
        const canvas = element as HTMLCanvasElement;
        return { width: canvas.width, height: canvas.height, clientWidth: canvas.clientWidth, clientHeight: canvas.clientHeight, rect: canvas.getBoundingClientRect().toJSON(), context: !!canvas.getContext("2d") };
      }));
      await frame.locator(".m1-root").screenshot({ path: "m1l01-debug.png" });
    }
    assert.ok(drawn, "Rive canvas bo‘sh");
    const firstFrame = await frame.locator(".m1-route-canvas").evaluate((element) => (element as HTMLCanvasElement).toDataURL());
    await page.waitForTimeout(300);
    const nextFrame = await frame.locator(".m1-route-canvas").evaluate((element) => (element as HTMLCanvasElement).toDataURL());
    assert.notEqual(nextFrame, firstFrame, "Rive timeline harakatlanmadi");
    assert.equal(await frame.locator(".m1-truck-stage").count(), 1);
    await frame.locator(".m1-list .m1-opt").nth(1).click();
    assert.ok((await frame.locator(".m1-fb.bad").textContent())?.length);
    await frame.locator(".m1-list .m1-opt").nth(0).click();
    assert.ok((await frame.locator(".m1-fb.good").textContent())?.length);
    if (process.env.M1L01_SCREENSHOT) await frame.locator(".m1-root").screenshot({ path: process.env.M1L01_SCREENSHOT });
    await page.setViewportSize({ width: 390, height: 844 });
    const mobile = await frame.locator(".m1-body").evaluate((element) => ({ scroll: element.scrollHeight, client: element.clientHeight }));
    assert.ok(mobile.scroll <= mobile.client + 1, `Mobil dars kontenti sig‘madi: ${mobile.scroll}/${mobile.client}`);
    if (process.env.M1L01_MOBILE_SCREENSHOT) await frame.locator(".m1-root").screenshot({ path: process.env.M1L01_MOBILE_SCREENSHOT });
    await page.setViewportSize({ width: 320, height: 568 });
    const compact = await frame.locator(".m1-body").evaluate((element) => ({ scroll: element.scrollHeight, client: element.clientHeight }));
    assert.ok(compact.scroll <= compact.client + 1, `Kichik ekranda kontent sig‘madi: ${compact.scroll}/${compact.client}`);
    await frame.locator(".m1-foot .m1-btn.p").click();
    assert.equal(await frame.locator(".m1-chat .m1-bubble").count(), 8);
    const chat = await frame.locator(".m1-body").evaluate((element) => ({ scroll: element.scrollHeight, client: element.clientHeight }));
    assert.ok(chat.scroll <= chat.client + 1, `Chat slaydi kichik ekranga sig‘madi: ${chat.scroll}/${chat.client}`);
    await page.setViewportSize({ width: 390, height: 844 });
    const next = frame.locator(".m1-foot .m1-btn.p");
    await next.click();
    assert.match((await frame.locator(".m1-slide h1").textContent()) || "", /Uch xil gap/, "Read dan keyingi slayd ochilmadi");
    for (const [sentence, type] of [
      ["I have a load from Dallas to Atlanta.", "Darak gap"],
      ["Where is the shipper?", "Wh-savol"],
      ["Do you have a load for me?", "Yes/No savol"],
    ]) {
      await frame.locator(".m1-pair").getByRole("button", { name: sentence, exact: true }).click();
      await frame.locator(".m1-pair").getByRole("button", { name: type, exact: true }).click();
    }
    await next.click();
    await frame.locator(".m1-svo-stage").locator("button").first().click();
    await next.click();
    async function runQuiz(answers: string[]) {
      for (const answer of answers) {
        await frame.locator(".m1-slide .m1-opt").filter({ hasText: answer }).first().click();
        await frame.locator(".m1-slide .m1-btn.p").click();
      }
      await next.click();
    }
    await runQuiz(["have", "is"]);
    for (const count of [5, 3, 8]) {
      const cards = frame.locator(".m1-slide .m1-flip");
      assert.equal(await cards.count(), count);
      for (let index = 0; index < count; index += 1) await cards.nth(index).click();
      await next.click();
    }
    await runQuiz(["The dispatcher calls the driver.", "Where", "is"]);
    for (const answer of ["The broker sends the rate", "Who is the dispatcher ?", "What do you need ?"]) {
      for (const word of answer.split(" ")) await frame.locator(".m1-slide .m1-chips").getByRole("button", { name: word, exact: true }).click();
      await frame.locator(".m1-slide .m1-btn.p").click();
    }
    await next.click();
    await runQuiz(["Where do you need to go?", "The load is heavy.", "The broker sends the rate."]);
    await runQuiz(["Yes, I have a truck.", "Where is the shipper?", "How much is the rate?"]);
    await runQuiz(["We need a new truck.", "Where is the driver now?", "is", "What is the weight?"]);
    assert.match((await frame.locator(".m1-eyebrow").textContent()) || "", /19\/19/);
    await frame.locator(".m1-foot .m1-btn.p").click();
    const completed = await page.evaluate(() => (window as unknown as { lessonMessages: { type: string; payload: unknown }[] }).lessonMessages.filter((message) => message.type === "finished"));
    assert.equal(completed.length, 1);
    console.log("M1L01: 5 animatsiyali qoida, Rive timeline, harakatlanuvchi truck, 19 slayd, javoblar va yakun payload ishladi.");
  } finally { await browser.close(); await new Promise<void>((resolve) => server.close(() => resolve())); }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
