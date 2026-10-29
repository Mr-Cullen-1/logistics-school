"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-auto rounded-cl-lg border border-bronze/30 bg-dark-slate p-0 text-ivory shadow-panel backdrop:bg-black/75"
      style={{ width: "min(32rem, calc(100vw - 2rem))" }}
    >
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Yopish"
            className="rounded-cl-sm px-2 text-xl leading-none text-steel hover:text-ivory focus-visible:outline-2 focus-visible:outline-gold"
          >
            ×
          </button>
        </div>
        {description && <p id={descriptionId} className="mt-2 text-sm leading-6 text-steel">{description}</p>}
      </div>
      <div className="px-6 py-5 text-sm leading-6">{children}</div>
      {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 px-6 py-4">{footer}</div>}
    </dialog>
  );
}
