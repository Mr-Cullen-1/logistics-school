import assert from "node:assert/strict";
import { test } from "node:test";

import { detectPracticeMechanic, parseLessonFilename, publishReadiness, passThreshold, selectPublishFiles, validateUploadSelection } from "../src/lib/lessons/rules";

test("Practice mechanic comes from JSX metadata and matches its task", () => {
  assert.equal(detectPracticeMechanic('export const meta = { mechanic: "MATCH" }; const task = { kind: "MATCH" };'), "MATCH");
  assert.equal(detectPracticeMechanic('export const meta = {"mechanic":"READ-MC"}; const task = {"kind":"READ-MC"};'), "READ-MC");
  assert.equal(detectPracticeMechanic('export const meta = { mechanic: "MATCH" }; const task = { kind: "MC" };'), null);
});

test("only canonical Learn and Practice filenames are accepted", () => {
  assert.deepEqual(parseLessonFilename("M1L01.learn.jsx"), { code: "M1L01", kind: "learn", seq: 0 });
  assert.deepEqual(parseLessonFilename("M4L08.p10.jsx"), { code: "M4L08", kind: "practice", seq: 10 });
  assert.deepEqual(parseLessonFilename("INTRO.learn.jsx"), { code: "INTRO", kind: "learn", seq: 0 });
  for (const name of ["INTRO.p01.jsx", "M1L09.learn.jsx", "M1L01.p00.jsx", "M1L01.p11.jsx", "Dars01.jsx", "M1L01.p1.jsx"]) {
    assert.equal(parseLessonFilename(name), null, name);
  }
});

test("bulk selection belongs to one lesson and accepts Practice only", () => {
  const names = Array.from({ length: 10 }, (_, index) => `M1L01.p${String(index + 1).padStart(2, "0")}.jsx`);
  assert.equal(validateUploadSelection("M1L01", "practice", names), null);
  assert.equal(validateUploadSelection("M1L01", "learn", ["M1L01.learn.jsx"]), null);
  assert.match(validateUploadSelection("M1L01", "learn", ["M1L01.learn.jsx", "M1L01.learn.jsx"]) || "", /Bitta Learn/);
  assert.match(validateUploadSelection("M1L01", "practice", [...names, names[0]]) || "", /1–10/);
  assert.match(validateUploadSelection("M1L01", "practice", [names[0], names[0]]) || "", /ikki marta/);
  assert.match(validateUploadSelection("M1L01", "practice", [names[0], "M1L02.p02.jsx"]) || "", /mos emas/);
  assert.match(validateUploadSelection("M1L01", "practice", ["M1L01.learn.jsx"]) || "", /mos emas/);
  assert.match(validateUploadSelection("INTRO", "practice", [names[0]]) || "", /Intro/);
});

test("Intro publishes with Learn only; regular lessons require a diverse ordered set", () => {
  assert.deepEqual(publishReadiness("INTRO", [{ kind: "learn", seq: 0, mechanic: null }]), []);
  const files = [
    { kind: "learn" as const, seq: 0, mechanic: null },
    ...["MC", "GAP", "ORDER", "MATCH", "FIX", "MC", "READ-MC", "READ-TYPE", "TYPE", "SCENE"].map((mechanic, index) => ({ kind: "practice" as const, seq: index + 1, mechanic })),
  ];
  assert.deepEqual(publishReadiness("M1L01", files), []);
  assert.match(publishReadiness("M1L01", files.map((file) => file.mechanic === "READ-MC" ? { ...file, mechanic: "LISTEN-MC" } : file)).join(" "), /o.qib-tushunish/i);
  assert.match(publishReadiness("M1L01", files.filter((file) => file.seq !== 4)).join(" "), /p04/);
  assert.match(publishReadiness("M1L01", files.map((file) => file.seq === 10 ? { ...file, mechanic: "MC" } : file)).join(" "), /SCENE/);
});

test("checkpoint pass threshold is 70 percent", () => {
  assert.equal(passThreshold("M1L01"), 60);
  assert.equal(passThreshold("M3L08"), 70);
  assert.equal(passThreshold("INTRO"), null);
});

test("new draft replaces only its own published slot", () => {
  const files = [
    { id: "old-learn", kind: "learn" as const, seq: 0, version: 1, status: "published", isCurrent: true },
    { id: "new-learn", kind: "learn" as const, seq: 0, version: 2, status: "draft", isCurrent: false },
    { id: "p01", kind: "practice" as const, seq: 1, version: 1, status: "published", isCurrent: true },
  ];
  assert.deepEqual(selectPublishFiles(files).map((file) => file.id), ["new-learn", "p01"]);
});

test("an older draft never replaces the current published version", () => {
  const files = [
    { id: "draft-1", kind: "learn", seq: 0, version: 1, status: "draft", isCurrent: false },
    { id: "current-2", kind: "learn", seq: 0, version: 2, status: "published", isCurrent: true },
    { id: "draft-3", kind: "learn", seq: 0, version: 3, status: "draft", isCurrent: false },
  ];
  assert.deepEqual(selectPublishFiles(files.slice(0, 2)).map((file) => file.id), ["current-2"]);
  assert.deepEqual(selectPublishFiles(files.slice(0, 2).reverse()).map((file) => file.id), ["current-2"]);
  assert.deepEqual(selectPublishFiles(files).map((file) => file.id), ["draft-3"]);
});
