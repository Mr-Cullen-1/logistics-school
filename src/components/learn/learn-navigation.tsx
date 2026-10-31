"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { LearnIcon, type LearnIconName } from "@/components/learn/learn-icon";
import styles from "@/app/learn/learn.module.css";

const items: { label: string; icon: LearnIconName; href?: string }[] = [
  { label: "Boshqaruv paneli", icon: "dashboard", href: "/learn" },
  { label: "Mening kurslarim", icon: "courses", href: "/learn#my-courses" },
  { label: "Darslar", icon: "lessons" },
  { label: "Topshiriqlar", icon: "assignments" },
  { label: "Imtihonlar", icon: "exams" },
  { label: "Sertifikatlar", icon: "certificates" },
  { label: "Progress", icon: "progress", href: "/learn#weekly-progress" },
  { label: "Xabarlar", icon: "messages" },
  { label: "Jadval", icon: "schedule" },
  { label: "Resurslar", icon: "resources" },
  { label: "Hamjamiyat", icon: "community" },
];

export function LearnNavigation() {
  const pathname = usePathname();
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const section = window.location.hash.slice(1);
      if (section) document.getElementById(section)?.scrollIntoView({ block: "start" });
      else document.getElementById("learn-content")?.scrollTo({ top: 0 });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return <nav className={styles.nav} aria-label="O‘quvchi bo‘limlari">
    {items.map((item) => {
      const active = item.href === "/learn" ? pathname === "/learn" : item.href === "/learn#my-courses" && pathname.startsWith("/learn/");
      const content = <><LearnIcon name={item.icon} size={19} /><span>{item.label}</span>{!item.href && <small>Tez orada</small>}</>;
      return item.href
        ? <Link key={item.label} href={item.href} className={active ? styles.navActive : undefined} aria-current={active ? "page" : undefined} onClick={() => {
          if (pathname === "/learn" && item.href?.includes("#")) requestAnimationFrame(() => document.getElementById(item.href!.split("#")[1])?.scrollIntoView({ block: "start" }));
        }}>{content}</Link>
        : <span key={item.label} className={styles.navDisabled} aria-disabled="true">{content}</span>;
    })}
  </nav>;
}
