import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FilterStatus, SortOrder } from '@/types/code';
import { cn } from '@/lib/utils';

interface CodeFiltersProps {
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  search: string;
  onSearchChange: (search: string) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  counts: { all: number; active: number; expired: number; unknown: number };
}

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'unknown', label: 'Unknown' },
];

export function CodeFilters({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  sortOrder,
  onSortChange,
  counts,
}: CodeFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
              filter === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            {label}
            <span className="ml-1.5 text-xs opacity-70">
              ({counts[value]})
            </span>
          </button>
        ))}
      </div>
      
      {/* Search and sort */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search codes..."
            className="pl-9 bg-secondary/50 border-border/50"
          />
        </div>
        
        <button
          onClick={() => onSortChange(sortOrder === 'newest' ? 'oldest' : 'newest')}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm rounded-md",
            "bg-secondary/50 hover:bg-secondary transition-colors",
            "text-muted-foreground hover:text-foreground"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">
            {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
          </span>
        </button>
      </div>
    </div>
  );
}
