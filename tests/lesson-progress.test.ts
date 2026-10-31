import assert from "node:assert/strict";
import { test } from "node:test";

import { canRecordPractice, learnPassed } from "../src/lib/lessons/progress";

test("Learn pass depends on the course threshold, not a client flag", () => {
  assert.equal(learnPassed("M1L01", { scorePercent: 59, passed: true }), false);
  assert.equal(learnPassed("M1L01", { scorePercent: 60, passed: false }), true);
  assert.equal(learnPassed("M2L08", { scorePercent: 69, passed: true }), false);
  assert.equal(learnPassed("M2L08", { scorePercent: 70, passed: false }), true);
  assert.equal(learnPassed("INTRO", {}), true);
});

test("Practice cannot skip a question or run before Learn", () => {
  assert.equal(canRecordPractice(1, false, []), false);
  assert.equal(canRecordPractice(1, true, []), true);
  assert.equal(canRecordPractice(2, true, [1]), true);
  assert.equal(canRecordPractice(3, true, [1]), false);
  assert.equal(canRecordPractice(11, true, Array.from({ length: 10 }, (_, i) => i + 1)), false);
});
