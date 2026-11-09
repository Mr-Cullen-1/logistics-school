import Link from "next/link";
import type { AttemptResult } from "@/lib/exams/types";
import { examText, type ExamLocale } from "@/lib/exams/translations";
import styles from "./student-exam-player.module.css";
export function ExamResult({result,courseId,lang,onRetry,canRetry=false,busy=false}:{result:AttemptResult;courseId:string;lang:ExamLocale;onRetry?:()=>void;canRetry?:boolean;busy?:boolean}) {
  const t=examText[lang];
  return <section className={styles.card} aria-live="polite"><h1>{result.passed?t.passed:t.failed}</h1><div className={styles.score}>{result.percent}%</div><p>{result.correct}/{result.total} · {t.threshold}: {result.passPercent}%</p>
    {result.nextAction==="restart_course"&&<p>{t.restart}</p>}{result.nextAction==="awaiting_admin"&&!canRetry&&<p>{t.awaiting}</p>}
    {!result.passed&&result.total===100&&<><h2>{t.weak}</h2><ul>{result.weakModules.map(code=>{const m=result.modules.find(m=>m.moduleCode===code)!;return <li key={code}><Link href={`/learn/${courseId}#${code}`}>{code}</Link> — {m.wrong}/{m.total}</li>;})}</ul></>}
    <div className={styles.actions}>{canRetry&&onRetry&&<button className={styles.button} disabled={busy} onClick={onRetry}>{t.retry}</button>}<Link className={`${styles.button} ${styles.secondary}`} href={`/learn/${courseId}`}>{t.back}</Link></div>
  </section>;
}
