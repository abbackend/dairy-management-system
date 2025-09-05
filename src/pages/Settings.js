import React, { useState } from 'react';
import BackupManager from '../database/backup';

const Settings = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportDatabase = async () => {
    setIsExporting(true);
    try {
      const result = await BackupManager.exportDatabase();
      if (result.success) {
        alert('Database exported successfully!');
      } else {
        alert('Export failed: ' + result.message);
      }
    } catch (error) {
      alert('Export failed: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const result = await BackupManager.exportToJSON();
      if (result.success) {
        alert('Data exported to JSON successfully!');
      } else {
        alert('Export failed: ' + result.message);
      }
    } catch (error) {
      alert('Export failed: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Database Management</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Export Database</h3>
            <p className="text-sm text-gray-500 mb-3">
              Download your database as a SQLite file or JSON format for backup purposes.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleExportDatabase}
                disabled={isExporting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isExporting ? 'Exporting...' : 'Export SQLite File'}
              </button>
              
              <button
                onClick={handleExportJSON}
                disabled={isExporting}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isExporting ? 'Exporting...' : 'Export JSON'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;