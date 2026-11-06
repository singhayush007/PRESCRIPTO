import { http } from "@/shared/api/http";

export const appointmentsService = {
  list: async () => (await http.get("/api/user/appointments")).data,
  cancel: async (appointmentId) =>
    (await http.post("/api/user/cancel-appointment", { appointmentId })).data,
  reschedule: async ({ appointmentId, slotDate, slotTime }) =>
    (await http.post("/api/user/reschedule-appointment", { appointmentId, slotDate, slotTime }))
      .data,
  addReview: async ({ appointmentId, rating, comment }) =>
    (await http.post("/api/user/add-review", { appointmentId, rating, comment })).data,
};
