import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import useSaved from "../utils/useSaved";

const Heart = ({ filled }) => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M12 20.5s-7.500-4.500-9.200-9.200C1.700 8.200 3.500 5.500 6.400 5.500c2.100 0 3.700 1.200 5.600 3.400 1.900-2.200 3.500-3.400 5.600-3.400 2.900 0 4.700 2.700 3.600 5.800-1.700 4.700-9.200 9.200-9.200 9.200Z" />
  </svg>
);

// Airbnb-style listing card: big photo, no borders, details underneath
const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const { currencySymbol } = useContext(AppContext);
  const { saved, toggle } = useSaved();
  const isSaved = saved.includes(doctor._id);

  return (
    <div
      onClick={() => {
        navigate(`/appointment/${doctor._id}`);
        scrollTo(0, 0);
      }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-primary-50 to-primary-100">
        <img
          className="aspect-[4/4.4] w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          src={doctor.image}
          alt={doctor.name}
          loading="lazy"
        />
        <span
          className={`absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur ${
            doctor.available ? "text-emerald-600" : "text-slate-500"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${doctor.available ? "animate-pulse bg-emerald-500" : "bg-slate-400"}`} />
          {doctor.available ? "Available" : "Unavailable"}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggle(doctor._id);
          }}
          aria-label={isSaved ? "Remove from saved" : "Save doctor"}
          aria-pressed={isSaved}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-card/90 shadow-sm backdrop-blur transition hover:scale-110 ${
            isSaved ? "text-rose-500" : "text-ink-soft hover:text-rose-500"
          }`}
        >
          <Heart filled={isSaved} />
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{doctor.name}</p>
          <p className="truncate text-sm text-ink-soft">{doctor.speciality}</p>
          <p className="mt-0.5 text-sm text-ink">
            <span className="font-semibold">
              {currencySymbol}
              {doctor.fees}
            </span>{" "}
            <span className="text-ink-soft">/ visit</span>
          </p>
        </div>
        <p className="flex flex-shrink-0 items-center gap-1 text-sm font-medium">
          {doctor.ratingCount > 0 ? (
            <>
              <span className="text-amber-400">★</span>
              {doctor.ratingAvg.toFixed(1)}
              <span className="font-normal text-ink-muted">({doctor.ratingCount})</span>
            </>
          ) : (
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-semibold text-primary-600">New</span>
          )}
        </p>
      </div>
    </div>
  );
};

export const DoctorCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[4/4.4] rounded-3xl bg-slate-100" />
    <div className="mt-3 space-y-2 px-1">
      <div className="h-4 w-3/4 rounded bg-slate-100" />
      <div className="h-3 w-1/2 rounded bg-slate-100" />
      <div className="h-3 w-1/3 rounded bg-slate-100" />
    </div>
  </div>
);

export default DoctorCard;
