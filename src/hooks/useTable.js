import { useState, useMemo } from 'react';

/**
 * Custom hook for managing table state including sorting, pagination, and selection
 * @param {Array} data - The data array to display in the table
 * @param {Object} options - Configuration options
 * @returns {Object} Table state and handlers
 */
export const useTable = (data = [], options = {}) => {
  const {
    initialPageSize = 10,
    initialSortBy = null,
    initialSortOrder = 'asc',
    enableSelection = false,
  } = options;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Sorting state
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  // Selection state
  const [selectedItems, setSelectedItems] = useState([]);

  // Computed values
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Sort and paginate data
  const sortedData = useMemo(() => {
    if (!sortBy) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [data, sortBy, sortOrder]);

  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Handlers
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSelectItem = (itemId) => {
    if (!enableSelection) return;

    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (!enableSelection) return;

    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedData.map((item) => item.id));
    }
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  return {
    // Data
    data: paginatedData,
    allData: data,
    sortedData,
    
    // Pagination
    currentPage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
    handlePageSizeChange,
    
    // Sorting
    sortBy,
    sortOrder,
    handleSort,
    
    // Selection
    selectedItems,
    handleSelectItem,
    handleSelectAll,
    clearSelection,
    isAllSelected: paginatedData.length > 0 && selectedItems.length === paginatedData.length,
    isPartiallySelected: selectedItems.length > 0 && selectedItems.length < paginatedData.length,
  };
};
