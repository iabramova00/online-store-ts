import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import { registerUser } from "../services/authService";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await registerUser(formData);

    if ("error" in result) {
      setError(result.error);
    } else {
      setError(null);
      navigate("/login");
    }
  };

  return (
    <AuthCard heading="Create an account">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        {/** Email Field */}
        <div>
          <InputField
            label="Your email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="name@company.com"
          />
        </div>

        {/** Password Field */}
        <div>
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />
        </div>

        {/** Confirm Password Field */}
        <div>
          <InputField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />
        </div>

        {/** Terms */}
        <div className="flex items-start">
          <input
            id="terms"
            name="acceptedTerms"
            type="checkbox"
            checked={formData.acceptedTerms}
            onChange={handleChange}
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-accent dark:bg-gray-700 dark:border-gray-600"
            required
          />
          <label htmlFor="terms" className="ml-3 text-sm text-gray-500 dark:text-gray-300">
            I accept the{" "}
            <a href="#" className="font-medium text-accent hover:underline">
              Terms and Conditions
            </a>
          </label>
        </div>

        {/** Submit Button */}
        <button
          type="submit"
          className="w-full text-white bg-accent hover:bg-primary font-semibold rounded-lg text-lg sm:text-xl px-6 py-4 text-center transition">
          Create an account
        </button>

        {/** Link to Login */}
        <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </AuthCard >
  );
};

export default RegisterPage;
