import { http } from "@/shared/api/http";

export const doctorDashboardService = {
  get: async () => (await http.get("/api/doctor/dashboard")).data,
};
