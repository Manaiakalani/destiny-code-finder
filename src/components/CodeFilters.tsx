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
  { value: 'active', label: 'D2 active' },
  { value: 'expired', label: 'D2 expired' },
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
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Filter codes">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onFilterChange(value)}
            aria-pressed={filter === value}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-md px-3 text-sm',
              filter === value
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            {label}
            <span className="num">{counts[value]}</span>
          </button>
        ))}
      </div>

      <div className="relative w-full lg:w-80">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="code-search" className="sr-only">Search codes, emblems, sources</label>
        <Input
          id="code-search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search codes, emblems, sources"
          className="min-h-11 bg-background pl-10"
        />
      </div>
    </div>
  );
}
