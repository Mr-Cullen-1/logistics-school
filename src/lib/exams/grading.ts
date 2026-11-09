import { normalizeExamAnswer } from "./normalize";
import { ExamError } from "./db";
import { moduleCodes, type AttemptResult, type ExamAnswer, type ExamDefinition } from "./types";

export function gradeExam(def: ExamDefinition, answers: ExamAnswer[], passPercent = 80): AttemptResult {
  if (!Number.isInteger(passPercent) || passPercent < 1 || passPercent > 100) throw new ExamError(400,"O‘tish foizi 1–100 bo‘lsin");
  const ids = new Set(def.questions.map(q => q.id));
  if (new Set(answers.map(a => a.questionId)).size !== answers.length || answers.some(a => !ids.has(a.questionId) || typeof a.value !== "string" || a.value.length > 2000)) throw new ExamError(400,"Javoblar noto‘g‘ri");
  const values = new Map(answers.map(a => [a.questionId, a.value]));
  const modules = moduleCodes.map(moduleCode => {
    const questions = def.questions.filter(q => q.moduleCode === moduleCode);
    const correct = questions.filter(q => {
      const answer = values.get(q.id) || "";
      if (!answer.trim() || (q.grading.maxWords && answer.trim().split(/\s+/).length > q.grading.maxWords)) return false;
      return q.grading.acceptedAnswers.some(a => q.type === "typed" ? normalizeExamAnswer(a, q.grading.caseSensitive) === normalizeExamAnswer(answer, q.grading.caseSensitive) : a === answer);
    }).length;
    return { moduleCode, correct, wrong: questions.length - correct, total: questions.length };
  }).filter(m => m.total > 0);
  const correct = modules.reduce((n, m) => n + m.correct, 0), total = def.questions.length;
  const passed = correct * 100 >= passPercent * total;
  const maxWrong = Math.max(...modules.map(m => m.wrong));
  return { correct, total, percent: Math.round(correct / total * 10000) / 100, passPercent, passed, modules, weakModules: passed ? [] : modules.filter(m => m.wrong === maxWrong).map(m => m.moduleCode) };
}
