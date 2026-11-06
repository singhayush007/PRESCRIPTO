import userModel from "../users/user.model.js";
import doctorModel from "../doctors/doctor.model.js";
import reviewModel from "./review.model.js";
import { getOwnAppointment } from "../appointments/appointment.service.js";
import { fail, serverError } from "../../shared/utils/http.js";

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

export { addReview };
