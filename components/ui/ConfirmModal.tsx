"use client";

import { useCallback, useEffect, useId, useState, type ReactNode } from "react";
import { X } from "lucide-react";

type ConfirmModalProps = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "primary" | "approve" | "danger";
  icon?: ReactNode;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "primary",
  icon,
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const titleId = useId();
  const descId = useId();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    if (pending) return;
    setOpen(false);
    window.setTimeout(onCancel, 280);
  }, [onCancel, pending]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => setOpen(true));

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  return (
    <div
      className={`confirm-modal${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <button
        type="button"
        className="confirm-modal__backdrop"
        aria-label="Close"
        disabled={pending}
        onClick={close}
      />
      <div className="confirm-modal__panel">
        <button
          type="button"
          className="confirm-modal__close"
          onClick={close}
          disabled={pending}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {icon ? (
          <span className={`confirm-modal__icon is-${tone}`} aria-hidden>
            {icon}
          </span>
        ) : null}

        <h2 id={titleId}>{title}</h2>
        <p id={descId}>{description}</p>

        <div className="confirm-modal__actions">
          <button
            type="button"
            className="confirm-modal__btn confirm-modal__btn--ghost"
            onClick={close}
            disabled={pending}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`confirm-modal__btn confirm-modal__btn--${tone}`}
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? "Saving…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
