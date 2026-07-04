import React from 'react';
import { Filter, X } from 'lucide-react';
import { Input, Select } from './Input';
import { Button } from './Button';

/**
 * Reusable FilterBar component
 */
export const FilterBar = ({
  filters,
  onFilterChange,
  onClearFilters,
  searchQuery,
  onSearchChange,
  hasActiveFilters,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-4 bg-card border border-border p-4 rounded-xl shadow-sm text-xs ${className}`}>
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="font-bold text-foreground">Filtres :</span>
      </div>

      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center space-x-1 bg-secondary px-2 py-1 rounded-lg">
          <span className="text-muted-foreground font-semibold">{filter.label}:</span>
          {filter.type === 'select' ? (
            <Select
              options={filter.options}
              value={filter.value}
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
              className="bg-transparent text-foreground font-bold focus:outline-none cursor-pointer border-0 p-0"
              containerClassName="m-0"
            />
          ) : (
            <Input
              type={filter.type || 'text'}
              placeholder={filter.placeholder}
              value={filter.value}
              onChange={(e) => onFilterChange(filter.key, e.target.value)}
              className="bg-transparent text-foreground font-bold focus:outline-none placeholder-muted-foreground/60 w-32 border-0 p-0"
              containerClassName="m-0"
            />
          )}
        </div>
      ))}

      {searchQuery !== undefined && (
        <div className="flex items-center space-x-1 bg-secondary px-2 py-1 rounded-lg">
          <span className="text-muted-foreground font-semibold">Recherche:</span>
          <Input
            type="text"
            placeholder="Chercher..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent text-foreground font-bold focus:outline-none placeholder-muted-foreground/60 w-40 border-0 p-0"
            containerClassName="m-0"
          />
        </div>
      )}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          icon={X}
          onClick={onClearFilters}
          className="ml-auto"
        >
          Effacer
        </Button>
      )}
    </div>
  );
};

export default FilterBar;
