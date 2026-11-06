import { http } from "@/shared/api/http";

export const doctorAppointmentsService = {
  list: async () => (await http.get("/api/doctor/appointments")).data,
  cancel: async (appointmentId) =>
    (await http.post("/api/doctor/cancel-appointment", { appointmentId })).data,
  complete: async (appointmentId) =>
    (await http.post("/api/doctor/complete-appointment", { appointmentId })).data,
};
