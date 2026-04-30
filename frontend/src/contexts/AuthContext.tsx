import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, ApiUser, getToken, setToken, clearToken } from "../services/api";

export type User = ApiUser;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      authApi.me()
        .then(setUser)
        .catch(() => clearToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const res = await authApi.login(email, password);
    setToken(res.access_token);
    setUser(res.user);
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    const res = await authApi.signup(name, email, password);
    setToken(res.access_token);
    setUser(res.user);
  };

  const logout = (): void => {
    clearToken();
    setUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    const updated = await authApi.me();
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
