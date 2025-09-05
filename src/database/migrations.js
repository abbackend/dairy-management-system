// Database migration system
export const MIGRATIONS = [
  {
    version: '1.0.0',
    description: 'Initial database setup',
    up: async (db) => {
      // This is handled by the initial table creation
      console.log('Migration 1.0.0: Initial setup completed');
    }
  },
  {
    version: '1.0.1',
    description: 'Add updated_at triggers',
    up: async (db) => {
      // Add triggers to automatically update updated_at fields
      const triggers = [
        `CREATE TRIGGER IF NOT EXISTS update_members_timestamp 
         AFTER UPDATE ON members 
         BEGIN 
           UPDATE members SET updated_at = datetime('now') WHERE id = NEW.id;
         END`,
        
        `CREATE TRIGGER IF NOT EXISTS update_collections_timestamp 
         AFTER UPDATE ON milk_collections 
         BEGIN 
           UPDATE milk_collections SET updated_at = datetime('now') WHERE id = NEW.id;
         END`,
         
        `CREATE TRIGGER IF NOT EXISTS update_settings_timestamp 
         AFTER UPDATE ON settings 
         BEGIN 
           UPDATE settings SET updated_at = datetime('now') WHERE key = NEW.key;
         END`
      ];
      
      triggers.forEach(trigger => {
        db.exec(trigger);
      });
      
      console.log('Migration 1.0.1: Added timestamp triggers');
    }
  }
];

export class MigrationManager {
  constructor(database) {
    this.database = database;
  }

  async getCurrentVersion() {
    try {
      const result = await this.database.executeQueryAll(
        "SELECT value FROM settings WHERE key = 'db_version'"
      );
      return result[0]?.value || '0.0.0';
    } catch (error) {
      return '0.0.0';
    }
  }

  async setVersion(version) {
    try {
      await this.database.executeUpdate(
        `INSERT OR REPLACE INTO settings (key, value) VALUES ('db_version', ?)`,
        [version]
      );
    } catch (error) {
      console.error('Failed to set database version:', error);
    }
  }

  compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 < part2) return -1;
      if (part1 > part2) return 1;
    }
    
    return 0;
  }

  async runMigrations() {
    try {
      const currentVersion = await this.getCurrentVersion();
      console.log(`Current database version: ${currentVersion}`);
      
      const pendingMigrations = MIGRATIONS.filter(migration => 
        this.compareVersions(migration.version, currentVersion) > 0
      );
      
      if (pendingMigrations.length === 0) {
        console.log('No pending migrations');
        return;
      }
      
      console.log(`Running ${pendingMigrations.length} migrations...`);
      
      for (const migration of pendingMigrations) {
        console.log(`Running migration ${migration.version}: ${migration.description}`);
        
        try {
          await migration.up(this.database.db);
          await this.setVersion(migration.version);
          console.log(`Migration ${migration.version} completed successfully`);
        } catch (error) {
          console.error(`Migration ${migration.version} failed:`, error);
          throw error;
        }
      }
      
      console.log('All migrations completed successfully');
    } catch (error) {
      console.error('Migration process failed:', error);
      throw error;
    }
  }
}

export default MigrationManager;