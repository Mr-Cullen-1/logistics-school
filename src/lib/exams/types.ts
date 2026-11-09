export const moduleCodes = ["M1", "M2", "M3", "M4"] as const;
export const bloomLevels = ["remember", "understand", "apply", "analyze", "evaluate", "create"] as const;
export type ModuleCode = typeof moduleCodes[number];
export type ExamKind = "pk" | "ik";
export type ExamQuestion = {
  id: string; moduleCode: ModuleCode; section: "core" | "reading" | "writing" | "grammar" | "vocabulary";
  bloom: typeof bloomLevels[number]; difficulty: "easy" | "medium" | "hard";
  type: "single_choice" | "matching" | "typed"; prompt: string; passageId?: string; lemma?: string;
  options?: { id: string; text: string }[];
  sourceRefs: { lessonCode: string; slot: string; sha256: string; reference: string }[];
  grading: { acceptedAnswers: string[]; caseSensitive: boolean; maxWords?: number; explanation?: string };
};
export type ExamDefinition = { schemaVersion: 1; kind: ExamKind; moduleCode?: ModuleCode; title: string; passages: { id: string; title: string; text: string }[]; questions: ExamQuestion[] };
export type PublicQuestion = Pick<ExamQuestion, "id" | "section" | "type" | "prompt" | "passageId" | "options"> & { maxWords?: number };
export type PublicExam = { title: string; kind: ExamKind; passages: ExamDefinition["passages"]; questions: PublicQuestion[] };
export type ExamAnswer = { questionId: string; value: string };
export type ModuleResult = { moduleCode: ModuleCode; correct: number; wrong: number; total: number };
export type AttemptResult = { correct: number; total: number; percent: number; passPercent: number; passed: boolean; modules: ModuleResult[]; weakModules: ModuleCode[]; nextAction?: "retry" | "restart_course" | "awaiting_admin" | "continue" | "completed" };
