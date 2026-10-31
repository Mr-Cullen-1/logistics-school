"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Toast } from "@/components/ui/toast";

type Module = { id: string; title: string; order: number };
type Course = { id: string; title: string; description: string | null; level: string | null; isPublished: boolean };

export function ModuleManager({ course, modules, canEdit }: { course: Course; modules: Module[]; canEdit: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Module | "new" | null>(null);
  const [deleting, setDeleting] = useState<Module | null>(null);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

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

  return <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
    <Link href="/admin/courses" className="text-sm text-gold hover:underline">← Kurslar</Link>
    <div className="mt-6 mb-8"><span className="text-sm font-semibold text-gold">{course.level || "Daraja belgilanmagan"} · {course.isPublished ? "Nashr qilingan" : "Qoralama"}</span><h1 className="mt-2 text-3xl font-bold">{course.title}</h1>{course.description && <p className="mt-3 text-steel">{course.description}</p>}</div>
    <div className="mb-4 flex items-center justify-between gap-4"><h2 className="text-xl font-semibold">Modullar</h2>{canEdit && <Button onClick={() => openEditor()}>+ Modul qo‘shish</Button>}</div>
    {modules.length ? <div className="space-y-3">{modules.map((module, index) => <Card key={module.id}>
      <div className="flex flex-wrap items-center justify-between gap-4"><span className="font-semibold">{index + 1}. {module.title}</span>{canEdit && <div className="flex flex-wrap gap-2">
        <Button size="small" variant="tertiary" onClick={() => openEditor(module)}>Tahrirlash</Button>
        <Button size="small" variant="tertiary" disabled={busy || index === 0} onClick={() => mutate(`/api/admin/modules/${module.id}/move`, "POST", { direction: "up" })} aria-label={`${module.title} yuqoriga`}>↑</Button>
        <Button size="small" variant="tertiary" disabled={busy || index === modules.length - 1} onClick={() => mutate(`/api/admin/modules/${module.id}/move`, "POST", { direction: "down" })} aria-label={`${module.title} pastga`}>↓</Button>
        <Button size="small" variant="tertiary" onClick={() => setDeleting(module)}>O‘chirish</Button>
      </div>}</div>
    </Card>)}</div> : <Card title="Modullar hali yo‘q" description="Kurs uchun birinchi modulni qo‘shing." />}

    <Modal open={!!editing} onClose={() => { if (!busy) setEditing(null); }} title={editing === "new" ? "Yangi modul" : "Modulni tahrirlash"}>
      <form onSubmit={save} className="space-y-4"><Input label="Modul nomi" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required />{error && <p role="alert" className="text-sm text-alert">{error}</p>}<Button type="submit" disabled={busy} className="w-full">{busy ? "Saqlanmoqda..." : "Saqlash"}</Button></form>
    </Modal>
    <Modal open={!!deleting} onClose={() => { if (!busy) setDeleting(null); }} title="Modulni o‘chirish" description={deleting?.title}>
      <p className="text-steel">Darslari bor modul o‘chirilmaydi.</p><div className="mt-6 flex justify-end gap-3"><Button variant="tertiary" disabled={busy} onClick={() => setDeleting(null)}>Bekor qilish</Button><Button disabled={busy} onClick={() => deleting && mutate(`/api/admin/modules/${deleting.id}`, "DELETE")}>O‘chirish</Button></div>
    </Modal>
    <Toast open={!!toast} message={toast} onClose={() => setToast("")} />
  </div>;
}
