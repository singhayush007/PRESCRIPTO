// Shared slot helpers (used by the booking page and the reschedule modal).
// slotDate format matches the backend: "<day>_<month>_<year>", e.g. "6_11_2026".

export const toSlotDate = (date) =>
  `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

// Builds the next 7 days of 30-minute slots (10:00 - 21:00), excluding booked ones.
// Returns an array (one entry per day) of [{ datetime, time }].
export const buildSlots = (slotsBooked = {}) => {
  const today = new Date();
  const days = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    const endTime = new Date();
    endTime.setDate(today.getDate() + i);
    endTime.setHours(21, 0, 0, 0);

    if (today.getDate() === currentDate.getDate()) {
      currentDate.setHours(
        currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
      );
      currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
    } else {
      currentDate.setHours(10);
      currentDate.setMinutes(0);
    }

    const timeSlots = [];
    while (currentDate < endTime) {
      const time = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const booked = slotsBooked[toSlotDate(currentDate)] || [];
      if (!booked.includes(time)) {
        timeSlots.push({ datetime: new Date(currentDate), time });
      }
      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }
    days.push(timeSlots);
  }
  return days;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const DAYS_OF_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// "20_1_2026" -> "20 Jan 2026"
export const formatSlotDate = (slotDate) => {
  const [day, month, year] = slotDate.split("_");
  return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
};

// ---- helpers for showing/using a booked slot ----

// "6_11_2026" + "10:30 AM" (or 24h "14:30") -> Date
export const parseSlot = (slotDate, slotTime) => {
  const [d, m, y] = slotDate.split("_").map(Number);
  const match = /(\d{1,2}):(\d{2})\s*([AaPp][Mm])?/.exec(slotTime || "");
  let hours = match ? Number(match[1]) : 0;
  const minutes = match ? Number(match[2]) : 0;
  const meridiem = match?.[3]?.toLowerCase();
  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;
  return new Date(y, m - 1, d, hours, minutes);
};

// Today / Tomorrow / In 3 days / 12 Nov
export const relativeDay = (date) => {
  const startOfDay = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const diff = Math.round((startOfDay(date) - startOfDay(new Date())) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff > 1 && diff < 7) return `In ${diff} days`;
  if (diff < 0) return `${-diff} day${diff === -1 ? "" : "s"} ago`;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

// Generates and downloads an .ics calendar event (works with Google/Apple/Outlook calendars)
export const downloadIcs = ({ title, start, durationMin = 30, location = "", description = "" }) => {
  const pad = (n) => String(n).padStart(2, "0");
  const fmt = (d) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const esc = (t) => String(t).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
  const end = new Date(start.getTime() + durationMin * 60000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Prescripto//Appointment//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@prescripto`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(title)}`,
    `LOCATION:${esc(location)}`,
    `DESCRIPTION:${esc(description)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "appointment.ics";
  a.click();
  URL.revokeObjectURL(url);
};
