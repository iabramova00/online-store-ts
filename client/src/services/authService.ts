import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

interface AuthSuccess {
  token: string;
  userId: string;
  isAdmin: boolean;
}

interface AuthError {
  error: string;
}

export type AuthResult = AuthSuccess | AuthError;

export async function loginUser(data: { email: string; password: string }): Promise<AuthResult> {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    // Return the data needed for the Redux action
    const { token, userId, isAdmin } = response.data;
    return { token, userId, isAdmin };
  } catch (err: unknown) {
    const error = err as AxiosError<{ error: string }>;
    // Extract and return the error message
    return { error: error.response?.data?.error || "Login failed." };
  }
}

export async function registerUser(data: {
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<AuthResult> {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    // Return the data needed for the Redux action
    const { token, userId, isAdmin } = response.data;

    // Remove localStorage calls - this is now handled by the setUser reducer
    // localStorage.setItem("token", token);
    // localStorage.setItem("user", JSON.stringify({ userId, isAdmin }));

    return { token, userId, isAdmin };
  } catch (err: unknown) {
    const error = err as AxiosError<{ error: string }>;
     // Extract and return the error message
    return { error: error.response?.data?.error || "Registration failed." };
  }
}

// Remove getToken function as state should be read from Redux store
// export function getToken(): string | null {
//   return localStorage.getItem("token");
// }

