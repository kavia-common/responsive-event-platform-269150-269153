import React from "react";

export default function Select({ label, value, onChange, options }) {
  return (
    <label className="field">
      <div className="fieldLabel">{label}</div>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
