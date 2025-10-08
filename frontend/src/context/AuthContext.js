import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => {
          console.log('Fetched user:', res.data);
          setUser(res.data);
          navigate('/dashboard'); // Redirect to dashboard on app load if logged in
        })
        .catch(err => {
          console.error('Fetch user error:', err);
          localStorage.removeItem('token');
          setUser(null);
          navigate('/'); // Redirect to home if token is invalid
        });
    }
  }, [navigate]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    navigate('/dashboard'); // Redirect to dashboard after login
  };

  const adminLogin = async (email, password) => {
    const res = await api.post('/auth/admin-login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    navigate('/dashboard'); // Redirect to dashboard after admin login
  };

  const signup = async (username, email, password) => {
    const res = await api.post('/auth/signup', { username, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    navigate('/dashboard'); // Redirect to dashboard after signup
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/'); // Redirect to home after logout
  };

  return (
    <AuthContext.Provider value={{ user, api, login, adminLogin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);