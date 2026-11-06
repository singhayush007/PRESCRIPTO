import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "@/assets/assets";
import { AdminContext } from "@/store/AdminContext";
import Icon from "@/components/common/Icon";
import { ADMIN_NAV, DOCTOR_NAV } from "@/components/layout/nav.constants";

// Fixed left sidebar on desktop (mobile uses MobileNav)
const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const items = aToken ? ADMIN_NAV : DOCTOR_NAV;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-100 bg-card md:flex">
      <div className="flex h-16 items-center gap-2 px-6">
        <img data-logo className="w-36" src={assets.admin_logo} alt="Prescripto" />
      </div>
      <p className="px-6 pb-2 pt-4 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
        {aToken ? "Admin console" : "Doctor workspace"}
      </p>
      <nav className="flex flex-col gap-1 px-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-50 text-primary-600"
                  : "text-ink-soft hover:bg-slate-50 hover:text-ink"
              }`
            }
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary-700 via-primary to-primary-400 p-4 text-white">
          <p className="text-sm font-bold">Prescripto</p>
          <p className="mt-1 text-xs text-white/80">
            {aToken
              ? "Manage doctors, bookings and patients."
              : "Manage your visits and availability."}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
