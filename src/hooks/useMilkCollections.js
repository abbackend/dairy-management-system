import { useState, useEffect, useCallback } from 'react';
import milkCollectionService from '../database/services/milkCollectionService';

export const useMilkCollections = (options = {}) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load collections with optional filters
  const loadCollections = useCallback(async (loadOptions = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await milkCollectionService.getAll({ ...options, ...loadOptions });
      setCollections(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load collections:', err);
    } finally {
      setLoading(false);
    }
  }, [options]);

  // Create a new collection
  const createCollection = useCallback(async (collectionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newCollection = await milkCollectionService.create(collectionData);
      
      // Reload collections to get updated list
      await loadCollections();
      return { success: true, data: newCollection };
    } catch (err) {
      setError(err.message);
      console.error('Failed to create collection:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [loadCollections]);

  // Update a collection
  const updateCollection = useCallback(async (id, collectionData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCollection = await milkCollectionService.update(id, collectionData);
      
      // Update local state
      setCollections(prev => prev.map(collection => 
        collection.id === id ? updatedCollection : collection
      ));
      
      return { success: true, data: updatedCollection };
    } catch (err) {
      setError(err.message);
      console.error('Failed to update collection:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a collection
  const deleteCollection = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await milkCollectionService.delete(id);
      
      // Remove from local state
      setCollections(prev => prev.filter(collection => collection.id !== id));
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      console.error('Failed to delete collection:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get today's collections
  const getTodayCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await milkCollectionService.getTodayCollections();
      setCollections(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to get today collections:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get collections by date range
  const getCollectionsByDateRange = useCallback(async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await milkCollectionService.getByDateRange(startDate, endDate);
      setCollections(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to get collections by date range:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get collections by member
  const getCollectionsByMember = useCallback(async (memberId, memberOptions = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await milkCollectionService.getByMember(memberId, memberOptions);
      setCollections(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to get collections by member:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get collection statistics
  const getCollectionStats = useCallback(async (statsOptions = {}) => {
    try {
      return await milkCollectionService.getStats(statsOptions);
    } catch (err) {
      console.error('Failed to get collection stats:', err);
      return {
        totalCollections: 0,
        totalQuantity: 0,
        totalRevenue: 0,
        avgFat: 0,
        avgClr: 0,
        avgPrice: 0
      };
    }
  }, []);

  // Get daily statistics
  const getDailyStats = useCallback(async (date) => {
    try {
      return await milkCollectionService.getDailyStats(date);
    } catch (err) {
      console.error('Failed to get daily stats:', err);
      return {
        totalCollections: 0,
        totalQuantity: 0,
        totalRevenue: 0,
        avgFat: 0,
        avgClr: 0,
        avgPrice: 0
      };
    }
  }, []);

  // Get monthly statistics
  const getMonthlyStats = useCallback(async (year, month) => {
    try {
      return await milkCollectionService.getMonthlyStats(year, month);
    } catch (err) {
      console.error('Failed to get monthly stats:', err);
      return {
        totalCollections: 0,
        totalQuantity: 0,
        totalRevenue: 0,
        avgFat: 0,
        avgClr: 0,
        avgPrice: 0
      };
    }
  }, []);

  // Get quality analysis
  const getQualityAnalysis = useCallback(async (analysisOptions = {}) => {
    try {
      return await milkCollectionService.getQualityAnalysis(analysisOptions);
    } catch (err) {
      console.error('Failed to get quality analysis:', err);
      return {
        avgFat: 0, minFat: 0, maxFat: 0,
        avgClr: 0, minClr: 0, maxClr: 0,
        totalSamples: 0
      };
    }
  }, []);

  // Filter collections by shift
  const filterByShift = useCallback(async (shift, shiftOptions = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await milkCollectionService.getByShift(shift, shiftOptions);
      setCollections(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to filter by shift:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load collections on mount
  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  return {
    collections,
    loading,
    error,
    createCollection,
    updateCollection,
    deleteCollection,
    getTodayCollections,
    getCollectionsByDateRange,
    getCollectionsByMember,
    getCollectionStats,
    getDailyStats,
    getMonthlyStats,
    getQualityAnalysis,
    filterByShift,
    refreshCollections: loadCollections
  };
};

export default useMilkCollections;
