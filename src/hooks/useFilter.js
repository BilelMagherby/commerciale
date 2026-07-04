import { useState, useMemo } from 'react';

/**
 * Custom hook for filtering data based on multiple criteria
 * @param {Array} data - The data array to filter
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} Filter state and handlers
 */
export const useFilter = (data = [], initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');

  // Apply filters to data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableFields = Object.values(item).join(' ').toLowerCase();
        if (!searchableFields.includes(query)) {
          return false;
        }
      }

      // Apply specific filters
      for (const [key, value] of Object.entries(filters)) {
        if (value !== '' && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            if (!value.includes(item[key])) {
              return false;
            }
          } else if (typeof value === 'object') {
            // Handle range filters
            if (value.min !== undefined && item[key] < value.min) {
              return false;
            }
            if (value.max !== undefined && item[key] > value.max) {
              return false;
            }
          } else {
            if (item[key] !== value) {
              return false;
            }
          }
        }
      }

      return true;
    });
  }, [data, filters, searchQuery]);

  // Handlers
  const setFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const setMultipleFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const clearFilter = (key) => {
    setFilters((prev) => {
      const { [key]: removed, ...rest } = prev;
      return rest;
    });
  };

  const clearAllFilters = () => {
    setFilters(initialFilters);
    setSearchQuery('');
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    // Data
    filteredData,
    originalData: data,
    
    // State
    filters,
    searchQuery,
    
    // Handlers
    setFilter,
    setMultipleFilters,
    setSearchQuery,
    clearFilter,
    clearAllFilters,
    resetFilters,
    
    // Computed
    hasActiveFilters: Object.keys(filters).some(
      (key) => filters[key] !== '' && filters[key] !== null && filters[key] !== undefined
    ),
    filterCount: Object.keys(filters).filter(
      (key) => filters[key] !== '' && filters[key] !== null && filters[key] !== undefined
    ).length,
  };
};
