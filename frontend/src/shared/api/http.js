import axios from "axios";
import { STORAGE_KEYS } from "@/shared/constants/storage.constants";

// The one axios instance for the whole app. Feature services import `http` instead of calling axios directly.
export const http = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL });

// attach the patient's JWT (if any) to every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  if (token) config.headers.token = token;
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
    // expired / invalid session: sign out and ask the user to log in again
    if (status === 401 && localStorage.getItem(STORAGE_KEYS.token)) {
      localStorage.removeItem(STORAGE_KEYS.token);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
