import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  // unique => a patient can review a given appointment only once
  appointmentId: { type: String, required: true, unique: true },
  docId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "", maxlength: 500 },
  date: { type: Number, required: true },
});

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);
export default reviewModel;
