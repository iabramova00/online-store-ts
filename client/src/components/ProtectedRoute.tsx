import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import React, { ReactNode } from "react";

interface Props {
    children: ReactNode;
    requireAdmin?: boolean;
  }

const ProtectedRoute: React.FC<Props> = ({ children, requireAdmin = false }) => {
  const { token, user } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
