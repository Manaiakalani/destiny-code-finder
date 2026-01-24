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
      {/* Filter tabs - VOID styled with subclass accents */}
      <div className="flex items-center gap-1 p-1.5 bg-secondary/40 rounded-lg border border-accent/20 backdrop-blur-sm">
        {FILTERS.map(({ value, label }) => {
          // Subclass colors for each filter
          const getFilterStyle = () => {
            if (filter !== value) return "text-muted-foreground hover:text-foreground hover:bg-accent/10";
            switch (value) {
              case 'active': return "bg-strand/20 text-strand border border-strand/40 shadow-lg";
              case 'expired': return "bg-stasis/15 text-stasis border border-stasis/30 shadow-lg";
              case 'unknown': return "bg-accent/20 text-accent border border-accent/40 shadow-lg";
              default: return "bg-accent/20 text-accent border border-accent/40 shadow-lg";
            }
          };
          
          return (
            <button
              key={value}
              onClick={() => onFilterChange(value)}
              className={cn(
                "px-4 py-2 text-sm font-semibold rounded-md transition-all duration-300",
                getFilterStyle()
              )}
            >
              {label}
              <span className={cn(
                "ml-1.5 text-xs",
                filter === value ? "opacity-90" : "opacity-50"
              )}>
                {counts[value]}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Search - VOID styled */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/60" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search codes, emblems, sources..."
          className="pl-10 bg-secondary/40 border-accent/20 focus:border-accent/50 focus:ring-accent/20 placeholder:text-muted-foreground/60"
        />
      </div>
    </div>
  );
}
