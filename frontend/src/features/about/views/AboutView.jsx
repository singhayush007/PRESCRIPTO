import React from "react";
import { Link } from "react-router-dom";
import { assets } from "@/assets/assets";
import SectionHeading from "@/components/common/SectionHeading";
import useDocumentTitle from "@/shared/hooks/useDocumentTitle";

const reasons = [
  {
    icon: "⚡",
    title: "Efficiency",
    text: "Streamlined appointment scheduling that fits into your busy lifestyle.",
  },
  {
    icon: "📍",
    title: "Convenience",
    text: "Access to a network of trusted healthcare professionals in your area.",
  },
  {
    icon: "🎯",
    title: "Personalization",
    text: "Tailored recommendations and reminders to help you stay on top of your health.",
  },
];

const AboutView = () => {
  useDocumentTitle("About us");
  return (
    <div className="animate-fade-up">
      <SectionHeading
        eyebrow="About us"
        title="Healthcare that fits your life"
        subtitle="Prescripto makes it effortless to find a doctor, book a slot and manage your care."
      />

      <div className="my-14 grid items-center gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-primary-50 shadow-soft">
          <img className="w-full object-cover" src={assets.about_image} alt="Prescripto team" />
        </div>
        <div className="flex flex-col gap-5 leading-relaxed text-ink-soft">
          <p>
            Welcome to Prescripto, your trusted partner in managing your healthcare needs
            conveniently and efficiently. We understand the challenges individuals face when it
            comes to scheduling doctor appointments and managing their health records.
          </p>
          <p>
            Prescripto is committed to excellence in healthcare technology. We continuously enhance
            our platform to improve user experience and deliver superior service — whether you're
            booking your first appointment or managing ongoing care.
          </p>
          <div className="rounded-2xl border-l-4 border-primary bg-primary-50 p-5">
            <p className="font-semibold text-ink">Our vision</p>
            <p className="mt-1 text-sm">
              To create a seamless healthcare experience for every user — bridging the gap between
              patients and providers so you can access the care you need, when you need it.
            </p>
          </div>
        </div>
      </div>

      <SectionHeading eyebrow="Why us" title="Why choose Prescripto" />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {reasons.map((r) => (
          <div
            key={r.title}
            className="group card p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:bg-primary hover:shadow-lift"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-2xl transition-colors group-hover:bg-white/20">
              {r.icon}
            </span>
            <p className="mt-5 text-lg font-semibold group-hover:text-white">{r.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft group-hover:text-white/85">
              {r.text}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Link to="/doctors" className="btn-primary">
          Find a doctor
        </Link>
      </div>
    </div>
  );
};

export default AboutView;
