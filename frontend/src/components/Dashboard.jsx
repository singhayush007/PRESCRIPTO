import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import useMyAppointments from "../utils/useMyAppointments";
import useSaved from "../utils/useSaved";
import { parseSlot, relativeDay } from "../utils/slots";
import SearchPill from "./SearchPill";

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

const actions = [
  { to: "/doctors", icon: "🔎", label: "Find a doctor" },
  { to: "/my-appointments", icon: "🗓️", label: "My visits" },
  { to: "/doctors", icon: "♥", label: "Saved", saved: true },
  { to: "/my-profile", icon: "👤", label: "My profile" },
];

// Home screen for logged-in patients: greeting, next appointment, quick actions, stats
const Dashboard = () => {
  const navigate = useNavigate();
  const { userData, currencySymbol } = useContext(AppContext);
  const { upcoming, completed, loading } = useMyAppointments();
  const { saved } = useSaved();

  const next = upcoming[0];
  const nextDate = next && parseSlot(next.slotDate, next.slotTime);
  const firstName = userData?.name?.split(" ")[0] || "there";

  return (
    <section className="animate-fade-up">
      {/* greeting */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink-soft">{greeting()}</p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Hi, {firstName} 👋</h1>
        </div>
        {userData?.image && (
          <img className="h-14 w-14 rounded-2xl border-2 border-card object-cover shadow-soft" src={userData.image} alt="" />
        )}
      </div>

      <div className="mt-6">
        <SearchPill />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* next appointment */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary to-primary-400 p-6 text-white shadow-lift sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <p className="relative text-xs font-semibold uppercase tracking-wider text-white/80">Next appointment</p>

          {loading && !next ? (
            <div className="mt-5 h-24 animate-pulse rounded-2xl bg-white/15" />
          ) : next ? (
            <div className="relative mt-4">
              <div className="flex items-center gap-4">
                <img className="h-20 w-20 rounded-2xl bg-white/20 object-cover object-top" src={next.docData.image} alt="" />
                <div className="min-w-0">
                  <p className="truncate text-xl font-bold">{next.docData.name}</p>
                  <p className="text-sm text-white/80">{next.docData.speciality}</p>
                  <p className="mt-2 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                    {relativeDay(nextDate)} · {next.slotTime}
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => navigate("/my-appointments")} className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary-700 transition hover:-translate-y-0.5">
                  {next.payment ? "View details" : `Pay ${currencySymbol}${next.amount} / manage`}
                </button>
                <span className="self-center text-sm text-white/80">{next.payment ? "✓ Paid" : "Payment pending"}</span>
              </div>
            </div>
          ) : (
            <div className="relative mt-4">
              <p className="text-2xl font-bold leading-snug">No upcoming visits.</p>
              <p className="mt-1 text-sm text-white/80">Book a doctor and it will show up here.</p>
              <Link to="/doctors" className="mt-5 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary-700 transition hover:-translate-y-0.5">
                Find a doctor
              </Link>
            </div>
          )}
        </div>

        {/* stats + quick actions */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-3xl bg-primary-50 p-5">
            <p className="text-3xl font-extrabold text-primary-700">{upcoming.length}</p>
            <p className="mt-1 text-sm font-medium text-ink-soft">Upcoming</p>
          </div>
          <div className="rounded-3xl bg-emerald-50 p-5">
            <p className="text-3xl font-extrabold text-emerald-600">{completed.length}</p>
            <p className="mt-1 text-sm font-medium text-ink-soft">Completed</p>
          </div>
          {actions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              onClick={() => scrollTo(0, 0)}
              className="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-card p-4 shadow-soft transition hover:-translate-y-1 hover:border-primary-200"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-lg group-hover:bg-primary-100">{a.icon}</span>
              <span className="text-sm font-semibold">
                {a.label}
                {a.saved && saved.length > 0 && <span className="ml-1 text-ink-muted">({saved.length})</span>}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
