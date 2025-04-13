import { Navigate } from "react-router-dom";
// Remove useAuth import if no longer needed
// import { useAuth } from "../hooks/useAuth";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux"; // Import useSelector
import { RootState } from "../store/store"; // Import RootState

interface Props {
    children: ReactNode;
    requireAdmin?: boolean;
  }

const ProtectedRoute: React.FC<Props> = ({ children, requireAdmin = false }) => {
  // Get authentication state from Redux store
  const { token, isAdmin } = useSelector((state: RootState) => state.user);

  // Check if user is logged in (token exists)
  if (!token) {
    // Not logged in, redirect to login page
    // You might want to preserve the intended location to redirect back after login
    // e.g., return <Navigate to="/login" state={{ from: location }} replace />;
    // (Requires importing useLocation from react-router-dom)
    return <Navigate to="/login" replace />;
  }

  // Check if admin privileges are required and if the user has them
  if (requireAdmin && !isAdmin) {
    // Logged in, but not an admin when admin is required
    // Redirect to home page or a dedicated "Unauthorized" page
    return <Navigate to="/" replace />;
  }

  // If checks pass, render the protected content
  return children;
};

export default ProtectedRoute;

