import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { adminAppointmentsService } from "@/features/admin-appointments/services/admin-appointments.service";
import { adminDashboardService } from "@/features/admin-dashboard/services/admin-dashboard.service";
import { adminDoctorsService } from "@/features/admin-doctors/services/admin-doctors.service";
import { STORAGE_KEYS } from "@/shared/constants/storage.constants";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(localStorage.getItem(STORAGE_KEYS.adminToken) || "");

  const [appointments, setAppointments] = useState(null); // null = still loading
  const [doctors, setDoctors] = useState(null);
  const [dashData, setDashData] = useState(false);

  // Getting all Doctors data from Database using API
  const getAllDoctors = async () => {
    try {
      const data = await adminDoctorsService.list();
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to change doctor availablity using API
  const changeAvailability = async (docId) => {
    try {
      const data = await adminDoctorsService.changeAvailability(docId);
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Getting all appointment data from Database using API
  const getAllAppointments = async () => {
    try {
      const data = await adminAppointmentsService.list();
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Getting Admin Dashboard data from Database using API
  const getDashData = async () => {
    try {
      const data = await adminDashboardService.get();
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to cancel appointment using API
  const cancelAppointment = async (appointmentId) => {
    try {
      const data = await adminAppointmentsService.cancel(appointmentId);
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
        getDashData(); // keep dashboard numbers/charts in sync
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    aToken,
    setAToken,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    getAllAppointments,
    getDashData,
    cancelAppointment,
    dashData,
  };

  return <AdminContext.Provider value={value}>{props.children}</AdminContext.Provider>;
};

export default AdminContextProvider;
