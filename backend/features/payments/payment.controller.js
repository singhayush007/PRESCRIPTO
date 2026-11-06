import stripe from "stripe";
import razorpay from "razorpay";
import { getOwnAppointment } from "../appointments/appointment.service.js";
import { fail, serverError } from "../../shared/utils/http.js";

// Gateway initialize (optional: app still boots if a gateway isn't configured)
const stripeInstance = process.env.STRIPE_SECRET_KEY
  ? new stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const razorpayInstance =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

// Shared guard for starting a payment
const getPayableAppointment = async (appointmentId, userId) => {
  const appointment = await getOwnAppointment(appointmentId, userId);
  if (!appointment || appointment.cancelled) {
    return { error: "Appointment Cancelled or not found" };
  }
  if (appointment.payment) return { error: "Appointment already paid" };
  return { appointment };
};

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
  try {
    if (!razorpayInstance) return fail(res, "Razorpay is not configured");

    const { appointmentId, userId } = req.body;
    const { appointment, error } = await getPayableAppointment(appointmentId, userId);
    if (error) return fail(res, error);

    const order = await razorpayInstance.orders.create({
      amount: Math.round(appointment.amount * 100),
      currency: process.env.CURRENCY || "INR",
      receipt: String(appointment._id),
    });

    res.json({ success: true, order });
  } catch (error) {
    serverError(res, error);
  }
};

// API to verify payment of razorpay
const verifyRazorpay = async (req, res) => {
  try {
    if (!razorpayInstance) return fail(res, "Razorpay is not configured");

    const { razorpay_order_id, userId } = req.body;
    if (typeof razorpay_order_id !== "string") return fail(res, "Invalid order");

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status !== "paid") return fail(res, "Payment Failed");

    // the order's receipt is the appointment id: make sure it belongs to this user
    const appointment = await getOwnAppointment(orderInfo.receipt, userId);
    if (!appointment) return fail(res, "Appointment not found");

    appointment.payment = true;
    await appointment.save();

    res.json({ success: true, message: "Payment Successful" });
  } catch (error) {
    serverError(res, error);
  }
};

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
  try {
    if (!stripeInstance) return fail(res, "Stripe is not configured");

    const { appointmentId, userId } = req.body;
    const { appointment, error } = await getPayableAppointment(appointmentId, userId);
    if (error) return fail(res, error);

    // prefer a fixed server-side URL over the client-supplied Origin header
    const origin = process.env.FRONTEND_URL || req.headers.origin;
    if (!origin) return fail(res, "Unable to determine return URL");

    const session = await stripeInstance.checkout.sessions.create({
      // {CHECKOUT_SESSION_ID} is filled in by Stripe so we can verify server-side
      success_url: `${origin}/verify?success=true&appointmentId=${appointment._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/verify?success=false&appointmentId=${appointment._id}`,
      line_items: [
        {
          price_data: {
            currency: (process.env.CURRENCY || "USD").toLowerCase(),
            product_data: { name: "Appointment Fees" },
            unit_amount: Math.round(appointment.amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { appointmentId: String(appointment._id), userId },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    serverError(res, error);
  }
};

// Verify Stripe payment by asking Stripe (never trust the `success` query param)
const verifyStripe = async (req, res) => {
  try {
    if (!stripeInstance) return fail(res, "Stripe is not configured");

    const { appointmentId, session_id, userId } = req.body;
    if (typeof session_id !== "string") return fail(res, "Payment Failed");

    const session = await stripeInstance.checkout.sessions.retrieve(session_id);
    const valid =
      session.payment_status === "paid" &&
      session.metadata?.appointmentId === appointmentId &&
      session.metadata?.userId === userId;
    if (!valid) return fail(res, "Payment Failed");

    const appointment = await getOwnAppointment(appointmentId, userId);
    if (!appointment) return fail(res, "Appointment not found");

    appointment.payment = true;
    await appointment.save();

    res.json({ success: true, message: "Payment Successful" });
  } catch (error) {
    serverError(res, error);
  }
};

export { paymentRazorpay, verifyRazorpay, paymentStripe, verifyStripe };
