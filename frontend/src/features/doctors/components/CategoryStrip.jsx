import React from "react";

// Airbnb-style horizontal category bar: icon above label, underline on the active one
const CategoryStrip = ({ items, active, onSelect, className = "" }) => (
  <div className={`no-scrollbar flex gap-2 overflow-x-auto sm:gap-4 ${className}`} role="tablist">
    {items.map((item) => {
      const isActive = active === item.key;
      return (
        <button
          key={item.key}
          role="tab"
          aria-selected={isActive}
          onClick={() => onSelect(item.key)}
          className={`group flex min-w-[84px] flex-shrink-0 flex-col items-center gap-2 border-b-2 px-3 pb-3 pt-2 transition-all ${
            isActive
              ? "border-ink text-ink"
              : "border-transparent text-ink-soft hover:border-slate-300 hover:text-ink"
          }`}
        >
          <span
            className={`flex h-9 w-9 items-center justify-center transition-transform group-hover:scale-110 ${isActive ? "" : "opacity-70 group-hover:opacity-100"}`}
          >
            {item.icon}
          </span>
          <span className="whitespace-nowrap text-xs font-medium">{item.label}</span>
        </button>
      );
    })}
  </div>
);

export default CategoryStrip;
