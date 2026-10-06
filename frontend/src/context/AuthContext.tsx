/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { isValidSession, readAuthSession, type AuthSession, type User } from './authSession';
import { apiRequest, ApiError } from '../services/api';
export type { User } from './authSession';
interface AuthContextType extends AuthSession {
  loading: boolean;
  error: string | null;
  login: (token: string, user: User) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  verify: () => Promise<void>;
  isAuthenticated: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
function removeLegacyAccess() {
  for (const key of ['maple-demo-session', 'maple-demo-workspace-v2']) {
    try { localStorage.removeItem(key); } catch { /* storage can be unavailable */ }
  }
}
function initialSession() { removeLegacyAccess(); return readAuthSession(); }
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState(initialSession);
  const [loading, setLoading] = useState(!!session.token);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);
  const logout = useCallback(() => {
    generation.current++;
    for (const key of ['token', 'user']) { try { localStorage.removeItem(key); } catch { /* clear in-memory session too */ } }
    removeLegacyAccess(); setSession({ user: null, token: null }); setVerified(false); setLoading(false); setError(null);
  }, []);
  const verify = useCallback(async () => {
    const current = readAuthSession(); const request = ++generation.current;
    if (!current.token) { setSession(current); setVerified(false); setLoading(false); setError(null); return; }
    setLoading(true); setError(null);
    try {
      const response = await apiRequest<{ user: User }>('/auth/me');
      if (request !== generation.current) return;
      if (!isValidSession(current.token, response.user)) { logout(); return; }
      localStorage.setItem('user', JSON.stringify(response.user));
      setSession({ token: current.token, user: response.user }); setVerified(true);
    } catch (err) {
      if (request !== generation.current) return;
      if (err instanceof ApiError && err.status === 401) logout();
      else setError(err instanceof Error ? err.message : 'Could not verify your account.');
    } finally { if (request === generation.current) setLoading(false); }
  }, [logout]);
  useEffect(() => {
    void verify();
    const onStorage = (event: StorageEvent) => { if (event.key === 'token' || event.key === 'user' || event.key === null) void verify(); };
    window.addEventListener('storage', onStorage);
    return () => { generation.current++; window.removeEventListener('storage', onStorage); };
  }, [verify]);
  useEffect(() => {
    if (!session.token) return;
    const expiration = JSON.parse(atob(session.token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).exp * 1000;
    const timer = window.setTimeout(logout, Math.max(0, Math.min(expiration - Date.now(), 2147483647)));
    return () => window.clearTimeout(timer);
  }, [session.token, logout]);
  const login = (token: string, user: User) => {
    if (!isValidSession(token, user)) throw new Error('The server did not return a valid login session.');
    generation.current++; removeLegacyAccess();
    try { localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); }
    catch { throw new Error('Browser storage is unavailable. Enable it to sign in securely.'); }
    setSession({ token, user }); setVerified(true); setLoading(false); setError(null);
  };
  const updateUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user)); setSession((previous) => ({ ...previous, user }));
  };
  return <AuthContext.Provider value={{ ...session, loading, error, login, updateUser, logout, verify, isAuthenticated: verified && !!session.token && !!session.user }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('AuthProvider is required'); return value; }
