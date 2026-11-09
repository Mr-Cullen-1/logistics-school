export function normalizeExamAnswer(value: string, caseSensitive = false): string {
  const normalized = value.normalize("NFC").trim().replace(/[‘’ʼ]/g, "'").replace(/\s+/g, " ");
  return caseSensitive ? normalized : normalized.toLowerCase();
}
