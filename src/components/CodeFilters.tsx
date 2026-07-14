import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { FilterStatus } from '@/types/code';
import { cn } from '@/lib/utils';

export type SortOption = 'featured' | 'name' | 'code';

interface CodeFiltersProps {
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  search: string;
  onSearchChange: (search: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  counts: Record<FilterStatus, number>;
}

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'redeemable', label: 'Redeemable' },
  { value: 'd1', label: 'Destiny 1' },
  { value: 'restricted', label: 'Restricted' },
  { value: 'pinned', label: 'Pinned' },
];

export function CodeFilters({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  counts,
}: CodeFiltersProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.matches('input, textarea, select, [contenteditable="true"]');
      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="code-search" className="sr-only">
            Search codes, rewards, and sources
          </label>
          <Input
            ref={searchRef}
            id="code-search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search codes, rewards, or sources"
            className="min-h-11 bg-card pl-10 pr-12 text-base placeholder:text-muted-foreground md:text-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                searchRef.current?.focus();
              }}
              className="absolute right-0 top-0 inline-flex h-11 w-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-secondary px-1.5 py-0.5 text-xs text-muted-foreground lg:block">
            /
          </kbd>
        </div>

        <label className="flex min-h-11 items-center gap-2 text-sm text-muted-foreground">
          <span>Sort</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
            className="min-h-11 rounded-md border border-border bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="featured">Featured</option>
            <option value="name">Reward name</option>
            <option value="code">Code</option>
          </select>
        </label>
      </div>

      <div
        className="flex gap-2 overflow-x-auto pb-1"
        role="group"
        aria-label="Filter catalogue by availability"
      >
        {FILTERS.filter(({ value }) => value === 'all' || counts[value] > 0).map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => onFilterChange(value)}
            aria-pressed={filter === value}
            className={cn(
              'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-semibold transition-colors',
              filter === value
                ? 'border-accent bg-accent text-accent-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-foreground',
            )}
          >
            {label}
            <span className={cn(
              'rounded px-1.5 py-0.5 text-xs',
              filter === value ? 'bg-accent-foreground/15' : 'bg-secondary text-foreground',
            )}>
              {counts[value]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
