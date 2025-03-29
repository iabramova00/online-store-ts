import { createContext } from "react";

export interface AuthContextType {
  token: string | null;
  user: { userId: string; isAdmin: boolean } | null;
  login: (token: string, user: { userId: string; isAdmin: boolean }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
