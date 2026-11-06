import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "@/store/AppContext";
import { authService } from "@/features/auth/services/auth.service";
import { STORAGE_KEYS } from "@/shared/constants/storage.constants";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { assets } from "@/assets/assets";
import useDocumentTitle from "@/shared/hooks/useDocumentTitle";

const perks = ["Book in under a minute", "Verified, trusted doctors", "Secure online payments"];

// 0-4 score for the password strength bar
const strength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};
const STRENGTH = [
  { label: "Too weak", bar: "bg-red-400", text: "text-red-500" },
  { label: "Weak", bar: "bg-red-400", text: "text-red-500" },
  { label: "Okay", bar: "bg-amber-400", text: "text-amber-500" },
  { label: "Good", bar: "bg-emerald-400", text: "text-emerald-500" },
  { label: "Strong", bar: "bg-emerald-500", text: "text-emerald-600" },
];

const LoginView = () => {
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken } = useContext(AppContext);
  const isSignUp = state === "Sign Up";
  const score = strength(password);
  useDocumentTitle(isSignUp ? "Create account" : "Login");

  // where to go after logging in (set by ProtectedRoute), default home
  const redirectTo = location.state?.from?.pathname || "/";

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = isSignUp
        ? await authService.register({ name, email, password })
        : await authService.login({ email, password });
      if (data.success) {
        localStorage.setItem(STORAGE_KEYS.token, data.token);
        localStorage.setItem(STORAGE_KEYS.onboarded, "1");
        setToken(data.token);
        toast.success(isSignUp ? `Welcome to Prescripto, ${name.split(" ")[0]}!` : "Welcome back!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate(redirectTo, { replace: true });
  }, [token]);

  const tab = (active) =>
    `flex-1 rounded-full py-2 text-sm font-semibold transition-all ${active ? "bg-card text-ink shadow-soft" : "text-ink-soft hover:text-ink"}`;

  return (
    <div className="animate-fade-up mx-auto my-6 grid max-w-4xl overflow-hidden rounded-3xl border border-slate-100 bg-card shadow-lift md:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-700 via-primary to-primary-400 p-10 text-white md:flex">
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <h2 className="text-3xl font-extrabold leading-tight">
            Your health,
            <br />
            one booking away.
          </h2>
          <ul className="mt-8 flex flex-col gap-4">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm text-white/90">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
                  ✓
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <img className="relative -mb-10 w-4/5 self-center" src={assets.header_img} alt="" />
      </div>

      {/* Form */}
      <form onSubmit={onSubmitHandler} className="flex flex-col justify-center gap-4 p-6 sm:p-10">
        <div className="flex rounded-full bg-slate-100 p-1" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={isSignUp}
            onClick={() => setState("Sign Up")}
            className={tab(isSignUp)}
          >
            Sign up
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isSignUp}
            onClick={() => setState("Login")}
            className={tab(!isSignUp)}
          >
            Login
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {location.state?.from
              ? "Please log in to continue."
              : `Please ${isSignUp ? "sign up" : "log in"} to book an appointment.`}
          </p>
        </div>

        {isSignUp && (
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className="input"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
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
              placeholder={isSignUp ? "At least 8 characters" : "Your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={isSignUp ? 8 : undefined}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary hover:text-primary-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {isSignUp && password && (
            <div className="mt-2" aria-live="polite">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${i <= score ? STRENGTH[score].bar : "bg-slate-200"}`}
                  />
                ))}
              </div>
              <p className={`mt-1 text-xs font-medium ${STRENGTH[score].text}`}>
                {STRENGTH[score].label}
              </p>
            </div>
          )}
        </div>

        <button disabled={loading} className="btn-primary mt-2 w-full">
          {loading ? "Please wait…" : isSignUp ? "Create account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginView;
