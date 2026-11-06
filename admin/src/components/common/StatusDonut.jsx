import React from "react";

const COLORS = { completed: "#10B981", paid: "#5F6FFF", pending: "#F59E0B", cancelled: "#F87171" };

const StatusDonut = ({ status }) => {
  const entries = Object.entries(COLORS).map(([key, color]) => ({
    key,
    color,
    value: status?.[key] || 0,
  }));
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
            <span
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ background: e.color }}
            />
            <span className="capitalize text-ink-soft">{e.key}</span>
            <span className="ml-auto font-semibold">{e.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatusDonut;
