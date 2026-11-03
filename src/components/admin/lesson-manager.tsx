"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { LessonFrame } from "@/components/learn/lesson-frame";
import { parseLessonFilename, practiceMechanics, publishReadiness, selectPublishFiles, validateUploadSelection, type LessonKind } from "@/lib/lessons/rules";
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
const pageSize = 6;

export function LessonManager({ lesson, files, canEdit }: { lesson: Lesson; files: FileRow[]; canEdit: boolean }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const mounted = useRef<string | null>(null);
  const previewPanel = useRef<HTMLElement>(null);
  const batchRun = useRef(0);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadKind, setUploadKind] = useState<LessonKind>("learn");
  const [mechanics, setMechanics] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [previewCheck, setPreviewCheck] = useState(0);
  const [previewLang, setPreviewLang] = useState<"" | "uz" | "ru" | "en">("uz");
  const [verified, setVerified] = useState<string[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [chosenVersion, setChosenVersion] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [batch, setBatch] = useState<FileRow[]>([]);
  const [batchIndex, setBatchIndex] = useState(0);
  const [deleting, setDeleting] = useState<FileRow[]>([]);

  const versions = [...new Set(files.map((file) => file.version))].sort((a, b) => b - a);
  const version = chosenVersion !== null && versions.includes(chosenVersion) ? chosenVersion : versions[0];
  const versionFiles = files.filter((file) => file.version === version).sort((a, b) => a.seq - b.seq);
  const pages = Math.max(1, Math.ceil(versionFiles.length / pageSize));
  const actualPage = Math.min(page, pages);
  const visible = versionFiles.slice((actualPage - 1) * pageSize, actualPage * pageSize);
  const selectedFiles = files.filter((file) => checked.includes(file.id)).sort((a, b) => b.version - a.version || a.seq - b.seq);
  const oldSelected = selectedFiles.filter((file) => !file.isCurrent);
  const allVisible = visible.length > 0 && visible.every((file) => checked.includes(file.id));
  const candidates = selectPublishFiles(files);
  const readiness = lesson.code ? publishReadiness(lesson.code, candidates.map((file) => ({ kind: file.kind as LessonKind, seq: file.seq, mechanic: file.mechanic }))) : ["Dars kodi belgilanmagan"];
  const missing = candidates.filter((file) => !file.previewed && !verified.includes(file.id));
  if (missing.length) readiness.push(`${missing.length} ta fayl iframe previewda tekshirilmagan`);

  useEffect(() => { if (preview) previewPanel.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [preview]);

  function choose(event: ChangeEvent<HTMLInputElement>, kind: LessonKind) {
    const list = Array.from(event.target.files || []);
    const error = validateUploadSelection(lesson.code || "", kind, list.map((file) => file.name));
    setUploadKind(kind);
    setUploadFiles(error ? [] : list);
    setMechanics(error || kind === "learn" ? {} : Object.fromEntries(list.map((file) => [file.name, file.name.startsWith("M1L01.p") ? (["MC", "MATCH", "READ-MC", "GAP", "ORDER", "ORDER", "FIX", "SORT", "READ-TYPE", "SCENE"][Number(parseLessonFilename(file.name)?.seq || 0) - 1] || "") : ""])));
    setMessage(error || "");
    if (error) event.target.value = "";
  }

  async function upload() {
    setBusy(true); setMessage("");
    try {
      const body = new FormData();
      uploadFiles.forEach((file) => body.append("files", file));
      body.set("kind", uploadKind);
      body.set("mechanics", JSON.stringify(uploadKind === "practice" ? mechanics : {}));
      const response = await fetch(`/api/admin/lessons/${lesson.id}/files`, { method: "POST", body });
      const result = await response.json();
      setMessage(result.results?.map((item: { name: string; ok: boolean; error?: string; version?: number }) => `${item.name}: ${item.ok ? `v${item.version} saqlandi` : item.error}`).join("\n") || result.error || "Yuklash tugadi");
      if (response.ok) {
        const failed = uploadFiles.filter((file) => result.results?.some((item: { name: string; ok: boolean }) => item.name === file.name && !item.ok));
        setUploadFiles(failed);
        if (!failed.length && fileInput.current) fileInput.current.value = "";
        if (result.results?.some((item: { ok: boolean }) => item.ok)) router.refresh();
      }
    } catch { setMessage("Ulanishda xatolik yuz berdi"); }
    finally { setBusy(false); }
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
    const run = batchRun.current;
    if (canEdit && !files.find((file) => file.id === preview.id)?.previewed && !verified.includes(preview.id)) {
      try {
        const response = await fetch(`/api/admin/lessons/${lesson.id}/files/${preview.id}/verify`, { method: "POST" });
        if (!response.ok) { setMessage("Preview tasdiqlanmadi. Qayta ochib ko‘ring."); setBatch([]); return; }
        setVerified((ids) => ids.includes(preview.id) ? ids : [...ids, preview.id]);
      } catch { setMessage("Preview tasdiqlanmadi. Ulanishni tekshiring."); setBatch([]); return; }
    }
    if (!batch.length || run !== batchRun.current) return;
    if (batchIndex + 1 === batch.length) {
      setMessage(`${batch.length} ta fayl Preview OK: iframe’da muvaffaqiyatli ochildi.`);
      setChecked([]); setBatch([]); router.refresh(); return;
    }
    const next = batchIndex + 1;
    setBatchIndex(next);
    if (!await openPreview(batch[next])) setBatch([]);
  }

  async function startBatch() {
    if (!selectedFiles.length) return;
    batchRun.current += 1;
    setBatch(selectedFiles); setBatchIndex(0);
    if (!await openPreview(selectedFiles[0])) setBatch([]);
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

  return <div className={styles.manager}>
    <header className={styles.heading}><div className={styles.headingMeta}><span className={styles.code}>{lesson.code || "Kod yo‘q"}</span><span className={lesson.status === "published" ? styles.published : styles.draft}>{lesson.status === "published" ? "Nashr qilingan" : "Draft"}</span></div><h1>{lesson.title}</h1><p>Dars fayllari, versiyalari va nashr holati</p></header>
    {message && <div role="status" className={styles.message}>{message}</div>}
    <div className={styles.layout}>
      <section className={styles.filesPanel} aria-labelledby="files-title">
        <div className={styles.panelHeader}><div><h2 id="files-title">Dars fayllari va holati</h2><p>Versiyani tanlang va fayllarni preview qiling.</p></div><span className={styles.count}>{files.length} ta fayl</span></div>
        <div className={styles.slotStrip}>{[0, ...(lesson.code === "INTRO" ? [] : Array.from({ length: 10 }, (_, i) => i + 1))].map((seq) => {
          const file = candidates.find((item) => item.seq === seq && item.kind === (seq === 0 ? "learn" : "practice"));
          return <span key={seq} className={file ? styles.slotReady : styles.slotMissing} title={file ? `v${file.version}` : "Fayl yetishmaydi"}>{seq === 0 ? "Learn" : `p${String(seq).padStart(2, "0")}`}</span>;
        })}</div>
        {files.length ? <>
          <div className={styles.versionTabs} role="tablist" aria-label="Fayl versiyalari">{versions.map((item) => <button type="button" role="tab" aria-selected={version === item} className={version === item ? styles.versionActive : ""} key={item} onClick={() => { setChosenVersion(item); setPage(1); }}>v{item} <small>{files.filter((file) => file.version === item).length}</small></button>)}</div>
          <div className={styles.toolbar}><label><input type="checkbox" disabled={!canEdit || busy || !!batch.length} checked={allVisible} onChange={() => setChecked((ids) => allVisible ? ids.filter((id) => !visible.some((file) => file.id === id)) : [...new Set([...ids, ...visible.map((file) => file.id)])])} /> Shu sahifadagilarni belgilash</label><span>{checked.length ? `${checked.length} ta tanlangan` : `v${version} · ${versionFiles.length} ta fayl`}</span></div>
          <div className={styles.fileList}>{visible.map((file) => <div className={styles.fileRow} key={file.id}>
            {canEdit && <input type="checkbox" aria-label={`${label(file)} v${file.version} ni belgilash`} checked={checked.includes(file.id)} disabled={busy || !!batch.length} onChange={() => setChecked((ids) => ids.includes(file.id) ? ids.filter((id) => id !== file.id) : [...ids, file.id])} />}
            <span className={styles.glyph}><Icon name={file.kind === "learn" ? "book" : "practice"} /></span><div className={styles.fileInfo}><strong>{label(file)}</strong><small>{file.kind === "learn" ? "Nazariy qism" : file.mechanic || "Mexanika yo‘q"}</small></div>
            <div className={styles.fileMeta}><span>v{file.version}</span><small>{file.isCurrent ? "Joriy" : file.status === "draft" ? "Draft" : "Eski nashr"}</small></div>
            <span className={file.previewed || verified.includes(file.id) ? styles.previewOk : styles.previewPending}>{file.previewed || verified.includes(file.id) ? "Preview OK" : "Kutilmoqda"}</span>
            <div className={styles.actions}><button type="button" title="Preview ochish" aria-label={`${label(file)} v${file.version} preview`} disabled={busy || !!batch.length} onClick={() => void openPreview(file)}><Icon name="eye" /></button>{canEdit && file.status === "published" && !file.isCurrent && <button type="button" title="Joriy versiyaga qaytarish" aria-label={`${label(file)} v${file.version} ni qaytarish`} disabled={busy || !!batch.length} onClick={() => void act("restore", { fileId: file.id })}><Icon name="restore" /></button>}{canEdit && !file.isCurrent && <button type="button" className={styles.danger} title="Eski versiyani o‘chirish" aria-label={`${label(file)} v${file.version} ni o‘chirish`} disabled={busy || !!batch.length} onClick={() => setDeleting([file])}><Icon name="trash" /></button>}</div>
          </div>)}</div>
          <div className={styles.pagination}><span>{actualPage} / {pages} sahifa</span><div><button type="button" aria-label="Oldingi sahifa" disabled={actualPage <= 1} onClick={() => setPage(actualPage - 1)}><Icon name="left" /></button><button type="button" aria-label="Keyingi sahifa" disabled={actualPage >= pages} onClick={() => setPage(actualPage + 1)}><Icon name="right" /></button></div></div>
          {canEdit && <div className={styles.bulkActions}><button type="button" className={styles.primary} disabled={!selectedFiles.length || busy || !!batch.length} onClick={() => void startBatch()}><Icon name="eye" /> {batch.length ? `Preview ${batchIndex + 1}/${batch.length}` : `Tanlanganlarni Preview OK (${selectedFiles.length})`}</button><button type="button" className={styles.secondary} disabled={!oldSelected.length || busy || !!batch.length} onClick={() => setDeleting(oldSelected)}><Icon name="trash" /> Eski versiyalarni o‘chirish ({oldSelected.length})</button></div>}
        </> : <div className={styles.empty}>Hali fayl yuklanmagan. Learn yoki Practice JSX faylini yuklang.</div>}
      </section>
      <aside className={styles.side}>
        {canEdit && <section className={styles.sideCard} aria-labelledby="upload-title"><h2 id="upload-title"><Icon name="upload" /> JSX fayl yuklash</h2>{(["learn", ...(lesson.code === "INTRO" ? [] : ["practice"])] as LessonKind[]).map((kind) => <div className={styles.uploadBlock} key={kind}><label htmlFor={`lesson-${kind}-files`}>{kind === "learn" ? "Learn fayli" : "Practice fayllari"}</label><p>{kind === "learn" ? "Bitta .jsx fayl" : "Bir vaqtda 1–10 ta .jsx fayl"}</p><input ref={uploadKind === kind ? fileInput : undefined} id={`lesson-${kind}-files`} type="file" multiple={kind === "practice"} accept=".jsx" onChange={(event) => choose(event, kind)} disabled={busy || !!batch.length} /></div>)}{uploadFiles.length > 0 && <div className={styles.uploadSelected}><strong>{uploadFiles.length} ta fayl tanlandi</strong>{uploadFiles.map((file) => <label key={file.name}><span>{file.name}</span>{parseLessonFilename(file.name)?.kind === "practice" && <select value={mechanics[file.name] || ""} onChange={(event) => setMechanics({ ...mechanics, [file.name]: event.target.value })}><option value="">Mexanika</option>{practiceMechanics.map((name) => <option key={name} value={name}>{name}</option>)}</select>}</label>)}</div>}<button type="button" className={styles.secondary} disabled={busy || !!batch.length || !uploadFiles.length || (uploadKind === "practice" && uploadFiles.some((file) => !mechanics[file.name]))} onClick={() => void upload()}><Icon name="upload" /> {uploadKind === "practice" ? `${uploadFiles.length} ta Practice draftini yuklash` : "Learn draftini yuklash"}</button></section>}
        <section className={styles.sideCard} aria-labelledby="publish-title"><h2 id="publish-title"><Icon name="rocket" /> Nashr holati</h2>{readiness.length ? <ul className={styles.readiness}>{readiness.map((item) => <li key={item}>{item}</li>)}</ul> : <div className={styles.ready}><Icon name="check" /> Fayllar tayyor va previewdan o‘tgan.</div>}{canEdit && <button type="button" className={styles.primary} disabled={busy || !!batch.length || readiness.length > 0} onClick={() => void act("publish")}><Icon name="rocket" /> Nashr qilish</button>}</section>
      </aside>
    </div>
    {preview && <section ref={previewPanel} className={styles.previewPanel} aria-labelledby="preview-title"><div className={styles.previewHeader}><div><h2 id="preview-title">{batch.length ? `Preview tekshiruvi ${batchIndex + 1}/${batch.length}` : "Fayl previewi"}</h2><p>{(() => { const item = files.find((file) => file.id === preview.id); return item ? `${label(item)} · v${item.version}` : "Fayl"; })()} · iframe’da ochiladi</p></div><div className={styles.previewControls}><label>Til <select value={previewLang} disabled={!!batch.length} onChange={(event) => setPreviewLang(event.target.value as "" | "uz" | "ru" | "en")}><option value="uz">UZ</option><option value="ru">RU</option><option value="en">EN</option><option value="">Avto</option></select></label><button type="button" title="Preview yopish" aria-label="Preview yopish" onClick={() => { batchRun.current += 1; setPreview(null); setBatch([]); }}><Icon name="close" /></button></div></div><div className={styles.frame}><LessonFrame key={`${preview.id}:${previewLang}`} compiledJs={preview.compiledJs} kind={preview.kind} lang={previewLang || undefined} studentName="Preview" checkSignal={previewCheck} onReady={setPreviewReady} onSubmit={(payload) => setMessage(JSON.stringify(payload))} onFinished={(payload) => setMessage(JSON.stringify(payload))} onMounted={() => void previewMounted()} onError={(detail) => { batchRun.current += 1; setMessage(`Preview xatosi: ${detail}`); setBatch([]); }} /></div>{preview.kind === "practice" && !batch.length && <button type="button" className={styles.secondary} disabled={!previewReady} onClick={() => setPreviewCheck((count) => count + 1)}>Tekshirish</button>}</section>}
    {deleting.length > 0 && <div className={styles.modalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) setDeleting([]); }}><div className={styles.modal} role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-desc"><h2 id="delete-title">Eski versiyalarni o‘chirish</h2><p id="delete-desc">{deleting.length} ta fayl butunlay o‘chiriladi va ularni qaytarib bo‘lmaydi. Joriy fayllar saqlanadi.</p><div className={styles.deleteList}>{deleting.map((file) => <span key={file.id}>{label(file)} · v{file.version}</span>)}</div><div className={styles.modalActions}><button type="button" className={styles.secondary} onClick={() => setDeleting([])}>Bekor qilish</button><button type="button" className={styles.deleteConfirm} onClick={() => void deleteFiles()}><Icon name="trash" /> O‘chirish</button></div></div></div>}
  </div>;
}
