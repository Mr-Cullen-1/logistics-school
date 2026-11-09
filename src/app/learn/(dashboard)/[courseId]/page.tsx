import { asc, and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { getDatabase } from "@/db";
import { courses, enrollments, modules, studentProfiles } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import { activeCourseAccess } from "@/lib/courses/access";
import { getLearnText } from "@/lib/learn/translations";
import { LessonAccessRow } from "@/components/learn/lesson-access-row";
import { courseLessonSequence } from "@/lib/lessons/access";
import { studentExams } from "@/lib/exams/queries";
import { examText } from "@/lib/exams/translations";
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
  const locale = profile?.locale === "ru" || profile?.locale === "en" ? profile.locale : "uz";
  const sections = await getDatabase().select({ id: modules.id, title: modules.title }).from(modules).where(eq(modules.courseId, courseId)).orderBy(asc(modules.order), asc(modules.id));
  const sequence = await courseLessonSequence(user.id, courseId);
  const examRows = await studentExams(user.id,courseId);
  const et = examText[locale];
  const intro = sequence.intro;
  const moduleLessons = sequence.lessons.filter(lesson => lesson.status === "published");

  return (
    <div className={styles.courseDetail}>
      <Link href="/learn#my-courses" className={styles.backLink}>← {t.back}</Link>
      <div className={styles.courseDetailHero}><small>{course.level || t.defaultLevel}</small><h1>{course.title}</h1><p>{course.description || t.defaultDescription}</p></div>
      {intro && <section className={styles.introSection} aria-labelledby="intro-heading">
        <h2 id="intro-heading" className={styles.moduleHeading}>{t.introHeading}</h2>
        <div className={styles.introCard}>
          <div><span className={styles.introEyebrow}>INTRO</span><h3>{intro.title}</h3><p>{t.introHelp}</p></div>
          <Link className={styles.introButton} href={`/learn/${intro.courseId}/${intro.id}`}>{intro.learnDoneAt ? t.introReview : t.introOpen} <span aria-hidden="true">→</span></Link>
        </div>
      </section>}
      <h2 className={styles.moduleHeading}>{t.modules}</h2>
      {sections.length ? <div className={styles.moduleList}>{sections.map((section, index) => {
        const sectionLessons = moduleLessons.filter((lesson) => lesson.moduleId === section.id);
        const completed = sectionLessons.filter((lesson) => lesson.completed).length;
        return <details id={sectionLessons[0]?.code?.slice(0,2)} className={styles.moduleCard} key={section.id} open={index === 0}>
          <summary className={styles.moduleSummary}>
            <span className={styles.moduleNumber}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.moduleIdentity}><span className={styles.moduleKicker}>{t.modules} / {String(index + 1).padStart(2, "0")}</span><strong>{section.title}</strong></span>
            <span className={styles.moduleMeta}>{t.lessonsLabel} · {sectionLessons.length}{completed > 0 ? ` / ${t.completedLabel} · ${completed}` : ""}</span>
            <span className={styles.moduleChevron} aria-hidden="true" />
          </summary>
          <div className={styles.moduleBody}>
            {examRows.filter(e=>e.moduleId===section.id).map(e=><p key={e.id}><Link href={`/learn/exams/${e.id}`}>{e.title} · {et.state[e.state]} · {e.passPercent}%</Link></p>)}
            {sectionLessons.length ? <ol className={styles.lessonList}>{sectionLessons.map((lesson, lessonIndex) => <li key={lesson.id}>
              <LessonAccessRow href={`/learn/${courseId}/${lesson.id}`} title={lesson.title} code={lesson.code} ordinal={`${index + 1}.${lessonIndex + 1}`} completed={lesson.completed} unlocked={lesson.unlocked} locale={locale} />
            </li>)}</ol> : <p className={styles.moduleEmpty}>{t.lessonsSoon}</p>}
          </div>
        </details>;
      })}</div> : <div className={styles.moduleEmptyCard}>{t.noModules}</div>}
      {examRows.filter(e=>e.kind==="ik").map(e=><section className={styles.moduleEmptyCard} key={e.id}><h2>{e.title}</h2><p>{et.state[e.state]} · {e.passPercent}%</p><Link className={styles.introButton} href={`/learn/exams/${e.id}`}>{et.start}</Link></section>)}
    </div>
  );
}
