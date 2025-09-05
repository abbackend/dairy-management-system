import database from '../database';

class MemberService {
  async getAll() {
    await database.initialize();
    
    const query = `
      SELECT 
        id,
        first_name || ' ' || last_name as name,
        first_name,
        last_name,
        email,
        phone,
        address,
        status,
        owns,
        created_at,
        updated_at,
        'DM' || SUBSTR('000' || id, -3) as membershipNumber
      FROM members 
      ORDER BY created_at DESC
    `;
    
    return await database.executeQueryAll(query);
  }

  async getById(id) {
    await database.initialize();
    
    const query = `
      SELECT 
        *,
        first_name || ' ' || last_name as name,
        'DM' || SUBSTR('000' || id, -3) as membershipNumber
      FROM members 
      WHERE id = ?
    `;
    
    const results = await database.executeQueryAll(query, [id]);
    return results[0] || null;
  }

  async create(memberData) {
    await database.initialize();
    
    const { first_name, last_name, email, phone, address, status = 'inactive', owns } = memberData;
    
    const query = `
      INSERT INTO members (first_name, last_name, email, phone, address, status, owns, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `;
    
    try {
      await database.executeUpdate(query, [first_name, last_name, email, phone, address, status, owns]);
      
      // Get the newly created member
      const newMember = await database.executeQueryAll('SELECT * FROM members WHERE id = last_insert_rowid()');
      return newMember[0];
    } catch (error) {
      console.error('Failed to create member:', error);
      throw error;
    }
  }

  async update(id, memberData) {
    await database.initialize();
    
    const { first_name, last_name, email, phone, address, status, owns } = memberData;
    
    const query = `
      UPDATE members 
      SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, 
          status = ?, owns = ?, updated_at = datetime('now')
      WHERE id = ?
    `;
    
    try {
      const result = await database.executeUpdate(query, [first_name, last_name, email, phone, address, status, owns, id]);
      
      if (result.changes > 0) {
        return await this.getById(id);
      }
      
      throw new Error('Member not found or no changes made');
    } catch (error) {
      console.error('Failed to update member:', error);
      throw error;
    }
  }

  async delete(id) {
    await database.initialize();
    
    try {
      // Check if member has milk collections
      const collections = await database.executeQueryAll(
        'SELECT COUNT(*) as count FROM milk_collections WHERE member_id = ?',
        [id]
      );
      
      if (collections[0]?.count > 0) {
        throw new Error('Cannot delete member with existing milk collections');
      }
      
      const result = await database.executeUpdate('DELETE FROM members WHERE id = ?', [id]);
      
      if (result.changes === 0) {
        throw new Error('Member not found');
      }
      
      return { success: true, message: 'Member deleted successfully' };
    } catch (error) {
      console.error('Failed to delete member:', error);
      throw error;
    }
  }

  async search(searchTerm) {
    await database.initialize();
    
    const query = `
      SELECT 
        id,
        first_name || ' ' || last_name as name,
        first_name,
        last_name,
        email,
        phone,
        address,
        status,
        owns,
        created_at,
        updated_at,
        'DM' || SUBSTR('000' || id, -3) as membershipNumber
      FROM members 
      WHERE 
        first_name LIKE ? OR 
        last_name LIKE ? OR 
        phone LIKE ? OR
        email LIKE ? OR
        ('DM' || SUBSTR('000' || id, -3)) LIKE ?
      ORDER BY created_at DESC
    `;
    
    const searchPattern = `%${searchTerm}%`;
    return await database.executeQueryAll(query, [
      searchPattern, searchPattern, searchPattern, searchPattern, searchPattern
    ]);
  }

  async getStats() {
    await database.initialize();
    
    try {
      const totalQuery = 'SELECT COUNT(*) as total FROM members';
      const activeQuery = 'SELECT COUNT(*) as active FROM members WHERE status = "active"';
      const inactiveQuery = 'SELECT COUNT(*) as inactive FROM members WHERE status = "inactive"';
      
      const [totalResult, activeResult, inactiveResult] = await Promise.all([
        database.executeQueryAll(totalQuery),
        database.executeQueryAll(activeQuery),
        database.executeQueryAll(inactiveQuery)
      ]);
      
      return {
        total: totalResult[0]?.total || 0,
        active: activeResult[0]?.active || 0,
        inactive: inactiveResult[0]?.inactive || 0
      };
    } catch (error) {
      console.error('Failed to get member stats:', error);
      return { total: 0, active: 0, inactive: 0 };
    }
  }

  // Convert old member format to new format for backward compatibility
  convertLegacyMember(legacyMember) {
    if (legacyMember.name && !legacyMember.first_name) {
      const nameParts = legacyMember.name.split(' ');
      return {
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        email: legacyMember.email || '',
        phone: legacyMember.phone || '',
        address: legacyMember.address || '',
        status: legacyMember.status === 'Active' ? 'active' : 'inactive',
        owns: 'Mixed' // Default value
      };
    }
    return legacyMember;
  }
}

export default new MemberService();
