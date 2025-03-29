import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
