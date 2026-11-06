import React from "react";

const PATHS = {
  dashboard: ["M4 4h7v7H4z", "M13 4h7v4h-7z", "M13 11h7v9h-7z", "M4 14h7v6H4z"],
  calendar: ["M4 6h16v14H4z", "M4 10h16", "M8 3v4", "M16 3v4"],
  userPlus: [
    "M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    "M3 21c0-4 3-6 7-6s7 2 7 6",
    "M19 8v6",
    "M16 11h6",
  ],
  users: [
    "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    "M2 21c0-4 3-6 7-6s7 2 7 6",
    "M17 4a4 4 0 0 1 0 7",
    "M22 21c0-3-2-5-5-5.7",
  ],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 21c0-4 3.5-6 8-6s8 2 8 6"],
  logout: ["M9 4H5v16h4", "M16 8l4 4-4 4", "M20 12H9"],
  sun: [
    "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    "M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  ],
  moon: ["M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"],
  search: ["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z", "m20 20-4-4"],
  check: ["M5 12.5l4.5 4.5L19 7.5"],
  x: ["M6 6l12 12", "M18 6 6 18"],
  wallet: ["M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M3 7l12-3v3", "M16 14h2"],
  trend: ["M3 17l6-6 4 4 8-8", "M15 7h6v6"],
  stethoscope: [
    "M6 3v6a4 4 0 0 0 8 0V3",
    "M10 13v2a5 5 0 0 0 10 0v-2",
    "M20 11a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
  ],
  upload: ["M12 16V4", "M7 9l5-5 5 5", "M4 20h16"],
  edit: ["M4 20h4L19 9l-4-4L4 16z", "M13 7l4 4"],
};

const Icon = ({ name, className = "h-5 w-5" }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {(PATHS[name] || []).map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

export default Icon;
