import assert from "node:assert/strict";
import { test } from "node:test";
import { gradeExam } from "../src/lib/exams/grading";
import { normalizeExamAnswer } from "../src/lib/exams/normalize";
import { examFixture } from "./helpers/exam-fixture";

test("thresholds use exact integer arithmetic and blanks count as wrong", () => {
  for (const [kind, fail, pass, threshold] of [["pk", 39, 40, 80], ["ik", 79, 80, 80], ["pk", 42, 43, 85]] as const) {
    const def = examFixture(kind);
    const answers = def.questions.map(q => ({ questionId: q.id, value: q.grading.acceptedAnswers[0] }));
    assert.equal(gradeExam(def, answers.slice(0, fail), threshold).passed, false);
    assert.equal(gradeExam(def, answers.slice(0, pass), threshold).passed, true);
    assert.equal(gradeExam(def, [], threshold).correct, 0);
  }
});
test("reject unknown/duplicate answers; return all equally weak modules only on failure", () => {
  const def = examFixture("ik");
  assert.throws(() => gradeExam(def, [{ questionId: "unknown", value: "a" }], 80));
  const a = { questionId: def.questions[0].id, value: "a" };
  assert.throws(() => gradeExam(def, [a, a], 80));
  assert.equal(gradeExam(def, [], 80).weakModules.length, 4);
  assert.deepEqual(gradeExam(def, def.questions.map(q => ({ questionId: q.id, value: q.grading.acceptedAnswers[0] })), 80).weakModules, []);
});
test("normalization preserves negation, IDs, hyphens and time zones", () => {
  assert.equal(normalizeExamAnswer("  Driver’s   ETA "), "driver's eta");
  for (const [a, b] of [["not confirmed", "confirmed"], ["PU-12", "PU12"], ["8 Central", "8 Eastern"], ["1,200", "1200"]]) assert.notEqual(normalizeExamAnswer(a), normalizeExamAnswer(b));
  const def = examFixture(); def.questions[0].grading = { acceptedAnswers: ["POD"], caseSensitive: true, maxWords: 1 };
  assert.equal(gradeExam(def, [{ questionId: def.questions[0].id, value: "pod" }], 80).correct, 0);
});
