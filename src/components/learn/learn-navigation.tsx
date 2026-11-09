"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LearnIcon, type LearnIconName } from "@/components/learn/learn-icon";
import { getLearnText, type LearnLocale } from "@/lib/learn/translations";
import styles from "@/app/learn/learn.module.css";

type NavKey = keyof ReturnType<typeof getLearnText>["nav"];
type NavItem = { key: NavKey; icon: LearnIconName; href?: string };
type Group = "courses" | "progress";

export function LearnNavigation({ locale, introHref, hasLessons }: { locale: LearnLocale; introHref: string | null; hasLessons: boolean }) {
  const t = getLearnText(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<Group, boolean>>({ courses: pathname === "/learn/profile" || pathname === "/learn/lessons" || pathname.startsWith("/learn/exams"), progress: pathname === "/learn/profile" });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const section = window.location.hash.slice(1);
      if (section) document.getElementById(section)?.scrollIntoView({ block: "start" });
      else document.getElementById("learn-content")?.scrollTo({ top: 0 });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  function navigate(href: string) {
    if (href.startsWith(`${pathname}#`)) requestAnimationFrame(() => document.getElementById(href.split("#")[1])?.scrollIntoView({ block: "start" }));
    else if (href === pathname) requestAnimationFrame(() => document.getElementById("learn-content")?.scrollTo({ top: 0 }));
  }

  function item({ key, icon, href }: NavItem) {
    const active = key === "dashboard" ? pathname === "/learn" : key === "profile" ? pathname === "/learn/profile" : key === "exams" ? pathname.startsWith("/learn/exams") : key === "lessons" && pathname === "/learn/lessons";
    const content = <><LearnIcon name={icon} size={18} /><span>{t.nav[key]}</span>{!href && <small>{t.nav.soon}</small>}</>;
    return href
      ? <Link key={key} href={href} className={active ? styles.navActive : undefined} aria-current={active ? "page" : undefined} onClick={() => navigate(href)}>{content}</Link>
      : <span key={key} className={styles.navDisabled} aria-disabled="true">{content}</span>;
  }

  function group(key: Group, icon: LearnIconName, children: NavItem[]) {
    return <div className={styles.navGroup} key={key}>
      <button type="button" className={styles.navToggle} aria-expanded={open[key]} aria-controls={`learn-nav-${key}`} onClick={() => setOpen((current) => ({ ...current, [key]: !current[key] }))}>
        <LearnIcon name={icon} size={19} /><span>{t.nav[key]}</span><span className={`${styles.navChevron} ${open[key] ? styles.navChevronOpen : ""}`} aria-hidden="true" />
      </button>
      <div id={`learn-nav-${key}`} className={styles.navSubitems} hidden={!open[key]}>{children.map(item)}</div>
    </div>;
  }

  return <nav className={styles.nav} aria-label={locale === "ru" ? "Навигация студента" : locale === "en" ? "Student navigation" : "O‘quvchi navigatsiyasi"}>
    {item({ key: "dashboard", icon: "dashboard", href: "/learn" })}
    {group("courses", "courses", [
      { key: "intro", icon: "play", href: introHref || undefined },
      { key: "lessons", icon: "lessons", href: hasLessons ? "/learn/lessons" : undefined },
      { key: "exams", icon: "exams", href: "/learn/exams" },
      { key: "resources", icon: "resources" },
    ])}
    {group("progress", "progress", [
      { key: "certificates", icon: "certificates" },
      { key: "achievements", icon: "trophy", href: "/learn/profile#achievements" },
    ])}
    {item({ key: "profile", icon: "profile", href: "/learn/profile" })}
  </nav>;
}
