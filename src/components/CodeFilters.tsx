import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FilterStatus } from '@/types/code';
import { cn } from '@/lib/utils';

interface CodeFiltersProps {
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  search: string;
  onSearchChange: (search: string) => void;
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
  counts,
}: CodeFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-secondary/30 rounded-lg border border-border/30">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
              filter === value
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            {label}
            <span className={cn(
              "ml-1.5 text-xs",
              filter === value ? "opacity-80" : "opacity-50"
            )}>
              {counts[value]}
            </span>
          </button>
        ))}
      </div>
      
      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search codes or descriptions..."
          className="pl-10 bg-secondary/30 border-border/30 focus:border-primary/50"
        />
      </div>
    </div>
  );
}
