import assert from "node:assert/strict";
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { chromium } from "playwright-core";

import { validateAndCompileLesson } from "../src/lib/lessons/compile";
import { lessonFrameDocument } from "../src/lib/lessons/frame";

async function main() {
  const browserPath = [process.env.CHROME_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find((path) => path && existsSync(path));
  if (!browserPath) throw new Error("Chrome yoki Edge topilmadi");
  const files: Record<string, [string, string]> = {
    "/lesson-runtime.js": ["public/lesson-runtime.js", "text/javascript"],
    "/fonts/Geist-Variable.woff2": ["public/fonts/Geist-Variable.woff2", "font/woff2"],
    "/fonts/GeistMono-Variable.woff2": ["public/fonts/GeistMono-Variable.woff2", "font/woff2"],
  };
  const server = createServer((request, response) => {
    const item = files[request.url || ""];
    if (item) { response.writeHead(200, { "content-type": item[1], "access-control-allow-origin": "*" }); response.end(readFileSync(item[0])); }
    else { response.writeHead(200, { "content-type": "text/html" }); response.end("<!doctype html><title>Practice smoke</title>"); }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  let address = server.address();
  if (address && typeof address !== "string" && address.port === 10080) {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    address = server.address();
  }
  assert.ok(address && typeof address !== "string");
  const origin = `http://127.0.0.1:${address.port}`;
  const browser = await chromium.launch({ executablePath: browserPath, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(origin);
    for (let seq = 1; seq <= 10; seq++) {
      const name = `M1L01.p${String(seq).padStart(2, "0")}.jsx`;
      const source = readFileSync(`jsx-lessons/practice/M1L01/${name}`, "utf8");
      const result = validateAndCompileLesson(name, source);
      if (!result.ok) throw new Error(result.error);
      await page.evaluate(({ html, compiledJs }) => {
        document.querySelector("iframe")?.remove();
        const nonce = crypto.randomUUID();
        const messages: { type: string; payload: unknown }[] = [];
        Object.assign(window, { practiceNonce: nonce, practiceMessages: messages });
        const frame = document.createElement("iframe");
        frame.setAttribute("sandbox", "allow-scripts");
        frame.style.cssText = "width:100vw;height:100dvh;border:0;position:fixed;inset:0";
        frame.srcdoc = html;
        window.addEventListener("message", (event) => { if (event.source === frame.contentWindow && event.data?.nonce === nonce) messages.push(event.data); });
        frame.addEventListener("load", () => frame.contentWindow?.postMessage({ type: "init", nonce, compiledJs, kind: "practice", props: { lang: "uz", fullScreen: true } }, "*"), { once: true });
        document.body.append(frame);
      }, { html: lessonFrameDocument(origin), compiledJs: result.compiledJs });
      await page.waitForFunction(() => (window as unknown as { practiceMessages: { type: string }[] }).practiceMessages.some((message) => message.type === "mounted" || message.type === "error"));
      const frame = page.frameLocator("iframe");
      await frame.locator(".pt-shell").waitFor();
      if (seq === 2 || seq === 8) {
        await page.setViewportSize({ width: 390, height: 844 });
        await frame.getByRole("button", { name: "Keyingi →" }).waitFor();
        await page.waitForTimeout(650);
        const size = await frame.locator(".pt").evaluate((element) => ({ content: document.documentElement.scrollHeight, viewport: window.innerHeight, root: element.getBoundingClientRect().height, shell: element.querySelector(".pt-shell")?.getBoundingClientRect().height, shellScroll: element.querySelector(".pt-shell")?.scrollHeight }));
        assert.ok(size.content <= size.viewport, `${name}: mobil ekran balandligidan chiqdi ${JSON.stringify(size)}`);
        await page.setViewportSize({ width: 1280, height: 800 });
      }
      if (seq === 1) {
        await frame.locator(".pt-grid button").nth(1).click();
        await page.waitForFunction(() => (window as unknown as { practiceMessages: { type: string; payload: unknown }[] }).practiceMessages.some((message) => message.type === "ready" && message.payload === true));
        await page.evaluate(() => { const state = window as unknown as { practiceNonce: string }; document.querySelector("iframe")?.contentWindow?.postMessage({ type: "check", nonce: state.practiceNonce }, "*"); });
        await page.waitForFunction(() => (window as unknown as { practiceMessages: { type: string; payload: { correct?: boolean } }[] }).practiceMessages.some((message) => message.type === "submit" && message.payload?.correct === false));
        await frame.locator(".pt-help.bad").waitFor();
        await frame.getByRole("button", { name: /Dispatcher/ }).click();
      }
      if (seq === 2) {
        const answers = ["goods carried by a truck", "the place or time goods are collected", "bringing goods to their destination", "a person who operates a truck", "the location of a place", "how heavy something is"];
        for (let index = 0; index < answers.length; index++) await frame.locator(".pt-pair select").nth(index).selectOption(answers[index]);
      }
      if (seq === 3) await frame.locator(".pt-grid button").nth(2).click();
      if (seq === 4 || seq === 7) await frame.locator(".pt-grid button").nth(0).click();
      if (seq === 5 || seq === 6) for (const index of (seq === 5 ? [1, 3, 0, 4, 2] : [1, 3, 0, 2, 4])) await frame.locator(".pt-row button").nth(index).click();
      if (seq === 8) for (let index = 0; index < 8; index++) {
        const item = await frame.locator(".pt-pair").nth(index).locator("span").innerText();
        await frame.locator(".pt-pair select").nth(index).selectOption(item.includes("?") ? "Savol" : "Darak");
      }
      if (seq === 9) { await frame.locator(".pt-input").nth(0).fill("28,000"); await frame.locator(".pt-input").nth(1).fill("417"); }
      if (seq === 10) {
        for (let step = 0; step < 2; step++) {
          await frame.locator(".pt-grid button").nth(0).click();
          await page.waitForFunction(() => (window as unknown as { practiceMessages: { type: string; payload: unknown }[] }).practiceMessages.some((message) => message.type === "ready" && message.payload === true));
          await page.evaluate(() => { const state = window as unknown as { practiceNonce: string }; document.querySelector("iframe")?.contentWindow?.postMessage({ type: "check", nonce: state.practiceNonce }, "*"); });
          await frame.getByText(step === 0 ? "Broker: It is 28,000 pounds. Pickup joyini so'rang." : "Broker: Pickup is at 417 Harbor Road. Narxni so'rang.").waitFor();
        }
        await frame.locator(".pt-grid button").nth(0).click();
      }
      await page.waitForFunction(() => (window as unknown as { practiceMessages: { type: string; payload: unknown }[] }).practiceMessages.some((message) => message.type === "ready" && message.payload === true));
      await page.evaluate(() => { const state = window as unknown as { practiceNonce: string }; document.querySelector("iframe")?.contentWindow?.postMessage({ type: "check", nonce: state.practiceNonce }, "*"); });
      await page.waitForFunction(() => (window as unknown as { practiceMessages: { type: string; payload: { correct?: boolean } }[] }).practiceMessages.some((message) => message.type === "error" || (message.type === "submit" && message.payload?.correct === true)));
      const messages = await page.evaluate(() => (window as unknown as { practiceMessages: { type: string; payload: { correct?: boolean } | string }[] }).practiceMessages);
      assert.ok(!messages.some((message) => message.type === "error"), `${name}: ${JSON.stringify(messages)}`);
      assert.ok(messages.some((message) => message.type === "submit" && typeof message.payload === "object" && message.payload.correct === true), `${name}: ${JSON.stringify(messages)}`);
      console.log(`${name}: iframe mounted, Check → correct`);
    }
    const previewName = "M1L01.p08.jsx";
    const previewResult = validateAndCompileLesson(previewName, readFileSync(`jsx-lessons/practice/M1L01/${previewName}`, "utf8"));
    if (!previewResult.ok) throw new Error(previewResult.error);
    await page.evaluate(({ html, compiledJs }) => {
      document.querySelector("iframe")?.remove();
      const nonce = crypto.randomUUID();
      const heights: number[] = [];
      Object.assign(window, { previewHeights: heights });
      const frame = document.createElement("iframe");
      frame.setAttribute("sandbox", "allow-scripts");
      frame.style.cssText = "display:block;width:560px;height:520px;border:0";
      frame.srcdoc = html;
      window.addEventListener("message", (event) => {
        if (event.source !== frame.contentWindow || event.data?.nonce !== nonce || event.data.type !== "height") return;
        const height = Math.max(280, Math.min(3200, Number(event.data.payload)));
        heights.push(height);
        frame.style.height = `${height}px`;
      });
      frame.addEventListener("load", () => frame.contentWindow?.postMessage({ type: "init", nonce, compiledJs, kind: "practice", props: { lang: "uz", fullScreen: false } }, "*"), { once: true });
      document.body.append(frame);
    }, { html: lessonFrameDocument(origin), compiledJs: previewResult.compiledJs });
    await page.frameLocator("iframe").locator(".pt-pair select").first().waitFor();
    await page.waitForTimeout(1800);
    const preview = await page.evaluate(() => {
      const frame = document.querySelector("iframe")!;
      const heights = (window as unknown as { previewHeights: number[] }).previewHeights;
      return { height: frame.getBoundingClientRect().height, heights: heights.slice(-8) };
    });
    const labelWidth = await page.frameLocator("iframe").locator(".pt-pair span").first().evaluate((element) => element.getBoundingClientRect().width);
    assert.ok(preview.height < 1000, `p08 Preview balandligi oshib ketdi: ${JSON.stringify(preview)}`);
    const settledHeights = preview.heights.slice(-3);
    assert.ok(settledHeights.length >= 2 && Math.max(...settledHeights) - Math.min(...settledHeights) < 5, `p08 Preview balandligi o'zgaryapti: ${JSON.stringify(preview)}`);
    assert.ok(labelWidth >= 180, `p08 matn katagi tor: ${labelWidth}px`);
    console.log(`M1L01.p08.jsx: admin Preview ${Math.round(preview.height)}px, matn katagi ${Math.round(labelWidth)}px`);
    assert.deepEqual(errors, []);
  } finally { await browser.close(); await new Promise<void>((resolve) => server.close(() => resolve())); }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
