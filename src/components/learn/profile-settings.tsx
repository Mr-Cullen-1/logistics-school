"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

import { LogoutButton } from "@/components/auth/logout-button";
import { LearnIcon } from "@/components/learn/learn-icon";
import { getLearnText, type LearnLocale } from "@/lib/learn/translations";
import styles from "@/app/learn/learn.module.css";

type Props = { fullName: string; phone: string; avatarData: string | null; locale: LearnLocale; goalTitle: string; goalDate: string; completedLessons: number };

function Flag({ code }: { code: LearnLocale }) {
  if (code === "ru") return <svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true"><rect width="24" height="16" fill="#fff" /><path fill="#2247a5" d="M0 5.3h24v5.4H0z" /><path fill="#d52b31" d="M0 10.7h24V16H0z" /></svg>;
  if (code === "en") return <svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true"><rect width="24" height="16" fill="#213a76" /><path d="M0 0l24 16M24 0L0 16" stroke="#fff" strokeWidth="4" /><path d="M0 0l24 16M24 0L0 16" stroke="#c93642" strokeWidth="1.7" /><path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5" /><path d="M12 0v16M0 8h24" stroke="#c93642" strokeWidth="2.5" /></svg>;
  return <svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true"><rect width="24" height="16" fill="#1682c4" /><path fill="#fff" d="M0 5h24v6H0z" /><path fill="#15965a" d="M0 11h24v5H0z" /><path fill="#dc3f40" d="M0 4.5h24v.6H0zm0 6h24v.6H0z" /><circle cx="5" cy="2.6" r="1.7" fill="#fff" /><circle cx="5.6" cy="2.2" r="1.5" fill="#1682c4" /></svg>;
}

async function resizeAvatar(file: File) {
  const image = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 320;
    const side = Math.min(image.width, image.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Rasmni qayta ishlash imkonsiz");
    context.drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, 320, 320);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error("Rasmni qayta ishlash imkonsiz")), "image/jpeg", .8));
    return new File([blob], "avatar.jpg", { type: "image/jpeg" });
  } finally {
    image.close();
  }
}

export function ProfileSettings({ fullName, phone, avatarData, locale: initialLocale, goalTitle: initialGoal, goalDate: initialDate, completedLessons }: Props) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [locale, setLocale] = useState(initialLocale);
  const [avatar, setAvatar] = useState(avatarData);
  const [goalTitle, setGoalTitle] = useState(initialGoal);
  const [goalDate, setGoalDate] = useState(initialDate);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const t = getLearnText(locale).profile;
  const initials = fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

  async function updateLocale(value: LearnLocale) {
    if (busy || value === locale) return;
    setBusy("locale"); setMessage("");
    try {
      const response = await fetch("/api/learn/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "locale", locale: value }) });
      if (!response.ok) throw new Error();
      setLocale(value);
      router.refresh();
    } catch { setMessage(t.saveError); }
    finally { setBusy(""); }
  }

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file || busy) return;
    setBusy("avatar"); setMessage("");
    try {
      const resized = await resizeAvatar(file);
      const form = new FormData();
      form.set("avatar", resized);
      const response = await fetch("/api/learn/profile/avatar", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t.photoError);
      setAvatar(result.avatarData);
      setMessage(t.saved);
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : t.photoError); }
    finally { setBusy(""); if (fileInput.current) fileInput.current.value = ""; }
  }

  async function saveGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy("goal"); setMessage("");
    try {
      const response = await fetch("/api/learn/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "goal", goalTitle, goalDate: goalDate || null }) });
      if (!response.ok) throw new Error();
      setMessage(t.saved);
      router.refresh();
    } catch { setMessage(t.saveError); }
    finally { setBusy(""); }
  }

  async function clearGoal() {
    if (busy) return;
    setBusy("goal"); setMessage("");
    try {
      const response = await fetch("/api/learn/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "goal", goalTitle: "", goalDate: null }) });
      if (!response.ok) throw new Error();
      setGoalTitle(""); setGoalDate(""); setMessage(t.saved);
      router.refresh();
    } catch { setMessage(t.saveError); }
    finally { setBusy(""); }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy("password"); setMessage("");
    try {
      const response = await fetch("/api/learn/profile/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword, confirmation }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t.passwordError);
      setCurrentPassword(""); setNewPassword(""); setConfirmation("");
      setMessage(t.passwordSaved);
      router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : t.passwordError); }
    finally { setBusy(""); }
  }

  return <div className={styles.profilePage}>
    <div className={styles.profileHeading}><div><p className={styles.profileEyebrow}>{getLearnText(locale).shell.student}</p><h1>{t.title}</h1><span>{t.subtitle}</span></div><LogoutButton label={t.logout} /></div>
    {message && <p className={styles.profileMessage} role="status">{message}</p>}
    <div className={styles.profileGrid}>
      <section className={`${styles.profilePanel} ${styles.profileIdentityPanel}`}><h2>{t.photoTitle}</h2><div className={styles.photoRow}><span className={styles.bigAvatar}>{avatar ? <Image src={avatar} alt={fullName} width={88} height={88} unoptimized className={styles.avatarImage} /> : initials}</span><div><strong>{fullName}</strong><small>{phone}</small><p>{t.photoHelp}</p><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadAvatar} className={styles.srOnly} aria-label={t.upload} /><button type="button" onClick={() => fileInput.current?.click()} disabled={!!busy}>{busy === "avatar" ? t.uploading : t.upload}</button></div></div><div className={styles.profileLanguage}><h2>{t.languageTitle}</h2><p>{t.languageHelp}</p><div className={styles.languageOptions}>{([{ code: "uz", label: "O‘zbekcha" }, { code: "ru", label: "Русский" }, { code: "en", label: "English" }] as const).map((option) => <button key={option.code} type="button" onClick={() => updateLocale(option.code)} className={locale === option.code ? styles.languageActive : undefined} aria-pressed={locale === option.code} disabled={!!busy}><Flag code={option.code} />{option.label}</button>)}</div></div></section>
      <section id="goal" className={styles.profilePanel}><h2><LearnIcon name="target" size={21} /> {t.goalTitle}</h2><form onSubmit={saveGoal} className={styles.profileForm}><label>{t.goalLabel}<input value={goalTitle} onChange={(event) => setGoalTitle(event.target.value)} placeholder={t.goalPlaceholder} maxLength={160} /></label><label>{t.goalDate}<input type="date" value={goalDate} onChange={(event) => setGoalDate(event.target.value)} disabled={!goalTitle.trim()} /></label><div className={styles.formActions}><button type="submit" disabled={!!busy}>{t.goalSave}</button>{initialGoal && <button type="button" onClick={clearGoal} disabled={!!busy}>{t.goalClear}</button>}</div></form></section>
      <section className={styles.profilePanel}><h2>{t.passwordTitle}</h2><form onSubmit={changePassword} className={styles.profileForm}><label>{t.currentPassword}<input type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required /></label><label>{t.newPassword}<input type="password" autoComplete="new-password" minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required /></label><label>{t.confirmPassword}<input type="password" autoComplete="new-password" minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required /></label><div className={styles.formActions}><button type="submit" disabled={!!busy}>{t.passwordButton}</button></div></form></section>
    </div>
    <section id="achievements" className={styles.achievementsSection}><h2>{t.achievementsTitle}</h2><div className={styles.badgeGrid}>{([{ count: 1, title: t.firstLesson }, { count: 5, title: t.fiveLessons }, { count: 10, title: t.tenLessons }]).map((badge) => <div className={completedLessons >= badge.count ? styles.badgeUnlocked : styles.badgeLocked} key={badge.count}><strong>{badge.title}</strong><LearnIcon name="trophy" size={27} /><small>{completedLessons >= badge.count ? t.unlocked : t.locked}</small></div>)}</div></section>
  </div>;
}
