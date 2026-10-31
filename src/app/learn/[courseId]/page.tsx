import { asc, and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { getDatabase } from "@/db";
import { courses, enrollments, modules, studentProfiles } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import { activeCourseAccess } from "@/lib/courses/access";
import { getLearnText } from "@/lib/learn/translations";
import styles from "../learn.module.css";

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const user = await requireReadyUser();
  if (user.role !== "student") redirect("/admin");
  const { courseId } = await params;
  if (!z.uuid().safeParse(courseId).success) notFound();
  const [[course], [profile]] = await Promise.all([getDatabase().select({
    id: courses.id,
    title: courses.title,
    description: courses.description,
    level: courses.level,
  }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(and(activeCourseAccess(user.id), eq(courses.id, courseId))).limit(1),
  getDatabase().select({ locale: studentProfiles.locale }).from(studentProfiles).where(eq(studentProfiles.studentId, user.id)).limit(1)]);
  if (!course) notFound();
  const t = getLearnText(profile?.locale).course;
  const sections = await getDatabase().select({ id: modules.id, title: modules.title }).from(modules).where(eq(modules.courseId, courseId)).orderBy(asc(modules.order), asc(modules.id));

  return (
    <div className={styles.courseDetail}>
      <Link href="/learn#my-courses" className={styles.backLink}>← {t.back}</Link>
      <div className={styles.courseDetailHero}><small>{course.level || t.defaultLevel}</small><h1>{course.title}</h1><p>{course.description || t.defaultDescription}</p></div>
      <h2 className={styles.moduleHeading}>{t.modules}</h2>
      {sections.length ? <div className={styles.moduleList}>{sections.map((section, index) => <section className={styles.moduleCard} key={section.id}><span className={styles.moduleNumber}>{index + 1}</span><div><h3>{section.title}</h3><p>{t.lessonsSoon}</p></div></section>)}</div> : <div className={styles.moduleCard}><p>{t.noModules}</p></div>}
    </div>
  );
}
