import { http } from "@/shared/api/http";

export const bookingService = {
  book: async ({ docId, slotDate, slotTime }) =>
    (await http.post("/api/user/book-appointment", { docId, slotDate, slotTime })).data,
};
