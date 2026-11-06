import { http } from "@/shared/api/http";

export const profileService = {
  get: async () => (await http.get("/api/user/get-profile")).data,
  /** `formData` is multipart (fields + optional image file). */
  update: async (formData) => (await http.post("/api/user/update-profile", formData)).data,
};
