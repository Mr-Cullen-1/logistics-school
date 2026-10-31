"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { LearnIcon, type LearnIconName } from "@/components/learn/learn-icon";
import { getLearnText, type LearnLocale } from "@/lib/learn/translations";
import styles from "@/app/learn/learn.module.css";

const items: { key: keyof ReturnType<typeof getLearnText>["nav"]; icon: LearnIconName; href?: string }[] = [
  { key: "dashboard", icon: "dashboard", href: "/learn" },
  { key: "courses", icon: "courses", href: "/learn#my-courses" },
  { key: "lessons", icon: "lessons" },
  { key: "exams", icon: "exams" },
  { key: "certificates", icon: "certificates" },
  { key: "progress", icon: "progress", href: "/learn#weekly-progress" },
  { key: "resources", icon: "resources" },
  { key: "achievements", icon: "trophy", href: "/learn/profile#achievements" },
  { key: "profile", icon: "profile", href: "/learn/profile" },
];

export function LearnNavigation({ locale }: { locale: LearnLocale }) {
  const t = getLearnText(locale);
  const pathname = usePathname();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const section = window.location.hash.slice(1);
      if (section) document.getElementById(section)?.scrollIntoView({ block: "start" });
      else document.getElementById("learn-content")?.scrollTo({ top: 0 });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return <nav className={styles.nav} aria-label={t.nav.profile}>
    {items.map((item) => {
      const active = item.key === "dashboard" ? pathname === "/learn" : item.key === "courses" ? pathname.startsWith("/learn/") && pathname !== "/learn/profile" : item.key === "profile" && pathname === "/learn/profile";
      const content = <><LearnIcon name={item.icon} size={19} /><span>{t.nav[item.key]}</span>{!item.href && <small>{t.nav.soon}</small>}</>;
      return item.href
        ? <Link key={item.key} href={item.href} className={active ? styles.navActive : undefined} aria-current={active ? "page" : undefined} onClick={() => {
          if (item.href?.startsWith(`${pathname}#`)) requestAnimationFrame(() => document.getElementById(item.href!.split("#")[1])?.scrollIntoView({ block: "start" }));
          else if (item.href === pathname) requestAnimationFrame(() => document.getElementById("learn-content")?.scrollTo({ top: 0 }));
        }}>{content}</Link>
        : <span key={item.key} className={styles.navDisabled} aria-disabled="true">{content}</span>;
    })}
  </nav>;
}
