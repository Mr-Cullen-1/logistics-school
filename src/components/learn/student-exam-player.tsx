"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { getAttemptView } from "@/lib/exams/attempts";
import type { studentExams } from "@/lib/exams/queries";
import type { ExamAnswer, AttemptResult } from "@/lib/exams/types";
import { examText, type ExamLocale } from "@/lib/exams/translations";
import { ExamFrame } from "./exam-frame";
import { ExamResult } from "./exam-result";
import styles from "./student-exam-player.module.css";
type View=Awaited<ReturnType<typeof getAttemptView>>;
type Summary=Awaited<ReturnType<typeof studentExams>>[number];

export function StudentExamPlayer({summary,lang,initialAttempt}:{summary:Summary;lang:ExamLocale;initialAttempt?:string}) {
  const t=examText[lang];
  const router=useRouter();
  const [view,setView]=useState<View|null>(null),[result,setResult]=useState<AttemptResult|null>(summary.result),[busy,setBusy]=useState(false),[error,setError]=useState(""),[saving,setSaving]=useState(false),[frameKey,setFrameKey]=useState(0);
  const [canRetry,setCanRetry]=useState(summary.canStart||summary.canResume);
  const active=useRef<View|null>(null),latest=useRef<ExamAnswer[]>([]),pending=useRef(false),queue=useRef<Promise<void>|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),saveError=useRef(false);
  async function json(url:string,method="GET",body?:unknown){const r=await fetch(url,{method,cache:"no-store",...(body?{headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}:{})});const data=await r.json();if(!r.ok)throw new Error(data.error||"So‘rov bajarilmadi");return data;}
  const load=useCallback((v:View)=>{active.current=v;latest.current=v.answers;pending.current=false;saveError.current=false;setView(v);setResult(v.result);setError("");setFrameKey(k=>k+1);},[]);
  useEffect(()=>{
    if(!initialAttempt)return;
    let cancelled=false;
    fetch(`/api/learn/exam-attempts/${initialAttempt}`,{cache:"no-store"}).then(async r=>{const v=await r.json();if(!r.ok)throw new Error(v.error);if(v.examId!==summary.id)throw new Error("Urinish mos emas");if(!cancelled)load(v);}).catch(e=>{if(!cancelled)setError(e.message);});
    return()=>{cancelled=true;};
  },[initialAttempt,summary.id,load]);
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  useEffect(()=>{
    const warn=(event:BeforeUnloadEvent)=>{if(pending.current||queue.current){event.preventDefault();event.returnValue="";}};
    window.addEventListener("beforeunload",warn);
    return()=>window.removeEventListener("beforeunload",warn);
  },[]);
  async function start(){setBusy(true);setError("");try{const v=await json(`/api/learn/exams/${summary.id}/attempts`,"POST");load(v);window.history.replaceState(null,"",`?attempt=${v.id}`);}catch(e){setError(e instanceof Error?e.message:"Xato");}finally{setBusy(false);}}
  function flush():Promise<void>{
    if(queue.current)return queue.current;
    queue.current=(async()=>{
      while(pending.current&&active.current&&!saveError.current){
        pending.current=false;setSaving(true);
        const v=active.current,snapshot=latest.current;
        try{const updated=await json(`/api/learn/exam-attempts/${v.id}/answers`,"PUT",{revision:v.answerRevision,answers:snapshot});active.current={...v,answerRevision:updated.answerRevision};}
        catch(e){saveError.current=true;pending.current=true;setError(e instanceof Error?e.message:"Saqlanmadi");}
      }
    })().finally(()=>{queue.current=null;setSaving(false);});
    return queue.current;
  }
  function change(answers:ExamAnswer[]){latest.current=answers;pending.current=true;setSaving(true);if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>void flush(),500);}
  async function finish(answers:ExamAnswer[]){
    latest.current=answers;pending.current=true;if(timer.current)clearTimeout(timer.current);setBusy(true);setError("");
    try{
      await flush();if(saveError.current)throw new Error(t.reload);
      const v=active.current;if(!v)return;
      const r=await json(`/api/learn/exam-attempts/${v.id}/submit`,"POST",{revision:v.answerRevision,answers:latest.current});
      setResult(r);setCanRetry(r.nextAction==="retry");setView(null);active.current=null;
    }catch(e){setError(e instanceof Error?e.message:"Yuborilmadi");setFrameKey(k=>k+1);setView(v=>v?{...v,answers:latest.current}:v);}
    finally{setBusy(false);}
  }
  async function reload(){if(!active.current)return;setBusy(true);try{await queue.current;load(await json(`/api/learn/exam-attempts/${active.current.id}`));}catch(e){setError(e instanceof Error?e.message:"Xato");}finally{setBusy(false);}}
  return <div className={styles.page}><Link href={`/learn/${summary.courseId}`} onClick={e=>{if(pending.current||queue.current){e.preventDefault();void flush().then(()=>{if(!saveError.current)router.push(`/learn/${summary.courseId}`);});}}}>{t.back}</Link>{error&&<div className={styles.error} role="alert">{error}{view&&<button className={`${styles.button} ${styles.secondary}`} disabled={busy} onClick={reload}>{t.reload}</button>}</div>}
    {result&&!view?.exam?<ExamResult result={result} courseId={summary.courseId} lang={lang} onRetry={start} canRetry={canRetry} busy={busy}/>:view?.exam?<><p className={styles.saved} role="status">{saving?t.saving:t.saved}</p><ExamFrame key={`${view.id}:${frameKey}`} exam={view.exam} answers={view.answers} lang={lang} onChange={change} onSubmit={finish} onError={setError}/></>:<section className={styles.card}><h1>{summary.title}</h1><p>{summary.kind==="pk"?t.pkRule:t.ikRule}</p><div className={styles.meta}><span>{t.threshold}: {summary.passPercent}%</span><span>{t.remaining}: {summary.remaining}</span></div><p>{t.state[summary.state]}</p><button className={styles.button} disabled={busy||(!summary.canStart&&!summary.canResume)} onClick={start}>{summary.canResume?t.resume:t.start}</button></section>}
  </div>;
}
