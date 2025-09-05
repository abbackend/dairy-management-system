import { useState, useEffect, useCallback } from 'react';
import memberService from '../database/services/memberService';

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all members
  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await memberService.getAll();
      setMembers(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new member
  const createMember = useCallback(async (memberData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert legacy format if needed
      const processedData = memberService.convertLegacyMember(memberData);
      const newMember = await memberService.create(processedData);
      
      // Reload members to get updated list
      await loadMembers();
      return { success: true, data: newMember };
    } catch (err) {
      setError(err.message);
      console.error('Failed to create member:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loadMembers]);

  // Update a member
  const updateMember = useCallback(async (id, memberData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert legacy format if needed
      const processedData = memberService.convertLegacyMember(memberData);
      const updatedMember = await memberService.update(id, processedData);
      
      // Update local state
      setMembers(prev => prev.map(member => 
        member.id === id ? updatedMember : member
      ));
      
      return { success: true, data: updatedMember };
    } catch (err) {
      setError(err.message);
      console.error('Failed to update member:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a member
  const deleteMember = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await memberService.delete(id);
      
      // Remove from local state
      setMembers(prev => prev.filter(member => member.id !== id));
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Failed to delete member:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Search members
  const searchMembers = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      await loadMembers();
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await memberService.search(searchTerm);
      setMembers(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to search members:', err);
    } finally {
      setLoading(false);
    }
  }, [loadMembers]);

  // Get member stats
  const getMemberStats = useCallback(async () => {
    try {
      return await memberService.getStats();
    } catch (err) {
      console.error('Failed to get member stats:', err);
      return { total: 0, active: 0, inactive: 0 };
    }
  }, []);

  // Load members on mount
  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  return {
    members,
    loading,
    error,
    createMember,
    updateMember,
    deleteMember,
    searchMembers,
    getMemberStats,
    refreshMembers: loadMembers
  };
};

export default useMembers;
