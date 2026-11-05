import { passThreshold } from "./rules";

export function learnPassed(code: string, payload: { scorePercent?: number; passed?: boolean }): boolean {
  const threshold = passThreshold(code);
  if (threshold === null) return true;
  return typeof payload.scorePercent === "number" && payload.scorePercent >= threshold;
}

export function canRecordPractice(seq: number, learnDone: boolean, correctSequences: number[]): boolean {
  if (!learnDone || !Number.isInteger(seq) || seq < 1 || seq > 10) return false;
  return Array.from({ length: seq - 1 }, (_, index) => index + 1).every(previous => correctSequences.includes(previous));
}
