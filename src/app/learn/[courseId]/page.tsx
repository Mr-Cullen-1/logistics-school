import { asc, and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { getDatabase } from "@/db";
import { courses, enrollments, modules } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import { activeCourseAccess } from "@/lib/courses/access";
import styles from "../learn.module.css";

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const user = await requireReadyUser();
  if (user.role !== "student") redirect("/admin");
  const { courseId } = await params;
  if (!z.uuid().safeParse(courseId).success) notFound();
  const [course] = await getDatabase().select({
    id: courses.id,
    title: courses.title,
    description: courses.description,
    level: courses.level,
  }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(and(activeCourseAccess(user.id), eq(courses.id, courseId))).limit(1);
  if (!course) notFound();
  const sections = await getDatabase().select({ id: modules.id, title: modules.title }).from(modules).where(eq(modules.courseId, courseId)).orderBy(asc(modules.order), asc(modules.id));

  return (
    <div className={styles.courseDetail}>
      <Link href="/learn#my-courses" className={styles.backLink}>← Mening kurslarim</Link>
      <div className={styles.courseDetailHero}><small>{course.level || "Ingliz tili"}</small><h1>{course.title}</h1><p>{course.description || "Kurs modullari bilan tanishing."}</p></div>
      <h2 className={styles.moduleHeading}>Modullar</h2>
      {sections.length ? <div className={styles.moduleList}>{sections.map((section, index) => <section className={styles.moduleCard} key={section.id}><span className={styles.moduleNumber}>{index + 1}</span><div><h3>{section.title}</h3><p>Darslar keyingi bosqichda qo‘shiladi.</p></div></section>)}</div> : <div className={styles.moduleCard}><p>Modullar hali qo‘shilmagan. Kurs mazmuni tayyorlanmoqda.</p></div>}
    </div>
  );
}
