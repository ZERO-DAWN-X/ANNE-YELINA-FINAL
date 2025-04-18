import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from 'services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      const publicRoutes = ['/login', '/registration'];
      
      if (publicRoutes.includes(router.pathname)) {
        router.push('/');
      }
    }
  }, [loading, user, router.pathname]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['x-auth-token'] = token;
        const res = await api.get('/auth/me');
        setUser(res.data);
      }
    } catch (error) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['x-auth-token'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.post('/auth/login', credentials);
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['x-auth-token'] = token;
      setUser(user);
      
      router.push('/');
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.post('/auth/register', userData);
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      api.defaults.headers.common['x-auth-token'] = token;
      setUser(user);
      
      router.push('/');
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setUser(null);
      setLoading(true);
      setError(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      clearError,
      isAdmin,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 