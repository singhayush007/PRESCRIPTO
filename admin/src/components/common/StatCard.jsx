import React from "react";
import Icon from "@/components/common/Icon";

const TONES = {
  primary: "bg-primary-50 text-primary-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-red-50 text-red-500",
};

export const StatCard = ({ icon, label, value, tone = "primary", hint }) => (
  <div className="card flex items-center gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
    <span
      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${TONES[tone]}`}
    >
      <Icon name={icon} className="h-6 w-6" />
    </span>
    <div className="min-w-0">
      <p className="truncate text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="text-sm text-ink-soft">{label}</p>
      {hint && <p className="text-xs text-ink-muted">{hint}</p>}
    </div>
  </div>
);

export default StatCard;
