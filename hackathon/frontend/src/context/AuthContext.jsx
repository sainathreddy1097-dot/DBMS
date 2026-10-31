import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('autocare_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('autocare_token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;
      setToken(data.token);
      setUser(data);
      localStorage.setItem('autocare_token', data.token);
      localStorage.setItem('autocare_user', JSON.stringify(data));
      return { success: true, role: data.role };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', userData);
      const data = response.data;
      setToken(data.token);
      setUser(data);
      localStorage.setItem('autocare_token', data.token);
      localStorage.setItem('autocare_user', JSON.stringify(data));
      return { success: true, role: data.role };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Email may already be registered.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('autocare_token');
    localStorage.removeItem('autocare_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
