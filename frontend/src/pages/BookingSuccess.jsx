import React, { useContext } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { downloadIcs, formatSlotDate, parseSlot } from "../utils/slots";
import useDocumentTitle from "../utils/useDocumentTitle";

// Shown right after a successful booking (state is passed from the booking page)
const BookingSuccess = () => {
  const { state } = useLocation();
  const { currencySymbol } = useContext(AppContext);
  useDocumentTitle("Appointment booked");

  // opened directly / refreshed: nothing to show
  if (!state?.doctor) return <Navigate to="/my-appointments" replace />;

  const { doctor, slotDate, slotTime } = state;
  const location = [doctor.address?.line1, doctor.address?.line2].filter(Boolean).join(", ");

  const addToCalendar = () =>
    downloadIcs({
      title: `Appointment with ${doctor.name}`,
      start: parseSlot(slotDate, slotTime),
      location,
      description: `${doctor.speciality} · Fee ${currencySymbol}${doctor.fees}. Booked via Prescripto.`,
    });

  const rows = [
    ["Doctor", doctor.name],
    ["Speciality", doctor.speciality],
    ["Date", formatSlotDate(slotDate)],
    ["Time", slotTime],
    ...(location ? [["Clinic", location]] : []),
    ["Fee", `${currencySymbol}${doctor.fees}`],
  ];

  return (
    <div className="animate-fade-up mx-auto max-w-lg py-6 text-center">
      {/* animated check */}
      <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/25" />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lift">
          <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.500 4.500L19 7.500" style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "draw .6s .25s ease-out forwards" }} />
          </svg>
        </span>
      </div>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Appointment booked!</h1>
      <p className="mt-2 text-ink-soft">Your slot with {doctor.name} is reserved. Complete the payment to confirm your visit.</p>

      <div className="card mt-8 overflow-hidden text-left">
        <div className="flex items-center gap-4 border-b border-slate-100 bg-primary-50 p-5">
          <img className="h-16 w-16 rounded-2xl bg-card object-cover object-top" src={doctor.image} alt="" />
          <div>
            <p className="font-bold">{doctor.name}</p>
            <p className="text-sm text-ink-soft">{formatSlotDate(slotDate)} · {slotTime}</p>
          </div>
        </div>
        <dl className="divide-y divide-slate-100 px-5">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 py-3 text-sm">
              <dt className="text-ink-muted">{k}</dt>
              <dd className="text-right font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/my-appointments" className="btn-primary">Pay now / view visit</Link>
        <button onClick={addToCalendar} className="btn-outline !px-7 !py-3">📅 Add to calendar</button>
      </div>
      <Link to="/doctors" className="mt-5 inline-block text-sm font-medium text-primary hover:underline">Book another appointment</Link>
    </div>
  );
};

export default BookingSuccess;
