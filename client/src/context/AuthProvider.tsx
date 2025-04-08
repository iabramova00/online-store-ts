import { useState, useEffect, ReactNode } from "react";
import AuthContext, { AuthContextType } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ userId: string; isAdmin: boolean } | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      fetch("http://localhost:5000/api/auth/verify-token", {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      })
        .then(res => {
          if (!res.ok) throw new Error("Token invalid");
          return res.json();
        })
        .then((user) => {
          setToken(savedToken);
          setUser(user); // <- comes from backend: { userId, isAdmin }
        })
        .catch(() => {
          logout(); // cleanup on bad token
        })
        .finally(() => {
          setIsLoaded(true);
        });
    } else {
      setIsLoaded(true);
    }
  }, []);

  const login = (token: string, user: { userId: string; isAdmin: boolean }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  const value: AuthContextType = { token, user, login, logout };

  if (!isLoaded) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
