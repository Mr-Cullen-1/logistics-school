import { createHash } from "node:crypto";

import { transform } from "sucrase";

import { parseLessonFilename } from "./rules";

type ValidationResult = { ok: true; slot: NonNullable<ReturnType<typeof parseLessonFilename>>; compiledJs: string; sha256: string; sizeBytes: number } | { ok: false; error: string };

const forbidden: [RegExp, string][] = [
  [/\bfetch\s*\(/, "fetch"],
  [/\bXMLHttpRequest\b/, "XMLHttpRequest"],
  [/\bWebSocket\b/, "WebSocket"],
  [/\beval\s*\(/, "eval"],
  [/\bnew\s+Function\b|\bFunction\s*\(/, "Function"],
  [/\bimport\s*\(/, "dynamic import"],
  [/\b(?:localStorage|sessionStorage)\b/, "storage"],
  [/\bdocument\s*(?:\.\s*cookie|\[\s*['"]cookie['"]\s*\])/, "cookie"],
  [/\bwindow\s*(?:\.\s*(?:parent|top|open)|\[\s*['"](?:parent|top|open)['"]\s*\])/, "parent/top/open"],
  [/\b(?:globalThis|require)\b/, "globalThis/require"],
  [/\b(?:Audio|webkitAudioContext|AudioContext|speechSynthesis|HTMLAudioElement|HTMLMediaElement|MediaRecorder|mediaDevices)\b|<\s*(?:audio|video)\b/i, "audio/video"],
  [/\b(?:document\.createElement\s*\(\s*['"]script|createElement\s*\(\s*['"]script)/, "script"],
];

export function validateAndCompileLesson(name: string, source: string): ValidationResult {
  const slot = parseLessonFilename(name);
  if (!slot) return { ok: false, error: `${name}: fayl nomi noto‘g‘ri` };
  const sizeBytes = Buffer.byteLength(source, "utf8");
  const max = slot.kind === "learn" ? 1_500_000 : 300_000;
  if (sizeBytes > max) return { ok: false, error: `${name}: fayl hajmi ${max} baytdan oshmasin` };
  if (!/\bexport\s+(?:default\b|\{[^}]*\bdefault\b[^}]*\})/.test(source)) {
    return { ok: false, error: `${name}: default export kerak` };
  }
  for (const [pattern, label] of forbidden) {
    const match = pattern.exec(source);
    if (match) {
      const line = source.slice(0, match.index).split("\n").length;
      return { ok: false, error: `${name}:${line}: ${label} taqiqlangan` };
    }
  }
  try {
    const compiledJs = transform(source, { transforms: ["jsx", "imports"], filePath: name }).code;
    const allowed = slot.kind === "learn" ? new Set(["react", "react-dom", "@coliseum/kit"]) : new Set(["react", "@coliseum/kit"]);
    for (const match of compiledJs.matchAll(/\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) {
      if (!allowed.has(match[1])) return { ok: false, error: `${name}: ${match[1]} importiga ruxsat yo‘q` };
    }
    return { ok: true, slot, compiledJs, sha256: createHash("sha256").update(source).digest("hex"), sizeBytes };
  } catch (error) {
    const detail = error instanceof Error ? error.message.split("\n")[0] : "noma’lum xato";
    return { ok: false, error: `${name}: sintaksis xatosi: ${detail}` };
  }
}
