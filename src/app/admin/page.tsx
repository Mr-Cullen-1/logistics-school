import { and, asc, count, desc, eq, gt, gte, isNull, lt, lte, or } from "drizzle-orm";
import Link from "next/link";

import { AdminIcon } from "@/components/admin/admin-icon";
import { getDatabase } from "@/db";
import { auditLog, courses, enrollments, lessons, users } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import styles from "./dashboard.module.css";

function dateInTashkent(date: Date) {
  return new Intl.DateTimeFormat("uz-UZ", { timeZone: "Asia/Tashkent", day: "numeric", month: "short", year: "numeric" }).format(date);
}

function monthBounds(now: Date) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tashkent", year: "numeric", month: "numeric", day: "numeric" }).formatToParts(now).map((part) => [part.type, part.value]));
  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  return { day, start: new Date(Date.UTC(year, month - 1, 1, -5)), end: new Date(Date.UTC(year, month, 1, -5)) };
}

function GrowthChart({ days }: { days: number[] }) {
  const max = Math.max(1, ...days);
  const points = days.map((value, index) => `${32 + (index / Math.max(1, days.length - 1)) * 704},${185 - (value / max) * 138}`);
  const line = `M ${points.join(" L ")}`;
  const fill = `${line} L 736 185 L 32 185 Z`;
  return <div className={styles.chartWrap}>
    <div className={styles.chartScale}><span>{max}</span><span>{max > 1 ? Math.round(max / 2) : "0.5"}</span><span>0</span></div>
    <svg className={styles.chart} viewBox="0 0 768 210" preserveAspectRatio="none" role="img" aria-label={`Bu oy ${days.at(-1) ?? 0} ta yangi o‘quvchi qo‘shildi`}>
      <defs><linearGradient id="growth-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#D4AF7C" stopOpacity=".37" /><stop offset="1" stopColor="#D4AF7C" stopOpacity="0" /></linearGradient></defs>
      {[47, 93, 139, 185].map((y) => <line key={y} x1="32" x2="736" y1={y} y2={y} stroke="#F4F1E8" strokeOpacity=".11" />)}
      <path d={fill} fill="url(#growth-fill)" />
      <path d={line} fill="none" stroke="#D4AF7C" strokeWidth="3" vectorEffect="non-scaling-stroke" />
      {days.length > 1 && <circle cx="736" cy={185 - ((days.at(-1) ?? 0) / max) * 138} r="5" fill="#D4AF7C" />}
    </svg>
    <div className={styles.chartDays}><span>1-kun</span><span>{days.length - 1}-kun</span></div>
  </div>;
}

const actionNames: Record<string, string> = {
  "admin.created": "Admin yaratildi",
  "student.created": "O‘quvchi yaratildi",
  "student.blocked": "O‘quvchi bloklandi",
  "student.unblocked": "O‘quvchi faollashtirildi",
  "student.pin_reset": "PIN tiklandi",
  "course.created": "Kurs yaratildi",
  "course.updated": "Kurs yangilandi",
  "course.deleted": "Kurs o‘chirildi",
  "course.reordered": "Kurs tartibi yangilandi",
  "module.created": "Modul yaratildi",
  "module.updated": "Modul yangilandi",
  "module.deleted": "Modul o‘chirildi",
  "module.reordered": "Modul tartibi yangilandi",
  "access.granted": "Kurs dostupi berildi",
  "access.revoked": "Kurs dostupi bekor qilindi",
};

export default async function AdminPage() {
  const user = await requireReadyUser();

  const db = getDatabase();
  const now = new Date();
  const month = monthBounds(now);
  const activeAccess = and(eq(enrollments.isActive, true), lte(enrollments.startsAt, now), or(isNull(enrollments.expiresAt), gt(enrollments.expiresAt, now)));
  const courseAccessCount = count(enrollments.id);
  const [[studentTotal], [courseTotal], [lessonTotal], [accessTotal], recentStudents, monthStudents, courseRows, recentActions] = await Promise.all([
    db.select({ total: count() }).from(users).where(eq(users.role, "student")),
    db.select({ total: count() }).from(courses).where(eq(courses.isPublished, true)),
    db.select({ total: count() }).from(lessons),
    db.select({ total: count() }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).where(and(activeAccess, eq(courses.isPublished, true))),
    db.select({ id: users.id, fullName: users.fullName, phone: users.phone, isActive: users.isActive, createdAt: users.createdAt }).from(users).where(eq(users.role, "student")).orderBy(desc(users.createdAt), desc(users.id)).limit(5),
    db.select({ createdAt: users.createdAt }).from(users).where(and(eq(users.role, "student"), gte(users.createdAt, month.start), lt(users.createdAt, month.end))),
    db.select({ id: courses.id, title: courses.title, total: courseAccessCount }).from(courses).leftJoin(enrollments, and(eq(enrollments.courseId, courses.id), activeAccess)).where(eq(courses.isPublished, true)).groupBy(courses.id, courses.title).orderBy(desc(courseAccessCount), asc(courses.title)).limit(4),
    db.select({ id: auditLog.id, action: auditLog.action, createdAt: auditLog.createdAt }).from(auditLog).orderBy(desc(auditLog.createdAt)).limit(5),
  ]);

  const daily = Array.from({ length: month.day + 1 }, () => 0);
  for (const row of monthStudents) {
    const day = Number(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Tashkent", day: "numeric" }).format(row.createdAt));
    if (day <= month.day) daily[day] += 1;
  }
  for (let index = 1; index < daily.length; index += 1) daily[index] += daily[index - 1];
  const maxCourseAccess = Math.max(1, ...courseRows.map((course) => course.total));
  const stats = [
    { label: "O‘quvchilar", value: studentTotal.total, detail: "Jami ro‘yxatdan o‘tgan", icon: "students" as const },
    { label: "Faol kurslar", value: courseTotal.total, detail: "Nashr qilingan kurslar", icon: "courses" as const },
    { label: "Darslar", value: lessonTotal.total, detail: "Jami darslar", icon: "book" as const },
    { label: "Faol dostuplar", value: accessTotal.total, detail: "Muddat ichidagi ruxsatlar", icon: "access" as const },
  ];

  return <div className={styles.content}>
        <section className={styles.hero}>
          <div><p className={styles.eyebrow}>Boshqaruv paneli <span aria-hidden="true">✦</span></p><h1>Xush kelibsiz, {user.fullName}!</h1><p>O‘quvchilar akkauntlari va kurslarni boshqarishingiz mumkin.</p></div>
          <div className={styles.heroActions}><span className={styles.dateBadge}>{dateInTashkent(now)}</span><Link href="/admin/students" className={styles.addButton}>+ O‘quvchi qo‘shish</Link></div>
        </section>

        <section className={styles.stats} aria-label="Asosiy ko‘rsatkichlar">
          {stats.map((stat) => <div className={styles.statCard} key={stat.label}><span className={styles.statIcon}><AdminIcon name={stat.icon} size={28} /></span><div><p>{stat.label}</p><strong>{stat.value.toLocaleString("uz-UZ")}</strong><small>{stat.detail}</small></div></div>)}
        </section>

        <div className={styles.panels}>
          <section id="growth" className={`${styles.panel} ${styles.growthPanel}`} aria-labelledby="growth-title"><div className={styles.panelHead}><div><h2 id="growth-title">O‘quvchilar o‘sishi</h2><p>Bu oy qo‘shilgan o‘quvchilar</p></div><span className={styles.panelBadge}>+{daily.at(-1) ?? 0} bu oy</span></div><GrowthChart days={daily} /></section>
          <section className={styles.panel} aria-labelledby="course-title"><div className={styles.panelHead}><div><h2 id="course-title">Kurslar bo‘yicha dostup</h2><p>Faol o‘quvchilar soni</p></div><Link href="/admin/courses" className={styles.viewAll}>Barchasi</Link></div>{courseRows.length ? <div className={styles.courseList}>{courseRows.map((course) => <Link href={`/admin/courses/${course.id}`} className={styles.courseRow} key={course.id}><span className={styles.courseBadge}><AdminIcon name="courses" size={19} /></span><span className={styles.courseInfo}><strong>{course.title}</strong><small>{course.total} ta faol dostup</small><span className={styles.track}><span style={{ width: `${(course.total / maxCourseAccess) * 100}%` }} /></span></span></Link>)}</div> : <p className={styles.empty}>Hozircha nashr qilingan kurs yo‘q.</p>}</section>
          <section className={`${styles.panel} ${styles.studentsPanel}`} aria-labelledby="students-title"><div className={styles.panelHead}><div><h2 id="students-title">So‘nggi o‘quvchilar</h2><p>Yaqinda qo‘shilgan akkauntlar</p></div><Link href="/admin/students" className={styles.viewAll}>Barchasi</Link></div>{recentStudents.length ? <div className={styles.tableScroll}><table className={styles.studentsTable}><thead><tr><th>O‘quvchi</th><th>Qo‘shilgan sana</th><th>Holat</th><th aria-label="Batafsil" /></tr></thead><tbody>{recentStudents.map((student) => <tr key={student.id}><td><span className={styles.studentCell}><span className={styles.studentAvatar} aria-hidden="true">{student.fullName[0]?.toUpperCase()}</span><span><strong>{student.fullName}</strong><small>{student.phone}</small></span></span></td><td>{dateInTashkent(student.createdAt)}</td><td><span className={student.isActive ? styles.activePill : styles.blockedPill}>{student.isActive ? "Faol" : "Bloklangan"}</span></td><td><Link href={`/admin/students/${student.id}`} className={styles.rowLink} aria-label={`${student.fullName} dostuplari`}><AdminIcon name="arrow" size={18} /></Link></td></tr>)}</tbody></table></div> : <p className={styles.empty}>Hozircha o‘quvchilar yo‘q.</p>}</section>
          <section id="recent-activity" className={styles.panel} aria-labelledby="activity-title"><div className={styles.panelHead}><div><h2 id="activity-title">So‘nggi amallar</h2><p>Boshqaruvdagi o‘zgarishlar</p></div></div>{recentActions.length ? <ul className={styles.activityList}>{recentActions.map((action) => <li key={action.id}><span className={styles.activityDot} /><span><strong>{actionNames[action.action] || action.action}</strong><small>{dateInTashkent(action.createdAt)}</small></span></li>)}</ul> : <p className={styles.empty}>Hozircha amallar yo‘q.</p>}</section>
        </div>
  </div>;
}
