import React from "react";

const SectionHeading = ({ eyebrow, title, subtitle, align = "center" }) => (
  <div className={`flex flex-col gap-3 ${align === "center" ? "items-center text-center" : ""}`}>
    {eyebrow && (
      <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-600">
        {eyebrow}
      </span>
    )}
    <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h2>
    {subtitle && (
      <p className="max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">{subtitle}</p>
    )}
  </div>
);

export default SectionHeading;
