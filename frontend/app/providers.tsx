'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import {
  User,
  login as apiLogin,
  logout as apiLogout,
  getToken,
} from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getInitialToken(): string | null {
  if (typeof window === 'undefined') return null;
  return getToken();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getInitialToken);

  const login = async (email: string, password: string): Promise<void> => {
    const newToken = await apiLogin(email, password);
    setTokenState(newToken);
  };

  const logout = async (): Promise<void> => {
    await apiLogout();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
