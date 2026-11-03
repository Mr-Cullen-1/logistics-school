"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LessonFrame } from "@/components/learn/lesson-frame";
import { parseLessonFilename, practiceMechanics, publishReadiness, selectPublishFiles, validateUploadSelection, type LessonKind } from "@/lib/lessons/rules";

type FileRow = { id: string; kind: string; seq: number; mechanic: string | null; version: number; status: "draft" | "published"; isCurrent: boolean; sizeBytes: number; previewed: boolean };
type Lesson = { id: string; code: string | null; title: string; status: "draft" | "published" };
const mechanics = practiceMechanics;

export function LessonManager({ lesson, files, canEdit }: { lesson: Lesson; files: FileRow[]; canEdit: boolean }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<File[]>([]);
  const [selectedKind, setSelectedKind] = useState<LessonKind>("learn");
  const [kinds, setKinds] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<{ id: string; kind: "learn" | "practice"; compiledJs: string } | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [previewCheck, setPreviewCheck] = useState(0);
  const [previewLang, setPreviewLang] = useState<"" | "uz" | "ru" | "en">("uz");
  const [verifiedIds, setVerifiedIds] = useState<string[]>([]);
  const candidates = selectPublishFiles(files);
  const missingPreview = candidates.filter((file) => !file.previewed && !verifiedIds.includes(file.id));
  const readiness = lesson.code ? publishReadiness(lesson.code, candidates.map((file) => ({ kind: file.kind as "learn" | "practice", seq: file.seq, mechanic: file.mechanic }))) : ["Dars kodi belgilanmagan"];
  if (missingPreview.length) readiness.push(`${missingPreview.length} ta fayl iframe previewda tekshirilmagan`);

  function choose(event: ChangeEvent<HTMLInputElement>, kind: LessonKind) {
    const chosen = Array.from(event.target.files || []);
    const error = validateUploadSelection(lesson.code || "", kind, chosen.map((file) => file.name));
    setSelectedKind(kind);
    setSelected(error ? [] : chosen);
    setKinds(error || kind === "learn" ? {} : Object.fromEntries(chosen.map((file) => [file.name, file.name.startsWith("M1L01.p") ? (["MC", "MATCH", "READ-MC", "GAP", "ORDER", "ORDER", "FIX", "SORT", "READ-TYPE", "SCENE"][Number(parseLessonFilename(file.name)?.seq || 0) - 1] || "") : ""])));
    setMessage(error || "");
    if (error) event.target.value = "";
  }

  async function upload() {
    setBusy(true);
    setMessage("");
    try {
      const body = new FormData();
      selected.forEach((file) => body.append("files", file));
      body.set("kind", selectedKind);
      body.set("mechanics", JSON.stringify(selectedKind === "practice" ? kinds : {}));
      const response = await fetch(`/api/admin/lessons/${lesson.id}/files`, { method: "POST", body });
      const result = await response.json();
      setMessage(result.results?.map((item: { name: string; ok: boolean; error?: string; version?: number }) => `${item.name}: ${item.ok ? `v${item.version} saqlandi` : item.error}`).join("\n") || result.error || "Yuklash tugadi");
      if (response.ok) {
        const failed = selected.filter((file) => result.results?.some((item: { name: string; ok: boolean }) => item.name === file.name && !item.ok));
        setSelected(failed);
        if (!failed.length && fileInputRef.current) fileInputRef.current.value = "";
        if (result.results?.some((item: { ok: boolean }) => item.ok)) router.refresh();
      }
    } catch { setMessage("Ulanishda xatolik yuz berdi"); }
    finally { setBusy(false); }
  }

  async function act(path: string, body?: object) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/lessons/${lesson.id}/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
      const result = await response.json();
      setMessage(response.ok ? "Saqlandi" : [result.error, ...(result.errors || [])].filter(Boolean).join(" · "));
      if (response.ok) router.refresh();
    } catch { setMessage("Ulanishda xatolik yuz berdi"); }
    finally { setBusy(false); }
  }

  async function openPreview(file: FileRow) {
    setMessage("");
    const response = await fetch(`/api/admin/lessons/${lesson.id}/files/${file.id}`, { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error || "Preview ochilmadi"); return; }
    setPreview({ id: file.id, kind: file.kind as "learn" | "practice", compiledJs: result.file.compiledJs });
    setPreviewReady(false);
    setPreviewCheck(0);
  }

  async function markPreviewed(fileId: string) {
    if (!canEdit || files.find((file) => file.id === fileId)?.previewed || verifiedIds.includes(fileId)) return;
    const response = await fetch(`/api/admin/lessons/${lesson.id}/files/${fileId}/verify`, { method: "POST" });
    if (response.ok) setVerifiedIds((ids) => ids.includes(fileId) ? ids : [...ids, fileId]);
    else setMessage("Preview tasdiqlanmadi. Qayta ochib ko‘ring.");
  }

  return <div className="mt-6 space-y-5"><div><span className="text-sm text-gold">{lesson.code || "Kod yo‘q"} · {lesson.status === "published" ? "Nashr qilingan" : "Draft"}</span><h1 className="mt-2 text-2xl font-bold">{lesson.title}</h1></div>
    <Card><h2 className="mb-3 text-lg font-semibold">Fayllar</h2><div className="grid gap-2 sm:grid-cols-2">{[0, ...(lesson.code === "INTRO" ? [] : Array.from({ length: 10 }, (_, i) => i + 1))].map((seq) => {
      const file = candidates.find((item) => item.seq === seq && item.kind === (seq === 0 ? "learn" : "practice"));
      return <div key={seq} className="rounded-lg border border-white/10 p-3 text-sm"><strong>{seq === 0 ? "Learn" : `p${String(seq).padStart(2, "0")}`}</strong><span className="ml-3 text-steel">{file ? `v${file.version} · ${file.mechanic || file.status}` : "Yetishmaydi"}</span></div>;
    })}</div></Card>
    {files.length > 0 && <Card><h2 className="mb-3 text-lg font-semibold">Versiyalar</h2><ul className="space-y-2">{files.map((file) => <li key={file.id} className="flex flex-wrap items-center justify-between gap-2 text-sm"><span>{file.kind === "learn" ? "Learn" : `p${String(file.seq).padStart(2, "0")}`} · v{file.version} · {file.status}{file.isCurrent ? " · joriy" : ""}{file.previewed || verifiedIds.includes(file.id) ? " · Preview OK" : " · Preview kutilmoqda"}</span><span className="flex gap-2"><Button size="small" variant="tertiary" onClick={() => openPreview(file)}>Preview</Button>{canEdit && file.status === "published" && !file.isCurrent && <Button size="small" variant="tertiary" disabled={busy} onClick={() => act("restore", { fileId: file.id })}>Qaytarish</Button>}</span></li>)}</ul></Card>}
    {preview && <Card><div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-lg font-semibold">Preview</h2><div className="flex items-center gap-2"><label className="text-sm">Til <select className="rounded border border-white/20 bg-charcoal p-2" value={previewLang} onChange={(event) => setPreviewLang(event.target.value as "" | "uz" | "ru" | "en")}><option value="uz">UZ</option><option value="ru">RU</option><option value="en">EN</option><option value="">Avto</option></select></label><Button size="small" variant="tertiary" onClick={() => setPreview(null)}>Yopish</Button></div></div><LessonFrame key={`${preview.id}:${previewLang}`} compiledJs={preview.compiledJs} kind={preview.kind} lang={previewLang || undefined} studentName="Preview" checkSignal={previewCheck} onReady={setPreviewReady} onSubmit={(payload) => setMessage(JSON.stringify(payload))} onFinished={(payload) => setMessage(JSON.stringify(payload))} onMounted={() => void markPreviewed(preview.id)} onError={(detail) => setMessage(`Preview xatosi: ${detail}`)} />{preview.kind === "practice" && <Button className="mt-3" disabled={!previewReady} onClick={() => setPreviewCheck((count) => count + 1)}>Tekshirish</Button>}</Card>}
    {canEdit && <Card>
      <h2 className="mb-3 text-lg font-semibold">JSX fayl yuklash</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {(["learn", ...(lesson.code === "INTRO" ? [] : ["practice"])] as LessonKind[]).map((kind) => <div key={kind} className="rounded-xl border border-gold/60 bg-gold/10 p-4">
          <label htmlFor={`lesson-${kind}-files`} className="block text-sm font-semibold text-ivory">{kind === "learn" ? "Learn fayli" : "Practice fayllari"}</label>
          <p className="mt-1 text-sm text-steel">{kind === "learn" ? "Bitta .jsx fayl tanlang" : "Bir vaqtda 1–10 ta .jsx fayl tanlang"}</p>
          <input ref={selectedKind === kind ? fileInputRef : undefined} id={`lesson-${kind}-files`} type="file" multiple={kind === "practice"} accept=".jsx" onChange={(event) => choose(event, kind)} className="mt-3 block w-full cursor-pointer rounded-lg border border-gold/50 bg-charcoal p-2 text-sm text-ivory file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-gold file:px-4 file:py-2 file:font-semibold file:text-charcoal hover:file:bg-[#E2BF90] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" />
          {selectedKind === kind && <p className="mt-2 text-sm text-ivory" aria-live="polite">{selected.length ? `${selected.length} ta fayl tanlandi` : "Fayl tanlanmagan"}</p>}
        </div>)}
      </div>
      <div className="mt-3 space-y-2">{selected.map((file) => { const slot = parseLessonFilename(file.name); return <label className="flex items-center gap-3 text-sm" key={file.name}><span className="min-w-40">{file.name}</span>{slot?.kind === "practice" && <select className="rounded border border-white/20 bg-charcoal p-2" value={kinds[file.name] || ""} onChange={(event) => setKinds({ ...kinds, [file.name]: event.target.value })}><option value="">Mexanika</option>{mechanics.map((name) => <option key={name} value={name}>{name}</option>)}</select>}</label>; })}</div>
      <Button className="mt-4" disabled={busy || !selected.length || (selectedKind === "practice" && selected.some((file) => !kinds[file.name]))} onClick={upload}>{selectedKind === "practice" ? `${selected.length} ta Practice draftini yuklash` : "Learn draftini yuklash"}</Button>
    </Card>}
    <Card><h2 className="mb-2 text-lg font-semibold">Nashr holati</h2>{readiness.length ? <ul className="mb-4 list-inside list-disc text-sm text-steel">{readiness.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="mb-4 text-sm text-steel">Fayllar to‘liq. Preview qilib tekshiring.</p>}{canEdit && <Button disabled={busy || readiness.length > 0} onClick={() => act("publish")}>Nashr qilish</Button>}</Card>
    {message && <p role="status" className="whitespace-pre-line rounded-lg border border-gold/30 p-3 text-sm">{message}</p>}
  </div>;
}
