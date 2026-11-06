import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import StarRating from "./StarRating";

const DoctorReviews = ({ docId }) => {
  const { backendUrl } = useContext(AppContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/doctor/reviews/${docId}`)
      .then(({ data }) => data.success && setReviews(data.reviews))
      .catch(() => setReviews([]));
  }, [backendUrl, docId]);

  if (!reviews.length) return null;

  return (
    <div className="mt-8 border-t border-slate-100 pt-8">
      <p className="text-xl font-bold">Patient reviews</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {reviews.map((review, index) => (
          <div key={index} className="p-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink">{review.userName}</p>
              <StarRating value={review.rating} />
            </div>
            {review.comment && (
              <p className="text-sm text-ink-soft mt-2">{review.comment}</p>
            )}
            <p className="text-xs text-ink-muted mt-2">
              {new Date(review.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorReviews;
