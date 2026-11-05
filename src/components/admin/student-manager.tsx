"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { Toast } from "@/components/ui/toast";

type Student = {
  id: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
};

type PendingAction = { kind: "reset" | "status" | "delete"; student: Student };

export function StudentManager({ students, search, total }: { students: Student[]; search: string; total: number }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [secret, setSecret] = useState<{ name: string; pin: string } | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [toast, setToast] = useState("");
  const [actionError, setActionError] = useState("");

  function openAction(kind: PendingAction["kind"], student: Student) {
    setActionError("");
    setPending({ kind, student });
  }

  function searchStudents(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("search") || "").trim();
    router.push(value ? `/admin/students?${new URLSearchParams({ search: value })}` : "/admin/students");
  }

  async function createStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone }),
      });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "O'quvchi yaratilmadi"); return; }
      setCreateOpen(false);
      setFullName("");
      setPhone("");
      setSecret({ name: result.student.fullName, pin: result.pin });
      router.refresh();
    } catch {
      setError("Ulanishda xatolik yuz berdi");
    } finally {
      setBusy(false);
    }
  }

  async function confirmAction() {
    if (!pending || busy) return;
    setActionError("");
    setBusy(true);
    try {
      const { kind, student } = pending;
      const response = await fetch(
        `/api/admin/students/${student.id}${kind === "delete" ? "" : kind === "reset" ? "/reset-pin" : "/status"}`,
        { method: kind === "delete" ? "DELETE" : kind === "reset" ? "POST" : "PATCH", ...(kind === "status" ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !student.isActive }) } : {}) },
      );
      const result = await response.json();
      if (!response.ok) { setActionError(result.error || "Amal bajarilmadi"); return; }
      setPending(null);
      if (kind === "reset") setSecret({ name: student.fullName, pin: result.pin });
      else if (kind === "delete") setToast("O‘quvchi tizimdan butunlay o‘chirildi");
      else setToast(student.isActive ? "O'quvchi bloklandi" : "O'quvchi faollashtirildi");
      router.refresh();
    } catch {
      setActionError("Ulanishda xatolik yuz berdi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <form action="/admin/students" onSubmit={searchStudents} className="flex w-full max-w-lg flex-wrap items-end gap-3 sm:flex-nowrap">
          <div className="min-w-48 flex-1"><Input label="Ism yoki telefon" name="search" defaultValue={search} placeholder="O‘quvchini qidirish" /></div>
          <Button type="submit" variant="secondary">Qidirish</Button>
        </form>
        <Button onClick={() => { setError(""); setCreateOpen(true); }}>+ O‘quvchi qo‘shish</Button>
      </div>
      <p className="mb-3 text-sm text-steel">{total} ta o‘quvchi topildi</p>
      {students.length ? (
        <Table>
          <TableHead><tr><TableHeaderCell>O‘quvchi</TableHeaderCell><TableHeaderCell>Telefon</TableHeaderCell><TableHeaderCell>Holat</TableHeaderCell><TableHeaderCell>Yaratilgan</TableHeaderCell><TableHeaderCell>Amallar</TableHeaderCell></tr></TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-semibold">{student.fullName}</TableCell>
                <TableCell>{student.phone}</TableCell>
                <TableCell>
                  <span className={student.isActive ? "text-gold" : "text-alert"}>{student.isActive ? "Faol" : "Bloklangan"}</span>
                  {student.isActive && student.mustChangePassword && <span className="mt-1 block text-xs text-steel">PIN bilan kiradi</span>}
                </TableCell>
                <TableCell>{new Date(student.createdAt).toLocaleDateString("uz-UZ")}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/admin/students/${student.id}`} className="inline-flex min-h-9 items-center rounded-[8px] border border-bronze px-3 text-sm font-semibold text-ivory hover:bg-bronze/10">Dostup</Link>
                    <Button size="small" variant="tertiary" onClick={() => openAction("reset", student)}>PIN tiklash</Button>
                    <Button size="small" variant="tertiary" onClick={() => openAction("status", student)}>{student.isActive ? "Bloklash" : "Faollashtirish"}</Button>
                    <Button size="small" variant="danger" onClick={() => openAction("delete", student)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7" /></svg>O‘chirish</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : <div className="rounded-cl-lg border border-bronze/20 bg-dark-slate p-8 text-center text-steel">{search ? "Qidiruv bo‘yicha o‘quvchi topilmadi." : "Hozircha o‘quvchi yo‘q. Birinchi o‘quvchini qo‘shing."}</div>}

      <Modal open={createOpen} onClose={() => { if (!busy) setCreateOpen(false); }} title="Yangi o‘quvchi" description="O‘quvchi uchun 6 xonali PIN yaratiladi va faqat bir marta ko‘rsatiladi.">
        <form onSubmit={createStudent} className="space-y-4">
          <Input label="Ism va familiya" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} minLength={2} maxLength={120} required />
          <Input label="Telefon raqami" type="tel" inputMode="tel" autoComplete="tel" placeholder="+998 90 123 45 67" value={phone} onChange={(event) => setPhone(event.target.value)} required />
          {error && <p role="alert" className="text-sm text-alert">{error}</p>}
          <Button type="submit" disabled={busy} className="w-full">{busy ? "Yaratilmoqda..." : "O‘quvchi yaratish"}</Button>
        </form>
      </Modal>

      <Modal open={!!secret} onClose={() => setSecret(null)} title="Bir martalik PIN" description={`${secret?.name || "O‘quvchi"} uchun PIN. Yopilgandan keyin qayta ko‘rish mumkin emas.`}>
        <div className="rounded-cl-md border border-gold/40 bg-charcoal px-4 py-5 text-center font-mono text-3xl font-bold tracking-[0.3em] text-gold" aria-label="Yangi PIN">{secret?.pin}</div>
        <p className="mt-4 text-sm text-steel">PINni o‘quvchiga xavfsiz yetkazing. Bazada faqat hash saqlanadi.</p>
        <Button className="mt-5 w-full" onClick={() => setSecret(null)}>Tushunarli</Button>
      </Modal>

      <Modal open={!!pending} onClose={() => { if (!busy) setPending(null); }} title={pending?.kind === "delete" ? "O‘quvchini butunlay o‘chirish" : pending?.kind === "reset" ? "PINni tiklash" : pending?.student.isActive ? "O‘quvchini bloklash" : "O‘quvchini faollashtirish"} description={pending ? `${pending.student.fullName} · ${pending.student.phone}` : undefined}>
        <p className="text-steel">{pending?.kind === "delete" ? "O‘quvchi akkaunti, profili, kurs dostuplari va barcha dars natijalari bazadan butunlay o‘chiriladi. Tizimga kirish bekor qilinadi. Bu amalni ortga qaytarib bo‘lmaydi." : pending?.kind === "reset" ? "Eski PIN/parol va barcha avvalgi sessiyalar bekor bo‘ladi." : pending?.student.isActive ? "O‘quvchi darhol tizimdan chiqadi va kira olmaydi." : "O‘quvchi yana tizimga kira oladi."}</p>
        {actionError && <p role="alert" className="mt-3 text-alert">{actionError}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="tertiary" onClick={() => setPending(null)} disabled={busy}>Bekor qilish</Button>
          <Button variant={pending?.kind === "delete" ? "danger" : "primary"} onClick={confirmAction} disabled={busy}>{busy ? "Bajarilmoqda..." : pending?.kind === "delete" ? "Butunlay o‘chirish" : "Tasdiqlash"}</Button>
        </div>
      </Modal>
      <Toast open={!!toast} message={toast} variant="info" onClose={() => setToast("")} />
    </>
  );
}
