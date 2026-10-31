import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { chromium } from "playwright-core";

import { validateAndCompileLesson } from "../src/lib/lessons/compile";
import { lessonFrameDocument } from "../src/lib/lessons/frame";

async function main() {
  const source = readFileSync("jsx-lessons/intro/INTRO.learn.jsx", "utf8");
  const result = validateAndCompileLesson("INTRO.learn.jsx", source);
  if (!result.ok) throw new Error(result.error);
  assert.ok(result.sizeBytes <= 60_000, "Intro standalone fayli 60 KB dan kichik bo'lishi kerak");

  const executablePath = [process.env.CHROME_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find((path) => path && existsSync(path));
  if (!executablePath) throw new Error("Chrome/Edge topilmadi. CHROME_PATH ni belgilang.");
  const origin = process.env.LESSON_TEST_ORIGIN || "http://localhost:3000";
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 360, height: 640 } });
    await page.goto(`${origin}/login`);
    await page.evaluate(({ html, compiledJs }) => {
      (window as unknown as { introMessages: { type: string; payload: unknown }[] }).introMessages = [];
      const nonce = crypto.randomUUID();
      const frame = document.createElement("iframe");
      frame.setAttribute("sandbox", "allow-scripts");
      frame.style.cssText = "position:fixed;inset:0;z-index:9999;display:block;width:100vw;height:100dvh;border:0";
      frame.srcdoc = html;
      window.addEventListener("message", (event) => {
        if (event.source !== frame.contentWindow || event.data?.nonce !== nonce) return;
        (window as unknown as { introMessages: { type: string; payload: unknown }[] }).introMessages.push(event.data);
      });
      frame.addEventListener("load", () => frame.contentWindow?.postMessage({ type: "init", nonce, compiledJs, kind: "learn", props: { studentName: "Test" } }, "*"), { once: true });
      document.body.append(frame);
    }, { html: lessonFrameDocument(origin), compiledJs: result.compiledJs });
    await page.waitForFunction(() => (window as unknown as { introMessages: { type: string }[] }).introMessages.some((message) => message.type === "mounted" || message.type === "error"), { timeout: 10_000 });
    const initialMessages = await page.evaluate(() => (window as unknown as { introMessages: { type: string; payload: unknown }[] }).introMessages);
    assert.ok(initialMessages.some((message) => message.type === "mounted"), JSON.stringify(initialMessages));
    const frame = page.frameLocator("iframe");
    const next = frame.locator(".intro-primary");
    await frame.locator(".intro-lang").selectOption("ru");
    assert.equal(await frame.locator("h1").textContent(), "Звонит телефон");
    await frame.locator(".intro-lang").selectOption("en");
    assert.equal(await frame.locator("h1").textContent(), "The phone is ringing");
    await frame.locator(".intro-lang").selectOption("uz");

    async function layout(screen: number) {
      const metrics = await frame.locator(".intro-root").evaluate((root) => ({
        scrollHeight: root.scrollHeight, clientHeight: root.clientHeight,
        buttons: [...root.querySelectorAll("button")].filter((button) => !button.hidden).map((button) => ({ text: button.textContent, height: button.getBoundingClientRect().height })),
      }));
      assert.ok(metrics.scrollHeight <= metrics.clientHeight + 1, `Screen ${screen} overflows at 360×640: ${metrics.scrollHeight}/${metrics.clientHeight}`);
      assert.ok(metrics.buttons.every((button) => button.height >= 43.5), `Screen ${screen} has a touch target below 44px`);
    }

    assert.equal(await next.isDisabled(), true);
    await layout(1);
    await frame.locator(".intro-list .intro-choice").first().click();
    await next.click();
    assert.equal(await next.isDisabled(), true);
    for (const button of await frame.locator(".intro-list .intro-choice").all()) await button.click();
    await layout(2);
    await next.click();
    const phrase = frame.locator(".intro-role-column").first().locator("button");
    const role = frame.locator(".intro-role-column").last().locator("button");
    await phrase.nth(0).click(); await role.nth(0).click(); await role.nth(1).click();
    for (const [phraseIndex, roleIndex] of [[1, 3], [2, 0], [3, 4], [4, 2]]) { await phrase.nth(phraseIndex).click(); await role.nth(roleIndex).click(); }
    await layout(3);
    await next.click();
    assert.equal(await next.isDisabled(), true);
    await frame.locator(".intro-grid .intro-choice").nth(3).click();
    await layout(4);
    await next.click();
    await frame.locator(".intro-list .intro-choice").nth(1).click();
    assert.equal(await next.isDisabled(), true);
    await frame.locator(".intro-list .intro-choice").nth(0).click();
    await layout(5);
    await next.click();
    for (const button of await frame.locator(".intro-list .intro-choice").all()) await button.click();
    await layout(6);
    await next.click();
    await frame.locator(".intro-list .intro-choice").nth(0).click();
    await layout(7);
    await next.click();
    await layout(8);
    await next.click();
    await layout(9);
    if (process.env.INTRO_SCREENSHOT) await frame.locator(".intro-root").screenshot({ path: process.env.INTRO_SCREENSHOT });
    await frame.locator(".intro-secondary").press("Enter");
    await next.press("Enter");
    assert.equal(await frame.locator(".intro-summary li").count(), 2, "Back navigation must keep answers");
    await next.click();
    await page.waitForFunction(() => (window as unknown as { introMessages: { type: string }[] }).introMessages.some((message) => message.type === "finished"));
    const finished = await page.evaluate(() => (window as unknown as { introMessages: { type: string; payload: unknown }[] }).introMessages.filter((message) => message.type === "finished"));
    assert.equal(finished.length, 1);
    const payload = finished[0].payload as { lessonId: string; passed: boolean; firstTryStats: { firstTryCorrect: number }; profile: { firstReaction: string; struggles: string[]; goals: string[] } };
    assert.equal(payload.lessonId, "INTRO");
    assert.equal(payload.passed, true);
    assert.equal(payload.firstTryStats.firstTryCorrect, 4);
    assert.deepEqual(payload.profile, { firstReaction: "A", struggles: ["rate"], goals: ["understand_loads"] });
    assert.equal(await next.isDisabled(), true);

    await page.setViewportSize({ width: 1280, height: 720 });
    const desktop = await frame.locator(".intro-root").evaluate((root) => ({ scroll: root.scrollHeight, client: root.clientHeight }));
    assert.ok(desktop.scroll <= desktop.client + 1, "Desktop Intro overflows");
    console.log("Intro: compiled, 9 mobile screens, gates, matching, retry, back navigation, payload, desktop finish screen passed.");
  } finally { await browser.close(); }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
