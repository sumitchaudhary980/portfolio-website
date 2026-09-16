"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function ProjectDialog({ children, onClose, label, className = "" }) {
  const ref = useRef(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return createPortal(<dialog ref={ref} className={`project-dialog ${className}`} aria-label={label} onCancel={(event) => { event.preventDefault(); close.current(); }} onClick={(event) => { if (event.target === ref.current) close.current(); }}>{children}</dialog>, document.body);
}
