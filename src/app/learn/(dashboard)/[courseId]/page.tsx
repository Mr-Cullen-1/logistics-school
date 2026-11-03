import { asc, and, eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { getDatabase } from "@/db";
import { courses, enrollments, lessons, modules, progress, studentProfiles } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import { activeCourseAccess } from "@/lib/courses/access";
import { getLearnText } from "@/lib/learn/translations";
import { LearnIcon } from "@/components/learn/learn-icon";
import styles from "../../learn.module.css";

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
  const lessonRows = sections.length ? await getDatabase().select({ id: lessons.id, moduleId: lessons.moduleId, title: lessons.title, code: lessons.code, completedAt: progress.completedAt }).from(lessons).leftJoin(progress, and(eq(progress.lessonId, lessons.id), eq(progress.studentId, user.id))).where(and(inArray(lessons.moduleId, sections.map((section) => section.id)), eq(lessons.status, "published"))).orderBy(asc(lessons.order), asc(lessons.title)) : [];
  const intro = lessonRows.find((lesson) => lesson.code === "INTRO");
  const moduleLessons = lessonRows.filter((lesson) => lesson.code !== "INTRO");

  return (
    <div className={styles.courseDetail}>
      <Link href="/learn#my-courses" className={styles.backLink}>← {t.back}</Link>
      <div className={styles.courseDetailHero}><small>{course.level || t.defaultLevel}</small><h1>{course.title}</h1><p>{course.description || t.defaultDescription}</p></div>
      {intro && <section className={styles.introSection} aria-labelledby="intro-heading">
        <h2 id="intro-heading" className={styles.moduleHeading}>{t.introHeading}</h2>
        <div className={styles.introCard}>
          <div><span className={styles.introEyebrow}>INTRO</span><h3>{intro.title}</h3><p>{t.introHelp}</p></div>
          <Link className={styles.introButton} href={`/learn/${courseId}/${intro.id}`}>{intro.completedAt ? t.introReview : t.introOpen} <span aria-hidden="true">→</span></Link>
        </div>
      </section>}
      <h2 className={styles.moduleHeading}>{t.modules}</h2>
      {sections.length ? <div className={styles.moduleList}>{sections.map((section, index) => {
        const sectionLessons = moduleLessons.filter((lesson) => lesson.moduleId === section.id);
        const completed = sectionLessons.filter((lesson) => lesson.completedAt).length;
        return <details className={styles.moduleCard} key={section.id} open={index === 0}>
          <summary className={styles.moduleSummary}>
            <span className={styles.moduleNumber}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.moduleIdentity}><span className={styles.moduleKicker}>{t.modules} / {String(index + 1).padStart(2, "0")}</span><strong>{section.title}</strong></span>
            <span className={styles.moduleMeta}>{t.lessonsLabel} · {sectionLessons.length}{completed > 0 ? ` / ${t.completedLabel} · ${completed}` : ""}</span>
            <span className={styles.moduleChevron} aria-hidden="true" />
          </summary>
          <div className={styles.moduleBody}>
            {sectionLessons.length ? <ol className={styles.lessonList}>{sectionLessons.map((lesson, lessonIndex) => <li key={lesson.id}>
              <Link className={styles.lessonRow} href={`/learn/${courseId}/${lesson.id}`}>
                <span className={styles.lessonOrdinal}>{index + 1}.{lessonIndex + 1}</span>
                <span className={styles.lessonIcon}><LearnIcon name={lesson.completedAt ? "check" : "play"} size={18} /></span>
                <span className={styles.lessonIdentity}><strong>{lesson.title}</strong><small>{lesson.code}{lesson.completedAt ? ` · ${t.completedLabel}` : ""}</small></span>
                <span className={styles.lessonAction}><span className={styles.lessonActionLabel}>{lesson.completedAt ? t.introReview : t.introOpen}</span><LearnIcon name="arrow" size={16} /></span>
              </Link>
            </li>)}</ol> : <p className={styles.moduleEmpty}>{t.lessonsSoon}</p>}
          </div>
        </details>;
      })}</div> : <div className={styles.moduleEmptyCard}>{t.noModules}</div>}
    </div>
  );
}
