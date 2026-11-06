import { http } from "@/shared/api/http";

export const adminAppointmentsService = {
  list: async () => (await http.get("/api/admin/appointments")).data,
  cancel: async (appointmentId) =>
    (await http.post("/api/admin/cancel-appointment", { appointmentId })).data,
};
