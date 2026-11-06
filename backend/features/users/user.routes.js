import express from "express";
import { loginUser, registerUser, getProfile, updateProfile } from "./user.controller.js";
import {
  bookAppointment,
  listAppointment,
  cancelAppointment,
  rescheduleAppointment,
} from "../appointments/appointment.controller.js";
import {
  paymentRazorpay,
  verifyRazorpay,
  paymentStripe,
  verifyStripe,
} from "../payments/payment.controller.js";
import { addReview } from "../reviews/review.controller.js";
import upload from "../../shared/middleware/multer.js";
import authUser from "../../shared/middleware/authUser.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  authUser, // authenticate first so anonymous users cannot upload files
  upload.single("image"),
  updateProfile
);

userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/reschedule-appointment", authUser, rescheduleAppointment);

userRouter.post("/add-review", authUser, addReview);

userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
userRouter.post("/verifyRazorpay", authUser, verifyRazorpay);
userRouter.post("/payment-stripe", authUser, paymentStripe);
userRouter.post("/verifyStripe", authUser, verifyStripe);

export default userRouter;
