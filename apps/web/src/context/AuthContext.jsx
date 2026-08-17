import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('skillswap_token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await api.get('/auth/me');
      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.warn('Auth verify error:', err.message);
      localStorage.removeItem('skillswap_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (emailOrUsername, password) => {
    const data = await api.post('/auth/login', { emailOrUsername, password });
    if (data.success) {
      localStorage.setItem('skillswap_token', data.token);
      await fetchUser();
    }
    return data;
  };

  const register = async (formData) => {
    const data = await api.post('/auth/register', formData);
    if (data.success) {
      localStorage.setItem('skillswap_token', data.token);
      await fetchUser();
    }
    return data;
  };

  const sendEmailOTP = async (email) => {
    return await api.post('/auth/send-otp', { email });
  };

  const verifyEmailOTP = async (email, otpCode) => {
    const data = await api.post('/auth/verify-otp', { email, otpCode });
    if (data.success) {
      localStorage.setItem('skillswap_token', data.token);
      await fetchUser();
    }
    return data;
  };

  const loginWithGoogle = async (googlePayload) => {
    const data = await api.post('/auth/google', googlePayload);
    if (data.success) {
      localStorage.setItem('skillswap_token', data.token);
      await fetchUser();
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('skillswap_token');
    setUser(null);
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, sendEmailOTP, verifyEmailOTP, loginWithGoogle, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
