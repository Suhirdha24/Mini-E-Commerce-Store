import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';
import { safeGetJSON, safeSetJSON, safeRemove } from '../utils/storage.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = safeGetJSON('user_data', null);

    if (token) {
      api.get('/auth/me')
        .then(r => {
          if (r.data?.user) {
            setUser(r.data.user);
            safeSetJSON('user_data', r.data.user);
          } else if (savedUser) {
            setUser(savedUser);
          }
        })
        .catch(() => {
          // Token expired or invalid
          safeRemove('token');
          safeRemove('user_data');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      if (savedUser) setUser(savedUser);
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const { email, password } = credentials;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    try {
      const r = await api.post('/auth/login', { email: cleanEmail, password: cleanPassword });
      
      if (r.data?.token) {
        localStorage.setItem('token', r.data.token);
      }
      if (r.data?.user) {
        safeSetJSON('user_data', r.data.user);
        setUser(r.data.user);
      }
      return r.data?.user;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email address or password.';
      throw new Error(msg);
    }
  };

  const register = async (userData) => {
    const { name, email, password } = userData;
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    try {
      const r = await api.post('/auth/register', {
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword
      });

      if (r.data?.token) {
        localStorage.setItem('token', r.data.token);
      }
      if (r.data?.user) {
        safeSetJSON('user_data', r.data.user);
        setUser(r.data.user);
      }
      return r.data?.user;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      throw new Error(msg);
    }
  };

  const logout = () => {
    safeRemove('token');
    safeRemove('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}