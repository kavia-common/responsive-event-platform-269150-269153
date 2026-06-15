import React from "react";
import clsx from "clsx";

export default function Button({ variant = "primary", onClick, children, disabled, ariaLabel }) {
  return (
    <button
      className={clsx("btn", `btn-${variant}`)}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
