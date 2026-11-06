import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";
import "@/index.css";
import { BrowserRouter } from "react-router-dom";

import AdminContextProvider from "@/store/AdminContext";
import DoctorContextProvider from "@/store/DoctorContext";
import AppContextProvider from "@/store/AppContext";

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
