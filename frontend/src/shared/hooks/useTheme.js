import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/shared/constants/storage.constants";

// Light / dark theme: persisted in localStorage, defaults to the OS preference.
// (index.html applies the class before first paint to avoid a flash.)
const KEY = STORAGE_KEYS.theme;
const isDark = () => document.documentElement.classList.contains("dark");

export default function useTheme() {
  const [dark, setDark] = useState(isDark);

  useEffect(() => {
    const sync = () => setDark(isDark());
    window.addEventListener("theme-change", sync);
    return () => window.removeEventListener("theme-change", sync);
  }, []);

  const toggle = useCallback(() => {
    const next = !isDark();
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(KEY, next ? "dark" : "light");
    window.dispatchEvent(new Event("theme-change"));
  }, []);

  return { dark, toggle };
}
