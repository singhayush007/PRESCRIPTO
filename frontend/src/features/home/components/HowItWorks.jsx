import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";

const steps = [
  {
    n: "01",
    icon: "🔎",
    title: "Find your doctor",
    text: "Search by name or speciality and compare ratings, experience and fees.",
  },
  {
    n: "02",
    icon: "🗓️",
    title: "Pick a time",
    text: "Choose a day and a slot that fits your schedule — booked slots disappear instantly.",
  },
  {
    n: "03",
    icon: "✅",
    title: "Confirm & pay",
    text: "Book in one tap and pay securely online. Reschedule or cancel any time.",
  },
];

const HowItWorks = () => (
  <section className="py-14 sm:py-20">
    <Reveal>
      <SectionHeading eyebrow="How it works" title="Booked in three simple steps" />
    </Reveal>
    <div className="relative mt-14 grid gap-6 md:grid-cols-3">
      <div className="pointer-events-none absolute left-[16%] right-[16%] top-9 hidden border-t-2 border-dashed border-primary-200 md:block" />
      {steps.map((step, i) => (
        <Reveal key={step.n} delay={i * 120}>
          <div className="relative flex flex-col items-center text-center">
            <span className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-3xl border border-slate-100 bg-card text-3xl shadow-soft">
              {step.icon}
              <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
                {step.n}
              </span>
            </span>
            <p className="mt-5 text-lg font-bold">{step.title}</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-soft">{step.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

export default HowItWorks;
