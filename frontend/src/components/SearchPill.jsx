import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { specialityData } from "../assets/assets";

// Airbnb-style search pill: what + speciality + button
const SearchPill = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [speciality, setSpeciality] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(`/doctors${speciality ? `/${speciality}` : ""}${q ? `?q=${encodeURIComponent(q)}` : ""}`);
    scrollTo(0, 0);
  };

  return (
    <form
      onSubmit={submit}
      className="flex w-full max-w-xl flex-col gap-1 rounded-3xl border border-slate-200 bg-card p-2 shadow-lift sm:flex-row sm:items-center sm:rounded-full"
    >
      <label className="flex-1 rounded-full px-5 py-2 transition hover:bg-slate-50 focus-within:bg-slate-50">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-ink">Doctor</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
        />
      </label>
      <span className="hidden h-8 w-px bg-slate-200 sm:block" />
      <label className="flex-1 rounded-full px-5 py-2 transition hover:bg-slate-50 focus-within:bg-slate-50">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-ink">Speciality</span>
        <select
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
          className="w-full bg-transparent text-sm text-ink outline-none"
        >
          <option value="">Any speciality</option>
          {specialityData.map((s) => (
            <option key={s.speciality} value={s.speciality}>
              {s.speciality}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:shadow-lift"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.200" strokeLinecap="round">
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 4 4" />
        </svg>
        Search
      </button>
    </form>
  );
};

export default SearchPill;
