// Database configuration
export const DB_CONFIG = {
  // SQLite configuration
  sqlite: {
    locateFile: file => `/sql-${file}`,
    storageKey: 'dairy_database',
    version: '1.0.0'
  },
  
  // Table schemas
  schemas: {
    members: `
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE,
        phone TEXT,
        address TEXT,
        status TEXT DEFAULT 'inactive' CHECK (status IN ('active', 'inactive')),
        owns TEXT DEFAULT 'Mixed' CHECK (owns IN ('Cow', 'Buffalo', 'Mixed')),
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `,
    
    milk_collections: `
      CREATE TABLE IF NOT EXISTS milk_collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id INTEGER NOT NULL,
        quantity REAL NOT NULL CHECK (quantity > 0),
        type TEXT DEFAULT 'Cow' CHECK (type IN ('Cow', 'Buffalo', 'Mixed')),
        fat REAL NOT NULL CHECK (fat >= 0 AND fat <= 15),
        clr REAL NOT NULL CHECK (clr >= 20 AND clr <= 40),
        price REAL NOT NULL CHECK (price > 0),
        date TEXT NOT NULL,
        shift TEXT NOT NULL CHECK (shift IN ('Morning', 'Evening')),
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (member_id) REFERENCES members (id) ON DELETE RESTRICT
      )
    `,
    

  },
  
  // Indexes for better performance
  indexes: [
    'CREATE INDEX IF NOT EXISTS idx_members_status ON members(status)',
    'CREATE INDEX IF NOT EXISTS idx_members_email ON members(email)',
    'CREATE INDEX IF NOT EXISTS idx_collections_member_id ON milk_collections(member_id)',
    'CREATE INDEX IF NOT EXISTS idx_collections_date ON milk_collections(date)',
    'CREATE INDEX IF NOT EXISTS idx_collections_shift ON milk_collections(shift)'
  ]
};

export default DB_CONFIG;