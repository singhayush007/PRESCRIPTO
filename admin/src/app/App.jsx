import React, { Suspense, lazy, useContext } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import ScrollToTop from "@/components/layout/ScrollToTop";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import PageLoader from "@/components/common/PageLoader";
import LoginView from "@/features/auth/views/LoginView";
import useTheme from "@/shared/hooks/useTheme";
import { AdminContext } from "@/store/AdminContext";
import { DoctorContext } from "@/store/DoctorContext";

// Each page is its own chunk, downloaded only when it is visited.
const AdminDashboardView = lazy(
  () => import("@/features/admin-dashboard/views/AdminDashboardView")
);
const AdminAppointmentsView = lazy(
  () => import("@/features/admin-appointments/views/AdminAppointmentsView")
);
const AddDoctorView = lazy(() => import("@/features/admin-doctors/views/AddDoctorView"));
const DoctorsListView = lazy(() => import("@/features/admin-doctors/views/DoctorsListView"));
const DoctorDashboardView = lazy(
  () => import("@/features/doctor-dashboard/views/DoctorDashboardView")
);
const DoctorAppointmentsView = lazy(
  () => import("@/features/doctor-appointments/views/DoctorAppointmentsView")
);
const DoctorProfileView = lazy(() => import("@/features/doctor-profile/views/DoctorProfileView"));
const NotFoundView = lazy(() => import("@/features/not-found/views/NotFoundView"));

const App = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);
  const { dark } = useTheme();
  const { pathname } = useLocation();
  const toasts = (
    <ToastContainer position="top-right" autoClose={3000} theme={dark ? "dark" : "light"} />
  );

  if (!dToken && !aToken) {
    return (
      <>
        {toasts}
        <LoginView />
      </>
    );
  }

  const home = aToken ? "/admin-dashboard" : "/doctor-dashboard";
  // role guard: a doctor can't open admin pages (and vice versa) - they go to their own dashboard
  const admin = (el) => (aToken ? el : <Navigate to={home} replace />);
  const doctor = (el) => (dToken && !aToken ? el : <Navigate to={home} replace />);

  return (
    <div className="min-h-screen bg-surface">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      {toasts}
      <ScrollToTop />
      <Sidebar />
      <div className="md:pl-64">
        <Navbar />
        <main
          id="main-content"
          className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 md:pb-10 lg:px-8"
        >
          <ErrorBoundary key={pathname}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Navigate to={home} replace />} />
                <Route path="/admin-dashboard" element={admin(<AdminDashboardView />)} />
                <Route path="/all-appointments" element={admin(<AdminAppointmentsView />)} />
                <Route path="/add-doctor" element={admin(<AddDoctorView />)} />
                <Route path="/doctor-list" element={admin(<DoctorsListView />)} />
                <Route path="/doctor-dashboard" element={doctor(<DoctorDashboardView />)} />
                <Route path="/doctor-appointments" element={doctor(<DoctorAppointmentsView />)} />
                <Route path="/doctor-profile" element={doctor(<DoctorProfileView />)} />
                <Route path="*" element={<NotFoundView />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default App;
