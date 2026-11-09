import type { ExamDefinition, PublicExam } from "./types";

export function toPublicExam(d: ExamDefinition): PublicExam {
  return { title: d.title, kind: d.kind, passages: d.passages.map(p => ({ id: p.id, title: p.title, text: p.text })), questions: d.questions.map(q => ({ id: q.id, section: q.section, type: q.type, prompt: q.prompt, ...(q.passageId ? { passageId: q.passageId } : {}), ...(q.options ? { options: q.options.map(o => ({ id: o.id, text: o.text })) } : {}), ...(q.grading.maxWords ? { maxWords: q.grading.maxWords } : {}) })) };
}
