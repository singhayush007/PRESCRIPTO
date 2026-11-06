import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const PAGES = [
  { label: "Home", to: "/", hint: "Go to" },
  { label: "All doctors", to: "/doctors", hint: "Go to" },
  { label: "My appointments", to: "/my-appointments", hint: "Go to" },
  { label: "My profile", to: "/my-profile", hint: "Go to" },
];

// ⌘K / Ctrl+K quick search: jump to any doctor or page from anywhere
const CommandPalette = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { doctors, currencySymbol } = useContext(AppContext);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const docs = doctors
      .filter((d) => !q || d.name.toLowerCase().includes(q) || d.speciality.toLowerCase().includes(q))
      .slice(0, q ? 6 : 4)
      .map((d) => ({ type: "doctor", key: d._id, doc: d, to: `/appointment/${d._id}` }));
    const pages = PAGES.filter((p) => !q || p.label.toLowerCase().includes(q)).map((p) => ({ type: "page", key: p.to, ...p }));
    return [...docs, ...pages];
  }, [query, doctors]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      inputRef.current?.focus(); // the input mounts together with `open`, so focus is immediate
    }
  }, [open]);

  useEffect(() => {
    setIndex(0);
  }, [query]);

  const go = (item) => {
    if (!item) return;
    onClose();
    navigate(item.to);
    scrollTo(0, 0);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      go(results[index]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-900/50 px-4 pt-[12vh] backdrop-blur-sm" onClick={onClose}>
      <div
        className="animate-fade-up w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Quick search"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-5">
          <svg className="h-5 w-5 flex-shrink-0 text-ink-muted" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 4 4" />
          </svg>
          <input
            ref={inputRef}
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search doctors, specialities or pages…"
            className="w-full bg-transparent py-4 text-base text-ink outline-none placeholder:text-ink-muted"
          />
          <kbd className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted">ESC</kbd>
        </div>

        <ul className="max-h-[55vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-4 py-10 text-center text-sm text-ink-soft">No results for “{query}”</li>}
          {results.map((item, i) => (
            <li key={item.key}>
              <button
                onMouseEnter={() => setIndex(i)}
                onClick={() => go(item)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${i === index ? "bg-primary-50" : ""}`}
              >
                {item.type === "doctor" ? (
                  <>
                    <img className="h-11 w-11 rounded-xl bg-primary-100 object-cover object-top" src={item.doc.image} alt="" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">{item.doc.name}</span>
                      <span className="block truncate text-xs text-ink-soft">{item.doc.speciality}</span>
                    </span>
                    <span className="text-xs text-ink-soft">
                      {item.doc.ratingCount > 0 && <span className="mr-2 text-amber-500">★ {item.doc.ratingAvg.toFixed(1)}</span>}
                      {currencySymbol}
                      {item.doc.fees}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-ink-soft">↗</span>
                    <span className="flex-1 text-sm font-medium text-ink">{item.label}</span>
                    <span className="text-xs text-ink-muted">{item.hint}</span>
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 border-t border-slate-100 px-5 py-3 text-[11px] text-ink-muted">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
