import React from "react";

export default function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="field">
      <div className="fieldLabel">{label}</div>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
      />
    </label>
  );
}
