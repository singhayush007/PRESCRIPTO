import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";

const slides = [
  { emoji: "🔎", title: "Find the right doctor", text: "Search verified specialists by name or speciality and compare real patient ratings." },
  { emoji: "🗓️", title: "Book in seconds", text: "Pick a day and a time that suits you. Reschedule or cancel any time, no phone calls." },
  { emoji: "💳", title: "Pay securely online", text: "Confirm your visit and pay with Stripe or Razorpay — all from one place." },
];

const KEY = "onboarded";

// First-visit welcome slides (shown once, skippable)
const Onboarding = ({ enabled }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (enabled && !localStorage.getItem(KEY)) setOpen(true);
  }, [enabled]);

  const finish = () => {
    localStorage.setItem(KEY, "1");
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  const last = step === slides.length - 1;
  const slide = slides[step];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Welcome to Prescripto">
      <div className="animate-fade-up relative w-full max-w-md overflow-hidden rounded-[2rem] bg-card shadow-2xl">
        <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-primary-700 via-primary to-primary-400">
          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
          <img data-keep className="absolute bottom-0 h-44 opacity-25" src={assets.header_img} alt="" />
          <span key={step} className="animate-fade-up relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white/20 text-5xl backdrop-blur">{slide.emoji}</span>
          <button onClick={finish} className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur hover:bg-white/30">Skip</button>
        </div>

        <div className="p-7 text-center">
          <h2 key={`t${step}`} className="animate-fade-up text-2xl font-extrabold tracking-tight">{slide.title}</h2>
          <p key={`p${step}`} className="animate-fade-up mt-2 min-h-[3.5rem] text-sm leading-relaxed text-ink-soft">{slide.text}</p>

          <div className="mt-5 flex justify-center gap-2">
            {slides.map((_, i) => (
              <span key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-primary" : "w-2 bg-slate-200"}`} />
            ))}
          </div>

          <div className="mt-7 flex gap-3">
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} className="btn-outline !px-6">Back</button>
            )}
            <button onClick={() => (last ? finish() : setStep((s) => s + 1))} className="btn-primary flex-1">
              {last ? "Get started" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
