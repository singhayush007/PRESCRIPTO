import React from "react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const faqs = [
  { q: "How do I book an appointment?", a: "Find a doctor, open their page, choose a day and time on the booking card and confirm. You can pay online afterwards from My Appointments." },
  { q: "Can I reschedule or cancel?", a: "Yes. From My Appointments you can move your visit to another available slot or cancel it — the slot is released so other patients can book it." },
  { q: "How can I pay?", a: "Securely online with Stripe or Razorpay once your appointment is booked." },
  { q: "Who can leave a review?", a: "Only patients whose appointment was marked completed by the doctor, one review per visit — so every rating comes from a real consultation." },
];

const FAQ = () => (
  <section className="mx-auto max-w-3xl py-14 sm:py-20">
    <Reveal>
      <SectionHeading eyebrow="FAQ" title="Questions, answered" />
    </Reveal>
    <Reveal delay={100} className="mt-10 divide-y divide-slate-100 rounded-3xl border border-slate-100 bg-card px-6 shadow-soft">
      {faqs.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-lg leading-none text-primary transition-transform duration-300 group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 pr-10 text-sm leading-relaxed text-ink-soft">{f.a}</p>
        </details>
      ))}
    </Reveal>
  </section>
);

export default FAQ;
