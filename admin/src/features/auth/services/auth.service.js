import { http } from "@/shared/api/http";

export const authService = {
  adminLogin: async ({ email, password }) =>
    (await http.post("/api/admin/login", { email, password })).data,
  doctorLogin: async ({ email, password }) =>
    (await http.post("/api/doctor/login", { email, password })).data,
};
