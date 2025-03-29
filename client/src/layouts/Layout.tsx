import React from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Global header or navbar goes here */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Global footer could go here */}
    </div>
  );
};

export default Layout;
