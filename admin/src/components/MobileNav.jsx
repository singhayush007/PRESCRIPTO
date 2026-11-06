import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import Icon from "./Icon";
import { ADMIN_NAV, DOCTOR_NAV } from "./nav";

const MobileNav = () => {
  const { aToken } = useContext(AdminContext);
  const items = aToken ? ADMIN_NAV : DOCTOR_NAV;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-card/90 backdrop-blur-lg md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} aria-label="Primary">
      <ul className={`mx-auto grid max-w-md ${items.length === 4 ? "grid-cols-4" : "grid-cols-3"}`}>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors ${isActive ? "text-primary" : "text-ink-muted"}`}>
              <Icon name={item.icon} className="h-6 w-6" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNav;
