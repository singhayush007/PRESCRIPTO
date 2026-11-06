import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { assets, specialityData } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import SearchPill from "./SearchPill";

const WORDS = ["in minutes.", "near you.", "you can trust."];

const Header = () => {
  const { doctors } = useContext(AppContext);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-gradient-to-br from-primary-50 via-surface to-primary-100 px-6 pt-10 sm:px-10 lg:px-16 lg:pt-0">
      {/* soft mesh blobs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />

      <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="animate-fade-up flex flex-col items-start gap-6 pb-4 lg:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-card/80 px-4 py-1.5 text-xs font-semibold text-primary-700 backdrop-blur">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Doctors available to book today
          </span>

          <h1 className="text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Find the right doctor,
            <span
              key={wordIndex}
              className="animate-fade-up block bg-gradient-to-r from-primary-600 via-primary to-indigo-400 bg-clip-text pb-1 text-transparent"
            >
              {WORDS[wordIndex]}
            </span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-ink-soft">
            Search verified specialists, see real patient ratings and book a slot that fits your day.
          </p>

          <SearchPill />

          <div className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
            <span>Popular:</span>
            {specialityData.slice(0, 3).map((s) => (
              <Link
                key={s.speciality}
                to={`/doctors/${s.speciality}`}
                className="rounded-full border border-slate-200 bg-card/80 px-3 py-1 text-xs font-medium transition hover:border-primary hover:text-primary"
              >
                {s.speciality}
              </Link>
            ))}
          </div>
        </div>

        {/* visual */}
        <div className="relative mx-auto w-full max-w-md self-end lg:max-w-none">
          <div className="absolute inset-x-6 bottom-0 top-10 rounded-t-[8rem] bg-gradient-to-b from-primary-200/60 to-primary-100/20" />
          <img className="animate-fade-up relative w-full" src={assets.header_img} alt="Doctors ready to help" />

          {/* floating glass cards */}
          <div className="animate-float absolute right-0 top-8 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-card/80 px-4 py-3 shadow-soft backdrop-blur sm:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">✓</span>
            <div>
              <p className="text-lg font-bold leading-none">{doctors.length ? `${doctors.length}+` : "Verified"}</p>
              <p className="text-xs text-ink-soft">Verified doctors</p>
            </div>
          </div>
          <div className="animate-float absolute bottom-20 left-0 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-card/80 px-4 py-3 shadow-soft backdrop-blur [animation-delay:1.5s] sm:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg text-amber-500">★</span>
            <div>
              <p className="text-lg font-bold leading-none">Real reviews</p>
              <p className="text-xs text-ink-soft">From verified visits</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
