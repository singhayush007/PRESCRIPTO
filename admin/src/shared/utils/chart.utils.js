const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// timestamps (ms) -> last 7 local days: [{ label, value }]
export const bucketLast7Days = (timestamps = []) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({ start: d.getTime(), label: i === 0 ? "Today" : DAY[d.getDay()], value: 0 });
  }
  timestamps.forEach((ts) => {
    for (let i = days.length - 1; i >= 0; i--) {
      if (ts >= days[i].start) {
        days[i].value++;
        break;
      }
    }
  });
  return days;
};
