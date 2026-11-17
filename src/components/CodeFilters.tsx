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
  { value: 'active', label: 'Destiny 2' },
  { value: 'expired', label: 'Expired' },
  { value: 'd1', label: 'Destiny 1' },
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
      <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter the catalogue">
        {FILTERS.map(({ value, label }) => {
          const selected = filter === value;
          const selectedTone = {
            all: 'bg-secondary text-foreground',
            active: 'tone-strand bg-strand/15 text-strand',
            expired: 'tone-stasis bg-stasis/15 text-stasis',
            d1: 'tone-solar bg-solar/15 text-solar',
            unknown: 'tone-accent bg-accent/15 text-accent',
          }[value];

          return (
            <button
              key={value}
              type="button"
              onClick={() => onFilterChange(value)}
              aria-pressed={selected}
              className={cn(
                'inline-flex min-h-11 items-center gap-3 rounded-md px-3 text-sm tracking-wide transition-colors',
                selected ? selectedTone : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <span className="font-heading font-semibold">{label}</span>
              <span className="min-w-[1.25rem] text-right font-medium tabular-nums">{counts[value]}</span>
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
