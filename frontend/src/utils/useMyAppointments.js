import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { parseSlot } from "./slots";

// Loads the logged-in patient's appointments and derives upcoming / completed lists
export default function useMyAppointments() {
  const { backendUrl, token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", { headers: { token } });
      if (data.success) setAppointments(data.appointments);
    } catch {
      /* dashboard widgets just stay empty */
    } finally {
      setLoading(false);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const now = Date.now() - 60 * 60 * 1000; // keep an appointment "upcoming" for 1h after its start
  const upcoming = appointments
    .filter((a) => !a.cancelled && !a.isCompleted && parseSlot(a.slotDate, a.slotTime).getTime() >= now)
    .sort((a, b) => parseSlot(a.slotDate, a.slotTime) - parseSlot(b.slotDate, b.slotTime));
  const completed = appointments.filter((a) => a.isCompleted);

  return { appointments, upcoming, completed, loading, refresh };
}
