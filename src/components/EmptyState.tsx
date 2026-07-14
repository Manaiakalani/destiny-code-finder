import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onReset: () => void;
}

export function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-border bg-card px-6 py-12 text-center">
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-accent">
        <SearchX className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-foreground">No matching codes</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Try a different reward name or clear the current search and availability filter.
      </p>
      <Button type="button" variant="outline" onClick={onReset} className="mt-5 min-h-11">
        Clear search and filters
      </Button>
    </div>
  );
}
