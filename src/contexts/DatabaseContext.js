import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import database from '../database/database';

const DatabaseContext = createContext(null);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      if (isInitialized || isInitializing) return;

      setIsInitializing(true);
      setError(null);

      try {
        console.log('Initializing database...');
        await database.initialize();
        
        console.log('Seeding initial data...');
        await database.seedData();
        
        setIsInitialized(true);
        console.log('Database initialization complete!');
      } catch (err) {
        console.error('Database initialization failed:', err);
        setError(err.message);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDatabase();
  }, [isInitialized, isInitializing]);

  // Clean up database connection on unmount
  useEffect(() => {
    return () => {
      if (isInitialized) {
        database.close();
      }
    };
  }, [isInitialized]);

  const value = {
    isInitialized,
    isInitializing,
    error,
    database
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

DatabaseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DatabaseContext;
