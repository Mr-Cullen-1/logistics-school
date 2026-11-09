import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDatabase } from "@/db";
import { studentProfiles } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import { studentExams } from "@/lib/exams/queries";
import { StudentExamPlayer } from "@/components/learn/student-exam-player";
export default async function ExamPage({params,searchParams}:{params:Promise<{examId:string}>;searchParams:Promise<{attempt?:string}>}){
  const user=await requireReadyUser();if(user.role!=="student")redirect("/admin");
  const {examId}=await params;if(!z.uuid().safeParse(examId).success)notFound();
  const exam=(await studentExams(user.id)).find(e=>e.id===examId);if(!exam)notFound();
  const [profile]=await getDatabase().select().from(studentProfiles).where(eq(studentProfiles.studentId,user.id));
  const lang=profile?.locale==="ru"||profile?.locale==="en"?profile.locale:"uz";
  const {attempt}=await searchParams;
  return <StudentExamPlayer summary={exam} lang={lang} initialAttempt={z.uuid().safeParse(attempt).success?attempt:undefined}/>;
}
