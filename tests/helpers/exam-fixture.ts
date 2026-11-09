import type { ExamDefinition, ExamQuestion } from "../../src/lib/exams/types";

export function examFixture(kind: "pk" | "ik" = "pk"): ExamDefinition {
  const questions: ExamQuestion[] = [];
  const blooms = ["remember", "understand", "apply", "analyze", "evaluate"] as const;
  for (let m = 1; m <= (kind === "pk" ? 1 : 4); m++) {
    const moduleCode = `M${m}` as ExamQuestion["moduleCode"];
    const counts = kind === "pk" ? [6, 6, 10, 6, 2] : [2, 3, 4, m < 3 ? 3 : 2, 1];
    const levels = counts.flatMap((n, i) => Array(n).fill(blooms[i]));
    const sections = kind === "pk" ? Array(30).fill("core") : [...Array(5).fill("reading"), ...Array(m === 4 ? 3 : 4).fill("writing"), ...Array(m === 3 ? 3 : 4).fill("grammar")];
    for (let i = 0; i < levels.length; i++) {
      const readingIndex = ((m - 1) % 2) * 5 + i;
      const type = sections[i] !== "reading" ? "typed" : readingIndex < 4 ? "single_choice" : readingIndex < 7 ? "matching" : "typed";
      questions.push({ id: `${moduleCode}-q${i}`, moduleCode, bloom: levels[i], difficulty: "medium", section: sections[i], type,
        prompt: `Answer ${moduleCode} ${i}`, ...(sections[i] === "reading" ? { passageId: m <= 2 ? "a" : "b" } : {}),
        ...(type !== "typed" ? { options: [{ id: "a", text: "Alpha" }, { id: "b", text: "Beta" }] } : {}),
        sourceRefs: [{ lessonCode: `${moduleCode}L0${i % 8 + 1}`, slot: "learn", sha256: "a".repeat(64), reference: "slide:2" }],
        grading: { acceptedAnswers: [type === "typed" ? "confirmed" : "a"], caseSensitive: false },
      });
    }
    const vocabCount = kind === "pk" ? 20 : m < 3 ? 12 : 13;
    for (let i = 0; i < vocabCount; i++) questions.push({ id: `${moduleCode}-v${i}`, moduleCode, bloom: i < (kind === "pk" ? 10 : 6) ? "remember" : "understand", difficulty: "easy", section: "vocabulary", type: "typed", prompt: `Term ${i}`, lemma: `${moduleCode}-term-${i}`, sourceRefs: [{ lessonCode: `${moduleCode}L0${i % 8 + 1}`, slot: "learn", sha256: "a".repeat(64), reference: "vocabulary" }], grading: { acceptedAnswers: ["dispatch"], caseSensitive: false } });
  }
  return { schemaVersion: 1, kind, ...(kind === "pk" ? { moduleCode: "M1" as const } : {}), title: "Test exam", passages: kind === "pk" ? [] : [{ id: "a", title: "Passage A", text: "Course passage A." }, { id: "b", title: "Passage B", text: "Course passage B." }], questions };
}
