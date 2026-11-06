import React from "react";

const Tabs = ({ tabs, active, onChange }) => (
  <div
    className="no-scrollbar flex gap-1 overflow-x-auto rounded-full bg-slate-100 p-1"
    role="tablist"
  >
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
        {t.count !== undefined && (
          <span className="rounded-full bg-slate-200 px-1.5 text-[11px] text-ink-soft">
            {t.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

export default Tabs;
