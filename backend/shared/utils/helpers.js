import fs from "fs/promises";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../../features/doctors/doctor.model.js";

export const isValidId = (id) => typeof id === "string" && mongoose.Types.ObjectId.isValid(id);

// slotDate format used by the frontend: "<day>_<month>_<year>", e.g. "6_11_2026"
export const isValidSlotDate = (value) =>
  typeof value === "string" && /^\d{1,2}_\d{1,2}_\d{4}$/.test(value);

export const isValidSlotTime = (value) =>
  typeof value === "string" && value.length > 0 && value.length <= 20;

// Upload a multer temp file to Cloudinary and always remove the temp file
export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
    });
    return result.secure_url;
  } finally {
    await fs.unlink(file.path).catch(() => {});
  }
};

// Free the doctor's slot for a (cancelled) appointment, atomically
export const releaseSlot = async ({ docId, slotDate, slotTime }) => {
  await doctorModel.updateOne(
    { _id: docId },
    { $pull: { [`slots_booked.${slotDate}`]: slotTime } }
  );
};
