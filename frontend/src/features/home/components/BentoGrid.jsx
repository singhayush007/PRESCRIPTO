import React, { useContext } from "react";
import { assets } from "@/assets/assets";
import { AppContext } from "@/store/AppContext";
import SectionHeading from "@/components/common/SectionHeading";
import CountUp from "@/components/common/CountUp";
import Reveal from "@/components/common/Reveal";

const tile = "relative overflow-hidden rounded-3xl p-7";

const BentoGrid = () => {
  const { doctors } = useContext(AppContext);

  return (
    <section className="py-14 sm:py-20">
      <Reveal>
        <SectionHeading eyebrow="Why Prescripto" title="Healthcare, minus the waiting room" />
      </Reveal>

      <Reveal delay={120} className="mt-12">
        <div className="grid auto-rows-[minmax(190px,auto)] gap-4 md:grid-cols-4">
          {/* big tile */}
          <div
            className={`${tile} flex flex-col justify-between bg-gradient-to-br from-primary-700 via-primary to-primary-400 text-white md:col-span-2 md:row-span-2`}
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <p className="text-sm font-semibold text-white/80">Quick booking</p>
              <p className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
                Pick a doctor, pick a slot. Done.
              </p>
            </div>
            <div className="relative mt-8 rounded-2xl bg-white/15 p-4 backdrop-blur">
              <p className="text-xs font-medium text-white/80">Tomorrow</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["10:00 am", "10:30 am", "11:30 am", "02:00 pm"].map((t, i) => (
                  <span
                    key={t}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium ${i === 1 ? "bg-white text-primary-700" : "border border-white/40"}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={`${tile} bg-primary-50`}>
            <p className="text-5xl font-extrabold tracking-tight text-primary-700">
              <CountUp value={doctors.length} />
            </p>
            <p className="mt-2 font-semibold">Verified doctors</p>
            <p className="text-sm text-ink-soft">Across 6 specialities</p>
          </div>

          <div className={`${tile} border border-slate-100 bg-card shadow-soft`}>
            <p className="font-semibold">Secure payments</p>
            <p className="mt-1 text-sm text-ink-soft">Pay online with Stripe or Razorpay.</p>
            <div className="mt-5 inline-flex items-center gap-4 rounded-xl bg-white px-4 py-2 ring-1 ring-slate-200">
              <img className="max-h-6" src={assets.stripe_logo} alt="Stripe" />
              <img className="max-h-6" src={assets.razorpay_logo} alt="Razorpay" />
            </div>
          </div>

          <div className={`${tile} bg-amber-50`}>
            <p className="text-2xl tracking-widest text-amber-400">★★★★★</p>
            <p className="mt-2 font-semibold">Honest patient reviews</p>
            <p className="text-sm text-ink-soft">
              Only patients with a completed visit can rate — so ratings are real.
            </p>
          </div>

          <div className={`${tile} bg-slate-900 text-white dark:border dark:border-slate-200`}>
            <p className="text-3xl">🔁</p>
            <p className="mt-3 font-semibold">Reschedule anytime</p>
            <p className="text-sm text-slate-400">Plans change. Move your slot in two taps.</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default BentoGrid;
