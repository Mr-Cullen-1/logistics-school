"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { Toast } from "@/components/ui/toast";

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
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/admin" className="text-sm text-gold hover:underline">← Boshqaruv paneli</Link>
      <div className="mt-6 mb-7 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-bold">Kurslar</h1><p className="mt-2 text-sm text-steel">Modullar va nashr holatini boshqaring.</p></div>
        {canEdit && <Button onClick={() => openEditor()}>+ Kurs yaratish</Button>}
      </div>
      {courses.length ? <Table>
        <TableHead><tr><TableHeaderCell>Kurs</TableHeaderCell><TableHeaderCell>Daraja</TableHeaderCell><TableHeaderCell>Holat</TableHeaderCell><TableHeaderCell>Amallar</TableHeaderCell></tr></TableHead>
        <TableBody>{courses.map((course, index) => <TableRow key={course.id}>
          <TableCell><Link href={`/admin/courses/${course.id}`} className="font-semibold text-gold hover:underline">{course.title}</Link>{course.description && <p className="mt-1 max-w-xl text-xs text-steel">{course.description}</p>}</TableCell>
          <TableCell>{course.level || "—"}</TableCell>
          <TableCell><span className={course.isPublished ? "text-gold" : "text-steel"}>{course.isPublished ? "Nashr qilingan" : "Qoralama"}</span></TableCell>
          <TableCell><div className="flex flex-wrap gap-2">
            <Link href={`/admin/courses/${course.id}`} className="inline-flex min-h-9 items-center rounded-[8px] border border-bronze px-3 text-sm font-semibold text-ivory hover:bg-bronze/10">Modullar</Link>
            {canEdit && <>
              <Button size="small" variant="tertiary" onClick={() => openEditor(course)}>Tahrirlash</Button>
              <Button size="small" variant="tertiary" disabled={busy || index === 0} onClick={() => mutate(`/api/admin/courses/${course.id}/move`, "POST", { direction: "up" })} aria-label={`${course.title} yuqoriga`}>↑</Button>
              <Button size="small" variant="tertiary" disabled={busy || index === courses.length - 1} onClick={() => mutate(`/api/admin/courses/${course.id}/move`, "POST", { direction: "down" })} aria-label={`${course.title} pastga`}>↓</Button>
              <Button size="small" variant="tertiary" onClick={() => setDeleting(course)}>O‘chirish</Button>
            </>}
          </div></TableCell>
        </TableRow>)}</TableBody>
      </Table> : <div className="rounded-cl-lg border border-bronze/20 bg-dark-slate p-8 text-center text-steel">Hozircha kurs yo‘q.</div>}

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
    </main>
  );
}
