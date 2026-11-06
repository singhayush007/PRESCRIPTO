import { http } from "@/shared/api/http";

export const doctorProfileService = {
  get: async () => (await http.get("/api/doctor/profile")).data,
  update: async ({ address, fees, about, available }) =>
    (await http.post("/api/doctor/update-profile", { address, fees, about, available })).data,
};
