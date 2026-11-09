"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExamFrame } from "@/components/learn/exam-frame";
import type { courseExamAdmin } from "@/lib/exams/admin";
import type { ExamDefinition, PublicExam } from "@/lib/exams/types";
import styles from "@/components/learn/student-exam-player.module.css";

export async function examAdminFetch(url:string,body:unknown,method="POST") {
  const response=await fetch(url,{method,headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const data=await response.json();if(!response.ok)throw new Error(data.error||"So‘rov bajarilmadi");return data;
}
type ExamRow=Awaited<ReturnType<typeof courseExamAdmin>>[number];
export function ExamManager({courseId,policy,modules,exams}:{courseId:string;policy:string;modules:{id:string;title:string}[];exams:ExamRow[]}) {
  const router=useRouter();
  const [error,setError]=useState(""),[busy,setBusy]=useState(false),[target,setTarget]=useState("ik"),[threshold,setThreshold]=useState(80);
  async function run(action:()=>Promise<unknown>){setError("");setBusy(true);try{await action();router.refresh();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
  return <section className={styles.page} aria-label="PK va IK boshqaruvi"><h2>PK / IK imtihonlari</h2><p>Holat: <strong>{policy}</strong>. Faollashtirish uchun 4 PK va 1 IK tekshirilib nashr qilingan bo‘lishi kerak.</p>
    {error&&<p role="alert" className={styles.error}>{error}</p>}
    {policy==="disabled"&&<form className={styles.card} onSubmit={e=>{e.preventDefault();void run(()=>examAdminFetch(`/api/admin/courses/${courseId}/exams`,{kind:target==="ik"?"ik":"pk",...(target!=="ik"?{moduleId:target}:{}),title:target==="ik"?"IK — Final exam":`PK — ${modules.find(m=>m.id===target)?.title}`,passPercent:threshold}));}}>
      <label>Imtihon<select value={target} onChange={e=>setTarget(e.target.value)}><option value="ik">IK — Final exam</option>{modules.map(m=><option key={m.id} value={m.id}>PK — {m.title}</option>)}</select></label>
      <label>O‘tish chegarasi (%)<input type="number" min={1} max={100} required value={threshold} onChange={e=>setThreshold(Number(e.target.value))}/></label><button className={styles.button} disabled={busy}>Imtihon yaratish</button>
    </form>}
    <div className={styles.actions}><button className={styles.button} disabled={busy||policy==="enabled"} onClick={()=>void run(()=>examAdminFetch(`/api/admin/courses/${courseId}/exam-policy`,{policy:"enabled"},"PATCH"))}>{policy==="paused"?"Davom ettirish":"Imtihonlarni faollashtirish"}</button>{policy==="enabled"&&<button className={styles.button} disabled={busy} onClick={()=>void run(()=>examAdminFetch(`/api/admin/courses/${courseId}/exam-policy`,{policy:"paused"},"PATCH"))}>Yangi urinishlarni to‘xtatish</button>}</div>
    {exams.map(exam=><ExamEditor key={exam.id} exam={exam}/>)}
  </section>;
}
function ExamEditor({exam}:{exam:ExamRow}) {
  const router=useRouter();const [error,setError]=useState(""),[busy,setBusy]=useState(false),[file,setFile]=useState<File|null>(null),[threshold,setThreshold]=useState(exam.passPercent);
  const [preview,setPreview]=useState<{versionId:string;sha256:string;definition:ExamDefinition;exam:PublicExam}|null>(null),[checked,setChecked]=useState(false),[previewDone,setPreviewDone]=useState(false);
  async function run(action:()=>Promise<unknown>){setError("");setBusy(true);try{await action();router.refresh();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
  async function open(versionId:string){const response=await fetch(`/api/admin/exams/${exam.id}/versions/${versionId}`,{cache:"no-store"});const data=await response.json();if(!response.ok)throw new Error(data.error);setPreview({...data,versionId});setChecked(false);setPreviewDone(false);}
  return <article className={styles.card}><h3>{exam.title}</h3><p>Joriy versiya: {exam.currentVersion??"—"} · O‘tish: {exam.passPercent}%</p>
    {error&&<p role="alert" className={styles.error}>{error}</p>}
    <form onSubmit={e=>{e.preventDefault();if(file)void run(async()=>{await examAdminFetch(`/api/admin/exams/${exam.id}/files`,{filename:file.name,source:await file.text(),passPercent:threshold});});}}>
      <label>JSX fayl<input type="file" accept=".jsx" required onChange={e=>setFile(e.target.files?.[0]||null)}/></label><label>Yangi versiya uchun o‘tish chegarasi (%)<input type="number" required min={1} max={100} value={threshold} onChange={e=>setThreshold(Number(e.target.value))}/></label><button className={styles.button} disabled={busy||!file}>Draft yuklash</button>
    </form>
    <div className={styles.scroll}><table className={styles.table}><thead><tr><th>Versiya</th><th>Holat</th><th>Chegara</th><th>Amal</th></tr></thead><tbody>{exam.versions.map(v=><tr key={v.id}><td>v{v.version}</td><td>{v.status} {v.reviewedAt?"· Tekshirilgan":""}</td><td>{v.passPercent}%</td><td><button className={styles.button} disabled={busy} onClick={()=>void run(()=>open(v.id))}>Ko‘rib chiqish</button>{v.status==="draft"&&v.reviewedAt&&<button className={styles.button} disabled={busy} onClick={()=>void run(()=>examAdminFetch(`/api/admin/exams/${exam.id}/publish`,{versionId:v.id}))}>Nashr qilish</button>}</td></tr>)}</tbody></table></div>
    {preview&&<div><h4>O‘quvchi ko‘rinishi</h4><ExamFrame key={preview.versionId} exam={preview.exam} answers={[]} lang="uz" onChange={()=>{}} onSubmit={()=>setPreviewDone(true)} onError={setError}/><p>{previewDone?"Preview yakunlandi.":"Previewda savollarni ko‘rib, yakunlash tugmasini sinang."}</p>
      <details><summary>Metodik tekshiruv: javoblar, Bloom va manbalar</summary>{preview.definition.questions.map(q=><div className={styles.review} key={q.id}><strong>{q.id} · {q.moduleCode} · {q.bloom}</strong><p>{q.prompt}</p><p>Javob: {q.grading.acceptedAnswers.join(" / ")}</p>{q.grading.explanation&&<p>{q.grading.explanation}</p>}<small>{q.sourceRefs.map(r=>`${r.lessonCode}/${r.slot}: ${r.reference}`).join("; ")}</small></div>)}</details>
      <label><input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)}/>Savollar, javoblar, Bloom va kurs manbalariga moslikni tekshirdim.</label><button className={styles.button} disabled={busy||!checked||!previewDone} onClick={()=>void run(()=>examAdminFetch(`/api/admin/exams/${exam.id}/versions/${preview.versionId}/verify`,{sha256:preview.sha256,reviewed:true}))}>Preview OK</button><button className={styles.button} onClick={()=>setPreview(null)}>Yopish</button>
    </div>}
  </article>;
}
