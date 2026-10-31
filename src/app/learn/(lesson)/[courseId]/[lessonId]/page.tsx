import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { StudentLessonPlayer } from "@/components/learn/student-lesson-player";
import { getDatabase } from "@/db";
import { studentProfiles } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import { accessibleLesson, nextAccessibleLesson } from "@/lib/lessons/access";
import styles from "./lesson.module.css";

export default async function StudentLessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const user = await requireReadyUser();
  if (user.role !== "student") redirect("/admin");
  const { courseId, lessonId } = await params;
  if (!z.uuid().safeParse(courseId).success || !z.uuid().safeParse(lessonId).success) notFound();
  const lesson = await accessibleLesson(user.id, lessonId);
  if (!lesson || lesson.courseId !== courseId) notFound();
  const [[profile], nextHref] = await Promise.all([
    getDatabase().select({ locale: studentProfiles.locale }).from(studentProfiles).where(eq(studentProfiles.studentId, user.id)).limit(1),
    nextAccessibleLesson(user.id, lesson),
  ]);
  const locale = profile?.locale === "ru" || profile?.locale === "en" ? profile.locale : "uz";
  const exitHref = lesson.code === "INTRO" ? "/learn" : `/learn/${courseId}`;
  return <main className={styles.page}>
    <StudentLessonPlayer lessonId={lessonId} title={lesson.title} code={lesson.code} lang={locale} studentName={user.fullName} nextHref={nextHref} exitHref={exitHref} />
  </main>;
}
