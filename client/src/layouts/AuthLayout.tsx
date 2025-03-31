import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-3xl">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
