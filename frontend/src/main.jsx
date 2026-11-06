import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

// the API answers 401 when a login token is expired/invalid: sign out and ask the user to log in again
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 429) {
      err.message = err.response.data?.message || "Too many requests, please try again in a few minutes";
    }
    if (err.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
import AppContextProvider from "./context/AppContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </BrowserRouter>
);
