import appointmentModel from "./appointment.model.js";
import { isValidId } from "../../shared/utils/helpers.js";

// Returns the appointment only if it exists and belongs to the user
export const getOwnAppointment = async (appointmentId, userId) => {
  if (!isValidId(appointmentId)) return null;
  const appointment = await appointmentModel.findById(appointmentId);
  if (!appointment || appointment.userId !== userId) return null;
  return appointment;
};
