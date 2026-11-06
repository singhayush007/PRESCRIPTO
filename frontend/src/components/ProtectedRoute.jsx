import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

// Pages that need a logged-in patient: send visitors to /login and bring them back afterwards
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AppContext);
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
};

export default ProtectedRoute;
