import { authService } from "@/features/auth/services/auth.service";
import { STORAGE_KEYS } from "@/shared/constants/storage.constants";
import React, { useContext, useState } from "react";
import { DoctorContext } from "@/store/DoctorContext";
import { AdminContext } from "@/store/AdminContext";
import { toast } from "react-toastify";
import { assets } from "@/assets/assets";
import useDocumentTitle from "@/shared/hooks/useDocumentTitle";
import useTheme from "@/shared/hooks/useTheme";
import Icon from "@/components/common/Icon";

const LoginView = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { dark, toggle } = useTheme();
  useDocumentTitle(`${state} login`);

  const { setDToken } = useContext(DoctorContext);
  const { setAToken } = useContext(AdminContext);
  const isAdmin = state === "Admin";

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = isAdmin
        ? await authService.adminLogin({ email, password })
        : await authService.doctorLogin({ email, password });
      if (data.success) {
        if (isAdmin) {
          setAToken(data.token);
          localStorage.setItem(STORAGE_KEYS.adminToken, data.token);
        } else {
          setDToken(data.token);
          localStorage.setItem(STORAGE_KEYS.doctorToken, data.token);
        }
        toast.success("Welcome back!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const tab = (active) =>
    `flex-1 rounded-full py-2 text-sm font-semibold transition-all ${active ? "bg-card text-ink shadow-soft" : "text-ink-soft hover:text-ink"}`;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-surface to-primary-100 p-4">
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="absolute right-4 top-4 rounded-full border border-slate-200 bg-card p-2.5 text-ink-soft hover:text-primary"
      >
        <Icon name={dark ? "sun" : "moon"} className="h-4 w-4" />
      </button>

      <form
        onSubmit={onSubmitHandler}
        className="animate-fade-up w-full max-w-md rounded-3xl border border-slate-100 bg-card p-8 shadow-lift"
      >
        <img data-logo className="mx-auto w-40" src={assets.admin_logo} alt="Prescripto" />
        <h1 className="mt-6 text-center text-2xl font-extrabold tracking-tight">
          {isAdmin ? "Admin" : "Doctor"} login
        </h1>
        <p className="mt-1 text-center text-sm text-ink-soft">
          {isAdmin
            ? "Manage doctors, bookings and patients."
            : "Manage your appointments and availability."}
        </p>

        <div className="mt-6 flex rounded-full bg-slate-100 p-1" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={isAdmin}
            onClick={() => setState("Admin")}
            className={tab(isAdmin)}
          >
            Admin
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isAdmin}
            onClick={() => setState("Doctor")}
            className={tab(!isAdmin)}
          >
            Doctor
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                className="input !pr-16"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button disabled={loading} className="btn-primary mt-1 w-full !py-3.5">
            {loading ? "Signing in…" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginView;
