"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { adminStudentExams } from "@/lib/exams/queries";
import { examAdminFetch } from "./exam-manager";
import styles from "@/components/learn/student-exam-player.module.css";

export function StudentExams({studentId,attempts}:{studentId:string;attempts:Awaited<ReturnType<typeof adminStudentExams>>}) {
  const router=useRouter();const [reason,setReason]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false);
  // Keep the request id across network retries; a successful request rotates it.
  const [requestId,setRequestId]=useState<string|null>(null);
  async function act(url:string,grant:boolean){const key=requestId||crypto.randomUUID();setRequestId(key);setBusy(true);setError("");try{await examAdminFetch(url,{reason,...(grant?{requestId:key}:{})});setRequestId(null);router.refresh();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
  return <section className={styles.page}><h2>PK / IK natijalari</h2>{error&&<p role="alert" className={styles.error}>{error}</p>}<div className={styles.card}><label>Admin amali sababi<input value={reason} onChange={e=>setReason(e.target.value)} minLength={5} maxLength={1000}/></label><div className={styles.scroll}><table className={styles.table}><thead><tr><th>Imtihon</th><th>Sikl / urinish</th><th>Natija</th><th>Amal</th></tr></thead><tbody>{attempts.map(a=><tr key={a.id}><td>{a.courseTitle}<br/>{a.title}</td><td>{a.cycle} / {a.attemptNo}</td><td>{a.result?`${a.result.percent}% · ${a.result.passed?"O‘tdi":"O‘tmadi"}`:a.status}{a.result&&<small> / chegara {a.result.passPercent}% {a.result.weakModules.join(", ")}</small>}</td><td>{a.canGrant&&<button className={styles.button} disabled={busy||reason.trim().length<5} onClick={()=>void act(`/api/admin/students/${studentId}/exams/${a.examId}/retry`,true)}>+1 urinish berish</button>}{a.status==="in_progress"&&<button className={styles.button} disabled={busy||reason.trim().length<5} onClick={()=>void act(`/api/admin/exam-attempts/${a.id}/void`,false)}>Texnik nosoz urinishni bekor qilish</button>}</td></tr>)}</tbody></table></div></div></section>;
}
