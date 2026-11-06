import React, { useContext } from "react";
import { DoctorContext } from "./context/DoctorContext";
import { AdminContext } from "./context/AdminContext";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import useTheme from "./utils/useTheme";
import { useEffect } from "react";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);
  const { dark } = useTheme();
  const toasts = <ToastContainer position="top-right" autoClose={3000} theme={dark ? "dark" : "light"} />;

  if (!dToken && !aToken) {
    return (
      <>
        {toasts}
        <Login />
      </>
    );
  }

  const home = aToken ? "/admin-dashboard" : "/doctor-dashboard";
  // role guard: a doctor can't open admin pages (and vice versa) - they go to their own dashboard
  const admin = (el) => (aToken ? el : <Navigate to={home} replace />);
  const doctor = (el) => (dToken && !aToken ? el : <Navigate to={home} replace />);

  return (
    <div className="min-h-screen bg-surface">
      {toasts}
      <ScrollToTop />
      <Sidebar />
      <div className="md:pl-64">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 md:pb-10 lg:px-8">
          <Routes>
            <Route path="/" element={<Navigate to={home} replace />} />
            <Route path="/admin-dashboard" element={admin(<Dashboard />)} />
            <Route path="/all-appointments" element={admin(<AllAppointments />)} />
            <Route path="/add-doctor" element={admin(<AddDoctor />)} />
            <Route path="/doctor-list" element={admin(<DoctorsList />)} />
            <Route path="/doctor-dashboard" element={doctor(<DoctorDashboard />)} />
            <Route path="/doctor-appointments" element={doctor(<DoctorAppointments />)} />
            <Route path="/doctor-profile" element={doctor(<DoctorProfile />)} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default App;
