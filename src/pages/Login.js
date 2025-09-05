import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';


const Login = () => {
  const [credentials, setCredentials] = useState({
    username: 'admin',
    password: 'admin123'
  });
  
  const { login, loading, error, clearError } = useAuth();

  // Clear any existing errors when component mounts or credentials change
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [credentials.username, credentials.password, clearError, error]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!credentials.username || !credentials.password) {
      return;
    }
    
    await login(credentials);
  }, [credentials, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="card p-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Maa Gauri Dairy
            </h2>
            <p className="text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="input-field"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !credentials.username || !credentials.password}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                {loading && (
                  <span className="mr-2">⏳</span>
                )}
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
