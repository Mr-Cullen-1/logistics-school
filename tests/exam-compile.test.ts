import assert from "node:assert/strict";
import { test } from "node:test";
import { parseExamUpload, examJsxSource } from "../src/lib/exams/compile";
import { examFixture } from "./helpers/exam-fixture";

test("declarative JSX parses without executing submitted code", () => {
  const source = examJsxSource(examFixture());
  assert.equal(parseExamUpload("M1.pk.jsx", source).definition.questions.length, 50);
  assert.throws(() => parseExamUpload("M2.pk.jsx", source));
  assert.throws(() => parseExamUpload("M1.pk.jsx", source + "\nfetch('https://example.com');"));
  assert.throws(() => parseExamUpload("M1.pk.jsx", source.replace('"schemaVersion": 1', '"schemaVersion": (() => 1)()')));
  assert.throws(() => parseExamUpload("M1.pk.jsx", source.replace("<ExamScreen {...props} />", "<div>secret answer</div>")));
});
