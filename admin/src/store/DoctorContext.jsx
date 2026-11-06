import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { doctorAppointmentsService } from "@/features/doctor-appointments/services/doctor-appointments.service";
import { doctorDashboardService } from "@/features/doctor-dashboard/services/doctor-dashboard.service";
import { doctorProfileService } from "@/features/doctor-profile/services/doctor-profile.service";
import { STORAGE_KEYS } from "@/shared/constants/storage.constants";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [dToken, setDToken] = useState(localStorage.getItem(STORAGE_KEYS.doctorToken) || "");
  const [appointments, setAppointments] = useState(null); // null = still loading
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // Getting Doctor appointment data from Database using API
  const getAppointments = async () => {
    try {
      const data = await doctorAppointmentsService.list();
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Getting Doctor profile data from Database using API
  const getProfileData = async () => {
    try {
      const data = await doctorProfileService.get();
      setProfileData(data.profileData);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Getting Doctor dashboard data using API
  const getDashData = async () => {
    try {
      const data = await doctorDashboardService.get();
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to cancel doctor appointment using API
  const cancelAppointment = async (appointmentId) => {
    try {
      const data = await doctorAppointmentsService.cancel(appointmentId);
      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to Mark appointment completed using API
  const completeAppointment = async (appointmentId) => {
    try {
      const data = await doctorAppointmentsService.complete(appointmentId);
      if (data.success) {
        toast.success(data.message);
        getAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    dToken,
    setDToken,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
  };

  return <DoctorContext.Provider value={value}>{props.children}</DoctorContext.Provider>;
};

export default DoctorContextProvider;
