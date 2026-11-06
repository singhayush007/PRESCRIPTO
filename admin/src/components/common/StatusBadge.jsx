import React from "react";

const StatusBadge = ({ item }) => {
  const s = item.cancelled
    ? ["Cancelled", "bg-red-50 text-red-500"]
    : item.isCompleted
      ? ["Completed", "bg-emerald-50 text-emerald-600"]
      : item.payment
        ? ["Paid", "bg-primary-50 text-primary-600"]
        : ["Pending", "bg-amber-50 text-amber-600"];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${s[1]}`}>
      {s[0]}
    </span>
  );
};

export default StatusBadge;
