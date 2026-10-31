import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { StudentLessonPlayer } from "@/components/learn/student-lesson-player";
import { getDatabase } from "@/db";
import { studentProfiles } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import { accessibleLesson } from "@/lib/lessons/access";
import styles from "../../learn.module.css";

export default async function StudentLessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const user = await requireReadyUser();
  if (user.role !== "student") redirect("/admin");
  const { courseId, lessonId } = await params;
  if (!z.uuid().safeParse(courseId).success || !z.uuid().safeParse(lessonId).success) notFound();
  const lesson = await accessibleLesson(user.id, lessonId);
  if (!lesson || lesson.courseId !== courseId) notFound();
  const [profile] = await getDatabase().select({ locale: studentProfiles.locale }).from(studentProfiles).where(eq(studentProfiles.studentId, user.id)).limit(1);
  const locale = profile?.locale === "ru" || profile?.locale === "en" ? profile.locale : "uz";
  return <div className={styles.courseDetail}><Link href={`/learn/${courseId}`} className={styles.backLink}>← {lesson.courseTitle}</Link><h1 className="mb-5 text-2xl font-bold">{lesson.title}</h1><StudentLessonPlayer lessonId={lessonId} code={lesson.code} lang={locale} studentName={user.fullName} /></div>;
}
