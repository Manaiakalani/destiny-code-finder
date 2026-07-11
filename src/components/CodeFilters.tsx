import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FilterStatus } from '@/types/code';
import { cn } from '@/lib/utils';

interface CodeFiltersProps {
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  search: string;
  onSearchChange: (search: string) => void;
  counts: { all: number; active: number; expired: number; d1: number; unknown: number };
}

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'D2 Active' },
  { value: 'expired', label: 'D2 Expired' },
  { value: 'd1', label: 'D1' },
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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-accent/20 bg-secondary/50 p-1 shadow-lg backdrop-blur-sm w-full sm:w-auto">
        {FILTERS.map(({ value, label }) => {
          const getFilterStyle = () => {
            if (filter !== value) return 'text-muted-foreground hover:text-foreground hover:bg-accent/10';
            switch (value) {
              case 'active': return 'bg-strand/20 text-strand border border-strand/30 shadow-md shadow-strand/10';
              case 'expired': return 'bg-stasis/15 text-stasis border border-stasis/25 shadow-md shadow-stasis/10';
              case 'd1': return 'bg-solar/20 text-solar border border-solar/30 shadow-md shadow-solar/10';
              case 'unknown': return 'bg-accent/20 text-accent border border-accent/30 shadow-md shadow-accent/10';
              default: return 'bg-accent/20 text-accent border border-accent/30 shadow-md shadow-accent/10';
            }
          };

          return (
            <button
              key={value}
              type="button"
              onClick={() => onFilterChange(value)}
              aria-pressed={filter === value}
              className={cn(
                'min-h-[44px] px-3.5 py-2 text-sm font-bold rounded-md transition-[background-color,color,border-color,box-shadow,transform] duration-200 tracking-wide touch-manipulation',
                getFilterStyle()
              )}
            >
              {label}
              <span className={cn(
                'ml-2 text-[11px] font-semibold',
                filter === value ? 'opacity-90' : 'opacity-60'
              )}>
                {counts[value]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/50" aria-hidden="true" />
        <label htmlFor="code-search" className="sr-only">Search codes, emblems, sources</label>
        <Input
          id="code-search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search codes, emblems, sources..."
          className="min-h-[44px] pl-10 bg-secondary/50 border-accent/20 focus:border-accent/40 focus:ring-accent/15 placeholder:text-muted-foreground/50 shadow-sm"
        />
      </div>
    </div>
  );
}
