"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";

type SiteToastProps = {
  message: string;
  onClose: () => void;
};

export default function SiteToast({ message, onClose }: SiteToastProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    setMounted(true);
    const show = window.requestAnimationFrame(() => setOpen(true));
    const hide = window.setTimeout(() => dismiss(), 4200);

    return () => {
      window.cancelAnimationFrame(show);
      window.clearTimeout(hide);
    };
  }, []);

  function dismiss() {
    setOpen(false);
    window.setTimeout(() => onCloseRef.current(), 280);
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className={`site-toast${open ? " is-open" : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className="site-toast__icon" aria-hidden>
        <Check className="h-4 w-4" />
      </span>
      <p>{message}</p>
      <button type="button" className="site-toast__close" onClick={dismiss} aria-label="Dismiss">
        <X className="h-4 w-4" />
      </button>
    </div>,
    document.body,
  );
}
