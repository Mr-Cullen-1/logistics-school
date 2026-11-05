"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getLearnText, type LearnLocale } from "@/lib/learn/translations";
import { LearnIcon } from "./learn-icon";
import styles from "@/app/learn/learn.module.css";

export function LockedLessonNotice({ locale, backHref }: { locale: LearnLocale; backHref: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const t = getLearnText(locale).course;
  const titleId = useId();
  useEffect(() => { dialog.current?.showModal(); }, []);
  return <dialog ref={dialog} className={styles.lockedDialog} aria-labelledby={titleId} onClose={() => router.replace(backHref)}>
    <LearnIcon name="lock" size={30} /><h2 id={titleId}>{t.lockedMessage}</h2><p>{t.lockedHelp}</p>
    <form method="dialog"><button className={styles.goldButton}>{t.close}</button></form>
  </dialog>;
}

export function LessonAccessRow({ href, title, code, ordinal, completed, unlocked, locale }: {
  href: string; title: string; code: string | null; ordinal: string; completed: boolean; unlocked: boolean; locale: LearnLocale;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const t = getLearnText(locale).course;
  const content = <>
    <span className={styles.lessonOrdinal}>{ordinal}</span>
    <span className={styles.lessonIcon}><LearnIcon name={!unlocked ? "lock" : completed ? "check" : "play"} size={18} /></span>
    <span className={styles.lessonIdentity}><strong>{title}</strong><small>{code}{!unlocked ? ` · ${t.locked}` : completed ? ` · ${t.completedLabel}` : ""}</small></span>
    <span className={styles.lessonAction} aria-disabled={!unlocked || undefined}><span className={styles.lessonActionLabel}>{!unlocked ? t.locked : completed ? t.introReview : t.introOpen}</span><LearnIcon name={unlocked ? "arrow" : "lock"} size={16} /></span>
  </>;
  if (unlocked) return <Link className={styles.lessonRow} href={href}>{content}</Link>;
  return <>
    <button type="button" className={`${styles.lessonRow} ${styles.lockedLesson}`} aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>{content}</button>
    <dialog ref={dialog} className={styles.lockedDialog} aria-labelledby={titleId} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <LearnIcon name="lock" size={30} /><h2 id={titleId}>{t.lockedMessage}</h2><p>{t.lockedHelp}</p>
      <form method="dialog"><button className={styles.goldButton}>{t.close}</button></form>
    </dialog>
  </>;
}
