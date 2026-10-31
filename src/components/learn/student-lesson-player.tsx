"use client";

import { useEffect, useRef, useState } from "react";

import { LessonFrame } from "./lesson-frame";

type LessonData = { files: { id: string; kind: string; seq: number; compiledJs: string }[]; progress: { learnDoneAt: string | null; practiceDoneAt: string | null } | null; attempts: { seq: number; correct: boolean }[] };

export function StudentLessonPlayer({ lessonId, code, lang, studentName }: { lessonId: string; code: string; lang: "uz" | "ru" | "en"; studentName: string }) {
  const [data, setData] = useState<LessonData | null>(null);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [checkSignal, setCheckSignal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const practiceStartedAt = useRef(0);

  useEffect(() => { practiceStartedAt.current = performance.now(); }, [step]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/learn/lessons/${lessonId}`, { cache: "no-store" }).then(async (response) => {
      if (!response.ok) throw new Error("Dars ochilmadi");
      return response.json() as Promise<LessonData>;
    }).then((result) => {
      if (cancelled) return;
      setData(result);
      if (result.progress?.practiceDoneAt) setStep(11);
      else if (result.progress?.learnDoneAt) setStep(code === "INTRO" ? 11 : Array.from({ length: 10 }, (_, i) => i + 1).find((seq) => !result.attempts.some((item) => item.seq === seq && item.correct)) || 11);
    }).catch(() => { if (!cancelled) setMessage("Darsni yuklab bo‘lmadi"); });
    return () => { cancelled = true; };
  }, [lessonId, code]);

  async function record(body: object) {
    setBusy(true);
    try {
      const response = await fetch(`/api/learn/lessons/${lessonId}/progress`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Natija saqlanmadi");
      return result;
    } catch (error) { setMessage(error instanceof Error ? error.message : "Natija saqlanmadi"); return null; }
    finally { setBusy(false); }
  }

  async function finish(payload: unknown) {
    const result = await record({ type: "learn", payload });
    if (!result) return;
    if (result.passed) { setStep(code === "INTRO" ? 11 : 1); setMessage(""); }
    else setMessage("Rapid test natijasi yetarli emas. Learn darsini qayta bajaring.");
  }

  async function submit(payload: unknown) {
    const value = payload && typeof payload === "object" ? payload as { correct?: boolean } : {};
    if (typeof value.correct !== "boolean") { setMessage("Topshiriq natijasi noto‘g‘ri"); return; }
    const durationMs = Math.min(3_600_000, Math.max(0, Math.round(performance.now() - practiceStartedAt.current)));
    practiceStartedAt.current = performance.now();
    const result = await record({ type: "practice", seq: step, correct: value.correct, durationMs });
    if (!result) return;
    setCorrect(result.correct);
    setReady(false);
    setMessage(result.correct ? "To‘g‘ri! Keyingisiga o‘ting." : "Yana urinib ko‘ring.");
  }

  function next() {
    setStep(step === 10 ? 11 : step + 1);
    setCorrect(false);
    setReady(false);
    setCheckSignal(0);
    setMessage("");
  }

  if (!data) return <p role="status">{message || "Dars yuklanmoqda..."}</p>;
  if (step === 11) return <div className="rounded-xl border border-gold/30 bg-white p-8 text-center"><h2 className="text-xl font-bold">Dars tugatildi</h2><p className="mt-2 text-steel">Natijangiz saqlandi.</p></div>;
  const file = data.files.find((item) => item.kind === (step === 0 ? "learn" : "practice") && item.seq === step);
  if (!file) return <p role="alert">Dars fayli topilmadi. Administratorga xabar bering.</p>;
  return <div className="space-y-4"><div className="flex items-center justify-between text-sm"><strong>{step === 0 ? "Learn" : `Practice ${step}/10`}</strong><span>{code}</span></div>
    <LessonFrame key={file.id} compiledJs={file.compiledJs} kind={step === 0 ? "learn" : "practice"} lang={lang} studentName={studentName} checkSignal={checkSignal} onReady={setReady} onSubmit={submit} onFinished={finish} />
    {step > 0 && <div className="flex justify-end">{correct ? <button className="rounded-lg bg-gold px-6 py-3 font-semibold text-black" onClick={next}>Keyingisi →</button> : <button className="rounded-lg bg-gold px-6 py-3 font-semibold text-black disabled:opacity-50" disabled={!ready || busy} onClick={() => setCheckSignal((count) => count + 1)}>Tekshirish</button>}</div>}
    {message && <p role="status" className="text-sm">{message}</p>}
  </div>;
}
