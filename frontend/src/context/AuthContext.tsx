import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

type User = { id: number; name: string; email: string; role: 'ADMIN'|'MECANICO' };
type AuthCtx = {
  user?: User;
  token?: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};
const Ctx = createContext<AuthCtx>({} as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t && u) { setToken(t); setUser(JSON.parse(u)); }
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await apiFetch<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setToken(token); setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setToken(undefined); setUser(undefined);
    localStorage.removeItem('token'); localStorage.removeItem('user');
  };

  return <Ctx.Provider value={{ user, token, login, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);

