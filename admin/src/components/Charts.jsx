import React from "react";

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// timestamps (ms) -> last 7 local days: [{ label, value }]
export const bucketLast7Days = (timestamps = []) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({ start: d.getTime(), label: i === 0 ? "Today" : DAY[d.getDay()], value: 0 });
  }
  timestamps.forEach((ts) => {
    for (let i = days.length - 1; i >= 0; i--) {
      if (ts >= days[i].start) {
        days[i].value++;
        break;
      }
    }
  });
  return days;
};

export const BarChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div>
      <div className="flex h-44 items-end gap-2 sm:gap-3" role="img" aria-label={`Bookings in the last 7 days: ${total} total`}>
        {data.map((d, i) => (
          <div key={d.label + i} className="group flex h-full flex-1 flex-col items-center justify-end gap-1" title={`${d.label}: ${d.value}`}>
            <span className="text-xs font-semibold text-ink-soft opacity-0 transition group-hover:opacity-100">{d.value}</span>
            <div
              className={`w-full max-w-[44px] origin-bottom rounded-t-xl transition-colors ${i === data.length - 1 ? "bg-primary" : "bg-primary-200 group-hover:bg-primary-400"}`}
              style={{ height: `${Math.max((d.value / max) * 100, d.value ? 8 : 3)}%`, animation: `grow .6s ${i * 60}ms ease-out both` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 sm:gap-3">
        {data.map((d, i) => (
          <p key={d.label + i} className="flex-1 text-center text-[11px] text-ink-muted">{d.label}</p>
        ))}
      </div>
    </div>
  );
};

const COLORS = { completed: "#10B981", paid: "#5F6FFF", pending: "#F59E0B", cancelled: "#F87171" };

export const StatusDonut = ({ status }) => {
  const entries = Object.entries(COLORS).map(([key, color]) => ({ key, color, value: status?.[key] || 0 }));
  const total = entries.reduce((s, e) => s + e.value, 0);

  let acc = 0;
  const stops = entries
    .filter((e) => e.value)
    .map((e) => {
      const from = (acc / total) * 100;
      acc += e.value;
      return `${e.color} ${from}% ${(acc / total) * 100}%`;
    });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      <div
        className="relative h-36 w-36 flex-shrink-0 rounded-full"
        style={{ background: total ? `conic-gradient(${stops.join(", ")})` : "rgb(var(--s200))" }}
        role="img"
        aria-label="Appointment status breakdown"
      >
        <div className="absolute inset-[18px] flex flex-col items-center justify-center rounded-full bg-card">
          <p className="text-2xl font-extrabold">{total}</p>
          <p className="text-[11px] text-ink-muted">total</p>
        </div>
      </div>
      <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {entries.map((e) => (
          <li key={e.key} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: e.color }} />
            <span className="capitalize text-ink-soft">{e.key}</span>
            <span className="ml-auto font-semibold">{e.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
