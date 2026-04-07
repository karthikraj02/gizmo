import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();
const API = process.env.REACT_APP_API_URL || '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('nexus_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async () => {
    try {
      const { data } = await axios.get(`${API}/auth/me`);
      setUser(data);
    } catch {
      localStorage.removeItem('nexus_token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem('nexus_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
    toast.success(`Welcome back, ${data.name}!`);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API}/auth/register`, { name, email, password });
    localStorage.setItem('nexus_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
    toast.success(`Welcome to Nexus Tech, ${data.name}!`);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('nexus_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    const { data } = await axios.put(`${API}/auth/profile`, profileData);
    localStorage.setItem('nexus_token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data);
    toast.success('Profile updated!');
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
