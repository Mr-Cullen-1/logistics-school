"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmation) { setError("Parollar bir xil emas"); return; }
    setBusy(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmation }),
      });
      const result = await response.json();
      if (!response.ok) { setError(result.error); return; }
      window.location.assign(result.next);
    } catch {
      setError("Ulanishda xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <Input label="Yangi parol" type="password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required hint="Kamida 8 belgi. PIN va telefon raqamidan farqli bo'lsin." />
      <Input label="Yangi parolni takrorlang" type="password" autoComplete="new-password" minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required />
      {error && <p role="alert" className="text-sm text-alert">{error}</p>}
      <Button type="submit" disabled={busy} className="w-full">{busy ? "Saqlanmoqda..." : "Parolni saqlash"}</Button>
    </form>
  );
}
