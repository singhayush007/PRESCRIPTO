import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "@/store/AppContext";

const Icon = ({ d }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.800"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {d.map((p) => (
      <path key={p} d={p} />
    ))}
  </svg>
);

const ICONS = {
  home: ["M3 11.500 12 4l9 7.500", "M5 10v10h5v-6h4v6h5V10"],
  search: ["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z", "m20 20-4-4"],
  calendar: ["M4 6h16v14H4z", "M4 10h16", "M8 3v4", "M16 3v4"],
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M4 21c0-4 3.600-6 8-6s8 2 8 6"],
};

// Native-app style bottom navigation, mobile only
const MobileTabBar = () => {
  const { token } = useContext(AppContext);

  const tabs = [
    { to: "/", label: "Home", icon: ICONS.home, end: true },
    { to: "/doctors", label: "Doctors", icon: ICONS.search },
    { to: token ? "/my-appointments" : "/login", label: "Visits", icon: ICONS.calendar },
    { to: token ? "/my-profile" : "/login", label: token ? "Profile" : "Login", icon: ICONS.user },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-card/90 backdrop-blur-lg md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map((tab) => (
          <li key={tab.label}>
            <NavLink
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${isActive ? "text-primary" : "text-ink-muted"}`
              }
            >
              <Icon d={tab.icon} />
              {tab.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileTabBar;
