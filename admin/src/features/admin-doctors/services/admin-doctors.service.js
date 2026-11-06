import { http } from "@/shared/api/http";

export const adminDoctorsService = {
  list: async () => (await http.get("/api/admin/all-doctors")).data,
  changeAvailability: async (docId) =>
    (await http.post("/api/admin/change-availability", { docId })).data,
  /** `formData` is multipart (doctor fields + the photo). */
  add: async (formData) => (await http.post("/api/admin/add-doctor", formData)).data,
};
