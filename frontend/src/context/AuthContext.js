import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Update baseURL to Render
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://funfling.onrender.com/api'
  });
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  };

  const signup = async (username, email, password) => {
    const res = await api.post('/auth/signup', { username, email, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};