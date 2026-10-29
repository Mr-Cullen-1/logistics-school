"use client";

import { useEffect } from "react";

type ToastProps = {
  open: boolean;
  message: string;
  variant?: "success" | "error" | "info";
  onClose: () => void;
};

export function Toast({ open, message, variant = "info", onClose }: ToastProps) {
  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(onClose, 5000);
    return () => window.clearTimeout(timeout);
  }, [open, message, onClose]);

  if (!open) return null;

  const styles = {
    success: "border-gold text-gold",
    error: "border-alert text-alert",
    info: "border-bronze text-gold",
  };

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`fixed bottom-5 left-4 right-4 z-50 mx-auto flex max-w-sm items-start gap-3 rounded-cl-md border bg-dark-slate p-4 text-sm shadow-panel sm:left-auto sm:right-6 ${styles[variant]}`}
    >
      <span aria-hidden="true" className="text-base font-bold">{variant === "error" ? "!" : "✓"}</span>
      <p className="flex-1 leading-5 text-ivory">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Bildirishnomani yopish"
        className="rounded-cl-sm px-1 leading-none text-steel hover:text-ivory focus-visible:outline-2 focus-visible:outline-gold"
      >
        ×
      </button>
    </div>
  );
}
