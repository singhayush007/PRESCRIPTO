import axios from "axios";
import { STORAGE_KEYS } from "@/shared/constants/storage.constants";

// The one axios instance for the panel. Feature services import `http` instead of calling axios directly.
export const http = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL });

// attach whichever role token is present (the API checks the one each route needs)
http.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem(STORAGE_KEYS.adminToken);
  const doctorToken = localStorage.getItem(STORAGE_KEYS.doctorToken);
  if (adminToken) config.headers.atoken = adminToken;
  if (doctorToken) config.headers.dtoken = doctorToken;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 429) {
      error.message =
        error.response.data?.message || "Too many requests, please try again in a few minutes";
    }
    // expired / invalid session: clear it and return to the login screen
    const signedIn =
      localStorage.getItem(STORAGE_KEYS.adminToken) ||
      localStorage.getItem(STORAGE_KEYS.doctorToken);
    if (status === 401 && signedIn) {
      localStorage.removeItem(STORAGE_KEYS.adminToken);
      localStorage.removeItem(STORAGE_KEYS.doctorToken);
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
