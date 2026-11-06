import React, { useContext, useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import { STORAGE_KEYS } from "@/shared/constants/storage.constants";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "@/store/AppContext";
import useTheme from "@/shared/hooks/useTheme";
import CommandPalette from "@/features/search/components/CommandPalette";

const links = [
  { to: "/", label: "Home" },
  { to: "/doctors", label: "All Doctors" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const desktopLink = ({ isActive }) =>
  `relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
    isActive ? "bg-primary-50 text-primary-600" : "text-ink-soft hover:text-ink hover:bg-slate-100"
  }`;

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { dark, toggle: toggleTheme } = useTheme();
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    setToken(false);
    navigate("/login");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl+K opens quick search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowSearch((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // close the mobile menu on navigation
  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-all ${
          scrolled
            ? "border-slate-200/70 bg-card/80 shadow-sm backdrop-blur-lg"
            : "border-transparent bg-card/80 backdrop-blur"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" aria-label="Prescripto home">
            <img data-logo className="w-36 sm:w-40" src={assets.logo} alt="Prescripto" />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className={desktopLink} end={l.to === "/"}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowSearch(true)}
              aria-label="Search doctors"
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-card p-2.5 text-ink-soft transition hover:border-primary-300 hover:text-primary lg:px-4 lg:py-2"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="9" cy="9" r="6" />
                <path d="m14 14 4 4" />
              </svg>
              <span className="hidden text-sm lg:inline">Search</span>
              <kbd className="hidden rounded border border-slate-200 px-1.5 text-[10px] font-semibold text-ink-muted lg:inline">
                ⌘K
              </kbd>
            </button>
            <button
              onClick={toggleTheme}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="rounded-full border border-slate-200 bg-card p-2.5 text-ink-soft transition hover:border-primary-300 hover:text-primary"
            >
              {dark ? (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M2 12h2M20 12h2M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400" />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.800A9 9 0 1 1 11.200 3a7 7 0 0 0 9.800 9.800Z" />
                </svg>
              )}
            </button>
            {token && userData ? (
              <div className="group relative">
                <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-card py-1 pl-1 pr-3 shadow-sm transition hover:border-primary-200">
                  <img className="h-8 w-8 rounded-full object-cover" src={userData.image} alt="" />
                  <span className="hidden max-w-24 truncate text-sm font-medium sm:block">
                    {userData.name?.split(" ")[0]}
                  </span>
                  <img className="w-2.5" src={assets.dropdown_icon} alt="" />
                </button>
                <div className="invisible absolute right-0 top-full z-20 pt-2 opacity-0 transition-all group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="card min-w-52 p-2 text-sm font-medium text-ink-soft">
                    <p className="truncate px-3 pb-2 pt-1 text-xs text-ink-muted">
                      {userData.email}
                    </p>
                    <button
                      onClick={() => navigate("/my-profile")}
                      className="block w-full rounded-lg px-3 py-2 text-left hover:bg-primary-50 hover:text-primary-600"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => navigate("/my-appointments")}
                      className="block w-full rounded-lg px-3 py-2 text-left hover:bg-primary-50 hover:text-primary-600"
                    >
                      My Appointments
                    </button>
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={logout}
                      className="block w-full rounded-lg px-3 py-2 text-left text-red-500 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="btn-primary hidden !py-2.5 md:inline-flex"
              >
                Create account
              </button>
            )}

            <button
              onClick={() => setShowMenu(true)}
              className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
              aria-label="Open menu"
            >
              <img className="w-6" src={assets.menu_icon} alt="" />
            </button>
          </div>
        </nav>
      </header>

      {/* ---- Mobile drawer (outside <header>: its backdrop-blur would trap fixed children) ---- */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${showMenu ? "visible" : "invisible"}`}
        aria-hidden={!showMenu}
      >
        <div
          onClick={() => setShowMenu(false)}
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity ${showMenu ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-72 flex-col bg-card p-5 shadow-2xl transition-transform duration-300 ${
            showMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <img data-logo src={assets.logo} className="w-32" alt="" />
            <button
              onClick={() => setShowMenu(false)}
              className="rounded-lg p-2 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <img src={assets.cross_icon} className="w-5" alt="" />
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 font-medium ${isActive ? "bg-primary-50 text-primary-600" : "text-ink-soft"}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-auto">
            {token ? (
              <button onClick={logout} className="btn-outline w-full">
                Logout
              </button>
            ) : (
              <button onClick={() => navigate("/login")} className="btn-primary w-full">
                Create account
              </button>
            )}
          </div>
        </div>
      </div>
      <CommandPalette open={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
};

export default Navbar;
