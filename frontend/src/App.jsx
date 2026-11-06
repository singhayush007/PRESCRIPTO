import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Appointment from "./pages/Appointment";
import MyAppointments from "./pages/MyAppointments";
import MyProfile from "./pages/MyProfile";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify";
import MobileTabBar from "./components/MobileTabBar";
import useTheme from "./utils/useTheme";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Onboarding from "./components/Onboarding";
import NotFound from "./pages/NotFound";
import BookingSuccess from "./pages/BookingSuccess";

const App = () => {
  const { dark } = useTheme();
  const { token } = useContext(AppContext);
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Onboarding enabled={!token && pathname === "/"} />
      <ToastContainer position="top-right" autoClose={3000} theme={dark ? "dark" : "light"} />
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/my-appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
        <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        <Route path="/verify" element={<ProtectedRoute><Verify /></ProtectedRoute>} />
        <Route path="/booking-success" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
};

export default App;
