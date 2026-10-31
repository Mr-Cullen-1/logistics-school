import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { chromium } from "playwright-core";

import { validateAndCompileLesson } from "../src/lib/lessons/compile";
import { lessonFrameDocument } from "../src/lib/lessons/frame";

async function main() {
  const executablePath = [process.env.CHROME_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/google-chrome", "/usr/bin/chromium"].find((path) => path && existsSync(path));
  if (!executablePath) throw new Error("Chrome/Edge topilmadi. CHROME_PATH ni belgilang.");
  const origin = process.env.LESSON_TEST_ORIGIN || "http://localhost:3000";
  const browser = await chromium.launch({ executablePath, headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`${origin}/login`);
    const html = lessonFrameDocument(origin);
    async function render(source: string) {
      const compiled = validateAndCompileLesson("INTRO.learn.jsx", source);
      if (!compiled.ok) throw new Error(compiled.error);
      return page.evaluate(`new Promise((resolve) => {
        const html = ${JSON.stringify(html)};
        const compiledJs = ${JSON.stringify(compiled.compiledJs)};
        const nonce = crypto.randomUUID();
        const frame = document.createElement("iframe");
        frame.setAttribute("sandbox", "allow-scripts");
        frame.srcdoc = html;
        const timeout = setTimeout(() => finish({ type: "timeout" }), 8_000);
        function finish(value) {
          clearTimeout(timeout);
          window.removeEventListener("message", receive);
          resolve(value);
        }
        function receive(event) {
          if (event.source !== frame.contentWindow || event.data?.nonce !== nonce) return;
          if (event.data.type === "mounted" || event.data.type === "error") finish({ type: event.data.type, payload: event.data.payload });
        }
        window.addEventListener("message", receive);
        frame.addEventListener("load", () => frame.contentWindow?.postMessage({ type: "init", nonce, compiledJs, kind: "learn", props: { lang: "uz" } }, "*"), { once: true });
        document.body.append(frame);
      })`) as Promise<{ type: string; payload?: string }>;
    }
    assert.equal((await render('import React from "react"; export default function Lesson(){return <h1>Ready</h1>}')).type, "mounted");
    assert.equal(await page.frameLocator("iframe").first().locator("h1").textContent(), "Ready");
    const broken = await render('import React from "react"; export default function Lesson(){throw new Error("boom")}');
    assert.equal(broken.type, "error");
    assert.match(broken.payload || "", /boom/);
    console.log("Iframe smoke: valid JSX mounted, render error rejected.");
  } finally { await browser.close(); }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
