import userModel from "../users/user.model.js";
import doctorModel from "../doctors/doctor.model.js";
import appointmentModel from "./appointment.model.js";
import { getOwnAppointment } from "./appointment.service.js";
import {
  isValidId,
  isValidSlotDate,
  isValidSlotTime,
  releaseSlot,
} from "../../shared/utils/helpers.js";
import { fail, serverError } from "../../shared/utils/http.js";

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    if (!isValidId(docId) || !isValidSlotDate(slotDate) || !isValidSlotTime(slotTime)) {
      return fail(res, "Invalid booking details");
    }

    const docData = await doctorModel.findById(docId).select("-password -slots_booked").lean();
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
      if (error.code === 11000) return fail(res, "Slot Not Available");
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
      if (error.code === 11000) return fail(res, "Slot Not Available");
      throw error;
    }
    await releaseSlot(old);

    res.json({ success: true, message: "Appointment Rescheduled" });
  } catch (error) {
    serverError(res, error);
  }
};

export { bookAppointment, cancelAppointment, listAppointment, rescheduleAppointment };
