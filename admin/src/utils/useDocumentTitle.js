import { useEffect } from "react";

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Prescripto Panel` : "Prescripto Panel";
  }, [title]);
}
