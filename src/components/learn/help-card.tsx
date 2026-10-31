"use client";

import { useState } from "react";

import { Modal } from "@/components/ui/modal";
import { LearnIcon } from "@/components/learn/learn-icon";
import { getLearnText, type LearnLocale } from "@/lib/learn/translations";
import styles from "@/app/learn/learn.module.css";

export function HelpCard({ locale }: { locale: LearnLocale }) {
  const [open, setOpen] = useState(false);
  const t = getLearnText(locale).shell;

  return <>
    <div className={styles.helpCard}>
      <div className={styles.helpImage} />
      <div className={styles.helpBody}><h2>{t.helpTitle}</h2><p>{t.helpText}</p><button type="button" onClick={() => setOpen(true)}>{t.helpButton} <LearnIcon name="arrow" size={17} /></button></div>
    </div>
    <Modal open={open} onClose={() => setOpen(false)} title={t.faqTitle}>
      <div className={styles.faqList}>{t.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
      <a href="https://t.me/coliseumlogistics" target="_blank" rel="noopener noreferrer" className={styles.contactButton}>{t.contact} <LearnIcon name="arrow" size={16} /></a>
    </Modal>
  </>;
}
