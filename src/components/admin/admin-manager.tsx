"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";

type Admin = { id: string; fullName: string; phone: string; isActive: boolean; mustChangePassword: boolean; createdAt: string };

export function AdminManager({ admins }: { admins: Admin[] }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [secret, setSecret] = useState<{ name: string; pin: string } | null>(null);

  async function createAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/admins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName, phone }) });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Admin yaratilmadi"); return; }
      setCreateOpen(false);
      setFullName("");
      setPhone("");
      setSecret({ name: result.admin.fullName, pin: result.pin });
      router.refresh();
    } catch { setError("Ulanishda xatolik yuz berdi"); }
    finally { setBusy(false); }
  }

  return <>
    <div className="mb-5 flex justify-end"><Button onClick={() => { setError(""); setCreateOpen(true); }}>+ Admin qo‘shish</Button></div>
    {admins.length ? <Table><TableHead><tr><TableHeaderCell>Admin</TableHeaderCell><TableHeaderCell>Telefon</TableHeaderCell><TableHeaderCell>Holat</TableHeaderCell><TableHeaderCell>Yaratilgan</TableHeaderCell></tr></TableHead><TableBody>{admins.map((admin) => <TableRow key={admin.id}>
      <TableCell className="font-semibold">{admin.fullName}</TableCell>
      <TableCell>{admin.phone}</TableCell>
      <TableCell><span className={admin.isActive ? "text-gold" : "text-alert"}>{admin.isActive ? "Faol" : "Bloklangan"}</span>{admin.isActive && admin.mustChangePassword && <span className="mt-1 block text-xs text-steel">PIN bilan kiradi</span>}</TableCell>
      <TableCell>{new Date(admin.createdAt).toLocaleDateString("uz-UZ")}</TableCell>
    </TableRow>)}</TableBody></Table> : <div className="rounded-cl-lg border border-bronze/20 bg-dark-slate p-8 text-center text-steel">Hozircha admin yo‘q. Birinchi adminni qo‘shing.</div>}

    <Modal open={createOpen} onClose={() => { if (!busy) setCreateOpen(false); }} title="Yangi admin" description="Admin uchun 6 xonali PIN yaratiladi va faqat bir marta ko‘rsatiladi.">
      <form onSubmit={createAdmin} className="space-y-4">
        <Input label="Ism va familiya" autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} minLength={2} maxLength={120} required />
        <Input label="Telefon raqami" type="tel" inputMode="tel" autoComplete="tel" placeholder="+998 90 123 45 67" value={phone} onChange={(event) => setPhone(event.target.value)} required />
        {error && <p role="alert" className="text-sm text-alert">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">{busy ? "Yaratilmoqda..." : "Admin yaratish"}</Button>
      </form>
    </Modal>
    <Modal open={!!secret} onClose={() => setSecret(null)} title="Bir martalik PIN" description={`${secret?.name || "Admin"} uchun PIN. Yopilgandan keyin qayta ko‘rish mumkin emas.`}>
      <div className="rounded-cl-md border border-gold/40 bg-charcoal px-4 py-5 text-center font-mono text-3xl font-bold tracking-[0.3em] text-gold" aria-label="Yangi PIN">{secret?.pin}</div>
      <p className="mt-4 text-sm text-steel">PINni adminga xavfsiz yetkazing. U birinchi kirishda yangi parol yaratadi.</p>
      <Button className="mt-5 w-full" onClick={() => setSecret(null)}>Tushunarli</Button>
    </Modal>
  </>;
}
