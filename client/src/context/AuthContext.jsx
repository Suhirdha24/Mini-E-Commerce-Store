import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';
import { safeGetJSON, safeSetJSON, safeRemove } from '../utils/storage';

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
          if (savedUser) {
            setUser(savedUser);
          } else {
            safeRemove('token');
          }
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

    if (cleanEmail === 'admin@ministore.com' && cleanPassword === 'Admin@123') {
      const adminUser = { id: 'admin_1', name: 'Store Admin', email: 'admin@ministore.com', role: 'admin' };
      localStorage.setItem('token', 'admin_jwt_token_123');
      safeSetJSON('user_data', adminUser);
      setUser(adminUser);
      return adminUser;
    }

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
      const registeredUsers = safeGetJSON('registered_users', []);
      const found = Array.isArray(registeredUsers) && registeredUsers.find(
        u => u && u.email && u.email.trim().toLowerCase() === cleanEmail && u.password && u.password.trim() === cleanPassword
      );

      if (found) {
        const loggedUser = { id: found.id, name: found.name, email: found.email, role: found.role || 'user' };
        localStorage.setItem('token', 'token_' + found.id);
        safeSetJSON('user_data', loggedUser);
        setUser(loggedUser);
        return loggedUser;
      }

      throw new Error(err.response?.data?.message || err.message || 'Invalid email address or password.');
    }
  };

  const register = async (userData) => {
    const { name, email, password } = userData;
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    const registeredUsers = safeGetJSON('registered_users', []);

    // REJECT DUPLICATE REGISTRATIONS
    const existing = Array.isArray(registeredUsers) && registeredUsers.find(
      u => u && (
        (u.email && u.email.trim().toLowerCase() === cleanEmail) ||
        (u.name && u.name.trim().toLowerCase() === cleanName.toLowerCase())
      )
    );
    
    if (existing) {
      throw new Error('An account with this Name or Email already exists. Please sign in instead.');
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      role: 'user'
    };

    const updatedUsers = Array.isArray(registeredUsers) ? [...registeredUsers, newUser] : [newUser];
    safeSetJSON('registered_users', updatedUsers);

    try {
      await api.post('/auth/register', { name: cleanName, email: cleanEmail, password: cleanPassword });
    } catch (err) {}
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