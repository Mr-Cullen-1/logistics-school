"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { AdminIcon, type AdminIconName } from "@/components/admin/admin-icon";
import styles from "@/app/admin/dashboard.module.css";

export function AdminNavigation({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const pathname = usePathname();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const section = window.location.hash.slice(1);
      if (section) document.getElementById(section)?.scrollIntoView({ block: "start" });
      else document.getElementById("admin-content")?.scrollTo({ top: 0 });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  const items: { href: string; label: string; icon: AdminIconName; active: boolean }[] = [
    { href: "/admin", label: "Boshqaruv paneli", icon: "dashboard", active: pathname === "/admin" },
    { href: "/admin/students", label: "O‘quvchilar", icon: "students", active: pathname.startsWith("/admin/students") },
    ...(isSuperAdmin ? [{ href: "/admin/admins", label: "Adminlar", icon: "students" as const, active: pathname.startsWith("/admin/admins") }] : []),
    { href: "/admin/intro", label: "Intro darsi", icon: "book", active: pathname.startsWith("/admin/intro") },
    { href: "/admin/courses", label: "Kurslar", icon: "courses", active: pathname.startsWith("/admin/courses") },
    { href: "/admin#growth", label: "O‘sish", icon: "growth", active: false },
    { href: "/admin#recent-activity", label: "So‘nggi amallar", icon: "activity", active: false },
  ];

  return <nav className={styles.nav} aria-label="Asosiy bo‘limlar">
    {items.map((item) => <Link key={item.href} href={item.href} className={item.active ? styles.navActive : undefined} aria-current={item.active ? "page" : undefined} onClick={() => {
      if (pathname === "/admin" && item.href.includes("#")) requestAnimationFrame(() => document.getElementById(item.href.split("#")[1])?.scrollIntoView({ block: "start" }));
    }}><AdminIcon name={item.icon} /> {item.label}</Link>)}
  </nav>;
}
