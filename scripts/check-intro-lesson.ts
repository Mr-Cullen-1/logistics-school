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
      frame.style.cssText = "position:fixed;top:56px;left:0;z-index:9999;display:block;width:100vw;height:calc(100dvh - 56px);border:0";
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
    async function settleViewport() {
      await frame.locator(".intro-root").evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    }
    async function introHeadingFits(size: string) {
      const bounds = await frame.locator(".intro-first-kicker").evaluate((heading) => ({
        headingBottom: heading.getBoundingClientRect().bottom,
        titleTop: heading.parentElement?.querySelector(".intro-title")?.getBoundingClientRect().top ?? 0,
      }));
      assert.ok(bounds.titleTop >= bounds.headingBottom + 4, `Intro heading overlaps title at ${size}: ${JSON.stringify(bounds)}`);
    }
    await frame.locator(".intro-lang").selectOption("ru");
    assert.equal(await frame.locator("h1").textContent(), "Звонит телефон");
    await frame.locator(".intro-lang").selectOption("en");
    assert.equal(await frame.locator("h1").textContent(), "The phone is ringing");
    await frame.locator(".intro-lang").selectOption("uz");

    async function layout(screen: number) {
      if (screen === 1) await introHeadingFits("360×640");
      const metrics = await frame.locator(".intro-root").evaluate((root) => ({
        scrollHeight: root.scrollHeight, clientHeight: root.clientHeight,
        bodyScroll: root.querySelector(".intro-body")?.scrollHeight, bodyClient: root.querySelector(".intro-body")?.clientHeight,
        buttons: [...root.querySelectorAll("button")].filter((button) => !button.hidden).map((button) => ({ text: button.textContent, height: button.getBoundingClientRect().height })),
      }));
      assert.ok(metrics.scrollHeight <= metrics.clientHeight + 1, `Screen ${screen} overflows: ${metrics.scrollHeight}/${metrics.clientHeight}`);
      assert.ok((metrics.bodyScroll || 0) <= (metrics.bodyClient || 0) + 1, `Screen ${screen} hides content: ${metrics.bodyScroll}/${metrics.bodyClient}`);
      assert.ok(metrics.buttons.every((button) => button.height >= 43.5), `Screen ${screen} has a touch target below 44px`);
      await page.setViewportSize({ width: 320, height: 568 });
      await settleViewport();
      if (screen === 1) await introHeadingFits("320×568");
      const compact = await frame.locator(".intro-body").evaluate((body) => ({ scroll: body.scrollHeight, client: body.clientHeight }));
      assert.ok(compact.scroll <= compact.client + 1, `Screen ${screen} hides content at 320×568: ${compact.scroll}/${compact.client}`);
      await page.setViewportSize({ width: 667, height: 375 });
      await settleViewport();
      if (screen === 1) await introHeadingFits("667×375");
      const landscape = await frame.locator(".intro-body").evaluate((body) => ({ scroll: body.scrollHeight, client: body.clientHeight }));
      assert.ok(landscape.scroll <= landscape.client + 1, `Screen ${screen} hides content at 667×375: ${landscape.scroll}/${landscape.client}`);
      await page.setViewportSize({ width: 1280, height: 720 });
      await settleViewport();
      await frame.locator(".intro-screen").evaluate(() => new Promise<void>((resolve) => setTimeout(resolve, 1800)));
      const desktopContent = await frame.locator(".intro-screen").evaluate((content) => ({ scroll: content.scrollHeight, client: content.clientHeight }));
      assert.ok(desktopContent.scroll <= desktopContent.client + 1, `Screen ${screen} hides content at 1280×720: ${desktopContent.scroll}/${desktopContent.client}`);
      await page.setViewportSize({ width: 360, height: 640 });
      await settleViewport();
    }

    assert.equal(await next.isDisabled(), true);
    await layout(1);
    await frame.locator(".intro-list .intro-choice").first().click();
    await layout(1);
    if (process.env.INTRO_SCREENSHOT_FIRST) await frame.locator(".intro-root").screenshot({ path: process.env.INTRO_SCREENSHOT_FIRST });
    if (process.env.INTRO_SCREENSHOT_DESKTOP) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await frame.locator(".intro-root").screenshot({ path: process.env.INTRO_SCREENSHOT_DESKTOP });
      await page.setViewportSize({ width: 360, height: 640 });
    }
    await next.click();
    assert.equal(await next.isDisabled(), true);
    for (const button of await frame.locator(".intro-list .intro-choice").all()) await button.click();
    await layout(2);
    await page.setViewportSize({ width: 1440, height: 900 });
    const flippedCard = await frame.locator(".intro-card-button").first().evaluate((card) => ({
      cardRight: card.getBoundingClientRect().right,
      markRight: card.lastElementChild?.getBoundingClientRect().right ?? 0,
    }));
    assert.ok(flippedCard.markRight > flippedCard.cardRight - 50, "Opened-card checkmark must stay on the right");
    const hint = await frame.locator(".intro-feedback").evaluate((node) => ({
      bottom: node.getBoundingClientRect().bottom,
      footerTop: document.querySelector(".intro-foot")?.getBoundingClientRect().top ?? 0,
    }));
    assert.ok(hint.footerTop - hint.bottom >= 8, "Desktop hint must be separate from footer buttons");
    await page.setViewportSize({ width: 360, height: 640 });
    await next.click();
    await frame.locator(".intro-role-column").first().waitFor({ state: "visible" });
    assert.equal(await frame.locator("h1").textContent(), "Siz kim bilan gaplashasiz?");
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
    assert.equal(await frame.locator(".intro-roadmap-card").count(), 4);
    assert.equal(await frame.locator(".intro-roadmap button").count(), 0);
    await layout(6);
    await next.click();
    await frame.locator(".intro-list .intro-choice").nth(0).click();
    await layout(7);
    await next.click();
    await layout(8);
    await next.click();
    await layout(9);
    if (process.env.INTRO_SCREENSHOT) {
      await frame.locator(".intro-result-next").evaluate(() => new Promise<void>((resolve) => setTimeout(resolve, 850)));
      await frame.locator(".intro-root").screenshot({ path: process.env.INTRO_SCREENSHOT });
    }
    assert.equal(await frame.locator(".intro-takeaways li").count(), 3);
    if (process.env.INTRO_SCREENSHOT_RESULT_DESKTOP) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await frame.locator(".intro-result-next").evaluate(() => new Promise<void>((resolve) => setTimeout(resolve, 850)));
      await frame.locator(".intro-root").screenshot({ path: process.env.INTRO_SCREENSHOT_RESULT_DESKTOP });
      await page.setViewportSize({ width: 360, height: 640 });
    }
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
