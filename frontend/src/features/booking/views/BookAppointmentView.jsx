import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "@/store/AppContext";
import { assets } from "@/assets/assets";
import RelatedDoctors from "@/features/doctors/components/RelatedDoctors";
import DoctorReviews from "@/features/doctors/components/DoctorReviews";
import { buildSlots, toSlotDate, DAYS_OF_WEEK } from "@/shared/utils/slots.utils";
import { bookingService } from "@/features/booking/services/booking.service";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import useDocumentTitle from "@/shared/hooks/useDocumentTitle";

const BookAppointmentView = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, token, getDoctosData, loadingDoctors } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(false);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const navigate = useNavigate();
  useDocumentTitle(docInfo ? docInfo.name : "Doctor");

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSolts = () => {
    setDocSlots(buildSlots(docInfo.slots_booked));
    setSlotTime("");
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Login to book appointment");
      return navigate("/login");
    }

    const firstSlot = docSlots[slotIndex]?.[0];
    if (!firstSlot || !slotTime) {
      return toast.warning("Please select a time slot");
    }

    const slotDate = toSlotDate(firstSlot.datetime);

    try {
      const data = await bookingService.book({ docId, slotDate, slotTime });
      if (data.success) {
        toast.success(data.message);
        getDoctosData();
        navigate("/booking-success", {
          state: { doctor: docInfo, slotDate, slotTime },
          replace: true,
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSolts();
    }
  }, [docInfo]);

  if (!docInfo) {
    return loadingDoctors ? (
      <div className="grid animate-pulse gap-10 lg:grid-cols-[1fr_390px]">
        <div className="space-y-4">
          <div className="h-52 w-52 rounded-3xl bg-slate-100" />
          <div className="h-8 w-2/3 rounded bg-slate-100" />
          <div className="h-4 w-1/2 rounded bg-slate-100" />
          <div className="h-24 w-full rounded bg-slate-100" />
        </div>
        <div className="h-96 rounded-3xl bg-slate-100" />
      </div>
    ) : (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-6xl">🩺</p>
        <h1 className="mt-4 text-2xl font-bold">Doctor not found</h1>
        <p className="mt-2 text-ink-soft">
          This doctor may no longer be listed, or the link is incorrect.
        </p>
        <Link to="/doctors" className="btn-primary mt-6">
          Browse all doctors
        </Link>
      </div>
    );
  }

  const slotsForDay = docSlots[slotIndex] || [];
  const progress = 1 + (slotTime ? 1 : 0);

  return docInfo ? (
    <div className="animate-fade-up">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_390px]">
        {/* ---------- Left: doctor details ---------- */}
        <div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="w-full flex-shrink-0 overflow-hidden rounded-3xl bg-gradient-to-b from-primary-50 to-primary-100 sm:w-52">
              <img
                className="aspect-[4/4.2] w-full object-cover object-top"
                src={docInfo.image}
                alt={docInfo.name}
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {docInfo.name}
                  <img className="w-6" src={assets.verified_icon} alt="Verified" />
                </h1>
              </div>
              <p className="mt-1 text-lg text-ink-soft">
                {docInfo.speciality} · {docInfo.degree}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 font-medium">
                  {docInfo.ratingCount > 0 ? (
                    <>
                      <span className="text-amber-400">★</span> {docInfo.ratingAvg.toFixed(1)}
                      <span className="font-normal text-ink-muted">({docInfo.ratingCount})</span>
                    </>
                  ) : (
                    "New on Prescripto"
                  )}
                </span>
                <span className="rounded-full border border-slate-200 px-3 py-1.5 font-medium">
                  {docInfo.experience} experience
                </span>
                <span
                  className={`rounded-full px-3 py-1.5 font-semibold ${
                    docInfo.available
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {docInfo.available ? "Available" : "Unavailable"}
                </span>
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-100" />

          <div>
            <h2 className="text-xl font-bold">
              About {docInfo.name.split(" ").slice(0, 2).join(" ")}
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{docInfo.about}</p>
          </div>

          <hr className="my-8 border-slate-100" />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-lg">
                🎓
              </span>
              <div>
                <p className="font-semibold">Qualification</p>
                <p className="text-sm text-ink-soft">{docInfo.degree}</p>
              </div>
            </div>
            {docInfo.address?.line1 && (
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-lg">
                  📍
                </span>
                <div>
                  <p className="font-semibold">Clinic</p>
                  <p className="text-sm text-ink-soft">
                    {docInfo.address.line1}
                    {docInfo.address.line2 ? `, ${docInfo.address.line2}` : ""}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DoctorReviews docId={docId} />
        </div>

        {/* ---------- Right: sticky booking card ---------- */}
        <aside className="self-start lg:sticky lg:top-24">
          <div className="rounded-3xl border border-slate-200 bg-card p-6 shadow-lift">
            <p className="text-ink-soft">
              <span className="text-3xl font-extrabold text-ink">
                {currencySymbol}
                {docInfo.fees}
              </span>{" "}
              / visit
            </p>

            {/* booking progress */}
            <div className="mt-5 flex gap-1.5" aria-label={`Step ${progress} of 3`}>
              {["Day", "Time", "Confirm"].map((label, i) => (
                <div key={label} className="flex-1">
                  <div
                    className={`h-1.5 rounded-full transition-colors duration-300 ${i < progress ? "bg-primary" : "bg-slate-200"}`}
                  />
                  <p
                    className={`mt-1 text-[11px] font-medium ${i < progress ? "text-primary" : "text-ink-muted"}`}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-5 text-sm font-semibold">Select a day</p>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              {docSlots.length > 0 &&
                docSlots.map((item, index) => (
                  <button
                    onClick={() => {
                      setSlotIndex(index);
                      setSlotTime("");
                    }}
                    key={index}
                    className={`min-w-[58px] flex-shrink-0 rounded-2xl border py-3 text-center transition-all ${
                      slotIndex === index
                        ? "border-ink bg-ink text-surface"
                        : "border-slate-200 hover:border-ink"
                    }`}
                  >
                    <p className="text-[11px] font-medium opacity-70">
                      {item[0] && DAYS_OF_WEEK[item[0].datetime.getDay()]}
                    </p>
                    <p className="text-lg font-bold leading-tight">
                      {item[0] && item[0].datetime.getDate()}
                    </p>
                  </button>
                ))}
            </div>

            <p className="mt-5 text-sm font-semibold">Select a time</p>
            <div className="mt-3 grid max-h-52 grid-cols-3 gap-2 overflow-y-auto pr-1">
              {slotsForDay.length > 0 ? (
                slotsForDay.map((item, index) => (
                  <button
                    onClick={() => setSlotTime(item.time)}
                    key={index}
                    className={`rounded-xl border px-2 py-2.5 text-sm transition-all ${
                      item.time === slotTime
                        ? "border-primary bg-primary text-white shadow-soft"
                        : "border-slate-200 text-ink-soft hover:border-ink hover:text-ink"
                    }`}
                  >
                    {item.time.toLowerCase()}
                  </button>
                ))
              ) : (
                <p className="col-span-3 text-sm text-ink-muted">
                  No slots left on this day — try another date.
                </p>
              )}
            </div>

            <button
              onClick={bookAppointment}
              disabled={!docInfo.available}
              className="btn-primary mt-6 w-full !py-4 !text-base"
            >
              {docInfo.available
                ? slotTime
                  ? `Book ${slotTime.toLowerCase()}`
                  : "Book an appointment"
                : "Doctor unavailable"}
            </button>
            <p className="mt-3 text-center text-xs text-ink-muted">
              You won't be charged until you pay from My Appointments.
            </p>
          </div>
        </aside>
      </div>

      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  ) : null;
};

export default BookAppointmentView;
