import { and, asc, count, desc, eq, gt, gte, isNull, lt, lte, or } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { LogoutButton } from "@/components/auth/logout-button";
import { getDatabase } from "@/db";
import { auditLog, courses, enrollments, lessons, users } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import styles from "./dashboard.module.css";

type IconName = "dashboard" | "students" | "courses" | "activity" | "growth" | "search" | "arrow" | "book" | "access";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    students: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m2 9h2v-2a6 6 0 0 0-4-5.7" /></>,
    courses: <><path d="m3 7 9-4 9 4-9 4-9-4Zm3 2v7c4 3 8 3 12 0V9M21 7v9" /></>,
    activity: <><path d="M3 12h4l3-7 4 14 3-7h4" /></>,
    growth: <><path d="M3 20V4m0 16h18M7 16l4-5 3 2 6-7m-4 0h4v4" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22V5.5Zm0 13A2.5 2.5 0 0 1 6.5 16H20" /></>,
    access: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

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
  if (user.role === "student") redirect("/learn");

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
  const initials = user.fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  const stats = [
    { label: "O‘quvchilar", value: studentTotal.total, detail: "Jami ro‘yxatdan o‘tgan", icon: "students" as const },
    { label: "Faol kurslar", value: courseTotal.total, detail: "Nashr qilingan kurslar", icon: "courses" as const },
    { label: "Darslar", value: lessonTotal.total, detail: "Jami darslar", icon: "book" as const },
    { label: "Faol dostuplar", value: accessTotal.total, detail: "Muddat ichidagi ruxsatlar", icon: "access" as const },
  ];

  return <main className={styles.shell}>
    <aside className={styles.sidebar} aria-label="Admin navigatsiyasi">
      <Link href="/admin" className={styles.brand}><Image src="/coliseum-logo-horizontal-light.svg" alt="Coliseum Logistics School" width={218} height={53} style={{ height: "auto" }} priority /></Link>
      <nav className={styles.nav} aria-label="Asosiy bo‘limlar">
        <Link href="/admin" className={styles.navActive} aria-current="page"><Icon name="dashboard" /> Boshqaruv paneli</Link>
        <Link href="/admin/students"><Icon name="students" /> O‘quvchilar</Link>
        <Link href="/admin/courses"><Icon name="courses" /> Kurslar</Link>
        <a href="#growth"><Icon name="growth" /> O‘sish</a>
        <a href="#recent-activity"><Icon name="activity" /> So‘nggi amallar</a>
      </nav>
      <div className={styles.sidebarNote}><span className={styles.noteIcon}><Icon name="courses" size={23} /></span><strong>O‘quv platformasi</strong><p>O‘quvchilar va kurslarni bir joydan boshqaring.</p><Link href="/admin/students">O‘quvchilarni ko‘rish <Icon name="arrow" size={17} /></Link></div>
    </aside>

    <div className={styles.workspace}>
      <header className={styles.topbar}>
        <form action="/admin/students" className={styles.search}><Icon name="search" size={21} /><input name="search" type="search" placeholder="O‘quvchilarni qidirish..." aria-label="O‘quvchilarni qidirish" /><button type="submit">Qidirish</button></form>
        <div className={styles.profile}><span className={styles.avatar} aria-hidden="true">{initials}</span><span><strong>{user.fullName}</strong><small>{user.role === "super_admin" ? "Super admin" : "Admin"}</small></span><div className={styles.logout}><LogoutButton /></div></div>
      </header>

      <div className={styles.content}>
        <section className={styles.hero}>
          <div><p className={styles.eyebrow}>Boshqaruv paneli <span aria-hidden="true">✦</span></p><h1>Xush kelibsiz, {user.fullName}!</h1><p>O‘quvchilar akkauntlari va kurslarni boshqarishingiz mumkin.</p></div>
          <div className={styles.heroActions}><span className={styles.dateBadge}>{dateInTashkent(now)}</span><Link href="/admin/students" className={styles.addButton}>+ O‘quvchi qo‘shish</Link></div>
        </section>

        <section className={styles.stats} aria-label="Asosiy ko‘rsatkichlar">
          {stats.map((stat) => <div className={styles.statCard} key={stat.label}><span className={styles.statIcon}><Icon name={stat.icon} size={28} /></span><div><p>{stat.label}</p><strong>{stat.value.toLocaleString("uz-UZ")}</strong><small>{stat.detail}</small></div></div>)}
        </section>

        <div className={styles.panels}>
          <section id="growth" className={`${styles.panel} ${styles.growthPanel}`} aria-labelledby="growth-title"><div className={styles.panelHead}><div><h2 id="growth-title">O‘quvchilar o‘sishi</h2><p>Bu oy qo‘shilgan o‘quvchilar</p></div><span className={styles.panelBadge}>+{daily.at(-1) ?? 0} bu oy</span></div><GrowthChart days={daily} /></section>
          <section className={styles.panel} aria-labelledby="course-title"><div className={styles.panelHead}><div><h2 id="course-title">Kurslar bo‘yicha dostup</h2><p>Faol o‘quvchilar soni</p></div><Link href="/admin/courses" className={styles.viewAll}>Barchasi</Link></div>{courseRows.length ? <div className={styles.courseList}>{courseRows.map((course) => <Link href={`/admin/courses/${course.id}`} className={styles.courseRow} key={course.id}><span className={styles.courseBadge}><Icon name="courses" size={19} /></span><span className={styles.courseInfo}><strong>{course.title}</strong><small>{course.total} ta faol dostup</small><span className={styles.track}><span style={{ width: `${(course.total / maxCourseAccess) * 100}%` }} /></span></span></Link>)}</div> : <p className={styles.empty}>Hozircha nashr qilingan kurs yo‘q.</p>}</section>
          <section className={`${styles.panel} ${styles.studentsPanel}`} aria-labelledby="students-title"><div className={styles.panelHead}><div><h2 id="students-title">So‘nggi o‘quvchilar</h2><p>Yaqinda qo‘shilgan akkauntlar</p></div><Link href="/admin/students" className={styles.viewAll}>Barchasi</Link></div>{recentStudents.length ? <div className={styles.tableScroll}><table className={styles.studentsTable}><thead><tr><th>O‘quvchi</th><th>Qo‘shilgan sana</th><th>Holat</th><th aria-label="Batafsil" /></tr></thead><tbody>{recentStudents.map((student) => <tr key={student.id}><td><span className={styles.studentCell}><span className={styles.studentAvatar} aria-hidden="true">{student.fullName[0]?.toUpperCase()}</span><span><strong>{student.fullName}</strong><small>{student.phone}</small></span></span></td><td>{dateInTashkent(student.createdAt)}</td><td><span className={student.isActive ? styles.activePill : styles.blockedPill}>{student.isActive ? "Faol" : "Bloklangan"}</span></td><td><Link href={`/admin/students/${student.id}`} className={styles.rowLink} aria-label={`${student.fullName} dostuplari`}><Icon name="arrow" size={18} /></Link></td></tr>)}</tbody></table></div> : <p className={styles.empty}>Hozircha o‘quvchilar yo‘q.</p>}</section>
          <section id="recent-activity" className={styles.panel} aria-labelledby="activity-title"><div className={styles.panelHead}><div><h2 id="activity-title">So‘nggi amallar</h2><p>Boshqaruvdagi o‘zgarishlar</p></div></div>{recentActions.length ? <ul className={styles.activityList}>{recentActions.map((action) => <li key={action.id}><span className={styles.activityDot} /><span><strong>{actionNames[action.action] || action.action}</strong><small>{dateInTashkent(action.createdAt)}</small></span></li>)}</ul> : <p className={styles.empty}>Hozircha amallar yo‘q.</p>}</section>
        </div>
      </div>
    </div>
  </main>;
}
