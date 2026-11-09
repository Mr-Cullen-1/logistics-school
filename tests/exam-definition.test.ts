import assert from "node:assert/strict";
import { test } from "node:test";
import { validateExamDefinition } from "../src/lib/exams/definition";
import { examFixture } from "./helpers/exam-fixture";

test("PK and IK blueprints enforce counts, section, module and Bloom coverage", () => {
  for (const kind of ["pk", "ik"] as const) assert.deepEqual(validateExamDefinition(examFixture(kind)), []);
  const def = examFixture(); def.questions.pop(); assert.ok(validateExamDefinition(def).length);
  const wrong = examFixture("ik"); wrong.questions[0].moduleCode = "M4"; assert.ok(validateExamDefinition(wrong).length);
  const bloom = examFixture(); bloom.questions[0].bloom = "create"; assert.ok(validateExamDefinition(bloom).length);
});
test("duplicate IDs, vocabulary choices, missing sources and broken reading groups fail", () => {
  const def = examFixture(); def.questions[1].id = def.questions[0].id; assert.ok(validateExamDefinition(def).length);
  const vocab = examFixture(); vocab.questions[49].type = "matching"; assert.ok(validateExamDefinition(vocab).length);
  const source = examFixture(); source.questions[0].sourceRefs = []; assert.ok(validateExamDefinition(source).length);
  const read = examFixture("ik"); read.questions[0].passageId = "missing"; assert.ok(validateExamDefinition(read).length);
});
