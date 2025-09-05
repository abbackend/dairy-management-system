import initSqlJs from 'sql.js';
import { DB_CONFIG } from './config';
import { MigrationManager } from './migrations';

class Database {
  constructor() {
    this.db = null;
    this.SQL = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return this.db;

    try {
      // Initialize SQL.js
      this.SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });

      // Try to load existing database from localStorage
      const savedData = localStorage.getItem(DB_CONFIG.sqlite.storageKey);
      if (savedData) {
        try {
          const uint8Array = new Uint8Array(JSON.parse(savedData));
          this.db = new this.SQL.Database(uint8Array);
          console.log('Loaded existing database from storage');
        } catch (error) {
          console.warn('Failed to load saved database, creating new one:', error);
          this.db = new this.SQL.Database();
        }
      } else {
        // Create new database
        this.db = new this.SQL.Database();
        console.log('Created new database');
      }

      // Create tables
      await this.createTables();
      
      // Run migrations
      const migrationManager = new MigrationManager(this);
      await migrationManager.runMigrations();
      
      this.initialized = true;
      console.log('Database initialized successfully!');
      return this.db;
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Create tables using configuration schemas
      Object.values(DB_CONFIG.schemas).forEach(schema => {
        this.db.exec(schema);
      });

      // Create indexes for better performance
      DB_CONFIG.indexes.forEach(indexQuery => {
        this.db.exec(indexQuery);
      });

      console.log('Database tables and indexes created successfully!');
    } catch (error) {
      console.error('Failed to create tables:', error);
      throw error;
    }
  }

  async saveToStorage() {
    if (!this.db) return;
    
    try {
      const data = this.db.export();
      const arrayString = JSON.stringify(Array.from(data));
      localStorage.setItem(DB_CONFIG.sqlite.storageKey, arrayString);
      
      // Also save backup with timestamp
      const backupKey = `${DB_CONFIG.sqlite.storageKey}_backup_${Date.now()}`;
      localStorage.setItem(backupKey, arrayString);
      
      // Keep only last 3 backups
      this.cleanupOldBackups();
    } catch (error) {
      console.error('Failed to save database:', error);
      throw error;
    }
  }

  cleanupOldBackups() {
    try {
      const backupKeys = Object.keys(localStorage)
        .filter(key => key.startsWith(`${DB_CONFIG.sqlite.storageKey}_backup_`))
        .sort()
        .reverse();
      
      // Remove old backups, keep only 3 most recent
      backupKeys.slice(3).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn('Failed to cleanup old backups:', error);
    }
  }

  async executeQuery(query, params = []) {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const stmt = this.db.prepare(query);
      const result = stmt.getAsObject(params);
      stmt.free();
      return result;
    } catch (error) {
      console.error('Query execution failed:', error);
      throw error;
    }
  }

  async executeQueryAll(query, params = []) {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const stmt = this.db.prepare(query);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    } catch (error) {
      console.error('Query execution failed:', error);
      throw error;
    }
  }

  async executeUpdate(query, params = []) {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      this.db.run(query, params);
      await this.saveToStorage(); // Auto-save after updates
      return { success: true, changes: this.db.getRowsModified() };
    } catch (error) {
      console.error('Update execution failed:', error);
      throw error;
    }
  }

  // Seed initial data
  async seedData() {
    try {
      // Check if data already exists
      const existingMembers = await this.executeQueryAll('SELECT COUNT(*) as count FROM members');
      if (existingMembers[0]?.count > 0) {
        console.log('Database already has data, skipping seed');
        return;
      }

      // Insert sample members
      const sampleMembers = [
        {
          first_name: 'Rajesh',
          last_name: 'Kumar',
          email: 'rajesh.kumar@example.com',
          phone: '+91 98765 43210',
          address: 'Village Sundarpur, Dist. Meerut',
          status: 'active',
          owns: 'Cow'
        },
        {
          first_name: 'Sunita',
          last_name: 'Devi',
          email: 'sunita.devi@example.com',
          phone: '+91 87654 32109',
          address: 'Village Greenfield, Dist. Meerut',
          status: 'active',
          owns: 'Buffalo'
        },
        {
          first_name: 'Mohan',
          last_name: 'Singh',
          email: 'mohan.singh@example.com',
          phone: '+91 76543 21098',
          address: 'Village Riverside, Dist. Meerut',
          status: 'active',
          owns: 'Mixed'
        },
        {
          first_name: 'Priya',
          last_name: 'Sharma',
          email: 'priya.sharma@example.com',
          phone: '+91 65432 10987',
          address: 'Village Hillside, Dist. Meerut',
          status: 'inactive',
          owns: 'Cow'
        }
      ];

      for (const member of sampleMembers) {
        await this.executeUpdate(
          `INSERT INTO members (first_name, last_name, email, phone, address, status, owns) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [member.first_name, member.last_name, member.email, member.phone, member.address, member.status, member.owns]
        );
      }

      console.log('Sample data seeded successfully!');
    } catch (error) {
      console.error('Failed to seed data:', error);
    }
  }

  // Clean up
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }
}

// Singleton instance
const database = new Database();

export default database;
