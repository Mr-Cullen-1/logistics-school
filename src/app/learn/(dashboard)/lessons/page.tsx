import { asc, and, eq, isNull, ne, or } from "drizzle-orm";
import Link from "next/link";

import { LearnIcon } from "@/components/learn/learn-icon";
import { getDatabase } from "@/db";
import { courses, enrollments, lessons, modules, progress, studentProfiles } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import { activeCourseAccess } from "@/lib/courses/access";
import { getLearnText } from "@/lib/learn/translations";
import styles from "../../learn.module.css";

export default async function LessonsPage() {
  const user = await requireReadyUser();
  const db = getDatabase();
  const [[profile], rows] = await Promise.all([
    db.select({ locale: studentProfiles.locale }).from(studentProfiles).where(eq(studentProfiles.studentId, user.id)).limit(1),
    db.select({
      id: lessons.id,
      title: lessons.title,
      code: lessons.code,
      courseId: courses.id,
      courseTitle: courses.title,
      moduleTitle: modules.title,
      completedAt: progress.completedAt,
    }).from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .innerJoin(modules, eq(modules.courseId, courses.id))
      .innerJoin(lessons, eq(lessons.moduleId, modules.id))
      .leftJoin(progress, and(eq(progress.lessonId, lessons.id), eq(progress.studentId, user.id)))
      .where(and(activeCourseAccess(user.id), eq(lessons.status, "published"), or(isNull(lessons.code), ne(lessons.code, "INTRO"))))
      .orderBy(asc(courses.order), asc(modules.order), asc(lessons.code), asc(lessons.id)),
  ]);
  const locale = profile?.locale === "ru" || profile?.locale === "en" ? profile.locale : "uz";
  const t = getLearnText(locale);

  return <div className={styles.lessonsPage}>
    <div className={styles.lessonsHeading}><span>{t.nav.courses}</span><h1>{t.nav.lessons}</h1><p>{locale === "ru" ? "Опубликованные уроки из доступных вам курсов." : locale === "en" ? "Published lessons from courses available to you." : "Sizga ochilgan kurslardagi nashr etilgan darslar."}</p></div>
    {rows.length ? <div className={styles.availableLessons}>{rows.map((lesson, index) => <Link className={styles.availableLesson} href={`/learn/${lesson.courseId}/${lesson.id}`} key={lesson.id}>
      <span className={styles.availableLessonNumber}>{String(index + 1).padStart(2, "0")}</span>
      <span className={styles.availableLessonIcon}><LearnIcon name={lesson.completedAt ? "check" : "play"} size={20} /></span>
      <span className={styles.availableLessonText}><small>{lesson.courseTitle} · {lesson.moduleTitle}</small><strong>{lesson.title}</strong><small>{lesson.code}{lesson.completedAt ? ` · ${t.course.completedLabel}` : ""}</small></span>
      <span className={styles.availableLessonAction}>{lesson.completedAt ? t.course.introReview : t.course.introOpen} <LearnIcon name="arrow" size={17} /></span>
    </Link>)}</div> : <div className={styles.moduleEmptyCard}>{t.course.lessonsSoon}</div>}
  </div>;
}
