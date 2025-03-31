import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import { loginUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await loginUser(formData);

    if ("error" in result) {
      setError(result.error);
    } else {
      setError(null);
      login(result.token, { userId: result.userId, isAdmin: result.isAdmin });
      navigate("/");
    }
  };

  return (
    <AuthCard heading="Sign in to your account">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <InputField
          label="Your email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="name@company.com"
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          placeholder="••••••••"
        />

        <button
          type="submit"
          className="w-full text-white bg-accent hover:bg-primary font-semibold rounded-lg text-lg sm:text-xl px-6 py-4 text-center transition">
          Sign in
        </button>

        <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
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
