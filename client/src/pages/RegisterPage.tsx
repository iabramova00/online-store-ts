import { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register data:", formData);
    // TODO: authService.register()
  };

  return (
    <AuthCard heading="Create an account">
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
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Confirm password
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-accent focus:border-accent block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="acceptedTerms"
              type="checkbox"
              checked={formData.acceptedTerms}
              onChange={handleChange}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
              I accept the{" "}
              <a href="#" className="font-medium text-accent hover:underline dark:text-accent">
                Terms and Conditions
              </a>
            </label>
          </div>
        </div>

        <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
          Create an account
        </button>

        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;
