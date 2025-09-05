import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage(LOCAL_STORAGE_KEYS.USER, null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simple authentication - in production, this would call an API
      const { username, password } = credentials;
      
      // Demo credentials
      if (username === 'admin' && password === 'admin123') {
        const userData = {
          id: 1,
          username: 'admin',
          name: 'Administrator',
          role: 'admin'
        };
        
        setUser(userData);
        return { success: true, user: userData };
      } else {
        const errorMessage = 'Invalid username or password';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = 'An error occurred during login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, [setUser]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    login,
    logout,
    loading,
    error,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
