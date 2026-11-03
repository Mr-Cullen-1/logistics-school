"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AdminIcon } from "./admin-icon";
import { CoursePageIcon } from "./course-page-icons";
import styles from "./course-pages.module.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Toast } from "@/components/ui/toast";

type Module = { id: string; title: string; order: number };
type Course = { id: string; title: string; description: string | null; level: string | null; isPublished: boolean };
type Lesson = { id: string; moduleId: string; code: string | null; title: string; status: "draft" | "published" };

export function ModuleManager({ course, modules, lessons, canEdit }: { course: Course; modules: Module[]; lessons: Lesson[]; canEdit: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Module | "new" | null>(null);
  const [deleting, setDeleting] = useState<Module | null>(null);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [lessonModule, setLessonModule] = useState<Module | null>(null);
  const [lessonCode, setLessonCode] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");

  function openEditor(module?: Module) {
    setEditing(module || "new");
    setTitle(module?.title || "");
    setError("");
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setBusy(true);
    setError("");
    try {
      const isNew = editing === "new";
      const response = await fetch(isNew ? `/api/admin/courses/${course.id}/modules` : `/api/admin/modules/${editing.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Modul saqlanmadi"); return; }
      setEditing(null);
      setToast(isNew ? "Modul yaratildi" : "Modul yangilandi");
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

  async function createLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lessonModule) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/lessons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ moduleId: lessonModule.id, code: lessonCode.toUpperCase().trim(), title: lessonTitle }) });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Dars yaratilmadi"); return; }
      setLessonModule(null);
      setLessonCode("");
      setLessonTitle("");
      router.refresh();
    } catch { setError("Ulanishda xatolik yuz berdi"); }
    finally { setBusy(false); }
  }

  return <div className={styles.page}>
    <Link href="/admin/courses" className={`${styles.back} ${styles.backMuted}`}><CoursePageIcon name="back" size={16} /> Kurslar</Link>
    <div className={styles.courseHeading}>
      <h1>{course.title}</h1>
      <div className={styles.courseMeta}><span className={styles.level}>{course.level || "—"}</span><span className={`${styles.status} ${course.isPublished ? "" : styles.statusDraft}`}>{course.isPublished ? "Nashr qilingan" : "Qoralama"}</span></div>
      {course.description && <p className={styles.courseDescription}>{course.description}</p>}
    </div>
    <div className={styles.sectionHeader}><h2>Modullar</h2>{canEdit && <button className={styles.primary} onClick={() => openEditor()}><CoursePageIcon name="plus" size={18} /> Modul qo‘shish</button>}</div>
    {modules.length ? <div className={styles.moduleList}>{modules.map((module, index) => {
      const moduleLessons = lessons.filter((lesson) => lesson.moduleId === module.id);
      return <section className={styles.moduleCard} key={module.id} aria-labelledby={`module-${module.id}`}>
        <div className={styles.moduleHeader}>
          <h3 id={`module-${module.id}`}><span className={styles.moduleNumber}>{index + 1}.</span>{module.title}</h3>
          {canEdit && <div className={styles.actions}>
            <button className={styles.iconAction} title="Tahrirlash" aria-label={`${module.title}ni tahrirlash`} onClick={() => openEditor(module)}><CoursePageIcon name="edit" /></button>
            <button className={styles.iconAction} title="Yuqoriga" disabled={busy || index === 0} onClick={() => mutate(`/api/admin/modules/${module.id}/move`, "POST", { direction: "up" })} aria-label={`${module.title} yuqoriga`}><CoursePageIcon name="up" /></button>
            <button className={styles.iconAction} title="Pastga" disabled={busy || index === modules.length - 1} onClick={() => mutate(`/api/admin/modules/${module.id}/move`, "POST", { direction: "down" })} aria-label={`${module.title} pastga`}><CoursePageIcon name="down" /></button>
            <span className={styles.actionDivider} aria-hidden="true" />
            <button className={`${styles.iconAction} ${styles.iconDanger}`} title="O‘chirish" aria-label={`${module.title}ni o‘chirish`} onClick={() => setDeleting(module)}><CoursePageIcon name="trash" /></button>
          </div>}
        </div>
        <div className={styles.moduleBody}>
          <div className={styles.lessonsHeader}><h4>Darslar</h4>{canEdit && <button className={styles.addLesson} onClick={() => { setLessonModule(module); setError(""); }}><CoursePageIcon name="plus" size={14} /> Dars</button>}</div>
          {moduleLessons.length ? <ul className={styles.lessonList}>{moduleLessons.map((lesson) => <li className={styles.lessonRow} key={lesson.id}>
            <Link className={styles.lessonLink} href={`/admin/lessons/${lesson.id}`}><span className={styles.lessonIcon}>{lesson.code === "INTRO" ? <CoursePageIcon name="file" size={20} /> : <CoursePageIcon name="play" size={20} />}</span><span className={styles.lessonName}>{lesson.code || "Kod belgilanmagan"} - {lesson.title}</span><span className={`${styles.lessonStatus} ${lesson.status === "draft" ? styles.lessonStatusDraft : ""}`}>{lesson.status === "published" ? "Nashr" : "Draft"}</span></Link>
            {canEdit && <div className={styles.lessonActions}><Link href={`/admin/lessons/${lesson.id}`} className={styles.iconAction} aria-label={`${lesson.title}ni ochish`} title="Darsni ochish"><CoursePageIcon name="edit" size={15} /></Link></div>}
          </li>)}</ul> : <div className={styles.emptyLessons}><AdminIcon name="book" size={27} /><p>Darslar hali yo‘q.</p></div>}
        </div>
      </section>;
    })}</div> : <div className={styles.emptyPage}>Modullar hali yo‘q. Kurs uchun birinchi modulni qo‘shing.</div>}

    <Modal open={!!editing} onClose={() => { if (!busy) setEditing(null); }} title={editing === "new" ? "Yangi modul" : "Modulni tahrirlash"}>
      <form onSubmit={save} className="space-y-4"><Input label="Modul nomi" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required />{error && <p role="alert" className="text-sm text-alert">{error}</p>}<Button type="submit" disabled={busy} className="w-full">{busy ? "Saqlanmoqda..." : "Saqlash"}</Button></form>
    </Modal>
    <Modal open={!!deleting} onClose={() => { if (!busy) setDeleting(null); }} title="Modulni o‘chirish" description={deleting?.title}>
      <p className="text-steel">Darslari bor modul o‘chirilmaydi.</p><div className="mt-6 flex justify-end gap-3"><Button variant="tertiary" disabled={busy} onClick={() => setDeleting(null)}>Bekor qilish</Button><Button disabled={busy} onClick={() => deleting && mutate(`/api/admin/modules/${deleting.id}`, "DELETE")}>O‘chirish</Button></div>
    </Modal>
    <Modal open={!!lessonModule} onClose={() => { if (!busy) setLessonModule(null); }} title="Yangi dars" description={lessonModule?.title}>
      <form onSubmit={createLesson} className="space-y-4"><Input label="Dars kodi (masalan M1L01 yoki INTRO)" value={lessonCode} onChange={(event) => setLessonCode(event.target.value)} required /><Input label="Dars nomi" value={lessonTitle} onChange={(event) => setLessonTitle(event.target.value)} required />{error && <p role="alert" className="text-sm text-alert">{error}</p>}<Button type="submit" disabled={busy}>Yaratish</Button></form>
    </Modal>
    <Toast open={!!toast} message={toast} onClose={() => setToast("")} />
  </div>;
}
