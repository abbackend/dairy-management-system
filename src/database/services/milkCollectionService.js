import database from '../database';

class MilkCollectionService {
  async getAll(options = {}) {
    await database.initialize();
    
    const { limit, offset, startDate, endDate, memberId, shift } = options;
    
    let query = `
      SELECT 
        mc.id,
        mc.member_id,
        mc.quantity,
        mc.type,
        mc.fat,
        mc.clr,
        mc.price,
        mc.date,
        mc.shift,
        mc.created_at,
        mc.updated_at,
        (mc.quantity * mc.price) as totalAmount,
        m.first_name || ' ' || m.last_name as memberName,
        'DM' || SUBSTR('000' || m.id, -3) as membershipNumber,
        m.phone as memberPhone
      FROM milk_collections mc
      JOIN members m ON mc.member_id = m.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate && endDate) {
      query += ` AND DATE(mc.date) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else if (startDate) {
      query += ` AND DATE(mc.date) >= ?`;
      params.push(startDate);
    } else if (endDate) {
      query += ` AND DATE(mc.date) <= ?`;
      params.push(endDate);
    }
    
    if (memberId) {
      query += ` AND mc.member_id = ?`;
      params.push(memberId);
    }
    
    if (shift) {
      query += ` AND mc.shift = ?`;
      params.push(shift);
    }
    
    query += ` ORDER BY mc.date DESC, mc.created_at DESC`;
    
    if (limit) {
      query += ` LIMIT ?`;
      params.push(limit);
      
      if (offset) {
        query += ` OFFSET ?`;
        params.push(offset);
      }
    }
    
    return await database.executeQueryAll(query, params);
  }

  async getById(id) {
    await database.initialize();
    
    const query = `
      SELECT 
        mc.*,
        (mc.quantity * mc.price) as totalAmount,
        m.first_name || ' ' || m.last_name as memberName,
        'DM' || SUBSTR('000' || m.id, -3) as membershipNumber
      FROM milk_collections mc
      JOIN members m ON mc.member_id = m.id
      WHERE mc.id = ?
    `;
    
    const results = await database.executeQueryAll(query, [id]);
    return results[0] || null;
  }

  async create(collectionData) {
    await database.initialize();
    
    const { 
      member_id, 
      quantity, 
      type = 'Cow', 
      fat, 
      clr, 
      price, 
      date, 
      shift 
    } = collectionData;
    
    // Validate member exists
    const member = await database.executeQueryAll('SELECT id FROM members WHERE id = ?', [member_id]);
    if (!member.length) {
      throw new Error('Member not found');
    }
    
    const query = `
      INSERT INTO milk_collections (member_id, quantity, type, fat, clr, price, date, shift, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `;
    
    try {
      await database.executeUpdate(query, [member_id, quantity, type, fat, clr, price, date, shift]);
      
      // Get the newly created collection
      const newCollection = await database.executeQueryAll(
        'SELECT * FROM milk_collections WHERE id = last_insert_rowid()'
      );
      return newCollection[0];
    } catch (error) {
      console.error('Failed to create milk collection:', error);
      throw error;
    }
  }

  async update(id, collectionData) {
    await database.initialize();
    
    const { member_id, quantity, type, fat, clr, price, date, shift } = collectionData;
    
    const query = `
      UPDATE milk_collections 
      SET member_id = ?, quantity = ?, type = ?, fat = ?, clr = ?, 
          price = ?, date = ?, shift = ?, updated_at = datetime('now')
      WHERE id = ?
    `;
    
    try {
      const result = await database.executeUpdate(query, [member_id, quantity, type, fat, clr, price, date, shift, id]);
      
      if (result.changes > 0) {
        return await this.getById(id);
      }
      
      throw new Error('Milk collection not found or no changes made');
    } catch (error) {
      console.error('Failed to update milk collection:', error);
      throw error;
    }
  }

  async delete(id) {
    await database.initialize();
    
    try {
      const result = await database.executeUpdate('DELETE FROM milk_collections WHERE id = ?', [id]);
      
      if (result.changes === 0) {
        throw new Error('Milk collection not found');
      }
      
      return { success: true, message: 'Milk collection deleted successfully' };
    } catch (error) {
      console.error('Failed to delete milk collection:', error);
      throw error;
    }
  }

  async getByDateRange(startDate, endDate) {
    return await this.getAll({ startDate, endDate });
  }

  async getByMember(memberId, options = {}) {
    return await this.getAll({ ...options, memberId });
  }

  async getTodayCollections() {
    const today = new Date().toISOString().split('T')[0];
    return await this.getAll({ startDate: today, endDate: today });
  }

  async getStats(options = {}) {
    await database.initialize();
    
    const { startDate, endDate } = options;
    
    let baseQuery = 'FROM milk_collections mc';
    let whereClause = ' WHERE 1=1';
    const params = [];
    
    if (startDate && endDate) {
      whereClause += ' AND DATE(mc.date) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    } else if (startDate) {
      whereClause += ' AND DATE(mc.date) >= ?';
      params.push(startDate);
    } else if (endDate) {
      whereClause += ' AND DATE(mc.date) <= ?';
      params.push(endDate);
    }
    
    try {
      const queries = {
        total: `SELECT COUNT(*) as count ${baseQuery}${whereClause}`,
        totalQuantity: `SELECT SUM(mc.quantity) as total ${baseQuery}${whereClause}`,
        totalRevenue: `SELECT SUM(mc.quantity * mc.price) as total ${baseQuery}${whereClause}`,
        avgFat: `SELECT AVG(mc.fat) as avg ${baseQuery}${whereClause}`,
        avgClr: `SELECT AVG(mc.clr) as avg ${baseQuery}${whereClause}`,
        avgPrice: `SELECT AVG(mc.price) as avg ${baseQuery}${whereClause}`
      };
      
      const results = await Promise.all([
        database.executeQueryAll(queries.total, params),
        database.executeQueryAll(queries.totalQuantity, params),
        database.executeQueryAll(queries.totalRevenue, params),
        database.executeQueryAll(queries.avgFat, params),
        database.executeQueryAll(queries.avgClr, params),
        database.executeQueryAll(queries.avgPrice, params)
      ]);
      
      return {
        totalCollections: results[0][0]?.count || 0,
        totalQuantity: Math.round((results[1][0]?.total || 0) * 10) / 10,
        totalRevenue: Math.round((results[2][0]?.total || 0) * 100) / 100,
        avgFat: Math.round((results[3][0]?.avg || 0) * 10) / 10,
        avgClr: Math.round((results[4][0]?.avg || 0) * 10) / 10,
        avgPrice: Math.round((results[5][0]?.avg || 0) * 100) / 100
      };
    } catch (error) {
      console.error('Failed to get collection stats:', error);
      return {
        totalCollections: 0,
        totalQuantity: 0,
        totalRevenue: 0,
        avgFat: 0,
        avgClr: 0,
        avgPrice: 0
      };
    }
  }

  async getDailyStats(date) {
    return await this.getStats({ 
      startDate: date, 
      endDate: date 
    });
  }

  async getMonthlyStats(year, month) {
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of month
    
    return await this.getStats({ startDate, endDate });
  }

  // Get collections by shift (morning/evening)
  async getByShift(shift, options = {}) {
    return await this.getAll({ ...options, shift });
  }

  // Quality analysis
  async getQualityAnalysis(options = {}) {
    await database.initialize();
    
    const { startDate, endDate } = options;
    
    let query = `
      SELECT 
        AVG(fat) as avgFat,
        MIN(fat) as minFat,
        MAX(fat) as maxFat,
        AVG(clr) as avgClr,
        MIN(clr) as minClr,
        MAX(clr) as maxClr,
        COUNT(*) as totalSamples
      FROM milk_collections
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate && endDate) {
      query += ' AND DATE(date) BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    try {
      const results = await database.executeQueryAll(query, params);
      const data = results[0] || {};
      
      return {
        avgFat: Math.round((data.avgFat || 0) * 100) / 100,
        minFat: Math.round((data.minFat || 0) * 100) / 100,
        maxFat: Math.round((data.maxFat || 0) * 100) / 100,
        avgClr: Math.round((data.avgClr || 0) * 10) / 10,
        minClr: data.minClr || 0,
        maxClr: data.maxClr || 0,
        totalSamples: data.totalSamples || 0
      };
    } catch (error) {
      console.error('Failed to get quality analysis:', error);
      return {
        avgFat: 0, minFat: 0, maxFat: 0,
        avgClr: 0, minClr: 0, maxClr: 0,
        totalSamples: 0
      };
    }
  }
}

export default new MilkCollectionService();
