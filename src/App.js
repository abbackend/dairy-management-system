import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DatabaseProvider, useDatabase } from './contexts/DatabaseContext';
import ErrorBoundary from './components/ErrorBoundary';
import { Loading } from './components/ui/loading';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import MilkCollections from './pages/MilkCollections';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Constants
import { ROUTES } from './constants';

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();
  const { isInitializing, isInitialized, error } = useDatabase();
  
  const handleRetry = React.useCallback(() => {
    window.location.reload();
  }, []);
  
  if (loading) {
    return <Loading fullScreen message="Checking authentication..." />;
  }
  
  if (isInitializing) {
    return <Loading fullScreen message="Initializing database..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">{"Database Error"}</h2>
          <p className="text-gray-600">{String(error)}</p>
          <button 
            onClick={handleRetry} 
            className="mt-4 btn-primary"
          >
            {"Retry"}
          </button>
        </div>
      </div>
    );
  }
  
  if (!isInitialized) {
    return <Loading fullScreen message="Setting up database..." />;
  }
  
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route 
        path={ROUTES.LOGIN}
        element={isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Login />} 
      />
      <Route 
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.MEMBERS}
        element={
          <ProtectedRoute>
            <Layout>
              <Members />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.COLLECTIONS}
        element={
          <ProtectedRoute>
            <Layout>
              <MilkCollections />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.REPORTS}
        element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path={ROUTES.SETTINGS}
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        } 
      />
      {/* Catch all route */}
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <DatabaseProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <AppRoutes />
            </div>
          </Router>
        </AuthProvider>
      </DatabaseProvider>
    </ErrorBoundary>
  );
}

export default App;
