import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { HelpCard } from "@/components/learn/help-card";
import { LearnIcon } from "@/components/learn/learn-icon";
import { LearnNavigation } from "@/components/learn/learn-navigation";
import { getDatabase } from "@/db";
import { courses, enrollments, lessons, modules, studentProfiles } from "@/db/schema";
import { requireReadyUser } from "@/lib/auth/current-user";
import { activeCourseAccess } from "@/lib/courses/access";
import { getLearnText, type LearnLocale } from "@/lib/learn/translations";
import { and, eq, isNull, ne, or } from "drizzle-orm";
import styles from "../learn.module.css";

export default async function LearnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireReadyUser();
  if (user.role !== "student") redirect("/admin");
  const db = getDatabase();
  const [[studentProfile], [intro], [firstLesson]] = await Promise.all([
    db.select({ avatarData: studentProfiles.avatarData, locale: studentProfiles.locale }).from(studentProfiles).where(eq(studentProfiles.studentId, user.id)).limit(1),
    db.select({ id: lessons.id, courseId: modules.courseId }).from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id)).where(and(eq(lessons.code, "INTRO"), eq(lessons.status, "published"))).limit(1),
    db.select({ id: lessons.id }).from(enrollments).innerJoin(courses, eq(enrollments.courseId, courses.id)).innerJoin(modules, eq(modules.courseId, courses.id)).innerJoin(lessons, eq(lessons.moduleId, modules.id)).where(and(activeCourseAccess(user.id), eq(lessons.status, "published"), or(isNull(lessons.code), ne(lessons.code, "INTRO")))).limit(1),
  ]);
  const locale = (studentProfile?.locale === "ru" || studentProfile?.locale === "en" ? studentProfile.locale : "uz") as LearnLocale;
  const t = getLearnText(locale);
  const initials = user.fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

  return <div className={styles.shell}>
    <aside className={styles.sidebar} aria-label="O‘quvchi navigatsiyasi">
      <Link href="/learn" className={styles.brand}><Image src="/brand/coliseum-logo-horizontal-brand.png" alt="Coliseum Logistics" width={1010} height={600} sizes="(max-width: 760px) 170px, 215px" priority /></Link>
      <LearnNavigation locale={locale} introHref={intro ? `/learn/${intro.courseId}/${intro.id}` : null} hasLessons={!!firstLesson} />
      <HelpCard locale={locale} />
    </aside>
    <div className={styles.workspace}>
      <header className={styles.topbar}>
        <div className={styles.searchDisabled} aria-disabled="true"><LearnIcon name="search" size={20} /><span>{t.shell.search}</span><small>{t.nav.soon}</small></div>
        <div className={styles.topActions}>
          <span className={styles.noticeDisabled} aria-label={t.nav.soon} aria-disabled="true"><LearnIcon name="bell" size={21} /></span>
          <Link href="/learn/profile" className={styles.profile}><span className={styles.avatar} aria-hidden="true">{studentProfile?.avatarData ? <Image src={studentProfile.avatarData} alt="" width={37} height={37} unoptimized className={styles.avatarImage} /> : initials}</span><span><strong>{user.fullName}</strong><small>{t.shell.student}</small></span></Link>
        </div>
      </header>
      <main id="learn-content" className={styles.mainScroll} tabIndex={-1}>{children}</main>
    </div>
  </div>;
}
