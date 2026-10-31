import { asc, and, eq, inArray } from "drizzle-orm";
import Link from "next/link";

import { LearnIcon } from "@/components/learn/learn-icon";
import { getDatabase } from "@/db";
import { courses, enrollments, lessons, modules, progress, studentProfiles } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import { activeCourseAccess } from "@/lib/courses/access";
import { getLearnText } from "@/lib/learn/translations";
import styles from "./learn.module.css";

function tashkentDay(date: Date) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tashkent", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function weekDays(now: Date, locale: string) {
  const [year, month, day] = tashkentDay(now).split("-").map(Number);
  const today = Date.UTC(year, month - 1, day);
  const monday = today - ((new Date(today).getUTCDay() + 6) % 7) * 86_400_000;
  const labels = locale === "ru" ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] : locale === "en" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
  return labels.map((label, index) => ({ label, key: new Date(monday + index * 86_400_000).toISOString().slice(0, 10) }));
}

export default async function LearnPage() {
  const user = await requireReadyUser();
  const db = getDatabase();
  const [available, [studentProfile]] = await Promise.all([db.select({
    id: courses.id,
    title: courses.title,
    level: courses.level,
  }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(activeCourseAccess(user.id)).orderBy(asc(courses.order), asc(courses.title)),
  db.select({ locale: studentProfiles.locale, goalTitle: studentProfiles.goalTitle, goalDate: studentProfiles.goalDate }).from(studentProfiles).where(eq(studentProfiles.studentId, user.id)).limit(1)]);
  const locale = studentProfile?.locale === "ru" || studentProfile?.locale === "en" ? studentProfile.locale : "uz";
  const t = getLearnText(locale).dashboard;
  const soon = getLearnText(locale).nav.soon;
  const [intro] = await db.select({ id: lessons.id, courseId: modules.courseId }).from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id)).where(and(eq(lessons.code, "INTRO"), eq(lessons.status, "published"))).limit(1);

  const lessonRows = available.length ? await db.select({
    id: lessons.id,
    title: lessons.title,
    courseId: modules.courseId,
    completedAt: progress.completedAt,
  }).from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id)).leftJoin(progress, and(eq(progress.lessonId, lessons.id), eq(progress.studentId, user.id)))
    .where(and(inArray(modules.courseId, available.map((course) => course.id)), eq(lessons.status, "published"))) : [];

  const completed = lessonRows.filter((lesson) => lesson.completedAt);
  const overall = lessonRows.length ? Math.round(completed.length / lessonRows.length * 100) : 0;
  const courseCards = available.map((course) => {
    const items = lessonRows.filter((lesson) => lesson.courseId === course.id);
    const done = items.filter((lesson) => lesson.completedAt).length;
    return { ...course, lessons: items.length, done, percent: items.length ? Math.round(done / items.length * 100) : 0 };
  });
  const featured = courseCards.find((course) => course.percent < 100) || courseCards[0];
  const firstName = user.fullName.trim().split(/\s+/)[0] || user.fullName;
  const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tashkent", hour: "numeric", hourCycle: "h23" }).format(new Date()));
  const greeting = hour < 11 ? t.morning : hour < 18 ? t.afternoon : t.evening;
  const days = weekDays(new Date(), locale);
  const weekly = days.map((day) => completed.filter((lesson) => lesson.completedAt && tashkentDay(lesson.completedAt) === day.key).length);
  const maxWeekly = Math.max(1, ...weekly);
  const recent = completed.sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime()).slice(0, 3);
  const photos = ["/admin-truck-hero.jpg", "/student-course-office.jpg", "/student-course-classroom.jpg"];
  const recentLocale = locale === "ru" ? "ru-RU" : locale === "en" ? "en-US" : "uz-UZ";

  return <div className={styles.dashboard}>
    <section className={styles.hero} aria-labelledby="welcome-title">
      <div className={styles.heroText}><p className={styles.heroEyebrow}>{t.eyebrow}</p><h1 id="welcome-title">{greeting}, {firstName}! <span aria-hidden="true">👋</span></h1><p>{t.subtitle}</p><blockquote>“{t.quote}”</blockquote></div>
      <div className={styles.heroCourse}>
        <span className={styles.heroCourseLabel}><LearnIcon name="courses" size={17} /> {t.continue}</span>
        <strong>{featured?.title || t.noCourses}</strong>
        {featured && <><div className={styles.progressLine}><span style={{ width: `${featured.percent}%` }} /></div><span className={styles.heroPercent}>{featured.percent}%</span><Link href={`/learn/${featured.id}`} className={styles.goldButton}>{t.openCourse} <LearnIcon name="arrow" size={17} /></Link></>}
        {!featured && <p>{t.noCoursesHelp}</p>}
      </div>
    </section>

    <section className={styles.stats} aria-label={t.eyebrow}>
      <Link href="#my-courses" className={styles.stat}><span className={styles.statIcon}><LearnIcon name="courses" size={26} /></span><span><strong>{courseCards.length}</strong><small>{t.activeCourses}</small></span><span className={styles.statArrow}>›</span></Link>
      <div className={styles.stat}><span className={styles.statIcon}><LearnIcon name="play" size={26} /></span><span><strong>{completed.length}</strong><small>{t.completedLessons}</small></span></div>
      <Link href="#weekly-progress" className={styles.stat}><span className={styles.statIcon}><LearnIcon name="progress" size={26} /></span><span><strong>{overall}%</strong><small>{t.overallProgress}</small></span><span className={styles.statArrow}>›</span></Link>
      <div className={`${styles.stat} ${styles.statDisabled}`} aria-disabled="true"><span className={styles.statIcon}><LearnIcon name="certificates" size={26} /></span><span><strong>—</strong><small>{t.certificates} · {soon}</small></span></div>
    </section>
    {intro && <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4"><strong>English for Logistics: The Why</strong><p className="mt-1 text-sm text-stone-600">Bepul kirish darsi</p><Link className="mt-2 inline-block text-sm font-semibold text-amber-900 underline" href={`/learn/${intro.courseId}/${intro.id}`}>Intro darsini ochish →</Link></div>}

    <div className={styles.dashboardGrid}>
      <section id="my-courses" className={`${styles.panel} ${styles.coursesPanel}`} aria-labelledby="my-courses-title">
        <div className={styles.panelHeader}><h2 id="my-courses-title">{t.myCourses}</h2><span>{courseCards.length} {t.courseCount}</span></div>
        {courseCards.length ? <div className={styles.courseGrid}>{courseCards.map((course, index) => <Link href={`/learn/${course.id}`} className={styles.courseCard} key={course.id}>
          <span className={styles.courseImage} style={{ backgroundImage: `url('${photos[index % photos.length]}')` }} />
          <span className={styles.courseDetails}><strong>{course.title}</strong><small>{course.level || t.noLevel}</small><span className={styles.courseProgress}><span style={{ width: `${course.percent}%` }} /></span><span className={styles.courseFoot}><small>{course.done}/{course.lessons} {t.lessonCount}</small><b>{course.percent}%</b></span></span><span className={styles.courseArrow}><LearnIcon name="arrow" size={17} /></span>
        </Link>)}</div> : <p className={styles.empty}>{t.noCoursesPanel}</p>}
      </section>

      <section className={`${styles.panel} ${styles.upcomingPanel}`} aria-labelledby="upcoming-title"><div className={styles.panelHeader}><h2 id="upcoming-title">{t.upcoming}</h2><span className={styles.soon}>{soon}</span></div><div className={styles.placeholder}><LearnIcon name="schedule" size={30} /><p>{t.upcomingHelp}</p></div></section>

      <section id="weekly-progress" className={`${styles.panel} ${styles.weeklyPanel}`} aria-labelledby="weekly-title"><div className={styles.panelHeader}><h2 id="weekly-title">{t.weekly}</h2><span>{t.thisWeek}</span></div><p className={styles.panelSub}>{weekly.reduce((sum, value) => sum + value, 0)} {t.completedThisWeek}</p><div className={styles.chart} role="img" aria-label={`${weekly.reduce((sum, value) => sum + value, 0)} ${t.completedThisWeek}`}>{days.map((day, index) => <div className={styles.chartColumn} key={day.key}><span className={styles.barTrack}><span className={styles.bar} style={{ height: `${weekly[index] ? Math.max(14, weekly[index] / maxWeekly * 100) : 3}%` }} /></span><small>{day.label}</small></div>)}</div></section>

      <section className={`${styles.panel} ${styles.achievementsPanel}`} aria-labelledby="achievements-title"><div className={styles.panelHeader}><h2 id="achievements-title">{t.achievements}</h2><Link href="/learn/profile#achievements" className={styles.panelAction}>{getLearnText(locale).nav.achievements} →</Link></div><div className={styles.achievementPreview}><LearnIcon name="trophy" size={29} /><strong>{completed.length}</strong><span>{t.completedLessons}</span><p>{t.achievementsHelp}</p></div></section>

      <section className={`${styles.panel} ${styles.activityPanel}`} aria-labelledby="activity-title"><div className={styles.panelHeader}><h2 id="activity-title">{t.recent}</h2><span>{t.lastLessons}</span></div>{recent.length ? <ul className={styles.activityList}>{recent.map((lesson) => <li key={lesson.id}><span className={styles.activityIcon}><LearnIcon name="check" size={18} /></span><span><strong>{lesson.title}</strong><small>{lesson.completedAt!.toLocaleString(recentLocale, { timeZone: "Asia/Tashkent", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · {t.completed}</small></span></li>)}</ul> : <p className={styles.empty}>{t.noActivity}</p>}</section>

      <section className={`${styles.panel} ${styles.goalPanel}`} aria-labelledby="goal-title"><div className={styles.panelHeader}><h2 id="goal-title"><LearnIcon name="target" size={21} /> {t.goal}</h2><Link href="/learn/profile#goal" className={styles.panelAction}>{t.editGoal} →</Link></div><div className={styles.goalContent}><strong>{studentProfile?.goalTitle || t.noGoal}</strong>{studentProfile?.goalDate && <small>{studentProfile.goalDate}</small>}<p>{t.goalHelp}</p></div></section>
    </div>
  </div>;
}
