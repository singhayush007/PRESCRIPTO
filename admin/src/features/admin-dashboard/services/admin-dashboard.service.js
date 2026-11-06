import { http } from "@/shared/api/http";

export const adminDashboardService = {
  get: async () => (await http.get("/api/admin/dashboard")).data,
};
