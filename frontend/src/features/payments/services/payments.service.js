import { http } from "@/shared/api/http";

export const paymentsService = {
  createStripeSession: async (appointmentId) =>
    (await http.post("/api/user/payment-stripe", { appointmentId })).data,
  /** `session_id` comes from Stripe's redirect; the server re-checks the payment with Stripe. */
  verifyStripe: async ({ appointmentId, session_id }) =>
    (await http.post("/api/user/verifyStripe", { appointmentId, session_id })).data,
  createRazorpayOrder: async (appointmentId) =>
    (await http.post("/api/user/payment-razorpay", { appointmentId })).data,
  /** `payload` is the object Razorpay's checkout handler returns. */
  verifyRazorpay: async (payload) => (await http.post("/api/user/verifyRazorpay", payload)).data,
};
