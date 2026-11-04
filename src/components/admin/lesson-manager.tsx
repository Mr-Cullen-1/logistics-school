"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { LessonFrame } from "@/components/learn/lesson-frame";
import { parseLessonFilename, validateUploadSelection, type LessonKind } from "@/lib/lessons/rules";
import styles from "./lesson-manager.module.css";

type FileRow = { id: string; kind: string; seq: number; mechanic: string | null; version: number; status: "draft" | "published"; isCurrent: boolean; sizeBytes: number; previewed: boolean };
type Lesson = { id: string; code: string | null; title: string; status: "draft" | "published" };
type Preview = { id: string; kind: "learn" | "practice"; compiledJs: string };
type Glyph = "book" | "practice" | "eye" | "trash" | "restore" | "upload" | "rocket" | "left" | "right" | "close" | "check";
const paths: Record<Glyph, string> = {
  book: "M3 5c0-1 1-2 2-2h6v17H5c-1 0-2 1-2 2V5Zm18 0c0-1-1-2-2-2h-6v17h6c1 0 2 1 2 2V5Z",
  practice: "M8 3v4H5a2 2 0 0 0-2 2v3h4v3H3v3a2 2 0 0 0 2 2h3v-4h3v4h3v-4h3v4h2a2 2 0 0 0 2-2v-4h-4v-3h4V9a2 2 0 0 0-2-2h-3V3h-3v4h-3V3H8Z",
  eye: "M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Zm10-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
  trash: "M4 7h16M10 4h4M6 7l1 14h10l1-14M10 11v6m4-6v6",
  restore: "M4 8V3m0 5h5M4 8a9 9 0 1 1-1 6m9-6v5l3 2",
  upload: "M12 16V3m-4 4 4-4 4 4M4 16v4h16v-4",
  rocket: "M12 3c4 1 7 4 9 9-2 3-5 6-9 9-5-2-8-5-9-9 2-4 5-7 9-9Zm0 6v6m-3-3h6",
  left: "m15 18-6-6 6-6", right: "m9 18 6-6-6-6", close: "M5 5l14 14M19 5 5 19", check: "m5 12 4 4L19 6",
};
function Icon({ name }: { name: Glyph }) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>; }
const label = (file: FileRow) => file.kind === "learn" ? "Learn" : `p${String(file.seq).padStart(2, "0")}`;

export function LessonManager({ lesson, files, canEdit }: { lesson: Lesson; files: FileRow[]; canEdit: boolean }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const mounted = useRef<string | null>(null);
  const previewPanel = useRef<HTMLElement>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [previewCheck, setPreviewCheck] = useState(0);
  const [previewLang, setPreviewLang] = useState<"" | "uz" | "ru" | "en">("uz");
  const [verified, setVerified] = useState<string[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [chosenVersion, setChosenVersion] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<FileRow[]>([]);

  const versions = [...new Set(files.map((file) => file.version))].sort((a, b) => b - a);
  const version = chosenVersion !== null && versions.includes(chosenVersion) ? chosenVersion : versions[0];
  const versionFiles = files.filter((file) => file.version === version).sort((a, b) => a.seq - b.seq || a.kind.localeCompare(b.kind));
  const visible = versionFiles;
  const selectedFiles = versionFiles.filter((file) => checked.includes(file.id));
  const oldSelected = selectedFiles.filter((file) => !file.isCurrent);
  const allVisible = visible.length > 0 && visible.every((file) => checked.includes(file.id));

  useEffect(() => { if (preview) previewPanel.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [preview]);

  function choose(event: ChangeEvent<HTMLInputElement>) {
    const list = Array.from(event.target.files || []);
    if (!list.length) return;
    let error = list.some((file) => parseLessonFilename(file.name)?.code !== lesson.code)
      ? `Faqat ${lesson.code} darsining JSX fayllarini tanlang.` : null;
    for (const kind of ["learn", "practice"] as const) {
      const names = list.filter((file) => parseLessonFilename(file.name)?.kind === kind).map((file) => file.name);
      if (names.length) error ||= validateUploadSelection(lesson.code || "", kind, names);
    }
    if (list.some((file) => file.size > 1_500_000)) error ||= "Har bir fayl 1.5 MB dan oshmasin.";
    if (list.reduce((total, file) => total + file.size, 0) > 5_000_000) error ||= "Fayllar jami 5 MB dan oshmasin.";
    setMessage(error || ""); setUploadFiles(error ? [] : list);
    if (error) event.target.value = "";
  }

  async function approveFiles(ids: string[]) {
    for (const id of ids) {
      const response = await fetch(`/api/admin/lessons/${lesson.id}/files/${id}/verify`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "bulk" }) });
      if (!response.ok) throw new Error("Fayl tasdiqlanmadi. Ro‘yxatdan qayta nashr qilishingiz mumkin.");
      setVerified((current) => [...new Set([...current, id])]);
    }
  }

  async function requestPublish(ids: string[]) {
    await approveFiles(ids.filter((id) => !files.find((file) => file.id === id)?.previewed && !verified.includes(id)));
    const response = await fetch(`/api/admin/lessons/${lesson.id}/publish`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileIds: ids }) });
    const result = await response.json();
    if (!response.ok) throw new Error([result.error, ...(result.errors || [])].filter(Boolean).join(" · "));
    return `${result.files} ta fayl nashr qilindi.${result.lessonPublished ? " Dars o‘quvchilar uchun ochiq." : ` Dars hali o‘quvchilarga ochilmagan.\n${(result.pendingReasons || []).join(" · ")}`}`;
  }

  async function upload(publish: boolean) {
    setBusy(true); setMessage("");
    const saved: string[] = [];
    const uploadedNames: string[] = [];
    const errors: string[] = [];
    try {
      for (const kind of ["learn", "practice"] as LessonKind[]) {
        const group = uploadFiles.filter((file) => parseLessonFilename(file.name)?.kind === kind);
        if (!group.length) continue;
        setMessage(`${kind === "learn" ? "Learn" : "Practice"} yuklanmoqda…`);
        const body = new FormData();
        group.forEach((file) => body.append("files", file)); body.set("kind", kind);
        const response = await fetch(`/api/admin/lessons/${lesson.id}/files`, { method: "POST", body });
        const result = await response.json();
        if (!response.ok) { errors.push(result.error || "Yuklash amalga oshmadi."); continue; }
        for (const item of result.results as { name: string; ok: boolean; id?: string; error?: string }[]) {
          if (item.ok && item.id) { saved.push(item.id); uploadedNames.push(item.name); }
          else errors.push(`${item.name}: ${item.error || "Yuklanmadi"}`);
        }
      }
      let summary = `${saved.length} ta fayl draft sifatida saqlandi.`;
      if (publish && saved.length && !errors.length) {
        setMessage("Fayllar nashr qilinmoqda…");
        summary = await requestPublish(saved);
      } else if (publish && errors.length) summary += " Xatolar sababli nashr qilinmadi.";
      setMessage([summary, ...errors].join("\n"));
    } catch (error) { setMessage(`${saved.length ? `${saved.length} ta fayl saqlandi. ` : ""}${error instanceof Error ? error.message : "Ulanishda xatolik yuz berdi."} Ro‘yxatni yangilab holatni tekshiring.`); }
    finally {
      setUploadFiles((current) => current.filter((file) => !uploadedNames.includes(file.name)));
      if (fileInput.current) fileInput.current.value = "";
      setChosenVersion(null); router.refresh(); setBusy(false);
    }
  }

  async function act(path: string, body?: object) {
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/admin/lessons/${lesson.id}/${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) });
      const result = await response.json();
      setMessage(response.ok ? "Saqlandi" : [result.error, ...(result.errors || [])].filter(Boolean).join(" · "));
      if (response.ok) router.refresh();
    } catch { setMessage("Ulanishda xatolik yuz berdi"); }
    finally { setBusy(false); }
  }

  async function openPreview(file: FileRow): Promise<boolean> {
    setMessage(""); setPreview(null); mounted.current = null;
    try {
      const response = await fetch(`/api/admin/lessons/${lesson.id}/files/${file.id}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error || "Preview ochilmadi"); return false; }
      setPreview({ id: file.id, kind: file.kind as Preview["kind"], compiledJs: result.file.compiledJs });
      setPreviewReady(false); setPreviewCheck(0);
      return true;
    } catch { setMessage("Preview yuklanmadi. Ulanishni tekshiring."); return false; }
  }

  async function previewMounted() {
    if (!preview || mounted.current === preview.id) return;
    mounted.current = preview.id;
    if (canEdit && !files.find((file) => file.id === preview.id)?.previewed && !verified.includes(preview.id)) {
      try {
        const response = await fetch(`/api/admin/lessons/${lesson.id}/files/${preview.id}/verify`, { method: "POST" });
        if (!response.ok) { setMessage("Preview tasdiqlanmadi. Qayta ochib ko‘ring."); return; }
        setVerified((ids) => ids.includes(preview.id) ? ids : [...ids, preview.id]);
      } catch { setMessage("Preview tasdiqlanmadi. Ulanishni tekshiring."); }
    }
  }

  async function approveSelected() {
    if (!selectedFiles.length) return;
    setBusy(true); setMessage("");
    const approved: string[] = [];
    let failure = "";
    for (const file of selectedFiles) {
      if (file.previewed || verified.includes(file.id)) continue;
      try {
        const response = await fetch(`/api/admin/lessons/${lesson.id}/files/${file.id}/verify`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "bulk" }) });
        if (!response.ok) { failure = `${label(file)} tasdiqlanmadi`; break; }
        approved.push(file.id);
      } catch { failure = `${label(file)}: ulanish xatosi`; break; }
    }
    if (approved.length) { setVerified((ids) => [...new Set([...ids, ...approved])]); router.refresh(); }
    setMessage(`${approved.length} ta fayl ochilmasdan Preview OK deb belgilandi.${failure ? ` ${failure}` : ""}`);
    setBusy(false);
  }

  async function publishFiles(ids: string[]) {
    if (!ids.length) return;
    setBusy(true); setMessage("");
    try {
      setMessage(await requestPublish(ids));
      setChecked([]); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Nashr qilishda ulanish xatosi yuz berdi"); }
    finally { router.refresh(); setBusy(false); }
  }

  async function deleteFiles() {
    const targets = deleting;
    setDeleting([]); setBusy(true);
    const removed: string[] = [];
    let failure = "";
    for (const file of targets) {
      try {
        const response = await fetch(`/api/admin/lessons/${lesson.id}/files/${file.id}`, { method: "DELETE" });
        const result = await response.json();
        if (!response.ok) { failure = `${label(file)} v${file.version}: ${result.error || "O‘chirilmadi"}`; break; }
        removed.push(file.id);
      } catch { failure = `${label(file)} v${file.version}: ulanish xatosi`; break; }
    }
    if (removed.length) {
      setChecked((ids) => ids.filter((id) => !removed.includes(id)));
      if (preview && removed.includes(preview.id)) setPreview(null);
      router.refresh();
    }
    setMessage(`${removed.length} ta eski fayl o‘chirildi.${failure ? ` ${failure}` : ""}`);
    setBusy(false);
  }

  const previewSection = preview && <section ref={previewPanel} className={styles.previewPanel} aria-labelledby="preview-title"><div className={styles.previewHeader}><div><h2 id="preview-title">Fayl previewi</h2><p>{(() => { const item = files.find((file) => file.id === preview.id); return item ? `${label(item)} · v${item.version}` : "Fayl"; })()} · iframe’da ochiladi</p></div><div className={styles.previewControls}><label>Til <select value={previewLang} onChange={(event) => setPreviewLang(event.target.value as "" | "uz" | "ru" | "en")}><option value="uz">UZ</option><option value="ru">RU</option><option value="en">EN</option><option value="">Avto</option></select></label><button type="button" title="Preview yopish" aria-label="Preview yopish" onClick={() => setPreview(null)}><Icon name="close" /></button></div></div><div className={styles.frame}><LessonFrame key={`${preview.id}:${previewLang}`} compiledJs={preview.compiledJs} kind={preview.kind} lang={previewLang || undefined} studentName="Preview" checkSignal={previewCheck} onReady={setPreviewReady} onSubmit={() => {}} onFinished={() => setMessage("Preview yakunlandi.")} onMounted={() => void previewMounted()} onError={(detail) => setMessage(`Preview xatosi: ${detail}`)} /></div>{preview.kind === "practice" && <button type="button" className={styles.secondary} disabled={!previewReady} onClick={() => setPreviewCheck((count) => count + 1)}>Tekshirish</button>}</section>;

  return <div className={styles.manager}>
    <header className={styles.heading}><div className={styles.headingMeta}><span className={styles.code}>{lesson.code || "Kod yo‘q"}</span><span className={lesson.status === "published" ? styles.published : styles.draft}>{lesson.status === "published" ? "Nashr qilingan" : "Draft"}</span></div><h1>{lesson.title}</h1><p>Dars fayllari, versiyalari va nashr holati</p></header>
    {message && <div role="status" className={styles.message}>{message}</div>}
    {canEdit && <section className={styles.uploadCard} aria-labelledby="upload-title" aria-busy={busy}>
      <div><h2 id="upload-title"><Icon name="upload" /> Dars fayllarini yuklash</h2>
        <p>{lesson.code === "INTRO" ? "INTRO.learn.jsx faylini tanlang." : "Learn va Practice JSX fayllarini birga yoki alohida tanlang. Turi va mexanikasi avtomatik aniqlanadi."}</p>
      </div>
      <div className={styles.uploadActions}>
        <input ref={fileInput} id="lesson-upload" className={styles.fileInput} type="file" multiple={lesson.code !== "INTRO"} accept=".jsx" onChange={choose} disabled={busy} />
        <button type="button" className={styles.secondary} disabled={busy} onClick={() => fileInput.current?.click()}><Icon name="upload" /> {uploadFiles.length ? "Fayllarni almashtirish" : "JSX fayllarni tanlash"}</button>
        {uploadFiles.length > 0 && <>
          <button type="button" className={styles.primary} disabled={busy} onClick={() => void upload(true)}><Icon name="check" /> {busy ? "Bajarilmoqda…" : "Yuklash va nashr qilish"}</button>
          <button type="button" className={styles.textButton} disabled={busy} onClick={() => void upload(false)}>Draft saqlash</button>
        </>}
      </div>
      {uploadFiles.length > 0 && <div className={styles.selection}>
        <div className={styles.selectionHeader}><strong>{uploadFiles.length} ta fayl tanlandi</strong><button type="button" className={styles.textButton} disabled={busy} onClick={() => { setUploadFiles([]); if (fileInput.current) fileInput.current.value = ""; }}>Tozalash</button></div>
        <ul>{uploadFiles.map((file) => <li key={file.name}><Icon name={parseLessonFilename(file.name)?.kind === "learn" ? "book" : "practice"} />{file.name}</li>)}</ul>
        <p>“Yuklash va nashr qilish” fayllarni Preview OK deb tasdiqlaydi va nashr qiladi. Oldin ko‘rish uchun “Draft saqlash”ni tanlang.</p>
      </div>}
    </section>}
      <section className={styles.filesPanel} aria-labelledby="files-title">
        <div className={styles.panelHeader}><div><h2 id="files-title">Dars fayllari</h2><p>Versiyani tanlang, kerakli fayllarni belgilang va amallarni bajaring.</p></div><span className={styles.count}>{files.length} ta fayl</span></div>
        {files.length ? <>
          <div className={styles.versionTabs} role="tablist" aria-label="Fayl versiyalari">{versions.map((item) => <button type="button" role="tab" aria-selected={version === item} className={version === item ? styles.versionActive : ""} key={item} onClick={() => { setChosenVersion(item); setChecked([]); }}>v{item} <small>{files.filter((file) => file.version === item).length}</small></button>)}</div>
          <div className={styles.toolbar}><label><input type="checkbox" disabled={!canEdit || busy} checked={allVisible} onChange={() => setChecked(allVisible ? [] : visible.map((file) => file.id))} /> Shu versiyadagi hammasini belgilash</label><span>{selectedFiles.length ? `${selectedFiles.length} ta tanlangan` : `v${version} · ${versionFiles.length} ta fayl`}</span></div>
          <div className={styles.fileList}>{visible.map((file) => <div className={styles.fileRow} key={file.id}>
            {canEdit && <input type="checkbox" aria-label={`${label(file)} v${file.version} ni belgilash`} checked={checked.includes(file.id)} disabled={busy} onChange={() => setChecked((ids) => ids.includes(file.id) ? ids.filter((id) => id !== file.id) : [...ids, file.id])} />}
            <span className={styles.glyph}><Icon name={file.kind === "learn" ? "book" : "practice"} /></span><div className={styles.fileInfo}><strong>{label(file)}</strong><small>{file.kind === "learn" ? "Nazariy qism" : file.mechanic || "Mexanika yo‘q"}</small></div>
            <div className={styles.fileMeta}><span>v{file.version}</span><small>{file.isCurrent ? "Nashr · joriy" : file.status === "draft" ? "Draft" : "Eski nashr"}</small></div>
            <span className={file.previewed || verified.includes(file.id) ? styles.previewOk : styles.previewPending}>{file.previewed || verified.includes(file.id) ? "Preview OK" : "Kutilmoqda"}</span>
            <div className={styles.actions}><button type="button" title="Preview ochish" aria-label={`${label(file)} v${file.version} preview`} disabled={busy} onClick={() => void openPreview(file)}><Icon name="eye" /></button>{canEdit && file.status === "draft" && <button type="button" className={styles.publishAction} title="Tasdiqlash va nashr qilish" aria-label={`${label(file)} v${file.version} ni nashr qilish`} disabled={busy} onClick={() => void publishFiles([file.id])}><Icon name="check" /></button>}{canEdit && file.status === "published" && !file.isCurrent && <button type="button" title="Joriy versiyaga qaytarish" aria-label={`${label(file)} v${file.version} ni qaytarish`} disabled={busy} onClick={() => void act("restore", { fileId: file.id })}><Icon name="restore" /></button>}{canEdit && !file.isCurrent && <button type="button" className={styles.danger} title="Faylni o‘chirish" aria-label={`${label(file)} v${file.version} ni o‘chirish`} disabled={busy} onClick={() => setDeleting([file])}><Icon name="trash" /></button>}</div>
          </div>)}</div>
          {canEdit && selectedFiles.length > 0 && <div className={styles.bulkActions}><button type="button" className={styles.secondary} disabled={busy || !selectedFiles.some((file) => !file.previewed && !verified.includes(file.id))} onClick={() => void approveSelected()}><Icon name="check" /> Tanlanganlarni Preview OK ({selectedFiles.length})</button>{allVisible && selectedFiles.some((file) => file.status === "draft") && <button type="button" className={styles.primary} disabled={busy} onClick={() => void publishFiles(selectedFiles.filter((file) => file.status === "draft").map((file) => file.id))}><Icon name="rocket" /> Tanlangan draftlarni nashr qilish</button>}<button type="button" className={styles.secondary} disabled={!oldSelected.length || busy} onClick={() => setDeleting(oldSelected)}><Icon name="trash" /> Tanlangan eski fayllarni o‘chirish ({oldSelected.length})</button></div>}
        </> : <div className={styles.empty}>Hali fayl yuklanmagan. Learn yoki Practice JSX faylini yuklang.</div>}
      </section>
    {previewSection}
    {deleting.length > 0 && <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleting([]); }}><div className={styles.modal} role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-desc"><h2 id="delete-title">Eski versiyalarni o‘chirish</h2><p id="delete-desc">{deleting.length} ta fayl butunlay o‘chiriladi va ularni qaytarib bo‘lmaydi. Joriy fayllar saqlanadi.</p><div className={styles.deleteList}>{deleting.map((file) => <span key={file.id}>{label(file)} · v{file.version}</span>)}</div><div className={styles.modalActions}><button type="button" className={styles.secondary} onClick={() => setDeleting([])}>Bekor qilish</button><button type="button" className={styles.deleteConfirm} onClick={() => void deleteFiles()}><Icon name="trash" /> O‘chirish</button></div></div></div>}
  </div>;
}
