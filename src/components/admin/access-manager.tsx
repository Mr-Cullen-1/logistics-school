"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Toast } from "@/components/ui/toast";

type Course = { id: string; title: string; isPublished: boolean };
type Grant = { courseId: string; title: string; isPublished: boolean; isActive: boolean; expiresAt: string | null };
type Student = { id: string; fullName: string; phone: string };

export function AccessManager({ student, courses, grants, asOf }: { student: Student; courses: Course[]; grants: Grant[]; asOf: string }) {
  const router = useRouter();
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [expiresOn, setExpiresOn] = useState("");
  const [revoke, setRevoke] = useState<Grant | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  async function grantAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/students/${student.id}/access`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, expiresOn: expiresOn || null }),
      });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Dostup saqlanmadi"); return; }
      setToast("Dostup berildi");
      router.refresh();
    } catch {
      setError("Ulanishda xatolik yuz berdi");
    } finally {
      setBusy(false);
    }
  }

  async function revokeAccess() {
    if (!revoke) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/students/${student.id}/access/${revoke.courseId}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) { setToast(result.error || "Dostup bekor qilinmadi"); return; }
      setRevoke(null);
      setToast("Dostup bekor qilindi");
      router.refresh();
    } catch {
      setToast("Ulanishda xatolik yuz berdi");
    } finally {
      setBusy(false);
    }
  }

  return <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 sm:px-6">
    <Link href="/admin/students" className="text-sm text-gold hover:underline">← O‘quvchilar</Link>
    <div className="mt-6 mb-8"><h1 className="text-3xl font-bold">{student.fullName}</h1><p className="mt-2 text-steel">{student.phone} · Kurs dostuplari</p></div>
    <Card title="Kursga dostup berish" description="Muddat ixtiyoriy. Sana tanlansa, dostup Toshkent vaqti bo‘yicha shu kun oxirigacha amal qiladi.">
      {courses.length ? <form onSubmit={grantAccess} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div><label htmlFor="access-course" className="mb-2 block text-sm font-semibold">Kurs</label><select id="access-course" value={courseId} onChange={(event) => setCourseId(event.target.value)} className="h-11 w-full rounded-cl-sm border border-muted/60 bg-charcoal px-3.5 text-ivory">{courses.map((course) => <option key={course.id} value={course.id}>{course.title}{course.isPublished ? "" : " (qoralama)"}</option>)}</select></div>
        <div><label htmlFor="access-expiry" className="mb-2 block text-sm font-semibold">Oxirgi sana</label><input id="access-expiry" type="date" value={expiresOn} onChange={(event) => setExpiresOn(event.target.value)} className="h-11 w-full rounded-cl-sm border border-muted/60 bg-charcoal px-3.5 text-ivory" /></div>
        <Button type="submit" disabled={busy || !courseId}>{busy ? "Saqlanmoqda..." : "Dostup berish"}</Button>
        {error && <p role="alert" className="text-sm text-alert sm:col-span-3">{error}</p>}
      </form> : <p className="text-steel">Avval super admin kurs yaratishi kerak.</p>}
    </Card>
    <h2 className="mt-8 mb-4 text-xl font-semibold">Berilgan dostuplar</h2>
    {grants.length ? <div className="space-y-3">{grants.map((grant) => {
      const expired = grant.expiresAt ? grant.expiresAt <= asOf : false;
      const status = !grant.isActive ? "Bekor qilingan" : expired ? "Muddati tugagan" : !grant.isPublished ? "Kurs qoralamada" : "Faol";
      return <Card key={grant.courseId}>
        <div className="flex flex-wrap items-center justify-between gap-4"><div><h3 className="font-semibold">{grant.title}</h3><p className="mt-1 text-sm text-steel">{status}{grant.expiresAt ? ` · ${new Date(grant.expiresAt).toLocaleDateString("uz-UZ", { timeZone: "Asia/Tashkent" })} gacha` : " · muddatsiz"}</p></div>{grant.isActive && <Button size="small" variant="tertiary" onClick={() => setRevoke(grant)}>Bekor qilish</Button>}</div>
      </Card>;
    })}</div> : <Card title="Dostup hali berilmagan" description="Yuqoridagi formadan kurs tanlang." />}
    <Modal open={!!revoke} onClose={() => { if (!busy) setRevoke(null); }} title="Dostupni bekor qilish" description={revoke?.title}>
      <p className="text-steel">O‘quvchi bu kursga darhol kira olmaydi.</p><div className="mt-6 flex justify-end gap-3"><Button variant="tertiary" disabled={busy} onClick={() => setRevoke(null)}>Orqaga</Button><Button disabled={busy} onClick={revokeAccess}>Bekor qilish</Button></div>
    </Modal>
    <Toast open={!!toast} message={toast} onClose={() => setToast("")} />
  </main>;
}
