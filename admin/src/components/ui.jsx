import React from "react";
import Icon from "./Icon";

export const PageHeader = ({ title, subtitle, action }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const TONES = {
  primary: "bg-primary-50 text-primary-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-red-50 text-red-500",
};

export const StatCard = ({ icon, label, value, tone = "primary", hint }) => (
  <div className="card flex items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
    <span className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${TONES[tone]}`}>
      <Icon name={icon} className="h-6 w-6" />
    </span>
    <div className="min-w-0">
      <p className="truncate text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="text-sm text-ink-soft">{label}</p>
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  </div>
);

export const StatusBadge = ({ item }) => {
  const s = item.cancelled
    ? ["Cancelled", "bg-red-50 text-red-500"]
    : item.isCompleted
    ? ["Completed", "bg-emerald-50 text-emerald-600"]
    : item.payment
    ? ["Paid", "bg-primary-50 text-primary-600"]
    : ["Pending", "bg-amber-50 text-amber-600"];
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${s[1]}`}>{s[0]}</span>;
};

export const Avatar = ({ src, name, className = "h-9 w-9" }) =>
  src ? (
    <img className={`${className} flex-shrink-0 rounded-full bg-primary-100 object-cover object-top`} src={src} alt="" />
  ) : (
    <span className={`${className} flex flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600`}>
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );

export const EmptyState = ({ icon = "calendar", title, text }) => (
  <div className="flex flex-col items-center px-6 py-14 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
      <Icon name={icon} className="h-7 w-7" />
    </span>
    <p className="mt-4 font-semibold">{title}</p>
    {text && <p className="mt-1 max-w-xs text-sm text-ink-soft">{text}</p>}
  </div>
);

export const Skeleton = ({ className = "" }) => <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />;

export const Toggle = ({ checked, onChange, label }) => (
  <button
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-emerald-500" : "bg-slate-300"}`}
  >
    <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`} />
  </button>
);

export const Tabs = ({ tabs, active, onChange }) => (
  <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-slate-100 p-1" role="tablist">
    {tabs.map((t) => (
      <button
        key={t.key}
        role="tab"
        aria-selected={active === t.key}
        onClick={() => onChange(t.key)}
        className={`flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
          active === t.key ? "bg-card text-ink shadow-soft" : "text-ink-soft hover:text-ink"
        }`}
      >
        {t.label}
        {t.count !== undefined && <span className="rounded-full bg-slate-200 px-1.5 text-[11px] text-ink-soft">{t.count}</span>}
      </button>
    ))}
  </div>
);

export const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="relative min-w-[220px] flex-1">
    <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-full border border-slate-200 bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
    />
  </div>
);

export const ConfirmDialog = ({ open, title, message, confirmLabel = "Confirm", danger, onConfirm, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="animate-fade-up w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true" aria-label={title}>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-2 text-sm text-ink-soft">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="btn-outline !px-5">Keep it</button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white transition ${danger ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary-600"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
