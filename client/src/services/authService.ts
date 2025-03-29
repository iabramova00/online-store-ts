import axios, { AxiosError }  from "axios";


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
    const { token, userId, isAdmin } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ userId, isAdmin }));

    return { token, userId, isAdmin };
  } catch (err: unknown) {
    const error = err as AxiosError<{ error: string }>;
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
    const { token, userId, isAdmin } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ userId, isAdmin }));

    return { token, userId, isAdmin };
  } catch (err: unknown) {
    const error = err as AxiosError<{ error: string }>;
    return { error: error.response?.data?.error || "Registration failed." };
  }
  
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}
