import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import InputField from "../components/InputField";
import { loginUser } from "../services/authService";
// Remove useAuth if it's no longer needed here for setting state
// import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice"; // Import the new setUser action

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Remove login from useAuth if not needed: const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const result = await loginUser(formData); // Assumes loginUser handles the API call

      if ("error" in result) {
        setError(result.error);
      } else {
        const { token, userId, isAdmin } = result;

        // Dispatch action to update Redux store (which also handles localStorage)
        console.log("🔑 Login successful, dispatching setUser:", { token, userId, isAdmin });
        dispatch(setUser({ token, userId, isAdmin }));

        // Remove direct localStorage calls (handled by reducer)
        // localStorage.setItem("token", token);
        // localStorage.setItem("user", JSON.stringify({ userId, isAdmin }));

        // Remove call to useAuth's login (Redux is the source of truth)
        // login(token, { userId, isAdmin });

        // Navigate to home or dashboard after successful login
        navigate("/");
      }
    } catch (err) {
      console.error("Login API call failed:", err);
      setError("An unexpected error occurred during login.");
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
