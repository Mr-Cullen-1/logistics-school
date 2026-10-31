"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { AdminIcon } from "@/components/admin/admin-icon";
import styles from "@/app/admin/dashboard.module.css";

export function AdminSearch() {
  const router = useRouter();
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = String(form.get("search") || "").trim();
    router.push(value ? `/admin/students?${new URLSearchParams({ search: value })}` : "/admin/students");
  }
  return <form action="/admin/students" onSubmit={search} className={styles.search} role="search">
    <AdminIcon name="search" size={21} />
    <input name="search" type="search" placeholder="O‘quvchilarni qidirish..." aria-label="O‘quvchilarni qidirish" />
    <button type="submit">Qidirish</button>
  </form>;
}
