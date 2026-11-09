import { z } from "zod";
import { bloomLevels, moduleCodes, type ExamDefinition } from "./types";

const question = z.object({
  id: z.string().min(1).max(80), moduleCode: z.enum(moduleCodes), section: z.enum(["core", "reading", "writing", "grammar", "vocabulary"]),
  bloom: z.enum(bloomLevels), difficulty: z.enum(["easy", "medium", "hard"]), type: z.enum(["single_choice", "matching", "typed"]),
  prompt: z.string().min(1).max(6000), passageId: z.string().optional(), lemma: z.string().min(1).optional(),
  options: z.array(z.object({ id: z.string().min(1).max(80), text: z.string().min(1).max(3000) }).strict()).min(2).max(20).optional(),
  sourceRefs: z.array(z.object({ lessonCode: z.string().regex(/^M[1-4]L0[1-8]$/), slot: z.string().regex(/^(learn|p(0[1-9]|10))$/), sha256: z.string().regex(/^[a-f0-9]{64}$/), reference: z.string().min(1).max(200) }).strict()).min(1).max(20),
  grading: z.object({ acceptedAnswers: z.array(z.string().trim().min(1).max(2000)).min(1).max(30), caseSensitive: z.boolean(), maxWords: z.number().int().min(1).max(100).optional(), explanation: z.string().max(4000).optional() }).strict(),
}).strict();
export const examDefinitionSchema = z.object({ schemaVersion: z.literal(1), kind: z.enum(["pk", "ik"]), moduleCode: z.enum(moduleCodes).optional(), title: z.string().min(1).max(200), passages: z.array(z.object({ id: z.string().min(1), title: z.string().min(1).max(200), text: z.string().min(1).max(20000) }).strict()).max(2), questions: z.array(question).min(50).max(100) }).strict();

export function validateExamDefinition(input: unknown): string[] {
  const parsed = examDefinitionSchema.safeParse(input);
  if (!parsed.success) return parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`);
  const d: ExamDefinition = parsed.data;
  const errors: string[] = [];
  const check = (ok: boolean, message: string) => { if (!ok) errors.push(message); };
  const qs = d.questions;
  check(new Set(qs.map(q => q.id)).size === qs.length, "Savol ID takrorlangan");
  check(new Set(d.passages.map(p => p.id)).size === d.passages.length, "Matn ID takrorlangan");
  check(d.kind === "pk" ? !!d.moduleCode : !d.moduleCode, "Imtihon modul bog‘lanishi noto‘g‘ri");
  check(qs.length === (d.kind === "pk" ? 50 : 100), "Savollar soni noto‘g‘ri");
  const vocab = qs.filter(q => q.section === "vocabulary");
  check(new Set(vocab.map(q => q.lemma?.toLowerCase().trim())).size === vocab.length && vocab.every(q => !!q.lemma), "Vocabulary lemma takrorlangan yoki yo‘q");
  for (const q of qs) {
    check(q.sourceRefs.some(r => r.lessonCode.startsWith(q.moduleCode)), `${q.id}: modul manbasi yo‘q`);
    if (d.kind === "pk") check(q.moduleCode === d.moduleCode && q.sourceRefs.every(r => r.lessonCode.startsWith(d.moduleCode!)), `${q.id}: PK boshqa moduldan`);
    if (q.type === "typed") check(!q.options, `${q.id}: yozma javobda variant bo‘lmasin`);
    else {
      const ids = q.options?.map(o => o.id) || [];
      check(ids.length >= 2 && new Set(ids).size === ids.length && q.grading.acceptedAnswers.every(a => ids.includes(a)), `${q.id}: variant/javob ID noto‘g‘ri`);
    }
    if (q.section === "vocabulary" || q.section === "writing") check(q.type === "typed", `${q.id}: javob yozilishi kerak`);
    if (q.section === "reading") check(d.passages.some(p => p.id === q.passageId), `${q.id}: matn yo‘q`);
    else check(!q.passageId, `${q.id}: keraksiz matn havolasi`);
  }
  for (const [mi, code] of moduleCodes.entries()) {
    if (d.kind === "pk" && code !== d.moduleCode) continue;
    const moduleQ = qs.filter(q => q.moduleCode === code);
    const core = moduleQ.filter(q => q.section !== "vocabulary");
    const v = moduleQ.filter(q => q.section === "vocabulary");
    const counts = d.kind === "pk" ? [6, 6, 10, 6, 2, 0] : [2, 3, 4, mi < 2 ? 3 : 2, 1, 0];
    bloomLevels.forEach((b, i) => check(core.filter(q => q.bloom === b).length === counts[i], `${code}: ${b} taqsimoti noto‘g‘ri`));
    check(v.length === (d.kind === "pk" ? 20 : mi < 2 ? 12 : 13), `${code}: vocabulary soni noto‘g‘ri`);
    check(new Set(v.flatMap(q=>q.sourceRefs.filter(r=>r.lessonCode.startsWith(code)).map(r=>r.lessonCode))).size===8,`${code}: vocabulary barcha 8 darsni qamrasin`);
    check(v.filter(q => q.bloom === "remember").length === (d.kind === "pk" ? 10 : 6) && v.every(q => ["remember", "understand"].includes(q.bloom)), `${code}: vocabulary Bloom noto‘g‘ri`);
    if (d.kind === "pk") {
      check(core.every(q => q.section === "core"), "PK asosiy qism turi noto‘g‘ri");
      const coverage = Array.from({ length: 8 }, (_, i) => `${code}L0${i + 1}`).map(l => core.filter(q => q.sourceRefs[0].lessonCode === l).length).sort();
      check(coverage.join() === "3,3,4,4,4,4,4,4", "PK 8 darsga 4/4/4/4/4/4/3/3 taqsimlansin");
    } else {
      check(core.filter(q => q.section === "reading").length === 5 && core.filter(q => q.section === "writing").length === (mi === 3 ? 3 : 4) && core.filter(q => q.section === "grammar").length === (mi === 2 ? 3 : 4), `${code}: section taqsimoti noto‘g‘ri`);
    }
  }
  check(d.passages.length === (d.kind === "pk" ? 0 : 2), "Reading 2 ta matn bo‘lsin");
  for (const p of d.passages) {
    const items = qs.filter(q => q.passageId === p.id);
    check(items.length === 10 && items.filter(q => q.type === "single_choice").length === 4 && items.filter(q => q.type === "matching").length === 3 && items.filter(q => q.type === "typed").length === 3, `${p.id}: reading 4 MC + 3 matching + 3 completion`);
  }
  return errors;
}
