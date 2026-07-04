import React from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

/**
 * Reusable DataTable component with sorting, pagination, and selection
 */
export const DataTable = ({
  columns,
  data,
  sortBy,
  sortOrder,
  onSort,
  enableSelection = false,
  selectedItems = [],
  onSelectItem,
  onSelectAll,
  isAllSelected,
  isPartiallySelected,
  emptyMessage = 'Aucune donnée trouvée',
  className = '',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {enableSelection && (
              <th className="p-3 text-left w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartiallySelected;
                  }}
                  onChange={onSelectAll}
                  className="cursor-pointer"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`p-3 text-left text-xs font-semibold tracking-wide text-muted-foreground ${
                  column.sortable ? 'cursor-pointer hover:text-foreground' : ''
                }`}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && sortBy === column.key && (
                    sortOrder === 'asc' ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )
                  )}
                  {column.sortable && sortBy !== column.key && (
                    <ChevronsUpDown className="w-4 h-4 opacity-50" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
            >
              {enableSelection && (
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(row.id)}
                    onChange={() => onSelectItem?.(row.id)}
                    className="cursor-pointer"
                  />
                </td>
              )}
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`p-3 text-xs ${
                    column.className || ''
                  } ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
