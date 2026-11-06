import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { assets } from "@/assets/assets";
import { DoctorContext } from "@/store/DoctorContext";
import { AdminContext } from "@/store/AdminContext";
import useTheme from "@/shared/hooks/useTheme";
import Icon from "@/components/common/Icon";

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext);
  const { aToken, setAToken } = useContext(AdminContext);
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  useLocation();

  const logout = () => {
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-100 bg-card/80 px-4 backdrop-blur-lg sm:px-6 lg:px-8">
      {/* logo is only shown here on mobile; desktop has it in the sidebar */}
      <img data-logo className="w-32 md:hidden" src={assets.admin_logo} alt="Prescripto" />
      <span className="hidden rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 md:inline">
        {aToken ? "Admin" : "Doctor"}
      </span>

      <div className="flex items-center gap-2">
        <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-600 md:hidden">
          {aToken ? "Admin" : "Doctor"}
        </span>
        <button
          onClick={toggle}
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          className="rounded-full border border-slate-200 bg-card p-2.5 text-ink-soft transition hover:border-primary-300 hover:text-primary"
        >
          <Icon name={dark ? "sun" : "moon"} className="h-4 w-4" />
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-card px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-red-300 hover:bg-red-50 hover:text-red-500"
        >
          <Icon name="logout" className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
