import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ExamScreen } from "../runtime/exam-screen";
import { toPublicExam } from "../src/lib/exams/public";
import { examFixture } from "./helpers/exam-fixture";
test("exam renderer exposes typed input without hints or grading metadata",()=>{
  const exam=toPublicExam(examFixture());
  const html=renderToStaticMarkup(createElement(ExamScreen,{exam,savedAnswers:[]}));
  assert.match(html,/textarea/);assert.match(html,/spellCheck="false"|spellcheck="false"/);
  assert.ok(!html.includes("acceptedAnswers"));assert.ok(!html.includes("confirmed"));
  assert.match(html,/1\/50/);
});
