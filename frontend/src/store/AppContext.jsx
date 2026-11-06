import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { doctorsService } from "@/features/doctors/services/doctors.service";
import { profileService } from "@/features/profile/services/profile.service";
import { STORAGE_KEYS } from "@/shared/constants/storage.constants";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem(STORAGE_KEYS.token) ? localStorage.getItem(STORAGE_KEYS.token) : ""
  );
  const [userData, setUserData] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Getting Doctors using API
  const getDoctosData = async () => {
    try {
      const data = await doctorsService.list();
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoadingDoctors(false);
    }
  };

  // Getting User Profile using API
  const loadUserProfileData = async () => {
    try {
      const data = await profileService.get();

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getDoctosData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token]);

  const value = {
    doctors,
    loadingDoctors,
    getDoctosData,
    currencySymbol,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
