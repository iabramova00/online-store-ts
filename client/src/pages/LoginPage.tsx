import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login data:", formData);
    // TODO: authService.login()
  };

  return (
    <AuthCard heading="Sign in to your account">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Your email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-accent focus:border-accent w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-accent focus:border-accent w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Sign in
        </button>

        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link to="/register" className="font-medium text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default LoginPage;
