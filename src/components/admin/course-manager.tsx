"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Toast } from "@/components/ui/toast";
import { AdminIcon } from "./admin-icon";
import { CoursePageIcon } from "./course-page-icons";
import styles from "./course-pages.module.css";

type Course = { id: string; title: string; description: string | null; level: string | null; isPublished: boolean; order: number };
const levels = ["A1", "A2", "B1", "B2", "C1"];

export function CourseManager({ courses, canEdit }: { courses: Course[]; canEdit: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Course | "new" | null>(null);
  const [deleting, setDeleting] = useState<Course | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  function openEditor(course?: Course) {
    setEditing(course || "new");
    setTitle(course?.title || "");
    setDescription(course?.description || "");
    setLevel(course?.level || "");
    setIsPublished(course?.isPublished || false);
    setError("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setBusy(true);
    setError("");
    try {
      const isNew = editing === "new";
      const response = await fetch(isNew ? "/api/admin/courses" : `/api/admin/courses/${editing.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, level: level || null, ...(!isNew ? { isPublished } : {}) }),
      });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Kurs saqlanmadi"); return; }
      setEditing(null);
      setToast(isNew ? "Kurs yaratildi" : "Kurs yangilandi");
      router.refresh();
    } catch {
      setError("Ulanishda xatolik yuz berdi");
    } finally {
      setBusy(false);
    }
  }

  async function mutate(path: string, method: "POST" | "DELETE", body?: object) {
    setBusy(true);
    try {
      const response = await fetch(path, { method, ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}) });
      const result = await response.json();
      if (!response.ok) { setToast(result.error || "Amal bajarilmadi"); return; }
      setDeleting(null);
      setToast("O‘zgarish saqlandi");
      router.refresh();
    } catch {
      setToast("Ulanishda xatolik yuz berdi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.page}>
      <Link href="/admin" className={styles.back}><CoursePageIcon name="back" size={16} /> Boshqaruv paneli</Link>
      <div className={styles.pageHeader}>
        <div><h1>Kurslar</h1><p>Modullar va nashr holatini boshqaring.</p></div>
        {canEdit && <button className={styles.primary} onClick={() => openEditor()}><CoursePageIcon name="plus" size={19} /> Kurs yaratish</button>}
      </div>
      {courses.length ? <div className={styles.tableFrame}><div className={styles.tableScroll}><table className={styles.table}>
        <thead><tr><th scope="col">Kurs</th><th scope="col">Daraja</th><th scope="col">Holat</th><th scope="col">Amallar</th></tr></thead>
        <tbody>{courses.map((course, index) => <tr key={course.id}>
          <td><div className={styles.courseIdentity}><span className={styles.courseGlyph}><AdminIcon name="book" size={17} /></span><div><Link href={`/admin/courses/${course.id}`}>{course.title}</Link>{course.description && <p title={course.description}>{course.description}</p>}</div></div></td>
          <td><span className={styles.level}>{course.level || "—"}</span></td>
          <td><span className={`${styles.status} ${course.isPublished ? "" : styles.statusDraft}`}>{course.isPublished ? "Nashr qilingan" : "Qoralama"}</span></td>
          <td><div className={styles.actions}>
            <Link href={`/admin/courses/${course.id}`} className={styles.iconAction} title="Modullar" aria-label={`${course.title} modullari`}><CoursePageIcon name="modules" /></Link>
            {canEdit && <>
              <button className={styles.iconAction} title="Tahrirlash" aria-label={`${course.title}ni tahrirlash`} onClick={() => openEditor(course)}><CoursePageIcon name="edit" /></button>
              <button className={styles.iconAction} title="Yuqoriga" disabled={busy || index === 0} onClick={() => mutate(`/api/admin/courses/${course.id}/move`, "POST", { direction: "up" })} aria-label={`${course.title} yuqoriga`}><CoursePageIcon name="up" /></button>
              <button className={styles.iconAction} title="Pastga" disabled={busy || index === courses.length - 1} onClick={() => mutate(`/api/admin/courses/${course.id}/move`, "POST", { direction: "down" })} aria-label={`${course.title} pastga`}><CoursePageIcon name="down" /></button>
              <span className={styles.actionDivider} aria-hidden="true" />
              <button className={`${styles.iconAction} ${styles.iconDanger}`} title="O‘chirish" aria-label={`${course.title}ni o‘chirish`} onClick={() => setDeleting(course)}><CoursePageIcon name="trash" /></button>
            </>}
          </div></td>
        </tr>)}</tbody>
      </table></div></div> : <div className={styles.emptyPage}>Hozircha kurs yo‘q.</div>}

      <Modal open={!!editing} onClose={() => { if (!busy) setEditing(null); }} title={editing === "new" ? "Yangi kurs" : "Kursni tahrirlash"}>
        <form onSubmit={save} className="space-y-4">
          <Input label="Kurs nomi" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required />
          <div><label htmlFor="course-description" className="mb-2 block text-sm font-semibold">Tavsif</label><textarea id="course-description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={1000} rows={3} className="w-full rounded-cl-sm border border-muted/60 bg-charcoal px-3.5 py-2 text-ivory outline-none focus:border-gold" /></div>
          <div><label htmlFor="course-level" className="mb-2 block text-sm font-semibold">Daraja</label><select id="course-level" value={level} onChange={(event) => setLevel(event.target.value)} className="h-11 w-full rounded-cl-sm border border-muted/60 bg-charcoal px-3.5 text-ivory"><option value="">Belgilanmagan</option>{levels.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
          {editing !== "new" && <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} className="h-4 w-4 accent-gold" /> O‘quvchilarga nashr qilish</label>}
          {error && <p role="alert" className="text-sm text-alert">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full">{busy ? "Saqlanmoqda..." : "Saqlash"}</Button>
        </form>
      </Modal>
      <Modal open={!!deleting} onClose={() => { if (!busy) setDeleting(null); }} title="Kursni o‘chirish" description={deleting?.title}>
        <p className="text-steel">Kurs, uning modullari va o‘quvchilarga berilgan dostuplar o‘chadi. Darslari bor kurs o‘chirilmaydi.</p>
        <div className="mt-6 flex justify-end gap-3"><Button variant="tertiary" disabled={busy} onClick={() => setDeleting(null)}>Bekor qilish</Button><Button disabled={busy} onClick={() => deleting && mutate(`/api/admin/courses/${deleting.id}`, "DELETE")}>O‘chirish</Button></div>
      </Modal>
      <Toast open={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
}
