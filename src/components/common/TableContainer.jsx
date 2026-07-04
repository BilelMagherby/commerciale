import React from 'react';
import DataTable from './DataTable';
import TablePagination from './TablePagination';

/**
 * Complete table container with data table and pagination
 */
export const TableContainer = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'Aucune donnée trouvée',
  enableSelection = false,
  enablePagination = true,
  initialPageSize = 10,
  sortBy,
  sortOrder,
  onSort,
  selectedItems,
  onSelectItem,
  onSelectAll,
  isAllSelected,
  isPartiallySelected,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
  className = '',
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-xl overflow-hidden ${className}`}>
      <DataTable
        columns={columns}
        data={data}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={onSort}
        enableSelection={enableSelection}
        selectedItems={selectedItems}
        onSelectItem={onSelectItem}
        onSelectAll={onSelectAll}
        isAllSelected={isAllSelected}
        isPartiallySelected={isPartiallySelected}
        emptyMessage={emptyMessage}
      />
      {enablePagination && totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          totalItems={totalItems}
        />
      )}
    </div>
  );
};

export default TableContainer;
