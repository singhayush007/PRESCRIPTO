import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Every navigation starts at the top of the page (except hash links like #speciality)
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

export default ScrollToTop;
