import database from './database';

export class BackupManager {
  static async exportDatabase() {
    try {
      await database.initialize();
      
      const data = database.db.export();
      const blob = new Blob([data], { type: 'application/octet-stream' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dairy-backup-${new Date().toISOString().split('T')[0]}.db`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      return { success: true, message: 'Database exported successfully' };
    } catch (error) {
      console.error('Export failed:', error);
      return { success: false, message: error.message };
    }
  }

  static async importDatabase(file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Validate the database file
      const SQL = database.SQL;
      if (!SQL) {
        throw new Error('Database not initialized');
      }
      
      // Test if the file is a valid SQLite database
      const testDb = new SQL.Database(uint8Array);
      
      // Check if it has the required tables
      const tables = testDb.exec("SELECT name FROM sqlite_master WHERE type='table'");
      const tableNames = tables[0]?.values?.map(row => row[0]) || [];
      
      const requiredTables = ['members', 'milk_collections', 'settings'];
      const hasRequiredTables = requiredTables.every(table => tableNames.includes(table));
      
      if (!hasRequiredTables) {
        testDb.close();
        throw new Error('Invalid database file: missing required tables');
      }
      
      testDb.close();
      
      // If validation passes, replace the current database
      if (database.db) {
        database.db.close();
      }
      
      database.db = new SQL.Database(uint8Array);
      
      // Save to localStorage
      await database.saveToStorage();
      
      return { success: true, message: 'Database imported successfully' };
    } catch (error) {
      console.error('Import failed:', error);
      return { success: false, message: error.message };
    }
  }

  static async exportToJSON() {
    try {
      await database.initialize();
      
      // Export all data as JSON
      const members = await database.executeQueryAll('SELECT * FROM members ORDER BY id');
      const collections = await database.executeQueryAll('SELECT * FROM milk_collections ORDER BY id');
      const settings = await database.executeQueryAll('SELECT * FROM settings ORDER BY key');
      
      const exportData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: {
          members,
          milk_collections: collections,
          settings
        }
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dairy-data-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      return { success: true, message: 'Data exported to JSON successfully' };
    } catch (error) {
      console.error('JSON export failed:', error);
      return { success: false, message: error.message };
    }
  }

  static async importFromJSON(file) {
    try {
      const text = await file.text();
      const importData = JSON.parse(text);
      
      // Validate JSON structure
      if (!importData.data || !importData.data.members || !importData.data.milk_collections) {
        throw new Error('Invalid JSON format');
      }
      
      await database.initialize();
      
      // Clear existing data (with confirmation in UI)
      await database.executeUpdate('DELETE FROM milk_collections');
      await database.executeUpdate('DELETE FROM members');
      
      // Import members
      for (const member of importData.data.members) {
        await database.executeUpdate(
          `INSERT INTO members (id, first_name, last_name, email, phone, address, status, owns, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            member.id, member.first_name, member.last_name, member.email,
            member.phone, member.address, member.status, member.owns,
            member.created_at, member.updated_at
          ]
        );
      }
      
      // Import collections
      for (const collection of importData.data.milk_collections) {
        await database.executeUpdate(
          `INSERT INTO milk_collections (id, member_id, quantity, type, fat, clr, price, date, shift, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            collection.id, collection.member_id, collection.quantity, collection.type,
            collection.fat, collection.clr, collection.price, collection.date,
            collection.shift, collection.created_at, collection.updated_at
          ]
        );
      }
      
      // Import settings if available
      if (importData.data.settings) {
        for (const setting of importData.data.settings) {
          await database.executeUpdate(
            'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)',
            [setting.key, setting.value, setting.updated_at]
          );
        }
      }
      
      return { success: true, message: 'Data imported from JSON successfully' };
    } catch (error) {
      console.error('JSON import failed:', error);
      return { success: false, message: error.message };
    }
  }

  static async getBackupInfo() {
    try {
      await database.initialize();
      
      const memberCount = await database.executeQueryAll('SELECT COUNT(*) as count FROM members');
      const collectionCount = await database.executeQueryAll('SELECT COUNT(*) as count FROM milk_collections');
      const dbSize = localStorage.getItem('dairy_database')?.length || 0;
      
      return {
        members: memberCount[0]?.count || 0,
        collections: collectionCount[0]?.count || 0,
        sizeKB: Math.round(dbSize / 1024),
        lastBackup: localStorage.getItem('last_backup_date') || 'Never'
      };
    } catch (error) {
      console.error('Failed to get backup info:', error);
      return {
        members: 0,
        collections: 0,
        sizeKB: 0,
        lastBackup: 'Error'
      };
    }
  }
}

export default BackupManager;