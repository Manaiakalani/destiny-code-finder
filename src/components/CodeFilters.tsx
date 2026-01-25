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
      {/* Filter tabs with refined styling */}
      <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg border border-accent/20 backdrop-blur-sm shadow-lg">
        {FILTERS.map(({ value, label }) => {
          // Subclass colors for each filter
          const getFilterStyle = () => {
            if (filter !== value) return "text-muted-foreground/70 hover:text-foreground hover:bg-accent/10";
            switch (value) {
              case 'active': return "bg-strand/20 text-strand border border-strand/30 shadow-md shadow-strand/10";
              case 'expired': return "bg-stasis/15 text-stasis border border-stasis/25 shadow-md shadow-stasis/10";
              case 'unknown': return "bg-accent/20 text-accent border border-accent/30 shadow-md shadow-accent/10";
              default: return "bg-accent/20 text-accent border border-accent/30 shadow-md shadow-accent/10";
            }
          };
          
          return (
            <button
              key={value}
              onClick={() => onFilterChange(value)}
              className={cn(
                "px-3.5 py-2 text-sm font-bold rounded-md transition-all duration-200 tracking-wide",
                getFilterStyle()
              )}
            >
              {label}
              <span className={cn(
                "ml-2 text-[11px] font-semibold",
                filter === value ? "opacity-90" : "opacity-60"
              )}>
                {counts[value]}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Search with improved styling */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/50" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search codes, emblems, sources..."
          className="pl-10 bg-secondary/50 border-accent/20 focus:border-accent/40 focus:ring-accent/15 placeholder:text-muted-foreground/50 shadow-sm"
        />
      </div>
    </div>
  );
}
