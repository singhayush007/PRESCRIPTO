import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/shared/constants/storage.constants";

// "Saved doctors" (the heart on a card) — kept in localStorage, synced across components/tabs
const KEY = STORAGE_KEYS.savedDoctors;
const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

export default function useSaved() {
  const [saved, setSaved] = useState(read);

  useEffect(() => {
    const sync = () => setSaved(read());
    window.addEventListener("saved-doctors", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("saved-doctors", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id) => {
    const current = read();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("saved-doctors"));
  }, []);

  return { saved, toggle };
}
