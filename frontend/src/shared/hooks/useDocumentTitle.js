import { useEffect } from "react";

// Sets the browser tab title for the current page: "Doctors · Prescripto"
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Prescripto` : "Prescripto — Book trusted doctors online";
  }, [title]);
}
