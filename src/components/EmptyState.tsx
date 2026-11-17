import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  filter?: string;
  onReset?: () => void;
}

export function EmptyState({ filter, onReset }: EmptyStateProps) {
  return (
    <div className="space-y-3 py-10">
      <h3>No codes found</h3>
      <p className="text-sm text-muted-foreground">
        {filter ? 'Nothing matches this filter.' : 'Nothing matches.'}
      </p>
      {onReset && (
        <Button type="button" onClick={onReset} variant="outline" className="min-h-11">
          Clear filters
        </Button>
      )}
    </div>
  );
}
