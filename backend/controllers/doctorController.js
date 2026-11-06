import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import reviewModel from "../models/reviewModel.js";
import { isValidId, releaseSlot } from "../utils/helpers.js";

const fail = (res, message) => res.json({ success: false, message });
const serverError = (res, error) => {
  console.error(error);
  res.json({ success: false, message: "Something went wrong, please try again" });
};

// API for doctor Login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
      return fail(res, "Invalid credentials");
    }

    const user = await doctorModel.findOne({
      email: validator.normalizeEmail(email) || email.toLowerCase(),
    });
    if (!user) return fail(res, "Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return fail(res, "Invalid credentials");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ success: true, token });
  } catch (error) {
    serverError(res, error);
  }
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    serverError(res, error);
  }
};

// Returns the appointment only if it belongs to this doctor
const getDoctorAppointment = async (appointmentId, docId) => {
  if (!isValidId(appointmentId)) return null;
  const appointment = await appointmentModel.findById(appointmentId);
  return appointment && appointment.docId === docId ? appointment : null;
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointment = await getDoctorAppointment(appointmentId, docId);

    if (!appointment) return fail(res, "Appointment not found");
    if (appointment.cancelled) return fail(res, "Appointment already cancelled");

    appointment.cancelled = true;
    await appointment.save();
    await releaseSlot(appointment); // free the slot so others can book it

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    serverError(res, error);
  }
};

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;
    const appointment = await getDoctorAppointment(appointmentId, docId);

    if (!appointment) return fail(res, "Appointment not found");
    if (appointment.cancelled) return fail(res, "Appointment is cancelled");

    appointment.isCompleted = true;
    await appointment.save();

    res.json({ success: true, message: "Appointment Completed" });
  } catch (error) {
    serverError(res, error);
  }
};

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    serverError(res, error);
  }
};

// Public: latest reviews of a doctor
const doctorReviews = async (req, res) => {
  try {
    const { docId } = req.params;
    if (!isValidId(docId)) return fail(res, "Invalid doctor");

    const reviews = await reviewModel
      .find({ docId })
      .select("userName rating comment date -_id")
      .sort({ date: -1 })
      .limit(20)
      .lean();

    res.json({ success: true, reviews });
  } catch (error) {
    serverError(res, error);
  }
};

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;
    if (!isValidId(docId)) return fail(res, "Invalid doctor");

    const docData = await doctorModel.findById(docId);
    if (!docData) return fail(res, "Doctor not found");

    docData.available = !docData.available;
    await docData.save();

    res.json({ success: true, message: "Availablity Changed" });
  } catch (error) {
    serverError(res, error);
  }
};

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");
    if (!profileData) return fail(res, "Doctor not found");

    res.json({ success: true, profileData });
  } catch (error) {
    serverError(res, error);
  }
};

// API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available, about } = req.body;

    const feesNumber = Number(fees);
    if (!Number.isFinite(feesNumber) || feesNumber <= 0) {
      return fail(res, "Please enter valid fees");
    }
    if (!address || typeof address !== "object") {
      return fail(res, "Invalid address");
    }

    const update = { fees: feesNumber, address, available: Boolean(available) };
    if (typeof about === "string" && about.trim()) update.about = about.trim();

    await doctorModel.findByIdAndUpdate(docId, update);

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    serverError(res, error);
  }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({ docId }).sort({ date: -1 });

    // cancelled appointments never count as earnings
    const earnings = appointments.reduce(
      (sum, item) =>
        !item.cancelled && (item.isCompleted || item.payment) ? sum + item.amount : sum,
      0
    );
    const patients = new Set(appointments.map((item) => item.userId)).size;

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const cancelled = appointments.filter((a) => a.cancelled).length;
    const completed = appointments.filter((a) => !a.cancelled && a.isCompleted).length;
    const paid = appointments.filter((a) => !a.cancelled && !a.isCompleted && a.payment).length;

    res.json({
      success: true,
      dashData: {
        earnings,
        appointments: appointments.length,
        patients,
        latestAppointments: appointments.slice(0, 5),
        status: { cancelled, completed, paid, pending: Math.max(appointments.length - cancelled - completed - paid, 0) },
        recentBookings: appointments.filter((a) => a.date >= weekAgo).map((a) => a.date),
      },
    });
  } catch (error) {
    serverError(res, error);
  }
};

export {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  doctorList,
  changeAvailablity,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  doctorReviews,
};
