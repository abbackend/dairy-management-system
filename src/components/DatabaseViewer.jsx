import React from 'react';
import BackupManager from '../database/backup';

const DatabaseViewer = () => {
  const handleExport = async () => {
    await BackupManager.exportDatabase();
  };

  const handleExportJSON = async () => {
    await BackupManager.exportToJSON();
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Database Tools</h3>
      <div className="space-x-2">
        <button 
          onClick={handleExport}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Export SQLite File
        </button>
        <button 
          onClick={handleExportJSON}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export JSON
        </button>
      </div>
    </div>
  );
};

export default DatabaseViewer;