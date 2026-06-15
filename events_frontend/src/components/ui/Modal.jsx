import React from "react";
import Button from "./Button.jsx";

export default function Modal({ open, onClose, title, children, maxWidthPx = 640 }) {
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label={title || "Modal"}>
      <div className="modal" style={{ maxWidth: maxWidthPx }}>
        <div className="modalHeader">
          <div className="modalTitle">{title}</div>
          <Button variant="ghost" onClick={onClose} ariaLabel="Close modal">
            ✕
          </Button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
      <button className="modalBackdrop" onClick={onClose} aria-label="Close modal backdrop" />
    </div>
  );
}
