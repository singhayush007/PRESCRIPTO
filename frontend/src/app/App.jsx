import React, { Suspense, lazy, useContext } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileTabBar from "@/components/layout/MobileTabBar";
import ScrollToTop from "@/components/layout/ScrollToTop";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import PageLoader from "@/components/common/PageLoader";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import Onboarding from "@/features/onboarding/components/Onboarding";
import useTheme from "@/shared/hooks/useTheme";
import { AppContext } from "@/store/AppContext";

// Each page is its own chunk, downloaded only when the user visits it.
const HomeView = lazy(() => import("@/features/home/views/HomeView"));
const DoctorsView = lazy(() => import("@/features/doctors/views/DoctorsView"));
const LoginView = lazy(() => import("@/features/auth/views/LoginView"));
const AboutView = lazy(() => import("@/features/about/views/AboutView"));
const ContactView = lazy(() => import("@/features/contact/views/ContactView"));
const BookAppointmentView = lazy(() => import("@/features/booking/views/BookAppointmentView"));
const BookingSuccessView = lazy(() => import("@/features/booking/views/BookingSuccessView"));
const MyAppointmentsView = lazy(
  () => import("@/features/my-appointments/views/MyAppointmentsView")
);
const MyProfileView = lazy(() => import("@/features/profile/views/MyProfileView"));
const VerifyPaymentView = lazy(() => import("@/features/payments/views/VerifyPaymentView"));
const NotFoundView = lazy(() => import("@/features/not-found/views/NotFoundView"));

const App = () => {
  const { dark } = useTheme();
  const { token } = useContext(AppContext);
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Onboarding enabled={!token && pathname === "/"} />
      <ToastContainer position="top-right" autoClose={3000} theme={dark ? "dark" : "light"} />
      <Navbar />
      <main
        id="main-content"
        className="mx-auto w-full max-w-7xl flex-1 px-4 pb-8 pt-6 sm:px-6 lg:px-8"
      >
        {/* keyed by path: navigating away from a crashed page recovers automatically */}
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/doctors" element={<DoctorsView />} />
              <Route path="/doctors/:speciality" element={<DoctorsView />} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/about" element={<AboutView />} />
              <Route path="/contact" element={<ContactView />} />
              <Route path="/appointment/:docId" element={<BookAppointmentView />} />
              <Route
                path="/my-appointments"
                element={
                  <ProtectedRoute>
                    <MyAppointmentsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-profile"
                element={
                  <ProtectedRoute>
                    <MyProfileView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/verify"
                element={
                  <ProtectedRoute>
                    <VerifyPaymentView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/booking-success"
                element={
                  <ProtectedRoute>
                    <BookingSuccessView />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundView />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
};

export default App;
