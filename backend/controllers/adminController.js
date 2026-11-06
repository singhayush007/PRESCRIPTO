import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import validator from "validator";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import userModel from "../models/userModel.js";
import { isValidId, uploadImage, releaseSlot } from "../utils/helpers.js";
import { fail, serverError } from "../utils/http.js";


// constant-time string comparison (hash first so lengths always match)
const safeEqual = (a, b) => {
  const hash = (v) => crypto.createHash("sha256").update(String(v)).digest();
  return crypto.timingSafeEqual(hash(a), hash(b));
};

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email === "string" &&
      typeof password === "string" &&
      safeEqual(email, process.env.ADMIN_EMAIL) &&
      safeEqual(password, process.env.ADMIN_PASSWORD)
    ) {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.json({ success: true, token });
    } else {
      fail(res, "Invalid credentials");
    }
  } catch (error) {
    serverError(res, error);
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    serverError(res, error);
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    if (!isValidId(appointmentId)) return fail(res, "Invalid appointment");

    const appointment = await appointmentModel.findById(appointmentId);
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

// API for adding Doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } =
      req.body;
    const imageFile = req.file;

    const textFields = [name, email, password, speciality, degree, experience, about, address];
    if (!textFields.every((v) => typeof v === "string" && v.trim()) || !fees) {
      return fail(res, "Missing Details");
    }
    if (!imageFile) return fail(res, "Doctor image is required");

    if (!validator.isEmail(email)) return fail(res, "Please enter a valid email");
    if (password.length < 8) return fail(res, "Password must be at least 8 characters");

    const feesNumber = Number(fees);
    if (!Number.isFinite(feesNumber) || feesNumber <= 0) {
      return fail(res, "Please enter valid fees");
    }

    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
    } catch {
      return fail(res, "Invalid address");
    }

    const normalizedEmail = validator.normalizeEmail(email) || email.toLowerCase();
    if (await doctorModel.exists({ email: normalizedEmail })) {
      return fail(res, "Doctor with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const imageUrl = await uploadImage(imageFile);

    await new doctorModel({
      name: name.trim(),
      email: normalizedEmail,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees: feesNumber,
      address: parsedAddress,
      date: Date.now(),
    }).save();

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    if (error.code === 11000) return fail(res, "Doctor with this email already exists");
    serverError(res, error);
  }
};

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    serverError(res, error);
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    // count in the database instead of loading every document into memory
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const [doctors, patients, appointments, latestAppointments, cancelled, completed, paid, revenueAgg, recent] =
      await Promise.all([
        doctorModel.countDocuments(),
        userModel.countDocuments(),
        appointmentModel.countDocuments(),
        appointmentModel.find({}).sort({ date: -1 }).limit(5),
        appointmentModel.countDocuments({ cancelled: true }),
        appointmentModel.countDocuments({ cancelled: false, isCompleted: true }),
        appointmentModel.countDocuments({ cancelled: false, isCompleted: false, payment: true }),
        appointmentModel.aggregate([
          { $match: { cancelled: false, $or: [{ payment: true }, { isCompleted: true }] } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        appointmentModel.find({ date: { $gte: weekAgo } }).select("date -_id").limit(5000).lean(),
      ]);

    res.json({
      success: true,
      dashData: {
        doctors,
        appointments,
        patients,
        latestAppointments,
        revenue: revenueAgg[0]?.total || 0,
        // pending = booked, not paid, not completed, not cancelled
        status: { cancelled, completed, paid, pending: Math.max(appointments - cancelled - completed - paid, 0) },
        // booking timestamps of the last 7 days; the browser buckets them per day in its own timezone
        recentBookings: recent.map((a) => a.date),
      },
    });
  } catch (error) {
    serverError(res, error);
  }
};

export {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addDoctor,
  allDoctors,
  adminDashboard,
};
