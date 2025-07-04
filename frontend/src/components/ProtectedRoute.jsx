import React from "react";
import { Navigate } from "react-router-dom";

// This component wraps our protected admin panel.
const ProtectedRoute = ({ children }) => {
  // Check if our admin authentication flag exists in localStorage.
  const isAdminAuthenticated =
    window.localStorage.getItem("isAdminAuthenticated") === "true";

  if (!isAdminAuthenticated) {
    // If the user is not authenticated, redirect them to the admin login page.
    return <Navigate to="/admin/login" replace />;
  }

  // If they are authenticated, render the component that was passed in (the AdminPanel).
  return children;
};

export default ProtectedRoute;
