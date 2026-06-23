import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { getCurrentUser as fetchCurrentUser, login as loginRequest, logout as clearAuthSession, registerDoctor as registerDoctorRequest, registerPatient as registerPatientRequest } from '../services/authService';
import { AUTH_STORAGE_KEYS } from '../utils/constants';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(AUTH_STORAGE_KEYS.token) || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const storedToken = window.localStorage.getItem(AUTH_STORAGE_KEYS.token);
      const storedUser = window.localStorage.getItem(AUTH_STORAGE_KEYS.user);

      if (!storedToken) {
        if (active) {
          setLoading(false);
        }

        return;
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;

      try {
        const response = await fetchCurrentUser();
        if (!active) {
          return;
        }

        setUser(response.user);
        setToken(storedToken);
        window.localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(response.user));
      } catch (_error) {
        clearAuthSession();
        if (active) {
          setToken('');
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const persistSession = (session) => {
    setToken(session.token);
    setUser(session.user);
    window.localStorage.setItem(AUTH_STORAGE_KEYS.token, session.token);
    window.localStorage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(session.user));
    api.defaults.headers.common.Authorization = `Bearer ${session.token}`;
  };

  const login = async (payload) => {
    const session = await loginRequest(payload);
    persistSession(session);
    return session;
  };

  const logout = () => {
    clearAuthSession();
    delete api.defaults.headers.common.Authorization;
    setToken('');
    setUser(null);
  };

  const registerPatient = async (payload) => {
    return registerPatientRequest(payload);
  };

  const registerDoctor = async (payload, onUploadProgress) => {
    return registerDoctorRequest(payload, onUploadProgress);
  };

  const value = useMemo(
    () => ({
      login,
      logout,
      registerPatient,
      registerDoctor,
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      userRole: user?.role || null,
    }),
    [loading, token, user]
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

