"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Intro = { id: string; title: string; status: "draft" | "published" };
type Section = { id: string; moduleTitle: string; courseTitle: string };

export function IntroManager({ intro, sections, canEdit }: { intro: Intro | null; sections: Section[]; canEdit: boolean }) {
  const router = useRouter();
  const [moduleId, setModuleId] = useState(sections[0]?.id || "");
  const [title, setTitle] = useState("English for Logistics: The Why");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/lessons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ moduleId, code: "INTRO", title }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Intro yaratilmadi");
      router.push(`/admin/lessons/${result.lesson.id}`);
      router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Intro yaratilmadi"); }
    finally { setBusy(false); }
  }

  return <div className="mt-6 space-y-5"><div><p className="text-sm font-semibold text-gold">Alohida demo dars</p><h1 className="mt-2 text-3xl font-bold">Intro darsi</h1><p className="mt-2 text-steel">Login qilgan barcha o‘quvchilar Intro’ni kurs dostupsiz ko‘radi. Kurs darslari avvalgidek faqat admin bergan dostup bilan ochiladi.</p></div>
    {intro ? <Card><h2 className="text-lg font-semibold">{intro.title}</h2><p className="mt-1 text-sm text-steel">{intro.status === "published" ? "Nashr qilingan" : "Draft — o‘quvchilarga ko‘rinmaydi"}</p><Link className="mt-4 inline-block rounded-lg bg-gold px-5 py-3 font-semibold text-charcoal" href={`/admin/lessons/${intro.id}`}>Fayllar va nashrni boshqarish →</Link></Card> : canEdit ? sections.length ? <Card><h2 className="mb-3 text-lg font-semibold">Intro yaratish</h2><form onSubmit={create} className="space-y-4"><Input label="Dars nomi" value={title} onChange={(event) => setTitle(event.target.value)} required /><label className="block text-sm">Saqlash uchun modul<select className="mt-2 block w-full rounded-lg border border-white/20 bg-charcoal p-3" value={moduleId} onChange={(event) => setModuleId(event.target.value)}>{sections.map((section) => <option key={section.id} value={section.id}>{section.courseTitle} · {section.moduleTitle}</option>)}</select></label><p className="text-sm text-steel">Bu modul faqat saqlash joyi; Intro ko‘rinishi kurs dostupiga bog‘liq emas.</p>{error && <p role="alert" className="text-sm text-alert">{error}</p>}<Button type="submit" disabled={busy || !moduleId}>Yaratish</Button></form></Card> : <Card><p>Intro yaratish uchun avval kurs va modul yarating.</p><Link href="/admin/courses" className="mt-3 inline-block text-gold underline">Kurslarga o‘tish</Link></Card> : <Card><p>Intro hali yaratilmagan. Super admin uni shu yerdan qo‘shadi.</p></Card>}
  </div>;
}
