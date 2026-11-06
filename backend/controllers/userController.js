import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import reviewModel from "../models/reviewModel.js";
import stripe from "stripe";
import razorpay from "razorpay";
import {
  isValidId,
  isValidSlotDate,
  isValidSlotTime,
  uploadImage,
  releaseSlot,
} from "../utils/helpers.js";

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

const TOKEN_EXPIRY = "7d";
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

const fail = (res, message) => res.json({ success: false, message });
const serverError = (res, error) => {
  console.error(error);
  res.json({ success: false, message: "Something went wrong, please try again" });
};

// Returns the appointment only if it exists and belongs to the user
const getOwnAppointment = async (appointmentId, userId) => {
  if (!isValidId(appointmentId)) return null;
  const appointment = await appointmentModel.findById(appointmentId);
  if (!appointment || appointment.userId !== userId) return null;
  return appointment;
};

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (![name, email, password].every((v) => typeof v === "string" && v.trim())) {
      return fail(res, "Missing Details");
    }
    if (!validator.isEmail(email)) {
      return fail(res, "Please enter a valid email");
    }
    if (password.length < 8) {
      return fail(res, "Password must be at least 8 characters");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await new userModel({
      name: name.trim(),
      email: validator.normalizeEmail(email) || email.toLowerCase(),
      password: hashedPassword,
    }).save();

    res.json({ success: true, token: signToken(user._id) });
  } catch (error) {
    if (error.code === 11000) return fail(res, "Email already registered");
    serverError(res, error);
  }
};

// API to login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // typeof checks block NoSQL injection payloads like { "$ne": null }
    if (typeof email !== "string" || typeof password !== "string") {
      return fail(res, "Invalid credentials");
    }

    const user = await userModel.findOne({
      email: validator.normalizeEmail(email) || email.toLowerCase(),
    });
    // same message for unknown email / wrong password (no account enumeration)
    if (!user) return fail(res, "Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return fail(res, "Invalid credentials");

    res.json({ success: true, token: signToken(user._id) });
  } catch (error) {
    serverError(res, error);
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    if (!userData) return fail(res, "User not found");

    res.json({ success: true, userData });
  } catch (error) {
    serverError(res, error);
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const userId = req.userId;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return fail(res, "Data Missing");
    }

    let parsedAddress = { line1: "", line2: "" };
    if (address) {
      try {
        parsedAddress = JSON.parse(address);
      } catch {
        return fail(res, "Invalid address");
      }
    }

    const update = { name: name.trim(), phone, address: parsedAddress, dob, gender };
    if (imageFile) update.image = await uploadImage(imageFile);

    await userModel.findByIdAndUpdate(userId, update);

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    serverError(res, error);
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    if (!isValidId(docId) || !isValidSlotDate(slotDate) || !isValidSlotTime(slotTime)) {
      return fail(res, "Invalid booking details");
    }

    const docData = await doctorModel
      .findById(docId)
      .select("-password -slots_booked")
      .lean();
    if (!docData) return fail(res, "Doctor not found");
    if (!docData.available) return fail(res, "Doctor Not Available");

    // Atomically claim the slot. The $ne condition makes the check and the write
    // a single operation, so two users can never book the same slot (no race).
    const slotKey = `slots_booked.${slotDate}`;
    const claimed = await doctorModel.findOneAndUpdate(
      { _id: docId, available: true, [slotKey]: { $ne: slotTime } },
      { $push: { [slotKey]: slotTime } }
    );
    if (!claimed) return fail(res, "Slot Not Available");

    try {
      const userData = await userModel.findById(userId).select("-password").lean();
      await new appointmentModel({
        userId,
        docId,
        userData,
        docData,
        amount: docData.fees,
        slotTime,
        slotDate,
        date: Date.now(),
      }).save();
    } catch (error) {
      // roll back the slot if the appointment could not be saved
      await releaseSlot({ docId, slotDate, slotTime });
      throw error;
    }

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    serverError(res, error);
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointment = await getOwnAppointment(appointmentId, userId);

    if (!appointment) return fail(res, "Appointment not found");
    if (appointment.cancelled) return fail(res, "Appointment already cancelled");

    appointment.cancelled = true;
    await appointment.save();
    await releaseSlot(appointment);

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    serverError(res, error);
  }
};

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    serverError(res, error);
  }
};

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

// API to reschedule an appointment to another slot (same doctor)
const rescheduleAppointment = async (req, res) => {
  try {
    const { userId, appointmentId, slotDate, slotTime } = req.body;

    if (!isValidSlotDate(slotDate) || !isValidSlotTime(slotTime)) {
      return fail(res, "Invalid slot");
    }

    const appointment = await getOwnAppointment(appointmentId, userId);
    if (!appointment) return fail(res, "Appointment not found");
    if (appointment.cancelled || appointment.isCompleted) {
      return fail(res, "This appointment can no longer be rescheduled");
    }
    if (appointment.slotDate === slotDate && appointment.slotTime === slotTime) {
      return fail(res, "Please choose a different slot");
    }

    // claim the new slot atomically first, so we never end up with no slot at all
    const slotKey = `slots_booked.${slotDate}`;
    const claimed = await doctorModel.findOneAndUpdate(
      { _id: appointment.docId, available: true, [slotKey]: { $ne: slotTime } },
      { $push: { [slotKey]: slotTime } }
    );
    if (!claimed) return fail(res, "Slot Not Available");

    const old = {
      docId: appointment.docId,
      slotDate: appointment.slotDate,
      slotTime: appointment.slotTime,
    };
    try {
      appointment.slotDate = slotDate;
      appointment.slotTime = slotTime;
      await appointment.save();
    } catch (error) {
      await releaseSlot({ docId: old.docId, slotDate, slotTime });
      throw error;
    }
    await releaseSlot(old);

    res.json({ success: true, message: "Appointment Rescheduled" });
  } catch (error) {
    serverError(res, error);
  }
};

// API to rate a doctor after a completed appointment
const addReview = async (req, res) => {
  try {
    const { userId, appointmentId, rating, comment } = req.body;

    const ratingNumber = Number(rating);
    if (!Number.isInteger(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
      return fail(res, "Rating must be between 1 and 5");
    }
    if (comment !== undefined && (typeof comment !== "string" || comment.length > 500)) {
      return fail(res, "Comment must be under 500 characters");
    }

    const appointment = await getOwnAppointment(appointmentId, userId);
    if (!appointment) return fail(res, "Appointment not found");
    if (!appointment.isCompleted) {
      return fail(res, "You can review only after the appointment is completed");
    }

    const user = await userModel.findById(userId).select("name").lean();

    try {
      await new reviewModel({
        appointmentId: String(appointment._id),
        docId: appointment.docId,
        userId,
        userName: user?.name || "Patient",
        rating: ratingNumber,
        comment: (comment || "").trim(),
        date: Date.now(),
      }).save();
    } catch (error) {
      if (error.code === 11000) return fail(res, "You already reviewed this appointment");
      throw error;
    }

    appointment.reviewed = true;
    await appointment.save();

    // keep the doctor's average rating up to date (denormalized for fast listing)
    const [stats] = await reviewModel.aggregate([
      { $match: { docId: appointment.docId } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    await doctorModel.findByIdAndUpdate(appointment.docId, {
      ratingAvg: Math.round(stats.avg * 10) / 10,
      ratingCount: stats.count,
    });

    res.json({ success: true, message: "Thanks for your review!" });
  } catch (error) {
    serverError(res, error);
  }
};

export {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
  paymentStripe,
  verifyStripe,
  rescheduleAppointment,
  addReview,
};
