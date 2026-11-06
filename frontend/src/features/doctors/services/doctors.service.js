import { http } from "@/shared/api/http";

export const doctorsService = {
  /** Public list of doctors (no email / password). */
  list: async () => (await http.get("/api/doctor/list")).data,

  /** Latest public reviews of one doctor. */
  reviews: async (docId) => (await http.get(`/api/doctor/reviews/${docId}`)).data,
};
