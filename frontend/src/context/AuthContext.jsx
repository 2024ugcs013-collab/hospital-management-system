import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authenticateMockUser, clearSession, hydrateSession, registerMockUser } from '../data/mockAuth';

export const AuthContext = createContext(null);

// Centralized mock auth state for Phase 1. The session persists across refreshes via localStorage.
export function AuthProvider({ children }) {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = hydrateSession();
    setToken(session.token || '');
    setUser(session.user || null);
    setReady(true);
  }, []);

  const login = async ({ email, password }) => {
    const session = authenticateMockUser(email, password);
    setToken(session.token);
    setUser(session.user);
    return session.user;
  };

  const logout = () => {
    clearSession();
    setToken('');
    setUser(null);
  };

  const register = async (payload) => {
    return registerMockUser(payload);
  };

  const value = useMemo(
    () => ({
      login,
      logout,
      register,
      user,
      token,
      ready,
      isAuthenticated: Boolean(token && user),
      userRole: user?.role || null,
    }),
    [ready, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}

	return context;
}

