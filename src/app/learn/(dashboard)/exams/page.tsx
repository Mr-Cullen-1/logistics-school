import Link from "next/link";
import { eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { studentProfiles } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import { studentExams } from "@/lib/exams/queries";
import { examText } from "@/lib/exams/translations";
import styles from "@/components/learn/student-exam-player.module.css";
export default async function ExamsPage(){
  const user=await requireReadyUser();
  const [profile]=await getDatabase().select().from(studentProfiles).where(eq(studentProfiles.studentId,user.id));
  const lang=profile?.locale==="ru"||profile?.locale==="en"?profile.locale:"uz",t=examText[lang];
  const rows=await studentExams(user.id);
  return <div className={styles.page}><h1>{t.title}</h1>{!rows.length&&<p>{t.noExams}</p>}<div className={styles.grid}>{rows.map(e=><section className={styles.card} key={e.id}><span className={styles.badge}>{e.kind.toUpperCase()}</span><h2>{e.title}</h2><p className={styles.muted}>{e.courseTitle}</p><p>{t.state[e.state]}</p><p>{t.threshold}: {e.passPercent}% · {t.remaining}: {e.remaining}</p><Link className={styles.button} href={`/learn/exams/${e.id}${e.attemptId?`?attempt=${e.attemptId}`:""}`}>{e.canResume?t.resume:e.result?`${e.result.percent}%`:t.title}</Link></section>)}</div></div>;
}
