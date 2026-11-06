import React from "react";

const BarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div>
      <div
        className="flex h-44 items-end gap-2 sm:gap-3"
        role="img"
        aria-label={`Bookings in the last 7 days: ${total} total`}
      >
        {data.map((d, i) => (
          <div
            key={d.label + i}
            className="group flex h-full flex-1 flex-col items-center justify-end gap-1"
            title={`${d.label}: ${d.value}`}
          >
            <span className="text-xs font-semibold text-ink-soft opacity-0 transition group-hover:opacity-100">
              {d.value}
            </span>
            <div
              className={`w-full max-w-[44px] origin-bottom rounded-t-xl transition-colors ${i === data.length - 1 ? "bg-primary" : "bg-primary-200 group-hover:bg-primary-400"}`}
              style={{
                height: `${Math.max((d.value / max) * 100, d.value ? 8 : 3)}%`,
                animation: `grow .6s ${i * 60}ms ease-out both`,
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3">
        {data.map((d, i) => (
          <p key={d.label + i} className="flex-1 text-center text-[11px] text-ink-muted">
            {d.label}
          </p>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
