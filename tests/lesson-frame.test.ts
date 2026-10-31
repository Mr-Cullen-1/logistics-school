import assert from "node:assert/strict";
import { test } from "node:test";

import { lessonFrameDocument } from "../src/lib/lessons/frame";

test("iframe document permits only platform assets and has no network connection", () => {
  const html = lessonFrameDocument("https://school.example");
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /media-src 'none'/);
  assert.match(html, /font-src https:\/\/school\.example/);
  assert.match(html, /fonts\/Geist-Variable\.woff2/);
  assert.match(html, /fonts\/GeistMono-Variable\.woff2/);
  assert.match(html, /script-src https:\/\/school\.example blob:/);
  assert.doesNotMatch(html, /allow-same-origin/);
  assert.doesNotMatch(html, /cookie/);
});
