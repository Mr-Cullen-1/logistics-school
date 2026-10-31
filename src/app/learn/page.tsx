import { asc, and, eq, inArray } from "drizzle-orm";
import Link from "next/link";

import { LearnIcon } from "@/components/learn/learn-icon";
import { getDatabase } from "@/db";
import { courses, enrollments, lessons, modules, progress } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import { activeCourseAccess } from "@/lib/courses/access";
import styles from "./learn.module.css";

function tashkentDay(date: Date) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tashkent", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function weekDays(now: Date) {
  const [year, month, day] = tashkentDay(now).split("-").map(Number);
  const today = Date.UTC(year, month - 1, day);
  const monday = today - ((new Date(today).getUTCDay() + 6) % 7) * 86_400_000;
  return ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"].map((label, index) => ({ label, key: new Date(monday + index * 86_400_000).toISOString().slice(0, 10) }));
}

export default async function LearnPage() {
  const user = await requireReadyUser();
  const db = getDatabase();
  const available = await db.select({
    id: courses.id,
    title: courses.title,
    level: courses.level,
  }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(activeCourseAccess(user.id)).orderBy(asc(courses.order), asc(courses.title));

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
  const greeting = hour < 11 ? "Xayrli tong" : hour < 18 ? "Xayrli kun" : "Xayrli kech";
  const days = weekDays(new Date());
  const weekly = days.map((day) => completed.filter((lesson) => lesson.completedAt && tashkentDay(lesson.completedAt) === day.key).length);
  const maxWeekly = Math.max(1, ...weekly);
  const recent = completed.sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime()).slice(0, 3);
  const photos = ["/admin-truck-hero.jpg", "/student-course-office.jpg", "/student-course-classroom.jpg"];

  return <div className={styles.dashboard}>
    <section className={styles.hero} aria-labelledby="welcome-title">
      <div className={styles.heroText}><p className={styles.heroEyebrow}>O‘quvchi paneli</p><h1 id="welcome-title">{greeting}, {firstName}! <span aria-hidden="true">👋</span></h1><p>O‘rganishda davom eting, yangi imkoniyatlar sari yuring.</p><blockquote>“Bugungi intizom ertangi imkoniyatlarni yaratadi.”</blockquote></div>
      <div className={styles.heroCourse}>
        <span className={styles.heroCourseLabel}><LearnIcon name="courses" size={17} /> O‘qishni davom ettirish</span>
        <strong>{featured?.title || "Kurslar hali ochilmagan"}</strong>
        {featured && <><div className={styles.progressLine}><span style={{ width: `${featured.percent}%` }} /></div><span className={styles.heroPercent}>{featured.percent}%</span><Link href={`/learn/${featured.id}`} className={styles.goldButton}>Kursni ochish <LearnIcon name="arrow" size={17} /></Link></>}
        {!featured && <p>Administrator kursga dostup berganida shu yerda ko‘rinadi.</p>}
      </div>
    </section>

    <section className={styles.stats} aria-label="O‘quv ko‘rsatkichlari">
      <Link href="#my-courses" className={styles.stat}><span className={styles.statIcon}><LearnIcon name="courses" size={26} /></span><span><strong>{courseCards.length}</strong><small>Faol kurslar</small></span><span className={styles.statArrow}>›</span></Link>
      <div className={styles.stat}><span className={styles.statIcon}><LearnIcon name="play" size={26} /></span><span><strong>{completed.length}</strong><small>Tugatilgan darslar</small></span></div>
      <Link href="#weekly-progress" className={styles.stat}><span className={styles.statIcon}><LearnIcon name="progress" size={26} /></span><span><strong>{overall}%</strong><small>Umumiy progress</small></span><span className={styles.statArrow}>›</span></Link>
      <div className={`${styles.stat} ${styles.statDisabled}`} aria-disabled="true"><span className={styles.statIcon}><LearnIcon name="certificates" size={26} /></span><span><strong>—</strong><small>Sertifikatlar · Tez orada</small></span></div>
    </section>

    <div className={styles.dashboardGrid}>
      <section id="my-courses" className={`${styles.panel} ${styles.coursesPanel}`} aria-labelledby="my-courses-title">
        <div className={styles.panelHeader}><h2 id="my-courses-title">Mening kurslarim</h2><span>{courseCards.length} ta kurs</span></div>
        {courseCards.length ? <div className={styles.courseGrid}>{courseCards.map((course, index) => <Link href={`/learn/${course.id}`} className={styles.courseCard} key={course.id}>
          <span className={styles.courseImage} style={{ backgroundImage: `url('${photos[index % photos.length]}')` }} />
          <span className={styles.courseDetails}><strong>{course.title}</strong><small>{course.level || "Daraja belgilanmagan"}</small><span className={styles.courseProgress}><span style={{ width: `${course.percent}%` }} /></span><span className={styles.courseFoot}><small>{course.done}/{course.lessons} dars</small><b>{course.percent}%</b></span></span><span className={styles.courseArrow}><LearnIcon name="arrow" size={17} /></span>
        </Link>)}</div> : <p className={styles.empty}>Hozircha kurs ochilmagan. Administrator dostup bergan kurslar shu yerda paydo bo‘ladi.</p>}
      </section>

      <section className={`${styles.panel} ${styles.upcomingPanel}`} aria-labelledby="upcoming-title"><div className={styles.panelHeader}><h2 id="upcoming-title">Yaqinlashayotgan darslar</h2><span className={styles.soon}>Tez orada</span></div><div className={styles.placeholder}><LearnIcon name="schedule" size={30} /><p>Dars jadvali ochilganda shu yerda ko‘rinadi.</p></div></section>

      <div className={styles.learningRow}>
        <section id="weekly-progress" className={`${styles.panel} ${styles.weeklyPanel}`} aria-labelledby="weekly-title"><div className={styles.panelHeader}><h2 id="weekly-title">Haftalik progress</h2><span>Shu hafta</span></div><p className={styles.panelSub}>{weekly.reduce((sum, value) => sum + value, 0)} ta dars tugatildi</p><div className={styles.chart} role="img" aria-label={`Shu hafta ${weekly.reduce((sum, value) => sum + value, 0)} ta dars tugatildi`}>{days.map((day, index) => <div className={styles.chartColumn} key={day.key}><span className={styles.barTrack}><span className={styles.bar} style={{ height: `${weekly[index] ? Math.max(14, weekly[index] / maxWeekly * 100) : 3}%` }} /></span><small>{day.label}</small></div>)}</div></section>
        <section className={`${styles.panel} ${styles.tasksPanel}`} aria-labelledby="tasks-title"><div className={styles.panelHeader}><h2 id="tasks-title">Bugungi vazifalar</h2><span className={styles.soon}>Tez orada</span></div><div className={styles.placeholder}><LearnIcon name="assignments" size={30} /><p>Topshiriqlar ochilganda bugungi vazifalar shu yerda chiqadi.</p></div></section>
      </div>

      <section className={`${styles.panel} ${styles.achievementsPanel}`} aria-labelledby="achievements-title"><div className={styles.panelHeader}><h2 id="achievements-title">Yutuqlar</h2><span className={styles.soon}>Tez orada</span></div><div className={styles.placeholder}><LearnIcon name="certificates" size={30} /><p>Yutuqlar va sertifikatlar keyingi bosqichda ochiladi.</p></div></section>

      <section className={`${styles.panel} ${styles.activityPanel}`} aria-labelledby="activity-title"><div className={styles.panelHeader}><h2 id="activity-title">So‘nggi faollik</h2><span>Oxirgi darslar</span></div>{recent.length ? <ul className={styles.activityList}>{recent.map((lesson) => <li key={lesson.id}><span className={styles.activityIcon}><LearnIcon name="check" size={18} /></span><span><strong>{lesson.title}</strong><small>{lesson.completedAt!.toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · Tugatildi</small></span></li>)}</ul> : <p className={styles.empty}>Tugatilgan darslar shu yerda ko‘rinadi.</p>}</section>

      <section className={`${styles.panel} ${styles.goalPanel}`} aria-labelledby="goal-title"><div className={styles.panelHeader}><h2 id="goal-title"><LearnIcon name="target" size={21} /> Maqsadim</h2><span className={styles.soon}>Tez orada</span></div><div className={styles.placeholder}><p>Shaxsiy maqsad qo‘yish funksiyasi tayyorlanmoqda.</p></div></section>
    </div>
  </div>;
}
