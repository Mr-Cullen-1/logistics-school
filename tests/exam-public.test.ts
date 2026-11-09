import assert from "node:assert/strict";
import { test } from "node:test";
import { toPublicExam } from "../src/lib/exams/public";
import { examFixture } from "./helpers/exam-fixture";
test("student DTO excludes answer keys, explanations, module/Bloom and source metadata",()=>{
  const def=examFixture();def.questions[0].grading.acceptedAnswers=["SECRET_SENTINEL"];def.questions[0].grading.explanation="PRIVATE_RUBRIC";
  const json=JSON.stringify(toPublicExam(def));
  for(const secret of ["SECRET_SENTINEL","PRIVATE_RUBRIC","sourceRefs","acceptedAnswers","moduleCode","bloom","sha256"])assert.ok(!json.includes(secret),secret);
});
