import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import DoctorCard, { DoctorCardSkeleton } from "../components/DoctorCard";
import CategoryStrip from "../components/CategoryStrip";
import { specialityData } from "../assets/assets";
import useSaved from "../utils/useSaved";
import useDocumentTitle from "../utils/useDocumentTitle";

const SORT_OPTIONS = {
  relevance: { label: "Recommended" },
  rating: { label: "Highest rated", compare: (a, b) => b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount },
  feesLow: { label: "Fees: low to high", compare: (a, b) => a.fees - b.fees },
  feesHigh: { label: "Fees: high to low", compare: (a, b) => b.fees - a.fees },
  experience: { label: "Most experienced", compare: (a, b) => parseInt(b.experience) - parseInt(a.experience) },
};

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
const ALL_ICON = (
  <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
    <rect x="4" y="4" width="6" height="6" rx="1.500" />
    <rect x="14" y="4" width="6" height="6" rx="1.500" />
    <rect x="4" y="14" width="6" height="6" rx="1.500" />
    <rect x="14" y="14" width="6" height="6" rx="1.500" />
  </svg>
);
const SAVED_ICON = (
  <svg viewBox="0 0 24 24" className="h-7 w-7" {...stroke}>
    <path d="M12 20.500s-7.500-4.500-9.200-9.200C1.700 8.200 3.500 5.500 6.400 5.500c2.100 0 3.700 1.200 5.600 3.400 1.900-2.200 3.500-3.400 5.600-3.400 2.900 0 4.700 2.700 3.600 5.800-1.700 4.700-9.200 9.200-9.200 9.200Z" />
  </svg>
);

const Doctors = () => {
  const { speciality } = useParams();
  useDocumentTitle(speciality ? `${speciality} doctors` : "All doctors");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { doctors, loadingDoctors } = useContext(AppContext);
  const { saved } = useSaved();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("relevance");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const filterDoc = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = doctors.filter(
      (doc) =>
        (!speciality || doc.speciality === speciality) &&
        (!showSaved || saved.includes(doc._id)) &&
        (!onlyAvailable || doc.available) &&
        (!query || doc.name.toLowerCase().includes(query) || doc.speciality.toLowerCase().includes(query))
    );
    const { compare } = SORT_OPTIONS[sortBy];
    return compare ? [...list].sort(compare) : list;
  }, [doctors, speciality, search, sortBy, onlyAvailable, showSaved, saved]);

  const items = [
    { key: "__all", label: "All", icon: ALL_ICON },
    ...specialityData.map((s) => ({ key: s.speciality, label: s.speciality, icon: <img className="h-8 w-8" src={s.image} alt="" /> })),
    { key: "__saved", label: `Saved${saved.length ? ` (${saved.length})` : ""}`, icon: SAVED_ICON },
  ];
  const active = showSaved ? "__saved" : speciality || "__all";

  const onSelect = (key) => {
    setShowSaved(key === "__saved");
    navigate(key === "__all" || key === "__saved" || key === speciality ? "/doctors" : `/doctors/${key}`);
  };

  return (
    <div className="animate-fade-up">
      {/* sticky category bar */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-slate-100 bg-card/90 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <CategoryStrip items={items} active={active} onSelect={onSelect} />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 4 4" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor name or speciality"
            className="w-full rounded-full border border-slate-200 bg-card py-3 pl-11 pr-4 text-sm shadow-soft outline-none transition focus:border-ink"
          />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-full border border-slate-200 bg-card px-5 py-3 text-sm outline-none focus:border-ink" aria-label="Sort doctors">
          {Object.entries(SORT_OPTIONS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <button
          onClick={() => setOnlyAvailable((v) => !v)}
          aria-pressed={onlyAvailable}
          className={`rounded-full border px-5 py-3 text-sm font-medium transition ${
            onlyAvailable ? "border-ink bg-ink text-surface" : "border-slate-200 bg-card text-ink-soft hover:border-ink"
          }`}
        >
          Available now
        </button>
      </div>

      <p className="mb-5 mt-6 text-sm text-ink-soft">
        {loadingDoctors ? "Loading doctors…" : `${filterDoc.length} ${filterDoc.length === 1 ? "doctor" : "doctors"}${speciality ? ` · ${speciality}` : ""}`}
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        {loadingDoctors
          ? Array.from({ length: 8 }).map((_, i) => <DoctorCardSkeleton key={i} />)
          : filterDoc.map((item) => <DoctorCard key={item._id} doctor={item} />)}
      </div>

      {!loadingDoctors && filterDoc.length === 0 && (
        <div className="mx-auto mt-6 max-w-md rounded-3xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-lg font-semibold">{showSaved ? "No saved doctors yet" : "No doctors match your search"}</p>
          <p className="mt-1 text-sm text-ink-soft">
            {showSaved ? "Tap the heart on a doctor to save them here." : "Try a different name or speciality, or clear the filters."}
          </p>
          <button
            onClick={() => {
              setSearch("");
              setOnlyAvailable(false);
              setShowSaved(false);
              navigate("/doctors");
            }}
            className="btn-primary mt-5"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Doctors;
