import assert from "node:assert/strict";
import { test } from "node:test";

import { validateAndCompileLesson } from "../src/lib/lessons/compile";

const valid = 'import React from "react"; export default function Lesson() { return <div>Ready</div>; }';

test("valid JSX compiles with its SHA-256 and filename metadata", () => {
  const result = validateAndCompileLesson("M1L01.learn.jsx", valid);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.slot.code, "M1L01");
    assert.equal(result.sha256.length, 64);
    assert.match(result.compiledJs, /exports\.default/);
  }
});

test("untrusted imports, browser escape APIs, malformed JSX, and missing exports are rejected", () => {
  for (const [source, expected] of [
    ['import x from "fs"; export default function X(){return null}', /import/],
    ['export default function X(){ fetch("https://evil.example"); return null }', /fetch/],
    ['export default function X(){ window.parent.postMessage("x", "*"); return null }', /parent/],
    ['export default function X(){ return <div>}', /sintaksis/i],
    ['export const x = 1', /default export/],
  ] as const) {
    const result = validateAndCompileLesson("M1L01.learn.jsx", source);
    assert.equal(result.ok, false);
    if (!result.ok) assert.match(result.error, expected);
  }
});

test("file limits and kind-specific imports apply", () => {
  const large = validateAndCompileLesson("M1L01.p01.jsx", `${" ".repeat(300_001)}export default function X(){return null}`);
  assert.equal(large.ok, false);
  const domImport = validateAndCompileLesson("M1L01.p01.jsx", 'import { createPortal } from "react-dom"; export default function X(){return null}');
  assert.equal(domImport.ok, false);
});

test("sound APIs and media elements are rejected for voice-free lessons", () => {
  for (const source of [
    'export default function Lesson(){ new Audio("sound.mp3"); return null }',
    'export default function Lesson(){ speechSynthesis.speak(null); return null }',
    'export default function Lesson(){ return <audio src="sound.mp3" /> }',
    'export default function Lesson(){ return <video src="movie.mp4" /> }',
    'export default function Lesson(){ window["Audio"]("sound.mp3"); return null }',
  ]) {
    const result = validateAndCompileLesson("INTRO.learn.jsx", source);
    assert.equal(result.ok, false, source);
  }
});
