export type LessonKind = "learn" | "practice";
export type LessonSlot = { kind: LessonKind; seq: number; mechanic: string | null };
export const practiceMechanics = ["MC", "GAP", "TYPE", "MATCH", "ORDER", "READ-MC", "READ-TYPE", "REPLY", "SORT", "FIX", "FORM", "SCENE"] as const;

export function detectPracticeMechanic(source: string): typeof practiceMechanics[number] | null {
  const meta = /\bexport\s+const\s+meta\s*=\s*\{([^}]*)\}/.exec(source)?.[1];
  const declared = meta && /(?:["']?mechanic["']?)\s*:\s*["']([A-Z-]+)["']/.exec(meta)?.[1];
  const taskKind = /(?:["']?kind["']?)\s*:\s*["']([A-Z-]+)["']/.exec(source)?.[1];
  return declared && taskKind === declared && practiceMechanics.includes(declared as typeof practiceMechanics[number])
    ? declared as typeof practiceMechanics[number]
    : null;
}

export function parseLessonFilename(name: string): { code: string; kind: LessonKind; seq: number } | null {
  if (name === "INTRO.learn.jsx") return { code: "INTRO", kind: "learn", seq: 0 };
  const match = /^(M[1-4]L0[1-8])\.(learn|p(0[1-9]|10))\.jsx$/.exec(name);
  if (!match) return null;
  return match[2] === "learn"
    ? { code: match[1], kind: "learn", seq: 0 }
    : { code: match[1], kind: "practice", seq: Number(match[3]) };
}

export function validateUploadSelection(code: string, kind: LessonKind, names: string[]): string | null {
  if (!names.length || names.length > (kind === "learn" ? 1 : 10)) return kind === "learn" ? "Bitta Learn fayl tanlang" : "1–10 ta Practice fayl tanlang";
  if (kind === "practice" && code === "INTRO") return "Intro uchun Practice fayl yo‘q";
  const slots = names.map(parseLessonFilename);
  if (slots.some((slot) => !slot || slot.code !== code || slot.kind !== kind)) return "Fayl nomi, turi yoki dars kodi mos emas";
  if (new Set(slots.map((slot) => slot?.seq)).size !== slots.length) return "Bir xil Practice sloti ikki marta tanlangan";
  return null;
}

export function passThreshold(code: string): 60 | 70 | null {
  if (code === "INTRO") return null;
  return /^M[1-4]L08$/.test(code) ? 70 : 60;
}

export function publishReadiness(code: string, files: LessonSlot[]): string[] {
  const errors: string[] = [];
  if (!files.some((file) => file.kind === "learn" && file.seq === 0)) errors.push("Learn fayli yo‘q");
  if (code === "INTRO") return errors;

  const practices = files.filter((file) => file.kind === "practice");
  for (let seq = 1; seq <= 10; seq++) {
    if (!practices.some((file) => file.seq === seq)) errors.push(`p${String(seq).padStart(2, "0")} fayli yo‘q`);
  }
  const mechanics = practices.map((file) => file.mechanic?.toUpperCase() || "");
  if (mechanics.includes("")) errors.push("Practice mexanikasi belgilanmagan");
  if (mechanics.some((value) => value && !practiceMechanics.includes(value as typeof practiceMechanics[number]))) errors.push("Noma’lum yoki ovozli mexanika bor");
  if (new Set(mechanics.filter(Boolean)).size < 5) errors.push("Kamida 5 xil mexanika kerak");
  if (mechanics.filter((value) => value === "READ-MC" || value === "READ-TYPE").length < 2) errors.push("Kamida 2 ta o‘qib-tushunish topshirig‘i kerak");
  if (!mechanics.includes("FIX")) errors.push("Kamida 1 ta FIX kerak");
  if (practices.find((file) => file.seq === 10)?.mechanic?.toUpperCase() !== "SCENE") errors.push("p10 SCENE bo‘lishi kerak");
  return errors;
}

export function selectPublishFiles<T extends { kind: string; seq: number; version: number; status: string; isCurrent: boolean }>(files: T[]): T[] {
  const slots = new Map<string, T>();
  for (const file of files) {
    if (file.status !== "draft" && !file.isCurrent) continue;
    const key = `${file.kind}:${file.seq}`;
    const previous = slots.get(key);
    if (!previous || file.version > previous.version || (file.version === previous.version && file.isCurrent)) slots.set(key, file);
  }
  return [...slots.values()].sort((a, b) => a.seq - b.seq || a.kind.localeCompare(b.kind));
}
