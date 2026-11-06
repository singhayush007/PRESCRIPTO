import React, { useEffect, useRef, useState } from "react";

// Animates a number from 0 to `value` once it scrolls into view
const CountUp = ({ value, duration = 1100 }) => {
  const ref = useRef(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !value) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        setN(Math.round(value * (1 - Math.pow(1 - t, 3)))); // ease-out
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{value ? n : "—"}</span>;
};

export default CountUp;
