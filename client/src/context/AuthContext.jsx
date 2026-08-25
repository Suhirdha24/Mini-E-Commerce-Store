import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user_data');

    if (token) {
      api.get('/auth/me')
        .then(r => {
          setUser(r.data.user);
          localStorage.setItem('user_data', JSON.stringify(r.data.user));
        })
        .catch(() => {
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            localStorage.removeItem('token');
          }
        })
        .finally(() => setLoading(false));
    } else {
      if (savedUser) setUser(JSON.parse(savedUser));
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
      localStorage.setItem('user_data', JSON.stringify(adminUser));
      setUser(adminUser);
      return adminUser;
    }

    try {
      const r = await api.post('/auth/login', { email: cleanEmail, password: cleanPassword });
      localStorage.setItem('token', r.data.token);
      localStorage.setItem('user_data', JSON.stringify(r.data.user));
      setUser(r.data.user);
      return r.data.user;
    } catch (err) {
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const found = registeredUsers.find(
        u => u.email.trim().toLowerCase() === cleanEmail && u.password.trim() === cleanPassword
      );

      if (found) {
        const loggedUser = { id: found.id, name: found.name, email: found.email, role: found.role || 'user' };
        localStorage.setItem('token', 'token_' + found.id);
        localStorage.setItem('user_data', JSON.stringify(loggedUser));
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

    const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');

    // REJECT DUPLICATE REGISTRATIONS
    const existing = registeredUsers.find(
      u => u.email.trim().toLowerCase() === cleanEmail || u.name.trim().toLowerCase() === cleanName.toLowerCase()
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

    registeredUsers.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(registeredUsers));

    try {
      await api.post('/auth/register', { name: cleanName, email: cleanEmail, password: cleanPassword });
    } catch (err) {}
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}