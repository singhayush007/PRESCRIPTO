import React from "react";

const Toggle = ({ checked, onChange, label }) => (
  <button
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-emerald-500" : "bg-slate-300"}`}
  >
    <span
      className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`}
    />
  </button>
);

export default Toggle;
