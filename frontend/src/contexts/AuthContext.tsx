import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type User = {
  id: string;
  name: string;
  email: string;
};

type StoredUser = User & { password: string };

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// ─── Storage helpers ──────────────────────────────────────────────────────────

const KEYS = {
  currentUser: "healthAppUser",
  allUsers: "healthAppUsers",
} as const;

function getStoredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(KEYS.allUsers);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(KEYS.allUsers, JSON.stringify(users));
}

function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(KEYS.currentUser);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function saveCurrentUser(user: User): void {
  localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const persisted = getCurrentUser();
    if (persisted) setUser(persisted);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const users = getStoredUsers();
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!match) throw new Error("Invalid credentials");

    const { password: _omit, ...safeUser } = match;
    saveCurrentUser(safeUser);
    setUser(safeUser);
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    const users = getStoredUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error("An account with this email already exists");

    const newUser: StoredUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    };

    saveStoredUsers([...users, newUser]);
    await login(email, password);
  };

  const logout = (): void => {
    localStorage.removeItem(KEYS.currentUser);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
