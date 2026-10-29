"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/table";
import { Toast } from "@/components/ui/toast";

const colors = [
  { name: "Charcoal", code: "#0D1114", className: "bg-charcoal" },
  { name: "Dark Slate", code: "#161B1F", className: "bg-dark-slate" },
  { name: "Bronze", code: "#B8814A", className: "bg-bronze" },
  { name: "Gold", code: "#D4AF7C", className: "bg-gold" },
  { name: "Ivory", code: "#F4F1E8", className: "bg-ivory" },
];

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  return (
    <main className="min-h-screen bg-charcoal">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-7 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-5 border-b border-bronze/25 pb-7">
          <Image src="/coliseum-logo-horizontal.svg" alt="Coliseum Logistics School" width={260} height={63} priority />
          <Link href="/" className="text-sm font-medium text-steel underline-offset-4 hover:text-gold hover:underline focus-visible:outline-2 focus-visible:outline-gold">
            Bosh sahifaga qaytish
          </Link>
        </header>

        <section className="py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Coliseum / Dizayn tizimi / 01</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Ingliz tili platformasining vizual asosi
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-steel">
            Ranglar, matn, komponentlar va holatlar uchun namuna sahifa. Bu yerda haqiqiy o‘quvchi yoki kurs ma’lumotlari yo‘q.
          </p>
        </section>

        <div className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
          <Card title="Rang palitrasi" description="Landing dizayn paketidagi asosiy ranglar.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {colors.map((color) => (
                <div key={color.name} className="min-w-0">
                  <div className={`h-20 rounded-cl-sm border border-white/20 ${color.className}`} />
                  <p className="mt-3 text-sm font-semibold">{color.name}</p>
                  <p className="mt-0.5 text-xs text-steel">{color.code}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Tipografiya" description="Inter Variable; aniq va qulay o‘qiladigan iyerarxiya.">
            <div className="space-y-4">
              <p className="text-3xl font-bold tracking-tight">Sarlavha namunasi</p>
              <p className="text-xl font-semibold">Bo‘lim sarlavhasi</p>
              <p className="text-base leading-7 text-steel">Asosiy matn darslarni uzoq vaqt o‘qishda ham ravshan qoladi.</p>
              <p className="text-sm text-muted">Yordamchi matn va izohlar</p>
            </div>
          </Card>
        </div>

        <section className="mt-10 grid gap-7 lg:grid-cols-2" aria-label="Interfeys komponentlari">
          <Card title="Tugmalar" description="Asosiy, ikkilamchi va uchinchi darajali amallar.">
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setToast("Asosiy tugma bosildi.")}>Asosiy amal <span aria-hidden="true">→</span></Button>
              <Button variant="secondary" onClick={() => setModalOpen(true)}>Modalni ochish</Button>
              <Button variant="tertiary" onClick={() => setToast("Bildirishnoma ko‘rsatildi.")}>Bildirishnoma</Button>
              <Button disabled>O‘chirilgan</Button>
            </div>
          </Card>

          <Card title="Kiritish maydonlari" description="Yorliq, yordamchi matn va xato holati.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Telefon raqam" type="tel" placeholder="+998 90 123 45 67" hint="Namuna format: +998XXXXXXXXX" />
              <Input label="Tasdiqlash kodi" type="text" placeholder="6 xonali PIN" error="Kod noto‘g‘ri kiritildi" />
            </div>
          </Card>

          <Card title="Karta" description="Kurs va modul ma’lumotlari uchun oddiy sirt namunasi.">
            <div className="rounded-cl-md border border-bronze/25 bg-charcoal p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Namuna kurs</p>
              <h3 className="mt-2 text-xl font-semibold">English for Logistics</h3>
              <p className="mt-2 text-sm leading-6 text-steel">Karta uslubi keyingi bosqichlardagi haqiqiy kurslarga qo‘llanadi.</p>
            </div>
          </Card>

          <Card title="Jadval" description="Keng jadval kichik ekranda yon tomonga aylantiriladi.">
            <Table aria-label="Darslar namunasi">
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Dars</TableHeaderCell>
                  <TableHeaderCell>Modul</TableHeaderCell>
                  <TableHeaderCell>Holat</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Salomlashuv</TableCell>
                  <TableCell>Asoslar</TableCell>
                  <TableCell><span className="rounded-full bg-bronze/15 px-2.5 py-1 text-xs font-semibold text-gold">Namuna</span></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Kasb so‘zlari</TableCell>
                  <TableCell>Asoslar</TableCell>
                  <TableCell><span className="rounded-full bg-bronze/15 px-2.5 py-1 text-xs font-semibold text-gold">Namuna</span></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </section>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Amalni tasdiqlash"
        description="Modal komponenti uchun ko‘rinish va klaviatura sinovi."
        footer={
          <>
            <Button variant="tertiary" onClick={() => setModalOpen(false)}>Bekor qilish</Button>
            <Button onClick={() => { setModalOpen(false); setToast("Amal tasdiqlandi."); }}>Tasdiqlash</Button>
          </>
        }
      >
        Bu oynadagi amal faqat namuna. Hech qanday ma’lumot saqlanmaydi.
      </Modal>
      <Toast open={Boolean(toast)} message={toast} variant="success" onClose={() => setToast("")} />
    </main>
  );
}
