import database from '../database';

class SettingsService {
  async get(key) {
    await database.initialize();
    
    const query = 'SELECT value FROM settings WHERE key = ?';
    const results = await database.executeQueryAll(query, [key]);
    
    return results[0]?.value || null;
  }

  async set(key, value) {
    await database.initialize();
    
    const query = `
      INSERT OR REPLACE INTO settings (key, value, updated_at)
      VALUES (?, ?, datetime('now'))
    `;
    
    try {
      await database.executeUpdate(query, [key, value]);
      return { success: true };
    } catch (error) {
      console.error('Failed to set setting:', error);
      throw error;
    }
  }

  async getAll() {
    await database.initialize();
    
    const query = 'SELECT key, value, updated_at FROM settings ORDER BY key';
    return await database.executeQueryAll(query);
  }

  async delete(key) {
    await database.initialize();
    
    try {
      const result = await database.executeUpdate('DELETE FROM settings WHERE key = ?', [key]);
      
      if (result.changes === 0) {
        throw new Error('Setting not found');
      }
      
      return { success: true, message: 'Setting deleted successfully' };
    } catch (error) {
      console.error('Failed to delete setting:', error);
      throw error;
    }
  }

  // Convenience methods for common settings
  async getCurrency() {
    return (await this.get('currency')) || 'INR';
  }

  async setCurrency(currency) {
    return await this.set('currency', currency);
  }

  async getDefaultPrices() {
    const cowPrice = await this.get('default_price_cow');
    const buffaloPrice = await this.get('default_price_buffalo');
    
    return {
      cow: parseFloat(cowPrice) || 45,
      buffalo: parseFloat(buffaloPrice) || 55
    };
  }

  async setDefaultPrices(prices) {
    await this.set('default_price_cow', prices.cow.toString());
    await this.set('default_price_buffalo', prices.buffalo.toString());
    return { success: true };
  }

  async getAppVersion() {
    return (await this.get('app_version')) || '1.0.0';
  }

  async isBackupEnabled() {
    const enabled = await this.get('backup_enabled');
    return enabled === 'true';
  }

  async setBackupEnabled(enabled) {
    return await this.set('backup_enabled', enabled ? 'true' : 'false');
  }

  // Get all application preferences
  async getPreferences() {
    try {
      const settings = await this.getAll();
      const preferences = {};
      
      settings.forEach(setting => {
        preferences[setting.key] = setting.value;
      });
      
      return {
        currency: preferences.currency || 'INR',
        defaultPrices: {
          cow: parseFloat(preferences.default_price_cow) || 45,
          buffalo: parseFloat(preferences.default_price_buffalo) || 55
        },
        backupEnabled: preferences.backup_enabled === 'true',
        appVersion: preferences.app_version || '1.0.0',
        dbVersion: preferences.db_version || '1.0.0'
      };
    } catch (error) {
      console.error('Failed to get preferences:', error);
      return {
        currency: 'INR',
        defaultPrices: { cow: 45, buffalo: 55 },
        backupEnabled: true,
        appVersion: '1.0.0',
        dbVersion: '1.0.0'
      };
    }
  }

  // Update multiple preferences at once
  async updatePreferences(preferences) {
    try {
      if (preferences.currency) {
        await this.setCurrency(preferences.currency);
      }
      
      if (preferences.defaultPrices) {
        await this.setDefaultPrices(preferences.defaultPrices);
      }
      
      if (typeof preferences.backupEnabled === 'boolean') {
        await this.setBackupEnabled(preferences.backupEnabled);
      }
      
      return { success: true, message: 'Preferences updated successfully' };
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  }
}

export default new SettingsService();