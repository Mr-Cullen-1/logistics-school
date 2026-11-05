import assert from "node:assert/strict";
import { test } from "node:test";
import { lessonSequence } from "../src/lib/lessons/sequence";

const lesson = (id: string, learn = false, practice = false, status = "published") => ({
  id, status, learnDoneAt: learn ? new Date() : null, practiceDoneAt: practice ? new Date() : null,
});

test("Intro is mandatory even with older out-of-order progress", () => {
  assert.deepEqual(lessonSequence([lesson("M1L01", true, true), lesson("M1L02")], false).map(x => x.unlocked), [false, false]);
});
test("Learn alone does not unlock the next lesson; completed lessons remain reviewable", () => {
  assert.deepEqual(lessonSequence([lesson("M1L01", true), lesson("M1L02")], true).map(x => x.unlocked), [true, false]);
  assert.deepEqual(lessonSequence([lesson("M1L01", true, true), lesson("M1L02"), lesson("M1L03")], true).map(x => x.unlocked), [true, true, false]);
});
test("Module boundaries and earlier gaps cannot be skipped", () => {
  assert.deepEqual(lessonSequence([lesson("M1L08"), lesson("M2L01", true, true), lesson("M2L02")], true).map(x => x.unlocked), [true, false, false]);
  assert.deepEqual(lessonSequence([lesson("M1L08", true, true), lesson("M2L01")], true).map(x => x.unlocked), [true, true]);
});
test("Unpublished prerequisites block later lessons", () => {
  assert.deepEqual(lessonSequence([lesson("M1L01", true, true, "draft"), lesson("M1L02")], true).map(x => x.unlocked), [false, false]);
});
