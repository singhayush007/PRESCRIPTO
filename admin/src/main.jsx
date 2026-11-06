import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// the API answers 401 when a token is expired/invalid: clear it and return to the login screen
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 429) {
      err.message = err.response.data?.message || "Too many requests, please try again in a few minutes";
    }
    if (err.response?.status === 401 && (localStorage.getItem("aToken") || localStorage.getItem("dToken"))) {
      localStorage.removeItem("aToken");
      localStorage.removeItem("dToken");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);
import AdminContextProvider from "./context/AdminContext.jsx";
import DoctorContextProvider from "./context/DoctorContext.jsx";
import AppContextProvider from "./context/AppContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);
