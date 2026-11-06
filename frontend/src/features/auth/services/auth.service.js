import { http } from "@/shared/api/http";

export const authService = {
  login: async ({ email, password }) =>
    (await http.post("/api/user/login", { email, password })).data,
  register: async ({ name, email, password }) =>
    (await http.post("/api/user/register", { name, email, password })).data,
};
