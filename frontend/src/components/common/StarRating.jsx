import React from "react";

// Read-only stars (value may be fractional) or, with onChange, a clickable input.
const StarRating = ({ value = 0, onChange, size = "text-base" }) => (
  <span className={`inline-flex ${size}`} aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => {
      const filled = value >= star - 0.25;
      const cls = filled ? "text-amber-400" : "text-ink-muted";
      return onChange ? (
        <button
          type="button"
          key={star}
          onClick={() => onChange(star)}
          className={`${cls} hover:text-amber-500 px-0.5`}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ) : (
        <span key={star} className={cls}>
          ★
        </span>
      );
    })}
  </span>
);

export default StarRating;
