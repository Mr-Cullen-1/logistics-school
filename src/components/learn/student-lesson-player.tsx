"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { LessonFrame } from "./lesson-frame";
import styles from "./student-lesson-player.module.css";

type LessonData = { files: { id: string; kind: string; seq: number; compiledJs: string }[]; progress: { learnDoneAt: string | null; practiceDoneAt: string | null } | null; attempts: { seq: number; correct: boolean }[] };

function PracticeLoading({ lang, saving }: { lang: "uz" | "ru" | "en"; saving: boolean }) {
  const copy = {
    uz: { title: "Practice yuklanmoqda", saving: "Learn natijasi saqlanmoqda. Mashqlar hozir ochiladi.", opening: "Birinchi mashq tayyorlanmoqda..." },
    ru: { title: "Загружается практика", saving: "Результат урока сохраняется. Задания скоро откроются.", opening: "Готовится первое задание..." },
    en: { title: "Loading practice", saving: "Saving your Learn result. Exercises will open shortly.", opening: "Preparing the first exercise..." },
  }[lang];

  return <section className={styles.practiceLoading} role="status" aria-live="polite">
    <div className={styles.loadingScene} aria-hidden="true">
      <div className={styles.loadingRing} />
      {[0, 1, 2].map((index) => <div className={`${styles.cargoOrbit} ${styles[`cargoOrbit${index}`]}`} key={index}><span className={styles.cargoBox} /></div>)}
      <svg className={styles.loadingTruck} viewBox="0 0 220 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="25" width="128" height="49" rx="8" fill="#c89b5f" stroke="#7d542c" strokeWidth="3" />
        <path d="M142 43h34l21 20v11h-55V43Z" fill="#e8d2ad" stroke="#7d542c" strokeWidth="3" strokeLinejoin="round" />
        <path d="M152 48h20l14 14h-34V48Z" fill="#30404a" />
        <path d="M26 38h80M26 47h60" stroke="#fff3db" strokeWidth="3" strokeLinecap="round" opacity=".75" />
        <path d="M12 75h188" stroke="#7d542c" strokeWidth="4" strokeLinecap="round" />
        <circle cx="49" cy="77" r="12" fill="#253039" stroke="#d8ae72" strokeWidth="4" />
        <circle cx="163" cy="77" r="12" fill="#253039" stroke="#d8ae72" strokeWidth="4" />
      </svg>
    </div>
    <strong>{copy.title}</strong>
    <p>{saving ? copy.saving : copy.opening}</p>
  </section>;
}

export function StudentLessonPlayer({ lessonId, title, code, lang, studentName, nextHref, exitHref }: { lessonId: string; title: string; code: string; lang: "uz" | "ru" | "en"; studentName: string; nextHref: string | null; exitHref: string }) {
  const [data, setData] = useState<LessonData | null>(null);
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [checkSignal, setCheckSignal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [practiceTransition, setPracticeTransition] = useState(false);
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
      if (result.progress?.practiceDoneAt || (code === "INTRO" && result.progress?.learnDoneAt)) { setReviewing(true); setStep(0); }
      else if (result.progress?.learnDoneAt) {
        const nextStep = Array.from({ length: 10 }, (_, i) => i + 1).find((seq) => !result.attempts.some((item) => item.seq === seq && item.correct)) || 11;
        if (nextStep === 1) setPracticeTransition(true);
        setStep(nextStep);
      }
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
    if (reviewing) { if (code !== "INTRO") setPracticeTransition(true); setStep(code === "INTRO" ? 11 : 1); setMessage(""); return; }
    if (code !== "INTRO") setPracticeTransition(true);
    const result = await record({ type: "learn", payload });
    if (!result) { setPracticeTransition(false); return; }
    if (result.passed) { setStep(code === "INTRO" ? 11 : 1); setMessage(""); }
    else { setPracticeTransition(false); setMessage("Rapid test natijasi yetarli emas. Learn darsini qayta bajaring."); }
  }

  async function submit(payload: unknown) {
    const value = payload && typeof payload === "object" ? payload as { correct?: boolean } : {};
    if (typeof value.correct !== "boolean") { setMessage("Topshiriq natijasi noto‘g‘ri"); return; }
    if (reviewing) { setCorrect(value.correct); setReady(false); setMessage(""); return; }
    const durationMs = Math.min(3_600_000, Math.max(0, Math.round(performance.now() - practiceStartedAt.current)));
    practiceStartedAt.current = performance.now();
    const result = await record({ type: "practice", seq: step, correct: value.correct, durationMs });
    if (!result) return;
    setCorrect(result.correct);
    setReady(false);
    setMessage("");
  }

  function next() {
    setStep(step === 10 ? 11 : step + 1);
    setCorrect(false);
    setReady(false);
    setCheckSignal(0);
    setMessage("");
  }

  const isIntro = code === "INTRO";
  const visibleTitle = isIntro ? title.replace(/^English for Logistics:\s*/i, "") : title;
  const file = data?.files.find((item) => item.kind === (step === 0 ? "learn" : "practice") && item.seq === step);

  return <div className={styles.player}>
    <nav className={`${styles.navigation} ${step === 11 ? styles.resultNavigation : ""}`} aria-label="Dars navigatsiyasi">
      <Link href={exitHref} className={styles.exit}>← {lang === "ru" ? "Выйти" : lang === "en" ? "Exit" : "Chiqish"}</Link>
      <strong className={styles.title} title={visibleTitle}>{visibleTitle}</strong>
      {message && data && step < 11 && <p role="alert" className={styles.navMessage}>{message}</p>}
      <span className={styles.stage}>{step === 11 ? (lang === "ru" ? "Итог" : lang === "en" ? "Result" : "Yakun") : step === 0 || isIntro ? "Learn" : `Practice ${step}/10`} <span aria-hidden="true">·</span> {isIntro ? (lang === "ru" ? "Вводный урок" : lang === "en" ? "Intro lesson" : "Kirish darsi") : code}</span>
    </nav>
    {!data ? <p className={styles.status} role="status">{message || "Dars yuklanmoqda..."}</p> : step === 11 ?
      <section className={styles.result} aria-labelledby="lesson-result-title">
        <div className={styles.resultMark} aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><path d="M13 33 26 46 52 18" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
        <p className={styles.resultLabel}>{isIntro ? "INTRO · 9/9" : "LESSON COMPLETE"}</p>
        <h1 id="lesson-result-title">Dars tugatildi</h1>
        <p className={styles.resultDescription}>Natijangiz saqlandi. {isIntro ? "Kirish darsining barcha 9 bosqichini ko‘rdingiz." : "Learn va Practice bosqichlarini yakunladingiz."}</p>
        {isIntro && <div className={styles.resultNote}><strong>INTRO YAKUNLANDI</strong><span>Learn → Practice → keyingi ochiq dars. Kurs darslariga kirish administrator bergan ruxsatga bog‘liq.</span></div>}
        {!nextHref && <div className={styles.lockNotice} role="note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M7 10V7a5 5 0 0 1 10 0v3" /><circle cx="12" cy="15.5" r="1" /></svg><span>Keyingi dars administrator ruxsat bergach ochiladi.</span></div>}
        <div className={styles.resultActions}>
          <button type="button" className={styles.secondaryAction} onClick={() => { setReviewing(true); setStep(0); setCorrect(false); setReady(false); setMessage(""); }}>Qayta ko‘rish</button>
          <Link href={exitHref} className={styles.resultExit}>Chiqish</Link>
          {nextHref ? <Link href={nextHref} className={styles.primaryAction}>{isIntro ? "Darslarni boshlash" : "Keyingi dars"} →</Link> : <button type="button" className={styles.primaryAction} disabled title="Administrator darsga ruxsat bergach ochiladi">{isIntro ? "Darslarni boshlash" : "Keyingi dars"} →</button>}
        </div>
      </section> : !file ? <p className={styles.status} role="alert">Dars fayli topilmadi. Administratorga xabar bering.</p> : <>
      <div className={styles.frameSlot}>
        <div className={practiceTransition ? styles.frameWaiting : styles.frameContent} aria-busy={practiceTransition} aria-hidden={practiceTransition}><LessonFrame key={`${file.id}-${reviewing}`} compiledJs={file.compiledJs} kind={step === 0 ? "learn" : "practice"} lang={lang} studentName={studentName} mode={reviewing ? "review" : undefined} fullScreen checkSignal={checkSignal} onReady={setReady} onSubmit={submit} onFinished={finish} onMounted={() => { if (step === 1) { practiceStartedAt.current = performance.now(); setPracticeTransition(false); } }} onError={() => { setPracticeTransition(false); if (step === 1) setMessage(lang === "ru" ? "Практика не открылась. Обновите страницу." : lang === "en" ? "Practice did not open. Reload the page." : "Practice ochilmadi. Sahifani yangilab ko‘ring."); }} /></div>
        {practiceTransition && <PracticeLoading lang={lang} saving={step === 0} />}
      </div>
      {step > 0 && !practiceTransition && <div className={styles.practiceActions}>{correct ? <button type="button" onClick={next}>Keyingisi →</button> : <button type="button" disabled={!ready || busy} onClick={() => setCheckSignal((count) => count + 1)}>Tekshirish →</button>}</div>}
    </>}
  </div>;
}
